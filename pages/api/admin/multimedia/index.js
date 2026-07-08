import pool from '../../../../lib/db';
import requireAuth from '../../../../lib/auth-middleware';

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { type, status, page = 1, limit = 20 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      const connection = await pool.getConnection();
      try {
        let query = 'SELECT id, type, title_en, title_am, description_en, status, publish_date, duration_seconds, created_at FROM multimedia WHERE 1=1';
        const params = [];

        if (type && ['audio', 'video'].includes(type)) {
          query += ' AND type = ?';
          params.push(type);
        }

        if (status) {
          query += ' AND status = ?';
          params.push(status);
        }

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);

        const [multimedia] = await connection.execute(query, params);

        const [countResult] = await connection.execute(
          'SELECT COUNT(*) as total FROM multimedia WHERE 1=1' +
          (type && ['audio', 'video'].includes(type) ? ' AND type = ?' : '') +
          (status ? ' AND status = ?' : ''),
          params.slice(0, params.length - 2)
        );

        return res.status(200).json({
          multimedia,
          pagination: {
            total: countResult[0].total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(countResult[0].total / parseInt(limit)),
          },
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Get multimedia error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    return requireAuth(createMultimedia)(req, res);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function createMultimedia(req, res) {
  const {
    type,
    title_en,
    title_am,
    description_en,
    description_am,
    file_url,
    thumbnail_url,
    duration_seconds,
    status,
    publish_date,
  } = req.body;

  if (!type || !['audio', 'video'].includes(type)) {
    return res.status(400).json({ error: 'Invalid type' });
  }

  if (!title_en || !title_am || !file_url) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        `INSERT INTO multimedia (
          type, title_en, title_am, description_en, description_am,
          file_url, thumbnail_url, duration_seconds, status, publish_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          type,
          title_en,
          title_am,
          description_en || '',
          description_am || '',
          file_url,
          thumbnail_url || null,
          duration_seconds || null,
          status || 'draft',
          publish_date || null,
        ]
      );

      return res.status(201).json({
        success: true,
        id: result.insertId,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Create multimedia error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default handler;

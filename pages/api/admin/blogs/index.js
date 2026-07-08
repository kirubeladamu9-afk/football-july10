import pool from '../../../../lib/db';
import requireAuth from '../../../../lib/auth-middleware';

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { status, category, page = 1, limit = 20 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      const connection = await pool.getConnection();
      try {
        let query = 'SELECT id, slug, title_en, title_am, excerpt_en, status, publish_date, category, created_at FROM blogs WHERE 1=1';
        const params = [];

        if (status) {
          query += ' AND status = ?';
          params.push(status);
        }

        if (category) {
          query += ' AND category = ?';
          params.push(category);
        }

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);

        const [blogs] = await connection.execute(query, params);

        const [countResult] = await connection.execute(
          'SELECT COUNT(*) as total FROM blogs WHERE 1=1' +
          (status ? ' AND status = ?' : '') +
          (category ? ' AND category = ?' : ''),
          params.slice(0, params.length - 2)
        );

        return res.status(200).json({
          blogs,
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
      console.error('Get blogs error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    return requireAuth(createBlog)(req, res);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function createBlog(req, res) {
  const {
    title_en,
    title_am,
    excerpt_en,
    excerpt_am,
    body_en,
    body_am,
    slug,
    category,
    tags,
    featured_image_url,
    status,
    publish_date,
  } = req.body;

  if (!title_en || !title_am || !body_en || !body_am) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const connection = await pool.getConnection();
    try {
      const finalSlug = slug || title_en.toLowerCase().replace(/\s+/g, '-');

      const [result] = await connection.execute(
        `INSERT INTO blogs (
          title_en, title_am, excerpt_en, excerpt_am, body_en, body_am,
          slug, category, tags, featured_image_url, status, publish_date, author_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title_en,
          title_am,
          excerpt_en || '',
          excerpt_am || '',
          body_en,
          body_am,
          finalSlug,
          category || null,
          tags ? JSON.stringify(tags) : null,
          featured_image_url || null,
          status || 'draft',
          publish_date || null,
          req.user.id,
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
    console.error('Create blog error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default handler;

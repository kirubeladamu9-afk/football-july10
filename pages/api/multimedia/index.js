import { requireAuth } from '@/lib/middleware';
import { query } from '@/lib/db';

export default async function handler(req, res) {
  const user = await requireAuth(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const { type, page = 1, limit = 10 } = req.query;
      let sql = 'SELECT * FROM multimedia WHERE 1=1';
      const params = [];

      if (type) {
        params.push(type);
        sql += ` AND type = ?`;
      }

      sql += ' ORDER BY created_at DESC';

      const offset = (parseInt(page) - 1) * parseInt(limit);
      sql += ` LIMIT ${limit} OFFSET ${offset}`;

      const result = await query(sql, params);

      const multimedia = result.rows.map((row) => ({
        id: row.id,
        titleEn: row.title_en,
        titleAm: row.title_am,
        type: row.type,
        fileUrl: row.file_url,
        thumbnailUrl: row.thumbnail_url,
        duration: row.duration,
        publishDate: row.publish_date,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));

      return res.status(200).json({ multimedia });
    } catch (error) {
      console.error('Fetch multimedia error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const {
        titleEn,
        titleAm,
        descriptionEn,
        descriptionAm,
        type,
        fileUrl,
        thumbnailUrl,
        duration,
        publishDate,
      } = req.body;

      if (!titleEn || !titleAm || !type || !fileUrl) {
        return res.status(400).json({ error: 'missingFields' });
      }

      const result = await query(
        `INSERT INTO multimedia
        (title_en, title_am, description_en, description_am, type,
         file_url, thumbnail_url, duration, publish_date, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          titleEn,
          titleAm,
          descriptionEn,
          descriptionAm,
          type,
          fileUrl,
          thumbnailUrl,
          duration,
          publishDate || null,
          user.id,
        ]
      );

      return res.status(201).json({
        success: true,
        id: result.rows[0].insertId,
      });
    } catch (error) {
      console.error('Create multimedia error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

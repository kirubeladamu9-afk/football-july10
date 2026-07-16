import { requireAuth, setCorsHeaders } from '@/lib/middleware';
import { query } from '@/lib/db';

export default async function handler(req, res) {
  setCorsHeaders(req, res);
  const user = await requireAuth(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const result = await query('SELECT * FROM multimedia WHERE id = ?', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'notFound' });
      }

      const item = result.rows[0];
      return res.status(200).json({
        id: item.id,
        titleEn: item.title_en,
        titleAm: item.title_am,
        descriptionEn: item.description_en,
        descriptionAm: item.description_am,
        fileUrl: item.file_url,
        thumbnailUrl: item.thumbnail_url,
        duration: item.duration,
        status: item.status || 'draft',
        publishDate: item.publish_date,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      });
    } catch (error) {
      console.error('Get multimedia error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const {
        titleEn,
        titleAm,
        descriptionEn,
        descriptionAm,
        fileUrl,
        thumbnailUrl,
        duration,
        status = 'draft',
        publishDate,
      } = req.body;

      const result = await query(
        `UPDATE multimedia SET
        title_en = ?, title_am = ?, description_en = ?, description_am = ?,
        file_url = ?, thumbnail_url = ?, duration = ?,
        status = ?, publish_date = ?, updated_at = NOW()
        WHERE id = ?`,
        [
          titleEn,
          titleAm,
          descriptionEn,
          descriptionAm,
          fileUrl,
          thumbnailUrl,
          duration,
          status,
          publishDate || null,
          id,
        ]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'notFound' });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Update multimedia error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const result = await query('DELETE FROM multimedia WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'notFound' });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Delete multimedia error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

import { requireAuth, setCorsHeaders } from '@/lib/middleware';
import { query } from '@/lib/db';

export default async function handler(req, res) {
  setCorsHeaders(req, res);
  const user = await requireAuth(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const result = await query('SELECT key, value_en, value_am FROM site_settings');

      const settings = result.rows.reduce((acc, row) => {
        acc[row.key] = {
          en: row.value_en,
          am: row.value_am,
        };
        return acc;
      }, {});

      return res.status(200).json({ settings });
    } catch (error) {
      console.error('Fetch settings error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { key, valueEn, valueAm } = req.body;

      if (!key) {
        return res.status(400).json({ error: 'keyRequired' });
      }

      await query(
        `INSERT INTO site_settings (key, value_en, value_am)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
        value_en = VALUES(value_en), value_am = VALUES(value_am), updated_at = NOW()`,
        [key, valueEn, valueAm]
      );

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Update settings error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

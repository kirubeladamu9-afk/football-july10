import { query } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await query(
      `SELECT id, title_en, title_am, description_en, description_am,
               file_url, thumbnail_url, duration, chapter
       FROM multimedia
       WHERE status = ?
       ORDER BY created_at DESC`,
      ['published']
    );

    const multimedia = result.rows.map((item) => ({
      id: item.id,
      titleEn: item.title_en,
      titleAm: item.title_am,
      descriptionEn: item.description_en,
      descriptionAm: item.description_am,
      fileUrl: item.file_url,
      thumbnailUrl: item.thumbnail_url,
      duration: item.duration,
      chapter: item.chapter,
    }));

    return res.status(200).json({ multimedia });
  } catch (error) {
    console.error('Public multimedia fetch error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

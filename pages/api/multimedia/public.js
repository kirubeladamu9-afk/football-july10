import { query } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { limit = 8 } = req.query;

    const result = await query(
      `SELECT 
        id,
        title_en,
        title_am,
        description_en,
        description_am,
        thumbnail_url,
        file_url,
        duration,
        chapter,
        status,
        publish_date,
        created_at,
        updated_at
      FROM multimedia 
      WHERE status = 'published'
      ORDER BY chapter ASC, created_at DESC
      LIMIT ${parseInt(limit)}`,
      []
    );

    const multimedia = result.rows.map((item) => ({
      id: item.id,
      titleEn: item.title_en,
      titleAm: item.title_am,
      descriptionEn: item.description_en,
      descriptionAm: item.description_am,
      thumbnailUrl: item.thumbnail_url,
      fileUrl: item.file_url,
      duration: item.duration,
      chapter: item.chapter,
      status: item.status,
      publishDate: item.publish_date,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));

    res.status(200).json({ multimedia });
  } catch (error) {
    console.error('Public multimedia fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

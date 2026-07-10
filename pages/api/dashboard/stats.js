import { requireAuth, setCorsHeaders } from '@/lib/middleware';
import { query } from '@/lib/db';

export default async function handler(req, res) {
  setCorsHeaders(req, res);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const user = await requireAuth(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const [articleCount, publishedCount, draftCount, multimediaCount, recentBlogs, categoryStats] =
      await Promise.all([
        query('SELECT COUNT(*) as count FROM blogs'),
        query('SELECT COUNT(*) as count FROM blogs WHERE status = ?', ['published']),
        query('SELECT COUNT(*) as count FROM blogs WHERE status = ?', ['draft']),
        query('SELECT COUNT(*) as count FROM multimedia'),
        query(
          'SELECT id, slug, title_en, title_am, status, updated_at FROM blogs ORDER BY updated_at DESC LIMIT 5'
        ),
        query('SELECT category, COUNT(*) as count FROM blogs GROUP BY category ORDER BY count DESC'),
      ]);

    const totalArticles = parseInt(articleCount.rows[0]?.count || 0);
    const publishedArticles = parseInt(publishedCount.rows[0]?.count || 0);
    const draftArticles = parseInt(draftCount.rows[0]?.count || 0);
    const totalMultimedia = parseInt(multimediaCount.rows[0]?.count || 0);

    return res.status(200).json({
      totalArticles,
      publishedArticles,
      draftArticles,
      totalMultimedia,
      recentActivity: recentBlogs.rows.map((row) => ({
        id: row.id,
        slug: row.slug,
        titleEn: row.title_en,
        titleAm: row.title_am,
        status: row.status,
        updatedAt: row.updated_at,
      })),
      categories: categoryStats.rows.map((row) => ({
        name: row.category,
        count: parseInt(row.count || 0),
      })),
    });
  } catch (error) {
    console.error('Stats error:', error?.message || error);
    return res.status(500).json({ error: error?.message || 'Internal server error' });
  }
}

import pool from '../../../../lib/db';
import requireAuth from '../../../../lib/auth-middleware';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return requireAuth(getStats)(req, res);
}

async function getStats(req, res) {
  try {
    const connection = await pool.getConnection();
    try {
      const [blogStats] = await connection.execute(
        `SELECT
          COUNT(*) as total,
          SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
          SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft,
          SUM(CASE WHEN status = 'scheduled' THEN 1 ELSE 0 END) as scheduled
        FROM blogs`
      );

      const [multimediaStats] = await connection.execute(
        `SELECT
          COUNT(*) as total,
          SUM(CASE WHEN type = 'audio' THEN 1 ELSE 0 END) as podcasts,
          SUM(CASE WHEN type = 'video' THEN 1 ELSE 0 END) as videos
        FROM multimedia`
      );

      const [recentActivity] = await connection.execute(
        `SELECT 'blog' as type, id, title_en as title, created_at FROM blogs
        UNION ALL
        SELECT 'multimedia' as type, id, title_en as title, created_at FROM multimedia
        ORDER BY created_at DESC
        LIMIT 10`
      );

      return res.status(200).json({
        blogs: blogStats[0],
        multimedia: multimediaStats[0],
        recentActivity,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Get stats error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default handler;

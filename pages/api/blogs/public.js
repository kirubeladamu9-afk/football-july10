import { query } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { limit = 3, category } = req.query;
    let sqlWhere = 'WHERE status = "published"';
    const params = [];

    if (category) {
      params.push(category);
      sqlWhere += ` AND category = ?`;
    }

    const result = await query(
      `SELECT 
        id,
        slug,
        title_en,
        title_am,
        excerpt_en,
        excerpt_am,
        cover_image,
        author_name,
        author_avatar,
        author_role_en,
        author_role_am,
        category,
        reading_time,
        publish_date,
        created_at,
        updated_at
      FROM blogs ${sqlWhere}
      ORDER BY publish_date DESC, updated_at DESC
      LIMIT ${parseInt(limit)}`,
      params
    );

    const blogs = result.rows.map((blog) => ({
      id: blog.id,
      slug: blog.slug,
      title_en: blog.title_en,
      title_am: blog.title_am,
      excerpt_en: blog.excerpt_en,
      excerpt_am: blog.excerpt_am,
      coverImage: blog.cover_image,
      authorName: blog.author_name,
      authorAvatar: blog.author_avatar,
      author_role_en: blog.author_role_en,
      author_role_am: blog.author_role_am,
      category: blog.category,
      readingTime: blog.reading_time,
      publishDate: blog.publish_date,
      createdAt: blog.created_at,
      updatedAt: blog.updated_at,
    }));

    res.status(200).json({ blogs });
  } catch (error) {
    console.error('Public blogs fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
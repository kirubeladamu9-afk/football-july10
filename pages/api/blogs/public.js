import { query } from '@/lib/db';
import { calculateReadingTime } from '@/lib/readingTime';

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
        body_en,
        cover_image,
        author_name,
        author_avatar,
        author_role_en,
        author_role_am,
        category,
        publish_date,
        reading_time,
        created_at,
        updated_at
      FROM blogs ${sqlWhere}
      ORDER BY publish_date DESC, updated_at DESC
      LIMIT ${parseInt(limit)}`,
      params
    );

    // Keep snake_case as-is so getTranslatedField(item, 'title', language)
    // correctly finds item['title_en'] / item['title_am'].
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
      publishDate: blog.publish_date,
      readingTime: blog.reading_time || calculateReadingTime(blog.body_en),
      createdAt: blog.created_at,
      updatedAt: blog.updated_at,
    }));

    res.status(200).json({ blogs });
  } catch (error) {
    console.error('Public blogs fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

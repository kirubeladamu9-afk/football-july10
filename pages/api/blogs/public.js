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
        title_en as titleEn,
        title_am as titleAm,
        excerpt_en as excerptEn,
        excerpt_am as excerptAm,
        cover_image as coverImage,
        author_name as authorName,
        author_avatar as authorAvatar,
        author_role_en as authorRoleEn,
        author_role_am as authorRoleAm,
        category,
        publish_date as publishDate,
        created_at as createdAt,
        updated_at as updatedAt
      FROM blogs ${sqlWhere}
      ORDER BY publish_date DESC, updated_at DESC
      LIMIT ${parseInt(limit)}`,
      params
    );

    const blogs = result.rows.map((blog) => ({
      id: blog.id,
      slug: blog.slug,
      titleEn: blog.titleEn,
      titleAm: blog.titleAm,
      excerptEn: blog.excerptEn,
      excerptAm: blog.excerptAm,
      coverImage: blog.coverImage,
      authorName: blog.authorName,
      authorAvatar: blog.authorAvatar,
      authorRoleEn: blog.authorRoleEn,
      authorRoleAm: blog.authorRoleAm,
      category: blog.category,
      publishDate: blog.publishDate,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    }));

    res.status(200).json({ blogs });
  } catch (error) {
    console.error('Public blogs fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

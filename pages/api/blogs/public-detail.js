import { query } from '@/lib/db';
import { calculateReadingTime } from '@/lib/readingTime';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { slug, id } = req.query;

    if (!slug && !id) {
      return res.status(400).json({ error: 'Either slug or id is required' });
    }

    let whereClause = 'WHERE status = "published"';
    let params = [];

    if (slug) {
      whereClause += ' AND slug = ?';
      params.push(slug);
    } else if (id) {
      whereClause += ' AND id = ?';
      params.push(parseInt(id));
    }

    const result = await query(
      `SELECT
        id,
        slug,
        title_en as titleEn,
        title_am as titleAm,
        excerpt_en as excerptEn,
        excerpt_am as excerptAm,
        body_en as bodyEn,
        body_am as bodyAm,
        cover_image as coverImage,
        featured_image_url as featuredImageUrl,
        author_name as authorName,
        author_avatar as authorAvatar,
        author_role_en as authorRoleEn,
        author_role_am as authorRoleAm,
        gallery,
        pull_quote_en as pullQuoteEn,
        pull_quote_am as pullQuoteAm,
        pull_quote_attribution as pullQuoteAttribution,
        previous_post_slug as previousPostSlug,
        next_post_slug as nextPostSlug,
        category,
        status,
        publish_date as publishDate,
        reading_time as readingTime,
        created_at as createdAt,
        updated_at as updatedAt
      FROM blogs
      ${whereClause}`,
      params
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const blog = result.rows[0];

    // Fetch tags
    const tagsResult = await query('SELECT tag FROM blog_tags WHERE blog_id = ?', [
      blog.id,
    ]);

    const parseField = (field) => {
      if (!field) return [];
      if (typeof field === 'string') {
        try {
          return JSON.parse(field);
        } catch (e) {
          return [];
        }
      }
      return field;
    };

    const blogData = {
      id: blog.id,
      slug: blog.slug,
      titleEn: blog.titleEn,
      titleAm: blog.titleAm,
      excerptEn: blog.excerptEn,
      excerptAm: blog.excerptAm,
      bodyEn: blog.bodyEn,
      bodyAm: blog.bodyAm,
      coverImage: blog.coverImage,
      featuredImageUrl: blog.featuredImageUrl,
      authorName: blog.authorName,
      authorAvatar: blog.authorAvatar,
      authorRoleEn: blog.authorRoleEn,
      authorRoleAm: blog.authorRoleAm,
      gallery: parseField(blog.gallery),
      pullQuoteEn: blog.pullQuoteEn,
      pullQuoteAm: blog.pullQuoteAm,
      pullQuoteAttribution: blog.pullQuoteAttribution,
      previousPostSlug: blog.previousPostSlug,
      nextPostSlug: blog.nextPostSlug,
      category: blog.category,
      status: blog.status,
      publishDate: blog.publishDate,
      readingTime: blog.readingTime || calculateReadingTime(blog.bodyEn),
      tags: tagsResult.rows.map((r) => r.tag),
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    };

    res.status(200).json(blogData);
  } catch (error) {
    console.error('Public blog detail fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

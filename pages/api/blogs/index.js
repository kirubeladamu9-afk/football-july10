import { requireAuth, setCorsHeaders } from '@/lib/middleware';
import { query, transaction } from '@/lib/db';
import { generateSlug } from '@/lib/validation';

export default async function handler(req, res) {
  setCorsHeaders(req, res);
  const user = await requireAuth(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const { status, category, page = 1, limit = 10 } = req.query;
      let sqlWhere = 'WHERE 1=1';
      const params = [];

      if (status) {
        params.push(status);
        sqlWhere += ` AND status = ?`;
      }

      if (category) {
        params.push(category);
        sqlWhere += ` AND category = ?`;
      }

      // Get total count
      const countResult = await query(`SELECT COUNT(*) as total FROM blogs ${sqlWhere}`, params);
      const total = countResult.rows[0].total;

      // Get paginated results
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const result = await query(
        `SELECT * FROM blogs ${sqlWhere} ORDER BY updated_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`,
        params
      );

      const blogs = result.rows.map((row) => ({
        id: row.id,
        slug: row.slug,
        titleEn: row.title_en,
        titleAm: row.title_am,
        excerptEn: row.excerpt_en,
        excerptAm: row.excerpt_am,
        category: row.category,
        status: row.status,
        publishDate: row.publish_date,
        updatedAt: row.updated_at,
      }));

      return res.status(200).json({ blogs, total });
    } catch (error) {
      console.error('Fetch blogs error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const {
        titleEn,
        titleAm,
        excerptEn,
        excerptAm,
        bodyEn,
        bodyAm,
        coverImage,
        authorName,
        authorAvatar,
        authorRoleEn,
        authorRoleAm,
        gallery = [],
        galleryInput,
        pullQuoteEn,
        pullQuoteAm,
        pullQuoteAttribution,
        category,
        status,
        publishDate,
        slug,
        previousPostId,
        nextPostId,
        featuredImageUrl,
        tags = [],
        imageCaption,
      } = req.body;

      if (!titleEn || !titleAm || !bodyEn || !bodyAm) {
        return res.status(400).json({ error: 'missingFields' });
      }

      const finalSlug = slug || generateSlug(titleEn);

      await transaction(async (client) => {
        const [blogResult] = await client.execute(
          `INSERT INTO blogs
          (slug, title_en, title_am, excerpt_en, excerpt_am, body_en, body_am,
           cover_image, author_name, author_avatar, author_role_en, author_role_am,
           gallery, pull_quote_en, pull_quote_am, pull_quote_attribution,
           previous_post_slug, next_post_slug, featured_image_url, category, status, publish_date, tags, image_caption, created_by)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            finalSlug,
            titleEn,
            titleAm,
            excerptEn,
            excerptAm,
            bodyEn,
            bodyAm,
            coverImage || null,
            authorName || null,
            authorAvatar || null,
            authorRoleEn || null,
            authorRoleAm || null,
            gallery.length > 0 ? JSON.stringify(gallery) : null,
            pullQuoteEn || null,
            pullQuoteAm || null,
            pullQuoteAttribution || null,
            previousPostId || null,
            nextPostId || null,
            featuredImageUrl || null,
            category,
            status || 'draft',
            publishDate || null,
            tags.length > 0 ? JSON.stringify(tags) : null,
            imageCaption || null,
            user.id,
          ]
        );

        const blogId = blogResult.insertId;

        if (tags.length > 0) {
          const tagValues = tags.map(() => '(?, ?)').join(',');
          const tagParams = tags.flatMap((tag) => [blogId, tag]);

          await client.execute(
            `INSERT INTO blog_tags (blog_id, tag) VALUES ${tagValues}`,
            tagParams
          );
        }

        return blogId;
      });

      return res.status(201).json({
        success: true,
        slug: finalSlug,
      });
    } catch (error) {
      console.error('Create blog error:', error);
      if (error.code === '23505') {
        return res.status(400).json({ error: 'slugExists' });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

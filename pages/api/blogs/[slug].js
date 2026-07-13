import { requireAuth, setCorsHeaders } from '@/lib/middleware';
import { query, transaction } from '@/lib/db';
import { calculateReadingTime } from '@/lib/readingTime';

export default async function handler(req, res) {
  setCorsHeaders(req, res);
  const user = await requireAuth(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { slug } = req.query;

  if (req.method === 'GET') {
    try {
      const result = await query('SELECT * FROM blogs WHERE slug = ?', [slug]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'notFound' });
      }

      const blog = result.rows[0];
      const tagsResult = await query('SELECT tag FROM blog_tags WHERE blog_id = ?', [
        blog.id,
      ]);

      const parseField = (field) => {
        if (!field) return [];
        if (typeof field === 'string') return JSON.parse(field);
        return field;
      };

      const readingTime = blog.reading_time || calculateReadingTime(blog.body_en);

      return res.status(200).json({
        id: blog.id,
        slug: blog.slug,
        titleEn: blog.title_en,
        titleAm: blog.title_am,
        excerptEn: blog.excerpt_en,
        excerptAm: blog.excerpt_am,
        bodyEn: blog.body_en,
        bodyAm: blog.body_am,
        coverImage: blog.cover_image,
        authorName: blog.author_name,
        authorAvatar: blog.author_avatar,
        authorRoleEn: blog.author_role_en,
        authorRoleAm: blog.author_role_am,
        gallery: parseField(blog.gallery),
        pullQuoteEn: blog.pull_quote_en,
        pullQuoteAm: blog.pull_quote_am,
        pullQuoteAttribution: blog.pull_quote_attribution,
        previousPostId: blog.previous_post_slug,
        nextPostId: blog.next_post_slug,
        featuredImageUrl: blog.featured_image_url,
        category: blog.category,
        status: blog.status,
        publishDate: blog.publish_date,
        readingTime,
        tags: blog.tags ? parseField(blog.tags) : tagsResult.rows.map((r) => r.tag),
        imageCaption: blog.image_caption,
        createdAt: blog.created_at,
        updatedAt: blog.updated_at,
      });
    } catch (error) {
      console.error('Get blog error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'PUT') {
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
        pullQuoteEn,
        pullQuoteAm,
        pullQuoteAttribution,
        category,
        status,
        publishDate,
        previousPostId,
        nextPostId,
        featuredImageUrl,
        tags = [],
        imageCaption,
      } = req.body;

      await transaction(async (client) => {
        const [blogResult] = await client.execute(
          'SELECT id FROM blogs WHERE slug = ?',
          [slug]
        );

        if (blogResult.length === 0) {
          throw new Error('notFound');
        }

        const blogId = blogResult[0].id;
        const readingTime = calculateReadingTime(bodyEn);

        await client.execute(
          `UPDATE blogs SET
          title_en = ?, title_am = ?, excerpt_en = ?, excerpt_am = ?,
          body_en = ?, body_am = ?, cover_image = ?, author_name = ?,
          author_avatar = ?, author_role_en = ?, author_role_am = ?,
          gallery = ?, pull_quote_en = ?, pull_quote_am = ?,
          pull_quote_attribution = ?, previous_post_slug = ?,
          next_post_slug = ?, featured_image_url = ?, category = ?, status = ?,
          publish_date = ?, reading_time = ?, tags = ?, image_caption = ?, updated_at = NOW()
          WHERE id = ?`,
          [
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
            status,
            publishDate || null,
            readingTime,
            tags.length > 0 ? JSON.stringify(tags) : null,
            imageCaption || null,
            blogId,
          ]
        );

        // Update tags
        await client.execute('DELETE FROM blog_tags WHERE blog_id = ?', [blogId]);

        if (tags.length > 0) {
          const tagValues = tags.map(() => '(?, ?)').join(',');
          const tagParams = tags.flatMap((tag) => [blogId, tag]);

          await client.execute(
            `INSERT INTO blog_tags (blog_id, tag) VALUES ${tagValues}`,
            tagParams
          );
        }
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Update blog error:', error);
      if (error.message === 'notFound') {
        return res.status(404).json({ error: 'notFound' });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const result = await query('DELETE FROM blogs WHERE slug = ?', [slug]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'notFound' });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Delete blog error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

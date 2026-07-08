import { requireAuth } from '@/lib/middleware';
import { query, transaction } from '@/lib/db';

export default async function handler(req, res) {
  const user = await requireAuth(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { slug } = req.query;

  if (req.method === 'GET') {
    try {
      const result = await query('SELECT * FROM blogs WHERE slug = $1', [slug]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'notFound' });
      }

      const blog = result.rows[0];
      const tagsResult = await query('SELECT tag FROM blog_tags WHERE blog_id = $1', [
        blog.id,
      ]);

      return res.status(200).json({
        id: blog.id,
        slug: blog.slug,
        titleEn: blog.title_en,
        titleAm: blog.title_am,
        excerptEn: blog.excerpt_en,
        excerptAm: blog.excerpt_am,
        bodyEn: blog.body_en,
        bodyAm: blog.body_am,
        featuredImageUrl: blog.featured_image_url,
        category: blog.category,
        status: blog.status,
        publishDate: blog.publish_date,
        tags: tagsResult.rows.map((r) => r.tag),
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
        category,
        status,
        publishDate,
        tags = [],
      } = req.body;

      await transaction(async (client) => {
        const blogResult = await client.query(
          'SELECT id FROM blogs WHERE slug = $1',
          [slug]
        );

        if (blogResult.rows.length === 0) {
          throw new Error('notFound');
        }

        const blogId = blogResult.rows[0].id;

        await client.query(
          `UPDATE blogs SET 
          title_en = $1, title_am = $2, excerpt_en = $3, excerpt_am = $4,
          body_en = $5, body_am = $6, category = $7, status = $8, 
          publish_date = $9, updated_at = NOW() 
          WHERE id = $10`,
          [
            titleEn,
            titleAm,
            excerptEn,
            excerptAm,
            bodyEn,
            bodyAm,
            category,
            status,
            publishDate || null,
            blogId,
          ]
        );

        // Update tags
        await client.query('DELETE FROM blog_tags WHERE blog_id = $1', [blogId]);

        if (tags.length > 0) {
          const tagValues = tags
            .map((tag, i) => `($${i * 2 + 1}, $${i * 2 + 2})`)
            .join(',');
          const tagParams = tags.flatMap((tag) => [blogId, tag]);

          await client.query(
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
      const result = await query('DELETE FROM blogs WHERE slug = $1 RETURNING id', [
        slug,
      ]);

      if (result.rows.length === 0) {
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

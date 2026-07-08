import { requireAuth } from '@/lib/middleware';
import { query, transaction } from '@/lib/db';
import { generateSlug } from '@/lib/validation';

export default async function handler(req, res) {
  const user = await requireAuth(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const { status, category, page = 1, limit = 10 } = req.query;
      let sql = 'SELECT * FROM blogs WHERE 1=1';
      const params = [];

      if (status) {
        params.push(status);
        sql += ` AND status = ?`;
      }

      if (category) {
        params.push(category);
        sql += ` AND category = ?`;
      }

      sql += ' ORDER BY updated_at DESC';

      const offset = (parseInt(page) - 1) * parseInt(limit);
      sql += ` LIMIT ${limit} OFFSET ${offset}`;

      const result = await query(sql, params);

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

      return res.status(200).json({ blogs });
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
        category,
        status,
        publishDate,
        slug,
        tags = [],
      } = req.body;

      if (!titleEn || !titleAm || !bodyEn || !bodyAm) {
        return res.status(400).json({ error: 'missingFields' });
      }

      const finalSlug = slug || generateSlug(titleEn);

      await transaction(async (client) => {
        const [blogResult] = await client.execute(
          `INSERT INTO blogs
          (slug, title_en, title_am, excerpt_en, excerpt_am, body_en, body_am,
           category, status, publish_date, created_by)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            finalSlug,
            titleEn,
            titleAm,
            excerptEn,
            excerptAm,
            bodyEn,
            bodyAm,
            category,
            status || 'draft',
            publishDate || null,
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

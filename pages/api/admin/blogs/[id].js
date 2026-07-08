import pool from '../../../../lib/db';
import requireAuth from '../../../../lib/auth-middleware';

async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    return getBlog(req, res, id);
  }

  if (req.method === 'PUT') {
    return requireAuth((req, res) => updateBlog(req, res, id))(req, res);
  }

  if (req.method === 'DELETE') {
    return requireAuth((req, res) => deleteBlog(req, res, id))(req, res);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function getBlog(req, res, blogId) {
  try {
    const connection = await pool.getConnection();
    try {
      const [blogs] = await connection.execute(
        'SELECT * FROM blogs WHERE id = ?',
        [blogId]
      );

      if (blogs.length === 0) {
        return res.status(404).json({ error: 'Blog not found' });
      }

      const blog = blogs[0];
      blog.tags = blog.tags ? JSON.parse(blog.tags) : [];

      return res.status(200).json(blog);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Get blog error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateBlog(req, res, blogId) {
  const {
    title_en,
    title_am,
    excerpt_en,
    excerpt_am,
    body_en,
    body_am,
    slug,
    category,
    tags,
    featured_image_url,
    status,
    publish_date,
  } = req.body;

  try {
    const connection = await pool.getConnection();
    try {
      const [blogs] = await connection.execute(
        'SELECT id FROM blogs WHERE id = ?',
        [blogId]
      );

      if (blogs.length === 0) {
        return res.status(404).json({ error: 'Blog not found' });
      }

      await connection.execute(
        `UPDATE blogs SET
          title_en = ?, title_am = ?, excerpt_en = ?, excerpt_am = ?,
          body_en = ?, body_am = ?, slug = ?, category = ?, tags = ?,
          featured_image_url = ?, status = ?, publish_date = ?
        WHERE id = ?`,
        [
          title_en || blogs[0].title_en,
          title_am || blogs[0].title_am,
          excerpt_en !== undefined ? excerpt_en : blogs[0].excerpt_en,
          excerpt_am !== undefined ? excerpt_am : blogs[0].excerpt_am,
          body_en || blogs[0].body_en,
          body_am || blogs[0].body_am,
          slug || blogs[0].slug,
          category !== undefined ? category : blogs[0].category,
          tags ? JSON.stringify(tags) : blogs[0].tags,
          featured_image_url !== undefined ? featured_image_url : blogs[0].featured_image_url,
          status || blogs[0].status,
          publish_date !== undefined ? publish_date : blogs[0].publish_date,
          blogId,
        ]
      );

      return res.status(200).json({ success: true });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Update blog error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteBlog(req, res, blogId) {
  try {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        'DELETE FROM blogs WHERE id = ?',
        [blogId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Blog not found' });
      }

      return res.status(200).json({ success: true });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Delete blog error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default handler;

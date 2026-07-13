require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

const getPoolConfig = () => {
  const dbUrl = process.env.MYSQL_URL;
  if (dbUrl) {
    const url = new URL(dbUrl);
    return {
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      port: parseInt(url.port || '3306'),
    };
  }
  return {
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: parseInt(process.env.MYSQLPORT || '3306'),
  };
};

function calculateReadingTime(text) {
  if (!text || typeof text !== 'string') {
    return null;
  }
  const plainText = text.replace(/<[^>]*>/g, ' ');
  const wordCount = plainText.trim().split(/\s+/).filter(word => word.length > 0).length;
  const readingTime = Math.ceil(wordCount / 200);
  return readingTime > 0 ? readingTime : 1;
}

(async () => {
  const pool = mysql.createPool(getPoolConfig());
  const conn = await pool.getConnection();
  try {
    const result = await conn.execute(
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
      FROM blogs WHERE status = "published"
      ORDER BY publish_date DESC, updated_at DESC
      LIMIT 3`
    );
    const rows = result[0];
    console.log('Testing API response format:');
    rows.forEach(blog => {
      const mapped = {
        id: blog.id,
        slug: blog.slug,
        title_en: blog.title_en,
        readingTime: blog.reading_time || calculateReadingTime(blog.body_en),
        publishDate: blog.publish_date,
      };
      console.log(JSON.stringify(mapped, null, 2));
    });
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await conn.release();
    await pool.end();
  }
})();

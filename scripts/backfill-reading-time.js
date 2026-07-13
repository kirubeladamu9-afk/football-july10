require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

const WORDS_PER_MINUTE = 200;

function calculateReadingTime(text) {
  if (!text || typeof text !== 'string') {
    return null;
  }

  const plainText = text.replace(/<[^>]*>/g, ' ');
  const wordCount = plainText.trim().split(/\s+/).filter(word => word.length > 0).length;
  const readingTime = Math.ceil(wordCount / WORDS_PER_MINUTE);
  
  return readingTime > 0 ? readingTime : 1;
}

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

async function backfillReadingTime() {
  const pool = mysql.createPool({
    ...getPoolConfig(),
    charset: 'utf8mb4',
  });

  const connection = await pool.getConnection();
  try {
    console.log('Starting backfill of reading_time for existing blogs...');

    // Get all blogs that don't have reading_time set
    const result = await connection.execute(
      `SELECT id, body_en FROM blogs WHERE reading_time IS NULL OR reading_time = 0`
    );

    const blogs = result[0];
    console.log(`Found ${blogs.length} blogs without reading_time`);

    let updated = 0;
    for (const blog of blogs) {
      const readingTime = calculateReadingTime(blog.body_en);
      await connection.execute(
        `UPDATE blogs SET reading_time = ? WHERE id = ?`,
        [readingTime, blog.id]
      );
      updated++;
      if (updated % 10 === 0) {
        console.log(`✅ Updated ${updated}/${blogs.length} blogs`);
      }
    }

    console.log(`✅ Successfully backfilled ${updated} blogs with reading_time`);
  } catch (error) {
    console.error('❌ Backfill failed:', error.message);
    process.exit(1);
  } finally {
    await connection.release();
    await pool.end();
  }
}

backfillReadingTime();

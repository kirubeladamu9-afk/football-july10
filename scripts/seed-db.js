const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function seedDb() {
  const pool = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: parseInt(process.env.MYSQLPORT || '3306'),
    charset: 'utf8mb4',
  });

  const connection = await pool.getConnection();
  try {
    // Check if admin user already exists
    const [adminExists] = await connection.execute(
      'SELECT * FROM admin_users WHERE email = ?',
      ['admin@football.com']
    );

    if (adminExists.length === 0) {
      // Create default admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const [adminResult] = await connection.execute(
        'INSERT INTO admin_users (email, password_hash, name) VALUES (?, ?, ?)',
        ['admin@football.com', hashedPassword, 'Admin User']
      );

      const adminId = adminResult.insertId;

      // Add sample blogs
      const [blogSample1] = await connection.execute(
        `INSERT INTO blogs 
        (slug, title_en, title_am, excerpt_en, excerpt_am, body_en, body_am, 
         category, status, publish_date, created_by) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'sample-blog-1',
          'Understanding Football Politics',
          'እግር ኳስ ፖለቲካን መገንዘብ',
          'A deep dive into the political aspects of modern football',
          'ዘመናዊ እግር ኳስ ፖለቲካዊ ገጽታዎች ላይ ጥልቅ ጥናት',
          'Football is not just a game; it is a complex arena where politics, power, and passion intersect...',
          'እግር ኳስ ተጫዋች ብቻ አይደለም; ፖለቲካ፣ ሥልጣን እና ተፈላጊነት የሚገናኙበት ውስብስብ አሪና ነው...',
          'Politics & Power',
          'published',
          new Date(),
          adminId
        ]
      );

      const blogId1 = blogSample1.insertId;

      // Add tags for first blog
      await connection.execute(
        'INSERT INTO blog_tags (blog_id, tag) VALUES (?, ?), (?, ?), (?, ?)',
        [blogId1, 'football', blogId1, 'ዋጋ', blogId1, 'politics']
      );

      // Add sample multimedia
      await connection.execute(
        `INSERT INTO multimedia 
        (title_en, title_am, description_en, description_am, type, 
         file_url, duration, publish_date, created_by) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'Weekly Football Podcast Ep. 1',
          'ሳምንታዊ እግር ኳስ ፖድካስት',
          'Join us as we discuss the week in football politics',
          'በእግር ኳስ ፖለቲካ ላይ ሳምንታዊ ውይይት',
          'audio',
          'https://example.com/podcast/ep1.mp3',
          2400,
          new Date(),
          adminId
        ]
      );

      // Add site settings
      await connection.execute(
        `INSERT INTO site_settings (key, value_en, value_am) 
        VALUES (?, ?, ?), (?, ?, ?)`,
        [
          'site_title',
          'Football, Politics and Law',
          'እግር ኳስ፣ ፖለቲካና ሕግ',
          'tagline',
          'In-depth analysis and insights',
          'ጥልቅ ትንተና እና ግንዛቤ'
        ]
      );

      console.log('✅ Database seeded successfully');
      console.log('Default admin credentials:');
      console.log('Email: admin@football.com');
      console.log('Password: admin123');
    } else {
      console.log('ℹ️ Admin user already exists, skipping seed');
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
  } finally {
    await connection.release();
    await pool.end();
  }
}

seedDb();

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seedDb() {
  const client = await pool.connect();
  try {
    // Check if admin user already exists
    const adminExists = await client.query(
      'SELECT * FROM admin_users WHERE email = $1',
      ['admin@football.com']
    );

    if (adminExists.rows.length === 0) {
      // Create default admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const adminResult = await client.query(
        'INSERT INTO admin_users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id',
        ['admin@football.com', hashedPassword, 'Admin User']
      );

      const adminId = adminResult.rows[0].id;

      // Add sample blogs
      const blogSample1 = await client.query(
        `INSERT INTO blogs 
        (slug, title_en, title_am, excerpt_en, excerpt_am, body_en, body_am, 
         category, status, publish_date, created_by) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
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

      const blogId1 = blogSample1.rows[0].id;

      // Add tags for first blog
      await client.query(
        'INSERT INTO blog_tags (blog_id, tag) VALUES ($1, $2), ($1, $3), ($1, $4)',
        [blogId1, 'football', 'ዋጋ', 'politics']
      );

      // Add sample multimedia
      await client.query(
        `INSERT INTO multimedia 
        (title_en, title_am, description_en, description_am, type, 
         file_url, duration, publish_date, created_by) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
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
      await client.query(
        `INSERT INTO site_settings (key, value_en, value_am) 
        VALUES ($1, $2, $3), ($4, $5, $6)`,
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
    await client.end();
  }
}

seedDb();

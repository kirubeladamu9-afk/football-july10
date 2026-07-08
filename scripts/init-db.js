const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initDb() {
  const client = await pool.connect();
  try {
    // Create admin_users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create blogs table with proper UTF-8 encoding for Amharic
    await client.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title_en VARCHAR(255) NOT NULL,
        title_am VARCHAR(255) NOT NULL,
        excerpt_en TEXT,
        excerpt_am TEXT,
        body_en TEXT NOT NULL,
        body_am TEXT NOT NULL,
        featured_image_url VARCHAR(500),
        category VARCHAR(100) NOT NULL,
        status VARCHAR(20) DEFAULT 'draft',
        publish_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER REFERENCES admin_users(id)
      );
    `);

    // Create blog_tags table
    await client.query(`
      CREATE TABLE IF NOT EXISTS blog_tags (
        id SERIAL PRIMARY KEY,
        blog_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
        tag VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create multimedia table
    await client.query(`
      CREATE TABLE IF NOT EXISTS multimedia (
        id SERIAL PRIMARY KEY,
        title_en VARCHAR(255) NOT NULL,
        title_am VARCHAR(255) NOT NULL,
        description_en TEXT,
        description_am TEXT,
        type VARCHAR(50) NOT NULL,
        file_url VARCHAR(500) NOT NULL,
        thumbnail_url VARCHAR(500),
        duration INTEGER,
        publish_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER REFERENCES admin_users(id)
      );
    `);

    // Create site_settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(100) UNIQUE NOT NULL,
        value_en TEXT,
        value_am TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for better query performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
      CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
      CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_multimedia_type ON multimedia(type);
      CREATE INDEX IF NOT EXISTS idx_multimedia_created_at ON multimedia(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_blog_tags_blog_id ON blog_tags(blog_id);
    `);

    console.log('✅ Database schema created successfully');
  } catch (error) {
    console.error('❌ Error creating schema:', error.message);
  } finally {
    await client.end();
  }
}

initDb();

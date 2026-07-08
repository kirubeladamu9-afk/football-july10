require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function initDb() {
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
    // Create admin_users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);

    // Create blogs table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS blogs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title_en VARCHAR(255) NOT NULL,
        title_am VARCHAR(255) NOT NULL,
        excerpt_en TEXT,
        excerpt_am TEXT,
        body_en LONGTEXT NOT NULL,
        body_am LONGTEXT NOT NULL,
        featured_image_url VARCHAR(500),
        category VARCHAR(100) NOT NULL,
        status VARCHAR(20) DEFAULT 'draft',
        publish_date TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INT,
        FOREIGN KEY (created_by) REFERENCES admin_users(id)
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);

    // Create blog_tags table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS blog_tags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        blog_id INT,
        tag VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);

    // Create multimedia table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS multimedia (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title_en VARCHAR(255) NOT NULL,
        title_am VARCHAR(255) NOT NULL,
        description_en TEXT,
        description_am TEXT,
        type VARCHAR(50) NOT NULL,
        file_url VARCHAR(500) NOT NULL,
        thumbnail_url VARCHAR(500),
        duration INT,
        publish_date TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INT,
        FOREIGN KEY (created_by) REFERENCES admin_users(id)
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);

    // Create site_settings table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        key VARCHAR(100) UNIQUE NOT NULL,
        value_en LONGTEXT,
        value_am LONGTEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);

    // Create indexes
    await connection.execute(`CREATE INDEX idx_blogs_status ON blogs(status)`);
    await connection.execute(`CREATE INDEX idx_blogs_category ON blogs(category)`);
    await connection.execute(`CREATE INDEX idx_blogs_created_at ON blogs(created_at DESC)`);
    await connection.execute(`CREATE INDEX idx_multimedia_type ON multimedia(type)`);
    await connection.execute(`CREATE INDEX idx_multimedia_created_at ON multimedia(created_at DESC)`);
    await connection.execute(`CREATE INDEX idx_blog_tags_blog_id ON blog_tags(blog_id)`);

    console.log('✅ Database schema created successfully');
  } catch (error) {
    if (error.code !== 'ER_TABLE_EXISTS_ERROR') {
      console.error('❌ Error creating schema:', error.message);
    }
  } finally {
    await connection.release();
    await pool.end();
  }
}

initDb();

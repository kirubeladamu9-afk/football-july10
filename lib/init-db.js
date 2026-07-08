const mysql = require('mysql2/promise');

async function initializeDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    port: process.env.MYSQLPORT || 3306,
  });

  try {
    // Create database if not exists
    await connection.execute(
      `CREATE DATABASE IF NOT EXISTS ${process.env.MYSQLDATABASE} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );

    // Switch to the database
    await connection.execute(`USE ${process.env.MYSQLDATABASE}`);

    // Create admin_users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create blogs table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS blogs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title_en VARCHAR(500) NOT NULL,
        title_am VARCHAR(500) NOT NULL,
        excerpt_en TEXT,
        excerpt_am TEXT,
        body_en LONGTEXT NOT NULL,
        body_am LONGTEXT NOT NULL,
        featured_image_url VARCHAR(500),
        category VARCHAR(100),
        tags JSON,
        status ENUM('draft', 'published', 'scheduled') DEFAULT 'draft',
        publish_date DATETIME,
        author_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_author (author_id),
        INDEX idx_publish_date (publish_date),
        INDEX idx_category (category),
        FOREIGN KEY (author_id) REFERENCES admin_users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create multimedia table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS multimedia (
        id INT PRIMARY KEY AUTO_INCREMENT,
        type ENUM('audio', 'video') NOT NULL,
        title_en VARCHAR(500) NOT NULL,
        title_am VARCHAR(500) NOT NULL,
        description_en TEXT,
        description_am TEXT,
        file_url VARCHAR(500) NOT NULL,
        thumbnail_url VARCHAR(500),
        duration_seconds INT,
        publish_date DATETIME,
        status ENUM('draft', 'published', 'scheduled') DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_type (type),
        INDEX idx_status (status),
        INDEX idx_publish_date (publish_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;

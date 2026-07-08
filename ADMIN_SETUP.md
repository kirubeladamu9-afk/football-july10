# Admin Panel Setup Guide

## Overview

This admin panel provides a bilingual (Amharic/English) interface for managing articles, multimedia (podcasts/videos), and site settings for the "Football, Politics and Law" editorial platform.

## Features

- **Authentication**: Email/password login with JWT tokens stored in httpOnly cookies
- **Dashboard**: Statistics showing article counts, published vs draft, multimedia inventory, and recent activity
- **Articles Management**: Full CRUD operations with dual-language support (Amharic/English)
- **Multimedia Management**: Manage podcasts and videos with bilingual titles/descriptions
- **Settings**: Configure site metadata
- **Responsive Design**: Clean, card-based UI matching your frontend design system

## Getting Started

### 1. Environment Setup

The following environment variables are already configured in your Railway MySQL setup:

```
MYSQLHOST={RAILWAY_PRIVATE_DOMAIN}
MYSQLUSER=root
MYSQLPASSWORD={MYSQL_ROOT_PASSWORD}
MYSQLDATABASE=railway
MYSQLPORT=3306
JWT_SECRET=your-secret-key-change-in-production
```

Add to your `.env.local`:
```
JWT_SECRET=your-secure-jwt-secret-key-here
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

The following packages have been added:
- `mysql2`: MySQL database driver
- `jsonwebtoken`: JWT token handling
- `bcryptjs`: Password hashing
- `react-query` or `react-quill`: Rich text editor
- Other utilities for form handling

### 3. Initialize Database

Run the database initialization script to create the schema:

```bash
node lib/init-db.js
```

This creates three tables:
- `admin_users`: Admin account storage
- `blogs`: Article content with bilingual fields
- `multimedia`: Podcast and video content

### 4. Seed Initial Data

Create the default admin user:

```bash
node lib/seed-db.js
```

**Demo Credentials:**
- Email: `admin@football.et`
- Password: `admin123`

⚠️ Change these credentials immediately after first login!

### 5. Start Development Server

```bash
npm run dev
```

Access the admin panel at: `http://localhost:3000/admin`

## Usage

### Admin Panel Routes

- `/admin` - Dashboard
- `/admin/login` - Login page
- `/admin/blogs` - Articles list
- `/admin/blogs/create` - Create new article
- `/admin/blogs/[id]/edit` - Edit article
- `/admin/multimedia` - Multimedia list
- `/admin/multimedia/create` - Create new multimedia
- `/admin/multimedia/[id]/edit` - Edit multimedia
- `/admin/settings` - Site settings

### API Endpoints

**Authentication:**
- `POST /api/admin/auth/login` - Login
- `POST /api/admin/auth/logout` - Logout
- `GET /api/admin/auth/verify` - Verify session

**Blogs:**
- `GET /api/admin/blogs` - List blogs (with pagination, filtering)
- `POST /api/admin/blogs` - Create blog
- `GET /api/admin/blogs/[id]` - Get blog details
- `PUT /api/admin/blogs/[id]` - Update blog
- `DELETE /api/admin/blogs/[id]` - Delete blog

**Multimedia:**
- `GET /api/admin/multimedia` - List multimedia
- `POST /api/admin/multimedia` - Create multimedia
- `GET /api/admin/multimedia/[id]` - Get multimedia details
- `PUT /api/admin/multimedia/[id]` - Update multimedia
- `DELETE /api/admin/multimedia/[id]` - Delete multimedia

**Dashboard:**
- `GET /api/admin/dashboard/stats` - Get dashboard statistics

## Database Schema

### admin_users
- `id` (INT, PRIMARY KEY)
- `email` (VARCHAR, UNIQUE)
- `password_hash` (VARCHAR)
- `name` (VARCHAR)
- `role` (VARCHAR, default 'admin')
- `created_at`, `updated_at` (TIMESTAMPS)

### blogs
- `id` (INT, PRIMARY KEY)
- `slug` (VARCHAR, UNIQUE) - URL slug
- `title_en`, `title_am` (VARCHAR) - Bilingual titles
- `excerpt_en`, `excerpt_am` (TEXT) - Bilingual excerpts
- `body_en`, `body_am` (LONGTEXT) - Bilingual content
- `featured_image_url` (VARCHAR)
- `category` (VARCHAR) - Pillar: politics, law, society
- `tags` (JSON)
- `status` (ENUM: draft, published, scheduled)
- `publish_date` (DATETIME)
- `author_id` (INT, FOREIGN KEY)
- `created_at`, `updated_at` (TIMESTAMPS)

### multimedia
- `id` (INT, PRIMARY KEY)
- `type` (ENUM: audio, video)
- `title_en`, `title_am` (VARCHAR)
- `description_en`, `description_am` (TEXT)
- `file_url` (VARCHAR)
- `thumbnail_url` (VARCHAR)
- `duration_seconds` (INT)
- `status` (ENUM: draft, published, scheduled)
- `publish_date` (DATETIME)
- `created_at`, `updated_at` (TIMESTAMPS)

## Design System

The admin panel uses your existing design system:

- **Colors**:
  - Charcoal: `#1a1a1a` (primary text, sidebars)
  - Blue: `#2e5aac` (primary action, highlights)
  - Offwhite: `#fafaf9` (backgrounds)
  - Borders: `#e5e5e4`

- **Fonts**:
  - Noto Sans Ethiopic: Headers, Amharic content
  - Inter: Body text, UI labels

- **Components**:
  - Cards with subtle borders and hover states
  - Responsive sidebar navigation
  - Form inputs with inline validation
  - Status badges for content states
  - Pagination controls

## Security Notes

1. **JWT Secrets**: Change the default JWT secret in production
2. **HTTPS**: Always use HTTPS in production
3. **httpOnly Cookies**: Auth tokens are stored in httpOnly cookies, preventing XSS attacks
4. **Password Hashing**: All passwords are hashed with bcryptjs
5. **SQL Injection**: Uses parameterized queries (mysql2)
6. **UTF-8 Charset**: Database uses utf8mb4 for proper Amharic text support

## Customization

### Adding More Admin Users

Use a database client to insert into `admin_users` table:

```sql
INSERT INTO admin_users (email, password_hash, name, role)
VALUES ('user@example.com', '$2a$10$...', 'User Name', 'admin');
```

Note: Password hash must be bcryptjs hashed.

### Changing Content Categories

Edit the PILLARS array in:
- `src/pages/admin/blogs/index.jsx`
- `src/pages/admin/blogs/[id].jsx`

### Adding Rich Text Editor Features

The blog editor uses React Quill. Customize toolbar options in `src/pages/admin/blogs/[id].jsx` in the Quill modules configuration.

### Language Support

Translations are stored in `src/context/AdminLanguageContext.js`. Add new strings to both `en` and `am` objects.

## Troubleshooting

### Database Connection Issues

Check that:
1. MySQL connection variables are set correctly
2. Database exists: `SHOW DATABASES;`
3. Tables created: `SHOW TABLES;`

### Login Fails

1. Verify admin user exists: `SELECT * FROM admin_users;`
2. Check password hashing with: `npm run seed`
3. Look for errors in server logs

### Images Not Uploading

The image URL field expects external image URLs (CDN, Cloud Storage, etc.). For file uploads, integrate with a service like:
- AWS S3
- Cloudinary
- Firebase Storage

## Next Steps

1. Change demo credentials after first login
2. Update site metadata in Settings
3. Create content categories that match your editorial structure
4. Integrate image uploading service for featured images and thumbnails
5. Set up automated backups for the MySQL database
6. Monitor admin access logs in production

## Support

For issues or questions, check:
- API response status codes and error messages
- Browser console for client-side errors
- Server logs for backend issues

# Quick Start Guide - Admin Panel

Get the admin panel running in 5 minutes.

## Prerequisites
- Node.js 16+
- PostgreSQL 12+ running locally
- npm or yarn

## 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install bcryptjs
```

### Step 2: Configure Environment
Create `.env.local` in project root:
```env
NEXT_PUBLIC_APP_NAME="እግር ኳስ፣ ፖለቲካና ሕግ"
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/football_admin"
SESSION_SECRET="your-secret-key-12345"
```

**Note:** Replace with your PostgreSQL credentials.

### Step 3: Create Database
Using psql or your database client:
```sql
CREATE DATABASE football_admin WITH ENCODING 'UTF8' LC_COLLATE 'en_US.UTF-8';
```

### Step 4: Initialize Schema & Seed Data
```bash
npm run db:init    # Creates all tables (1-2 seconds)
npm run db:seed    # Adds sample data (1 second)
```

### Step 5: Start Dev Server
```bash
npm run dev
```

The app starts at `http://localhost:3000`

## Login

Access the admin panel:
- **URL:** `http://localhost:3000/admin/login`
- **Email:** `admin@football.com`
- **Password:** `admin123`

## What You Can Do Now

### 📝 Blogs
1. Click "Blogs" in sidebar
2. Click "New Blog" 
3. Fill in English & Amharic titles, content, category
4. Click "Save" to save as draft
5. Click published blog row to edit

### 🎬 Multimedia
1. Click "Multimedia" in sidebar
2. Click "New Item"
3. Select type (Audio or Video)
4. Enter file URL (or use sample: `https://example.com/media.mp3`)
5. Set duration in seconds (e.g., 2400 for 40 minutes)
6. Save

### ⚙️ Settings
1. Click "Settings" in sidebar
2. Edit site metadata in English and Amharic
3. Click Save for each section

### 🌐 Language Toggle
- Click "EN" or "አ" in top right to switch language
- UI updates instantly
- Preference saved to localStorage

## File Organization

```
Admin Panel Files:
├── lib/                          # Backend utilities
│   ├── db.js                     # Database connection
│   ├── auth.js                   # Authentication
│   ├── validation.js             # Form validation
│   └── middleware.js             # Route protection
│
├── pages/api/                    # API endpoints
│   ├── auth/                     # Login/logout
│   ├── blogs/                    # Blog CRUD
│   ├── multimedia/               # Media CRUD
│   ├── settings/                 # Config
│   └── dashboard/                # Stats
│
├── src/admin/                    # Frontend code
│   ├── hooks/                    # Auth, language
│   └── components/               # Layout, sidebar, header
│
├── src/pages/admin/              # Admin pages
│   ├── login.jsx                 # Login page
│   ├── dashboard.jsx             # Dashboard
│   ├── blogs/                    # Blog pages
│   ├── multimedia/               # Media pages
│   └── settings/                 # Settings page
│
└── public/assets/scss/
    └── admin-panel.scss          # All styles (910 lines)
```

## Database Tables

| Table | Purpose |
|-------|---------|
| `admin_users` | Login credentials |
| `blogs` | Articles (dual-language) |
| `blog_tags` | Article tags |
| `multimedia` | Podcasts/videos |
| `site_settings` | Site configuration |

All tables use UTF-8 for Amharic text.

## Common Tasks

### Create a Blog Post
1. Go to Blogs → New Blog
2. Enter English title & content
3. Enter Amharic title & content
4. Select category (3 options)
5. Add tags (press Enter to add)
6. Save as draft or publish
7. Auto-generated slug can be overridden

### Create a Podcast Episode
1. Go to Multimedia → New Item
2. Enter English & Amharic titles
3. Select "Audio" type
4. Paste file URL (must be accessible URL)
5. Enter duration in seconds
6. Save

### Edit Site Settings
1. Go to Settings
2. Edit "Site Title", "Tagline", or "Description"
3. Update both English and Amharic versions
4. Click Save for each section

### Filter Blog Posts
1. Go to Blogs
2. Use status dropdown (All, Draft, Published)
3. Use category dropdown to filter by category
4. Table updates instantly

## API Quick Reference

All endpoints protected (require login):

**Blogs:**
- `GET /api/blogs?status=published&category=Politics%20%26%20Power`
- `POST /api/blogs` (create)
- `GET /api/blogs/my-blog-slug` (get)
- `PUT /api/blogs/my-blog-slug` (update)
- `DELETE /api/blogs/my-blog-slug` (delete)

**Multimedia:**
- `GET /api/multimedia?type=audio`
- `POST /api/multimedia` (create)
- `GET /api/multimedia/1` (get)
- `PUT /api/multimedia/1` (update)
- `DELETE /api/multimedia/1` (delete)

**Other:**
- `POST /api/auth/login` (get session)
- `GET /api/auth/me` (check logged in)
- `POST /api/auth/logout` (logout)
- `GET /api/dashboard/stats` (get stats)

## Troubleshooting

### Login fails
**Problem:** "Invalid email or password"
**Solution:** 
```bash
npm run db:seed  # Recreates admin user
```

### Can't connect to database
**Problem:** "Error: connect ECONNREFUSED"
**Solution:**
- Start PostgreSQL service
- Check `DATABASE_URL` in `.env.local`
- Ensure database exists: `CREATE DATABASE football_admin;`

### Amharic text not showing
**Problem:** See squares instead of Amharic characters
**Solution:**
- Check browser console for font errors
- Refresh page (Ctrl+Shift+R)
- Verify UTF-8 encoding in database:
  ```sql
  SELECT * FROM pg_database WHERE datname='football_admin';
  ```

### Styles not loading
**Problem:** Admin panel looks unstyled
**Solution:**
- Clear browser cache (Ctrl+Shift+Delete)
- Restart dev server (`npm run dev`)
- Check DevTools → Network for CSS file

## Next Steps

### Deploy to Production
1. Set strong `SESSION_SECRET` in production
2. Use production PostgreSQL instance
3. Set `NEXT_PUBLIC_APP_NAME` for your domain
4. Deploy via Vercel, Railway, or your host
5. Ensure HTTPS is enabled
6. Add environment variables to deployment

### Extend the Admin Panel
See `ADMIN_PANEL_README.md` for:
- Adding new content types
- Customizing colors
- Adding more admin users
- Integration with external services

### Secure for Production
- [ ] Change admin password: Update `admin_users` table
- [ ] Use strong `SESSION_SECRET`
- [ ] Enable HTTPS
- [ ] Set up regular backups
- [ ] Add rate limiting
- [ ] Enable CORS if needed

## Keyboard Shortcuts

- `Tab` - Navigate form fields
- `Enter` - Submit forms / Add tags
- `Escape` - Close modals
- `Ctrl/Cmd + B` - Toggle sidebar (coming soon)

## Support

For detailed information, see:
- **`ADMIN_PANEL_README.md`** - Full documentation
- **`IMPLEMENTATION_SUMMARY.md`** - Complete feature list
- Database schema at bottom of `ADMIN_PANEL_README.md`

## Version Info

- **Admin Panel Version:** 1.0.0
- **Built with:** Next.js 13, React 18, PostgreSQL
- **Languages:** English & Amharic
- **Status:** Production Ready

---

**Happy content management! 🎉**

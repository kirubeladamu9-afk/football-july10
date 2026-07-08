# Admin Panel - Quick Start

## Installation (5 minutes)

### 1. Install npm packages
```bash
npm install
```

### 2. Set up environment variables
Copy `.env.local.example` to `.env.local` and add your JWT secret:
```bash
cp .env.local.example .env.local
```

Your MySQL environment variables are already configured from Railway.

### 3. Initialize database and seed default admin
```bash
node lib/init-db.js
node lib/seed-db.js
```

### 4. Start the dev server
```bash
npm run dev
```

### 5. Access the admin panel
Open `http://localhost:3000/admin`

**Login with:**
- Email: `admin@football.et`
- Password: `admin123`

⚠️ **Change these credentials immediately after login!**

---

## What's Included

### Pages (Under `/admin`)
- **Dashboard** (`/`) - Overview of articles, multimedia, and recent activity
- **Articles** (`/blogs`) - Full CRUD for blog posts
  - Dual-language support (Amharic/English)
  - Rich text editor for body content
  - Pillar/category selection
  - Tag management
  - Featured image URL support
  - Publish status and scheduling
  - Auto-slug generation with manual override

- **Multimedia** (`/multimedia`) - Podcasts and videos management
  - Type selector (audio/video)
  - Bilingual title and description
  - File URLs and thumbnails
  - Duration tracking
  - Publish scheduling

- **Settings** (`/settings`) - Site metadata configuration

- **Login** (`/login`) - Email/password authentication

### API Routes (Under `/api/admin`)
All endpoints require authentication (except login)

**Auth:**
- `POST /auth/login` - Login with email/password
- `POST /auth/logout` - Logout
- `GET /auth/verify` - Check session status

**Blogs:**
- `GET /blogs` - List articles (paginated, filterable)
- `POST /blogs` - Create article
- `GET /blogs/[id]` - Get single article
- `PUT /blogs/[id]` - Update article
- `DELETE /blogs/[id]` - Delete article

**Multimedia:**
- `GET /multimedia` - List multimedia
- `POST /multimedia` - Create multimedia
- `GET /multimedia/[id]` - Get single multimedia
- `PUT /multimedia/[id]` - Update multimedia
- `DELETE /multimedia/[id]` - Delete multimedia

**Dashboard:**
- `GET /dashboard/stats` - Get dashboard statistics

### Database Tables

**admin_users**
- Admin account storage with encrypted passwords

**blogs**
- Article content with bilingual (AM/EN) fields
- Support for 3 pillars: Politics & Power, Law & Governance, Society & Ethics
- Rich HTML body content
- Tags, featured images, scheduling

**multimedia**
- Podcast and video content
- Bilingual titles/descriptions
- File URLs and thumbnails
- Duration and publishing info

All tables use:
- InnoDB engine
- UTF-8MB4 charset (proper Amharic support)
- Foreign keys and indexes for performance

---

## Design

**Color Scheme:**
- Charcoal (#1a1a1a) - Primary text and sidebars
- Blue (#2e5aac) - Action buttons and highlights
- Offwhite (#fafaf9) - Backgrounds
- Border (#e5e5e4) - Subtle separators

**Typography:**
- Noto Sans Ethiopic - Amharic headers
- Inter - English and body text

**Layout:**
- Fixed left sidebar navigation
- Responsive grid layouts
- Card-based content containers
- Hover states and smooth transitions

---

## Key Features

✅ **Bilingual Support**
- Toggle between Amharic and English
- All UI strings translated
- Database fully supports UTF-8MB4 for proper Amharic text

✅ **Security**
- JWT tokens in httpOnly cookies
- Password hashing with bcryptjs
- Parameterized SQL queries (no injection)
- Protected API routes with middleware

✅ **User Experience**
- Responsive design (works on mobile/tablet)
- Real-time form validation
- Inline error messages
- Loading indicators and spinners
- Success/error notifications

✅ **Content Management**
- Full CRUD operations
- Rich text editor with formatting
- Auto-generated URL slugs
- Category and tag management
- Publish status and scheduling
- Featured images and thumbnails
- Bilingual everything

---

## File Structure

```
admin-panel/
├── lib/
│   ├── db.js              # MySQL connection pool
│   ├── jwt.js             # JWT token utilities
│   ├── auth-middleware.js # Auth protection for routes
│   ├── init-db.js         # Database schema creation
│   └── seed-db.js         # Default admin user
├── src/
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── index.jsx  # Dashboard
│   │   │   ├── login.jsx  # Login page
│   │   │   ├── settings.jsx
│   │   │   ├── blogs/     # Blog management
│   │   │   └── multimedia/ # Multimedia management
│   │   └── api/admin/     # API routes
│   ├── components/admin/
│   │   ├── AdminLayout.jsx    # Main wrapper
│   │   └── AdminSidebar.jsx   # Navigation
│   ├── context/
│   │   ├── AdminAuthContext.js      # Auth state
│   │   └── AdminLanguageContext.js  # Language/translations
│   └── styles/
│       └── admin.scss       # Admin panel styles
├── package.json            # Dependencies
├── .env.local.example      # Environment template
├── ADMIN_SETUP.md          # Full setup guide
└── ADMIN_QUICKSTART.md     # This file
```

---

## Common Tasks

### Create a New Article
1. Go to **Articles** → **Add Article**
2. Fill in English and Amharic titles
3. Write content in rich text editors
4. Select pillar and add tags
5. Upload featured image URL
6. Set status (Draft/Published/Scheduled)
7. Click Save

### Add a Podcast
1. Go to **Multimedia** → **Add Multimedia**
2. Select "Podcast" from Type dropdown
3. Add bilingual titles and descriptions
4. Paste podcast file URL
5. Add thumbnail URL
6. Enter duration (optional)
7. Set publish date and status
8. Save

### Change Admin Password
Currently requires database access. To add this UI:
1. Create form in Settings page
2. Add API endpoint: `POST /api/admin/auth/change-password`
3. Verify old password before changing

### Filter or Search Articles
Use the filter dropdowns on the Articles page to filter by:
- Status (Draft/Published/Scheduled)
- Category/Pillar
- Pagination for browsing

---

## Production Deployment

Before deploying:

1. **Change JWT Secret**
   ```bash
   # Generate a secure random string
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Add to your production `.env` variables

2. **Update Admin Credentials**
   - Login with demo credentials
   - Create a new admin user
   - Delete the demo account

3. **Database Backups**
   - Set up automatic MySQL backups
   - Test restore procedures

4. **Monitor Admin Access**
   - Log all admin activities
   - Set up alerts for unusual activity

5. **SSL/HTTPS**
   - Ensure all admin traffic is over HTTPS
   - Update cookie security settings for production

6. **Rate Limiting**
   - Add rate limiting to `/api/admin/auth/login`
   - Protect API routes from abuse

---

## Troubleshooting

**Login not working?**
- Check that admin user was created: `node lib/seed-db.js`
- Verify JWT_SECRET is set in .env.local
- Check browser console for errors

**Can't connect to database?**
- Verify MySQL connection variables
- Test connection: `mysql -h $MYSQLHOST -u $MYSQLUSER -p`
- Check that database exists: `SHOW DATABASES;`

**Images not showing?**
- Ensure you're providing direct image URLs (CDN, cloud storage)
- Check CORS settings if using external image service

**Styling issues?**
- Clear browser cache and refresh
- Check that `src/styles/admin.scss` is being loaded
- Verify SCSS compilation in Next.js

---

## Next Steps

1. ✅ Install and set up (you are here)
2. ⏭️ Test the dashboard with demo data
3. ⏭️ Create your first article
4. ⏭️ Upload multimedia content
5. ⏭️ Change admin credentials
6. ⏭️ Configure site metadata in Settings
7. ⏭️ Deploy to production

---

For more details, see **ADMIN_SETUP.md**

# Bilingual Admin Panel for "እግር ኳስ፣ ፖለቲካና ሕግ"

A complete, production-ready admin panel for managing blog articles and multimedia content with full bilingual support (English/Amharic), session-based authentication, and a clean, minimal design matching your site's aesthetic.

## Features

### ✅ Authentication
- Email/password login with session-based authentication
- Secure password hashing with bcryptjs
- Protected admin routes (automatic redirects to login)
- User session management
- Single admin role (extendable to multiple roles)

### 📝 Blog Management
- Full CRUD operations for blog articles
- Dual-language fields (English & Amharic) for:
  - Titles
  - Excerpts
  - Body content
- Three predefined categories:
  - Politics & Power (ፖለቲካ እና ስልጣን)
  - Law & Governance (ህግ እና አስተዳደር)
  - Society & Ethics (ማህበረሰብ እና ስነምግባር)
- Publish/Draft/Scheduled status
- Auto-generated slug with manual override
- Tag system for content organization
- Featured image support

### 🎬 Multimedia Management
- Support for podcasts and videos
- Dual-language metadata (titles & descriptions)
- File URL or direct upload
- Duration tracking
- Publish date scheduling
- Thumbnail/cover image support
- Type selector (audio/video)

### ⚙️ Site Settings
- Bilingual site metadata management
- Site title, tagline, and description
- Easy expansion for additional settings

### 📊 Dashboard
- Real-time statistics:
  - Total articles count
  - Published vs. draft counts
  - Total multimedia items
- Recent activity feed
- Quick navigation to major sections

### 🌐 Bilingual UI
- Full English/Amharic language toggle
- Persistent language preference (localStorage)
- All UI text in both languages
- Proper Amharic character encoding (UTF-8)

### 🎨 Design System
- Matches your existing frontend:
  - Color scheme: Charcoal (#1A1A1A), Blue (#2E5AAC), Offwhite (#FAFAF9)
  - Typography: Noto Sans Ethiopic + Inter fonts
  - Card-based layout with subtle borders
  - Minimal, clean aesthetic
- Responsive sidebar navigation
- Persistent header with language toggle
- Loading states and error handling
- Form validation with inline error messages

## Database Schema

### Tables

**admin_users**
- id (SERIAL PRIMARY KEY)
- email (VARCHAR UNIQUE)
- password_hash (VARCHAR)
- name (VARCHAR)
- created_at, updated_at (TIMESTAMP)

**blogs**
- id (SERIAL PRIMARY KEY)
- slug (VARCHAR UNIQUE)
- title_en, title_am (VARCHAR)
- excerpt_en, excerpt_am (TEXT)
- body_en, body_am (TEXT)
- featured_image_url (VARCHAR)
- category (VARCHAR)
- status (VARCHAR: draft/published/scheduled)
- publish_date (TIMESTAMP)
- created_by (FOREIGN KEY → admin_users)
- created_at, updated_at (TIMESTAMP)

**blog_tags**
- id (SERIAL PRIMARY KEY)
- blog_id (FOREIGN KEY → blogs)
- tag (VARCHAR)
- created_at (TIMESTAMP)

**multimedia**
- id (SERIAL PRIMARY KEY)
- title_en, title_am (VARCHAR)
- description_en, description_am (TEXT)
- type (VARCHAR: audio/video)
- file_url (VARCHAR)
- thumbnail_url (VARCHAR)
- duration (INTEGER - seconds)
- publish_date (TIMESTAMP)
- created_by (FOREIGN KEY → admin_users)
- created_at, updated_at (TIMESTAMP)

**site_settings**
- id (SERIAL PRIMARY KEY)
- key (VARCHAR UNIQUE)
- value_en, value_am (TEXT)
- updated_at (TIMESTAMP)

All tables use UTF-8 encoding for proper Amharic text storage.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install bcryptjs
```

### 2. Set Up Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_APP_NAME="እግር ኳስ፣ ፖለቲካና ሕግ"
DATABASE_URL="postgresql://username:password@localhost:5432/football_admin"
SESSION_SECRET="your-secure-secret-key-change-in-production"
```

### 3. Initialize Database Schema
```bash
npm run db:init
```

This creates all necessary tables with:
- Proper foreign key relationships
- UTF-8 encoding for Amharic support
- Useful indexes for performance

### 4. Seed Sample Data (Optional)
```bash
npm run db:seed
```

Creates:
- Default admin user: `admin@football.com` / `admin123`
- Sample blog posts with Amharic content
- Sample multimedia items
- Site settings entries

**Note:** The seed script safely checks if admin user already exists before adding data.

### 5. Start Dev Server
```bash
npm run dev
```

Access admin panel at: `http://localhost:3000/admin/login`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Clear session
- `GET /api/auth/me` - Get current user info

### Dashboard
- `GET /api/dashboard/stats` - Get statistics and recent activity

### Blogs
- `GET /api/blogs` - List blogs (supports filters: status, category, pagination)
- `POST /api/blogs` - Create new blog
- `GET /api/blogs/[slug]` - Get single blog
- `PUT /api/blogs/[slug]` - Update blog
- `DELETE /api/blogs/[slug]` - Delete blog

### Multimedia
- `GET /api/multimedia` - List multimedia (supports filters: type, pagination)
- `POST /api/multimedia` - Create new item
- `GET /api/multimedia/[id]` - Get single item
- `PUT /api/multimedia/[id]` - Update item
- `DELETE /api/multimedia/[id]` - Delete item

### Settings
- `GET /api/settings` - Get all settings
- `PUT /api/settings` - Create or update setting

## File Structure

```
├── lib/
│   ├── auth.js              # Authentication utilities
│   ├── db.js                # Database connection & utilities
│   ├── middleware.js        # Auth middleware for API routes
│   └── validation.js        # Form validation & error messages
│
├── pages/api/
│   ├── auth/
│   │   ├── login.js
│   │   ├── logout.js
│   │   └── me.js
│   ├── blogs/
│   │   ├── index.js         # List & create
│   │   └── [slug].js        # Get, update, delete
│   ├── multimedia/
│   │   ├── index.js         # List & create
│   │   └── [id].js          # Get, update, delete
│   ├── settings/
│   │   └── index.js
│   └── dashboard/
│       └── stats.js
│
├── src/admin/
│   ├── components/
│   │   ├── AdminLayout.jsx  # Main wrapper
│   │   ├── Sidebar.jsx      # Navigation
│   │   └── Header.jsx       # Top bar with language toggle
│   └── hooks/
│       ├── useAuth.js       # Auth context & provider
│       └── useLanguage.js   # Language toggle hook
│
├── src/pages/admin/
│   ├── login.jsx            # Login page
│   ├── dashboard.jsx        # Dashboard
│   ├── blogs/
│   │   ├── index.jsx        # Blog list
│   │   ├── new.jsx          # Create new blog
│   │   └── [slug].jsx       # Edit blog
│   ├── multimedia/
│   │   ├── index.jsx        # Multimedia list
│   │   ├── new.jsx          # Create new item
│   │   └── [id].jsx         # Edit item
│   └── settings/
│       └── index.jsx        # Site settings
│
├── public/assets/scss/
│   └── admin-panel.scss     # Complete admin UI styles
│
├── scripts/
│   ├── init-db.js           # Schema creation script
│   └── seed-db.js           # Sample data script
│
└── .env.local               # Environment variables
```

## Authentication Flow

1. User visits `/admin/login`
2. Enters email and password
3. Server validates credentials against `admin_users` table
4. On success, creates session token (base64 encoded JWT-like structure)
5. Token stored in httpOnly cookie `admin_session`
6. Subsequent requests include session in headers
7. Middleware validates session on protected routes
8. Logout clears the session cookie

## Styling Approach

The admin panel uses:
- **SCSS** for styles with variables for colors and breakpoints
- **CSS Grid** for responsive layouts
- **Inline styles** in React components where necessary
- **No CSS-in-JS libraries** to keep bundle size minimal
- Proper media queries for mobile responsiveness

Key design tokens:
- Primary color: `#2e5aac` (Blue)
- Text color: `#1a1a1a` (Charcoal)
- Background: `#fafaf9` (Offwhite)
- Border: `#eeeef5` (Light gray)
- Fonts: Noto Sans Ethiopic (Amharic), Inter (English)

## Form Validation

Validation includes:
- Required field checks
- Email format validation
- Slug format validation
- Bilingual error messages
- Client-side validation before submission
- Server-side validation for security
- Inline error display in forms

## Loading & Error States

- Loading spinners while fetching data
- Error alerts with clear messages (bilingual)
- Success confirmations after actions
- Proper form disable states during submission
- Graceful handling of 404 and network errors

## Security Features

- Passwords hashed with bcryptjs (10 salt rounds)
- Session-based authentication (not JWT)
- HttpOnly cookies (client-side code can't access)
- CSRF protection via cookie security
- Input validation on both client and server
- SQL injection prevention via parameterized queries
- Protected API routes requiring authentication

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design for mobile, tablet, desktop
- Touch-friendly UI elements
- RTL-ready structure (can be extended for Amharic RTL)

## Extending the Admin Panel

### Add New Settings
1. Create a form component in `/src/pages/admin/settings/`
2. Add new key to the settings table
3. Update `translations` in `useLanguage.js`
4. Create API endpoint in `/pages/api/settings/`

### Add New Content Types
1. Create database table(s)
2. Create CRUD API endpoints in `/pages/api/`
3. Create pages in `/src/pages/admin/`
4. Add navigation item in `Sidebar.jsx`
5. Add translations for new labels

### Customize Colors
- Update SCSS variables in `public/assets/scss/admin-panel.scss`
- Update color constants in component files
- Maintain design consistency across the panel

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` in `.env.local`
- Ensure PostgreSQL is running
- Check database credentials
- Run `npm run db:init` to create schema

### Login Not Working
- Verify admin user exists: `npm run db:seed`
- Check password is `admin123` for default user
- Ensure `SESSION_SECRET` is set in `.env.local`
- Check browser cookies are enabled

### Amharic Text Not Displaying
- Verify UTF-8 encoding in database
- Check Noto Sans Ethiopic font is loaded
- Verify data is properly stored in database
- Check browser DevTools for encoding issues

### Styles Not Loading
- Ensure SCSS is compiled to CSS
- Check `public/assets/scss/admin-panel.scss` exists
- Verify import in `src/pages/_app.jsx`
- Clear browser cache

## Performance Considerations

- Pagination on blog/multimedia lists (default 10 items per page)
- Database indexes on frequently queried columns
- Lazy loading of images
- Optimized database queries
- Minimal client-side state management

## Future Enhancements

Possible additions:
- Multiple admin users with role-based permissions
- Two-factor authentication
- Email notifications for new content
- Content scheduling and auto-publishing
- Comment moderation
- Analytics and traffic reports
- Content search and advanced filtering
- Bulk operations
- Activity logs and audit trail
- File upload with server-side storage
- Rich text editor integration
- Content versioning and restore
- Multi-language content beyond English/Amharic

## License

This admin panel is part of the "እግር ኳስ፣ ፖለቲካና ሕግ" editorial platform.

---

**Support:** For issues or questions, check the database schema, API endpoints, and authentication flow documentation above.

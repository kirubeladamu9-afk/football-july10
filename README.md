# Football Governance & Tactics

A Next.js-based content platform exploring the intersection of football with politics, law, and society.

## Project Overview

**Football Governance & Tactics** is a comprehensive web platform dedicated to analyzing and discussing how football intersects with governance, legal frameworks, and social dynamics. The site features multilingual content (English & Amharic), research articles, podcasts, and multimedia content.

### Key Features

- **Multilingual Support**: English and Amharic language support
- **Content Management**: Blog articles, research hub, and multimedia content
- **User Authentication**: Admin panel with user authentication
- **Database Integration**: MySQL database for content and user management
- **Responsive Design**: Mobile-first design with Bootstrap 5
- **Rich Media**: Support for images, videos, and podcast content
- **SEO Optimized**: Proper meta tags and SEO configuration

## Tech Stack

- **Framework**: Next.js 13.2.4
- **Frontend**: React 18.2.0
- **Styling**: SASS/SCSS with Bootstrap 5
- **Database**: MySQL
- **Authentication**: JWT-based with bcrypt password hashing
- **Animations**: GSAP and WOW.js
- **Forms**: React Hook Form with Yup validation
- **UI Components**: React Modal Video, React Slick, Swiper

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL database
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Initialize database
npm run db:init

# Seed database with sample data (optional)
npm run db:seed

# Run migrations if needed
npm run db:migrate
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Preferred database connection setting
MYSQL_URL=mysql://user:password@host:3306/football_db

# Use these only when MYSQL_URL is not set
MYSQLHOST=your_mysql_host
MYSQLUSER=your_mysql_user
MYSQLPASSWORD=your_mysql_password
MYSQL_DATABASE=football_db
MYSQLPORT=3306

# Required for production admin authentication
SESSION_SECRET=replace_with_a_long_random_secret

NODE_ENV=production
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Building for Production

```bash
npm run build
npm start
```

## Admin Panel

### Access Admin

- Navigate to `/admin` or the admin panel link in the application
- Login with your admin credentials

### Admin Features

#### Content Management
- **Blog Management**: Create, edit, and publish articles in English and Amharic
- **Multimedia Library**: Upload and manage videos, podcasts, and images
- **Research Hub**: Curate and organize research articles
- **Categories & Tags**: Organize content with custom tags and categories

#### User Management
- **User Authentication**: Secure login with JWT tokens
- **User Profiles**: Manage user information and roles
- **Access Control**: Different permission levels for admin functions

#### Dashboard
- **Analytics**: View site statistics and content performance
- **Settings**: Configure site settings and general information
- **Profile Management**: Admin profile and account settings

## Project Structure

```
football-governance-tactics/
├── pages/                          # Next.js pages and API routes
│   ├── index.jsx                   # Homepage
│   ├── blog/                       # Blog pages
│   ├── about.jsx                   # About page
│   ├── contact.jsx                 # Contact page
│   └── api/                        # API endpoints
├── src/
│   ├── components/                 # React components
│   │   ├── homes/                  # Homepage sections
│   │   ├── blog/                   # Blog components
│   │   ├── about/                  # About page components
│   │   └── admin/                  # Admin panel components
│   ├── layout/                     # Layout components (header, footer)
│   ├── common/                     # Common/shared components
│   ├── pages/                      # Alternative page structure
│   ├── data/                       # Static data and configurations
│   ├── hooks/                      # Custom React hooks
│   ├── forms/                      # Form components
│   ├── svg/                        # SVG components
│   └── i18n/                       # Internationalization (i18n)
├── lib/                            # Utility functions and libraries
│   ├── auth.js                     # Authentication functions
│   ├── db.js                       # Database connection
│   ├── middleware.js               # API middleware
│   └── validation.js               # Form validation schemas
├── public/
│   └── assets/                     # Static assets (images, styles)
├── scripts/                        # Database scripts
│   ├── init-db.js                  # Database initialization
│   ├── seed-db.js                  # Database seeding
│   └── migrations/                 # Database migrations
└── package.json                    # Project dependencies
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `GET /api/auth/profile` - Get user profile

### Blog
- `GET /api/blogs/public` - Get public blog articles
- `GET /api/blogs/public-detail` - Get blog article details
- `POST /api/blogs` - Create new article (admin)
- `PUT /api/blogs/[slug]` - Update article (admin)

### Multimedia
- `GET /api/multimedia` - Get multimedia items
- `POST /api/multimedia` - Upload multimedia (admin)
- `PUT /api/multimedia/[id]` - Update multimedia (admin)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics (admin)

### Settings
- `GET /api/settings` - Get site settings (admin)
- `PUT /api/settings` - Update site settings (admin)

## Content Languages

The platform supports:
- **English**: Primary language
- **Amharic** (አማርኛ): Secondary language for African audience

All content can be created and managed in both languages through the admin panel.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

The site can be deployed to various platforms:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS**
- **Azure**
- **Self-hosted servers**

### Plesk deployment

1. In Plesk, enable the Node.js extension for the domain and select Node.js 18 or later.
2. Upload the project (including `package-lock.json`) to the application root, but do not upload local `.env` files or `node_modules`.
3. Set **Document Root** to the application's `public` directory, **Application Startup File** to `server.js`, and **Application URL** to `/`.
4. In **Application Settings**, add `NODE_ENV=production`, `MYSQL_URL` (or all of `MYSQLHOST`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQL_DATABASE`, and `MYSQLPORT`), and a long, unique `SESSION_SECRET`.
5. Run `npm ci`, then `npm run build` from the Plesk Node.js interface or the domain's terminal.
6. Set the application startup command to `npm start`, restart the Node.js application, and verify the public site and `/admin` sign-in.

Run `npm run db:migrate` only after backing up the production database and only if those migrations have not already been applied.

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is proprietary and closed source.

## Support

For technical issues or questions:
- Contact the development team
- Check documentation in `/docs` (if available)

## Version

**Current Version**: 0.1.0

---

**Last Updated**: July 2024

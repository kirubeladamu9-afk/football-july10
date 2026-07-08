# Admin Panel Deployment & Testing Checklist

## Pre-Deployment Setup Checklist

### Environment Configuration
- [ ] PostgreSQL 12+ installed and running
- [ ] Database created: `CREATE DATABASE football_admin WITH ENCODING 'UTF8';`
- [ ] `.env.local` file created with proper values:
  ```env
  NEXT_PUBLIC_APP_NAME="እግር ኳስ፣ ፖለቲካና ሕግ"
  DATABASE_URL="postgresql://user:password@localhost:5432/football_admin"
  SESSION_SECRET="generate-a-random-secret-key"
  ```

### Dependencies Installation
- [ ] Ran `npm install`
- [ ] Ran `npm install bcryptjs`
- [ ] Verified dependencies in `package.json` include bcryptjs

### Database Setup
- [ ] Ran `npm run db:init` successfully
- [ ] Ran `npm run db:seed` successfully
- [ ] Verified tables created: `SELECT * FROM information_schema.tables WHERE table_schema = 'public';`
- [ ] Verified admin user exists: `SELECT * FROM admin_users;`

### Development Testing
- [ ] Started dev server: `npm run dev`
- [ ] Server running at `http://localhost:3000`
- [ ] No console errors on startup

## Functional Testing Checklist

### Authentication
- [ ] Can access `/admin/login` page
- [ ] Login page displays both English and Amharic labels
- [ ] Login with correct credentials succeeds
- [ ] Login with wrong password shows error message
- [ ] Login redirects to `/admin/dashboard`
- [ ] Can logout from any admin page
- [ ] After logout, accessing `/admin/*` redirects to login
- [ ] Session persists on page refresh

### Dashboard
- [ ] Dashboard loads with statistics
- [ ] Statistics cards show correct counts
- [ ] Recent activity list displays recent items
- [ ] Dashboard updates after creating new content
- [ ] Loading state appears while fetching stats

### Blog Management

#### List View
- [ ] Blogs page loads with table
- [ ] "New Blog" button is visible and clickable
- [ ] Filter by status (Draft/Published) works
- [ ] Filter by category works
- [ ] Blog title displays in selected language
- [ ] Edit button opens blog for editing
- [ ] Delete button shows confirmation and removes blog
- [ ] Empty state shows when no blogs exist

#### Create Blog
- [ ] New blog form loads
- [ ] Can enter English title
- [ ] Can enter Amharic title
- [ ] Can enter English excerpt
- [ ] Can enter Amharic excerpt
- [ ] Can enter English body
- [ ] Can enter Amharic body
- [ ] Category dropdown shows 3 options
- [ ] Tags input allows adding multiple tags
- [ ] Tags can be removed
- [ ] Slug auto-generates from English title
- [ ] Status defaults to Draft
- [ ] Can change status to Published
- [ ] Submit shows loading state
- [ ] Success redirects to blogs list
- [ ] Error message shows on validation failure

#### Edit Blog
- [ ] Can load existing blog
- [ ] All fields pre-populate correctly
- [ ] Can update English content
- [ ] Can update Amharic content
- [ ] Tags load correctly
- [ ] Changes save properly
- [ ] Redirect on success works

### Multimedia Management

#### List View
- [ ] Multimedia page loads
- [ ] "New Item" button is visible
- [ ] Filter by type (Audio/Video) works
- [ ] Item title displays in selected language
- [ ] Edit button opens item for editing
- [ ] Delete button removes item
- [ ] Duration displays correctly (m/s format)
- [ ] Empty state shows when no items exist

#### Create Multimedia
- [ ] Can enter English title
- [ ] Can enter Amharic title
- [ ] Can enter English description
- [ ] Can enter Amharic description
- [ ] Type selector shows Audio/Video options
- [ ] File URL field accepts input
- [ ] Duration field accepts numbers
- [ ] Publish date picker works
- [ ] Submit saves new item
- [ ] Redirect on success works

#### Edit Multimedia
- [ ] Can load existing item
- [ ] All fields pre-populate correctly
- [ ] Can update all fields
- [ ] Changes save properly

### Settings Management
- [ ] Settings page loads
- [ ] Site Title section shows two fields (EN/AM)
- [ ] Tagline section shows two fields
- [ ] Description section shows two fields
- [ ] Can edit English values
- [ ] Can edit Amharic values
- [ ] Each section saves independently
- [ ] Success message appears after save
- [ ] Values persist on page reload

### Bilingual UI
- [ ] Language toggle shows "EN" and "አ" buttons
- [ ] Toggle switches language instantly
- [ ] All UI text translates correctly
- [ ] Language preference persists on reload
- [ ] Amharic text displays without squares
- [ ] Font loads properly for Amharic

### Design & Responsiveness
- [ ] Layout matches design system (colors, fonts)
- [ ] Charcoal (#1A1A1A) text color correct
- [ ] Blue (#2E5AAC) accent color correct
- [ ] Offwhite (#FAFAF9) background correct
- [ ] Sidebar displays on desktop
- [ ] Sidebar responsive on tablet (768px)
- [ ] Mobile menu works on phone (640px)
- [ ] Cards have subtle borders
- [ ] Buttons have proper hover states
- [ ] Forms have adequate spacing
- [ ] Tables are readable on mobile

### Error Handling
- [ ] Network errors show proper messages
- [ ] 404 errors handled gracefully
- [ ] 500 errors show user-friendly messages
- [ ] Form validation errors show inline
- [ ] Error messages are bilingual
- [ ] Loading states prevent accidental double-submit
- [ ] Timeout errors handled properly

### Performance
- [ ] Pages load quickly (< 2 seconds)
- [ ] No console errors or warnings
- [ ] No memory leaks on page navigation
- [ ] Images load properly
- [ ] Fonts load without delay
- [ ] Database queries are efficient

## Browser Compatibility Testing

- [ ] Chrome latest version
- [ ] Firefox latest version
- [ ] Safari latest version
- [ ] Edge latest version
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Security Testing

- [ ] Cannot access admin pages without login
- [ ] Session cookie is httpOnly (visible only in dev tools under "Cookies")
- [ ] Password is never logged in console
- [ ] CSRF tokens handled properly (built-in with cookies)
- [ ] SQL injection attempts fail safely
- [ ] XSS attempts handled (React auto-escapes)

## Database Testing

- [ ] UTF-8 encoding confirmed for Amharic text
- [ ] Can store Amharic characters in all fields
- [ ] Can retrieve Amharic text correctly
- [ ] Foreign keys prevent orphaned records
- [ ] Indexes improve query performance
- [ ] Backups can be created

## Performance Benchmarks

Target metrics:
- [ ] Login: < 500ms
- [ ] Blogs list: < 1000ms
- [ ] Create blog: < 1000ms
- [ ] Dashboard: < 1000ms
- [ ] Settings: < 1000ms

## Production Deployment

### Before Going Live
- [ ] Change SESSION_SECRET to strong random value
- [ ] Update DATABASE_URL to production database
- [ ] Verify HTTPS is enabled
- [ ] Set up automated backups
- [ ] Test on staging environment first
- [ ] Review all error logs
- [ ] Load test with expected traffic
- [ ] Verify email (if added later)
- [ ] Check CDN/caching strategy
- [ ] Document admin credentials securely

### First Production Deployment
- [ ] Create new admin user (don't use default)
- [ ] Run `npm run db:init` on production database
- [ ] Verify schema created successfully
- [ ] Test login on production
- [ ] Test each feature (CRUD operations)
- [ ] Monitor error logs
- [ ] Check database for proper encoding
- [ ] Verify backup system working

### Ongoing Maintenance
- [ ] Regular database backups (daily)
- [ ] Monitor error logs (weekly)
- [ ] Review access logs (weekly)
- [ ] Security updates (as needed)
- [ ] Database optimization (monthly)
- [ ] Admin user access review (quarterly)

## Rollback Plan

If issues occur:
1. [ ] Have database backup ready
2. [ ] Have previous version code ready
3. [ ] Document what caused the issue
4. [ ] Restore from backup if needed
5. [ ] Fix issue on staging first
6. [ ] Re-test all features
7. [ ] Deploy fix to production

## User Training Checklist

Before handing off to content team:
- [ ] Train how to create blog posts
- [ ] Train how to create multimedia items
- [ ] Train how to edit existing content
- [ ] Train how to delete content
- [ ] Train how to manage tags
- [ ] Train how to set status (Draft/Published)
- [ ] Train how to use language toggle
- [ ] Train how to manage settings
- [ ] Provide access credentials securely
- [ ] Provide support contact information
- [ ] Provide documentation links

## Documentation Verification

- [ ] `QUICK_START.md` is accurate
- [ ] `ADMIN_PANEL_README.md` is complete
- [ ] API endpoints documented
- [ ] Database schema documented
- [ ] Troubleshooting guide covers common issues
- [ ] Setup instructions are clear
- [ ] Code has helpful comments

## Final Sign-Off

- [ ] All tests passing
- [ ] Documentation complete
- [ ] Admin trained on features
- [ ] Backups in place
- [ ] Monitoring configured
- [ ] Support plan established

---

## Test Data for Verification

### Sample Blog Post (English)
- Title: "The Politics of Modern Football"
- Excerpt: "An in-depth analysis of how politics shapes football"
- Body: "Football has never been just a game. It intersects with power, politics, and social movements in profound ways..."
- Category: "Politics & Power"
- Tags: "football", "politics", "power"

### Sample Blog Post (Amharic)
- ርዕስ: "አধuniversal ኳስ ፖለቲካ"
- ሐሳብ: "ፖለቲካ የእግር ኳስ ሞሉበት መንገድ በጥልቅ ትንተና"
- ቅጂ: "እግር ኳስ ተጫዋች ብቻ ወደዚህ አልደረሰ. ከስልጣን, ፖለቲካ, እና ማህበራዊ እንቅስቃሴ ጋር..."

### Sample Multimedia (Podcast)
- Title: "Football Weekly Podcast Ep 1"
- Description: "Join us for weekly discussion on football politics"
- Type: Audio
- File URL: "https://example.com/podcast/ep1.mp3"
- Duration: 2400 (40 minutes)

---

## Notes for Developer

When testing, look for:
- Proper error messages (bilingual)
- Smooth animations/transitions
- Responsive layout breakpoints
- Form validation before submission
- Loading spinners during operations
- Empty states when appropriate
- Success feedback after actions
- Graceful degradation on errors

Keep all environment variables secure:
- Don't commit `.env.local` to git
- Rotate SESSION_SECRET regularly
- Use strong database passwords
- Keep DATABASE_URL confidential
- Never log sensitive data

---

**Estimated Testing Time:** 2-3 hours
**Estimated Training Time:** 1-2 hours
**Status:** Ready for deployment ✅

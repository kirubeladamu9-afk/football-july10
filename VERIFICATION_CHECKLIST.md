# Admin Panel - Verification Checklist

Use this checklist to verify that the admin panel is properly installed and functioning.

---

## Installation & Setup

- [ ] Ran `npm install` successfully
- [ ] Created `.env.local` with `JWT_SECRET`
- [ ] Ran `node lib/init-db.js` to initialize database
- [ ] Ran `node lib/seed-db.js` to create admin user
- [ ] Ran `npm run dev` and server started
- [ ] No console errors in terminal

---

## Database Verification

- [ ] Can connect to MySQL at `localhost:3306`
- [ ] Database `railway` exists
- [ ] Table `admin_users` exists with admin@football.et user
- [ ] Table `blogs` exists
- [ ] Table `multimedia` exists
- [ ] All tables use utf8mb4 charset

```bash
# To check, run in MySQL:
SHOW DATABASES;
USE railway;
SHOW TABLES;
DESC admin_users;
DESC blogs;
DESC multimedia;
```

---

## Login Page

Visit `http://localhost:3000/admin/login`

- [ ] Page loads without errors
- [ ] Email input field visible
- [ ] Password input field visible
- [ ] Language selector buttons visible (EN and አማርኛ)
- [ ] Demo credentials displayed
- [ ] Sign In button visible
- [ ] "Demo Credentials" section visible

### Test Login

- [ ] Login with `admin@football.et` / `admin123` succeeds
- [ ] Redirected to `/admin` dashboard after login
- [ ] Error message displays for invalid credentials
- [ ] Loading state shows while logging in

---

## Dashboard

Visit `http://localhost:3000/admin` (after login)

- [ ] Dashboard loads successfully
- [ ] "Dashboard" title displayed
- [ ] 6 stat cards visible:
  - [ ] Total Articles (0 initially)
  - [ ] Published (0 initially)
  - [ ] Drafts (0 initially)
  - [ ] Total Multimedia (0 initially)
  - [ ] Podcasts (0 initially)
  - [ ] Videos (0 initially)
- [ ] "Recent Activity" section visible (empty initially)
- [ ] "Add Article" button visible
- [ ] "Add Multimedia" button visible
- [ ] Language selector in top right
- [ ] User avatar with initial in top right

---

## Navigation Sidebar

- [ ] Sidebar visible on left side
- [ ] FPL logo visible
- [ ] Navigation links visible:
  - [ ] Dashboard (with 📊 icon)
  - [ ] Articles (with 📝 icon)
  - [ ] Multimedia (with 🎬 icon)
  - [ ] Settings (with ⚙️ icon)
- [ ] Logout button at bottom (with 🚪 icon)
- [ ] Active link highlighted with blue background
- [ ] On mobile: hamburger menu button visible instead of sidebar

---

## Articles List Page

Visit `/admin/blogs`

- [ ] Page loads successfully
- [ ] "Articles" title displayed
- [ ] "Add Article" button visible
- [ ] Filter dropdowns visible:
  - [ ] Status filter (All/Draft/Published/Scheduled)
  - [ ] Category filter (All/Politics & Power/Law & Governance/Society & Ethics)
- [ ] Empty state shows "No articles found" (initially)
- [ ] Pagination controls not visible (no articles yet)

---

## Create Article

Click "Add Article"

### English Content Section
- [ ] Title (English) field visible and required
- [ ] Excerpt (English) field visible
- [ ] Body (English) field visible with rich text editor
- [ ] Rich text toolbar visible (bold, italic, underline, link buttons)

### Amharic Content Section
- [ ] Title (Amharic) field visible and required
- [ ] Excerpt (Amharic) field visible
- [ ] Body (Amharic) field visible with rich text editor

### Settings Section
- [ ] URL Slug field visible with auto-generated value
- [ ] Category selector visible (dropdown)
- [ ] Status selector visible (Draft/Published/Scheduled)
- [ ] Publish Date picker visible
- [ ] Featured Image URL field visible
- [ ] Tags input with "Add" button visible
- [ ] "Save" button visible
- [ ] "Cancel" button visible

### Create Test Article
- [ ] Fill in English title: "Test Article"
- [ ] Fill in Amharic title: "ሙከራ መጣጥፍ"
- [ ] Add some content in both English and Amharic bodies
- [ ] Select "Politics & Power" category
- [ ] Add a tag: "test"
- [ ] Keep status as "Draft"
- [ ] Click "Save"
- [ ] Success: redirected to articles list
- [ ] New article appears in the list
- [ ] Stats updated: "Total Articles" now shows 1

---

## Edit Article

- [ ] Click edit button (✏️) on the article
- [ ] All fields pre-filled with saved data
- [ ] Can modify any field
- [ ] Changes persist after clicking "Save"

---

## Delete Article

- [ ] Click delete button (🗑️) on an article
- [ ] Confirmation dialog appears
- [ ] Confirming deletion removes article from list
- [ ] Stats updated: "Total Articles" count decreases

---

## Multimedia List Page

Visit `/admin/multimedia`

- [ ] Page loads successfully
- [ ] "Multimedia" title displayed
- [ ] "Add Multimedia" button visible
- [ ] Filter dropdowns visible:
  - [ ] Type filter (All/Podcast/Video)
  - [ ] Status filter (All/Draft/Published/Scheduled)
- [ ] Empty state shows message (initially)

---

## Create Multimedia

Click "Add Multimedia"

### Basic Information
- [ ] Type selector visible (Podcast/Video)
- [ ] Duration field visible (seconds)

### English Content
- [ ] Title (English) field visible and required
- [ ] Description (English) field visible

### Amharic Content
- [ ] Title (Amharic) field visible and required
- [ ] Description (Amharic) field visible

### Media & Publishing
- [ ] File URL field visible and required
- [ ] Thumbnail URL field visible
- [ ] Status selector visible
- [ ] Publish Date picker visible
- [ ] "Save" button visible
- [ ] "Cancel" button visible

### Create Test Podcast
- [ ] Select "Podcast" type
- [ ] Fill in English title: "Test Podcast"
- [ ] Fill in Amharic title: "ሙከራ ፖድካስት"
- [ ] Enter file URL: "https://example.com/test.mp3"
- [ ] Keep status as "Draft"
- [ ] Click "Save"
- [ ] Success: redirected to multimedia list
- [ ] Podcast appears with "Podcast" type badge
- [ ] Stats updated: "Total Multimedia" shows 1, "Podcasts" shows 1

---

## Settings Page

Visit `/admin/settings`

- [ ] Page loads successfully
- [ ] "Site Settings" title displayed
- [ ] Site Name (Amharic) field visible
- [ ] Site Name (English) field visible
- [ ] Description (Amharic) field visible
- [ ] Description (English) field visible
- [ ] Site URL field visible
- [ ] "Content Settings" section visible
- [ ] Info box about future settings visible
- [ ] "Save" button visible
- [ ] Can edit and save settings
- [ ] "Successfully saved" message appears after saving

---

## Language Toggle

- [ ] Click language selector in top right
- [ ] Interface changes to Amharic when "ኦ" is selected
- [ ] All labels translate:
  - [ ] "Dashboard" becomes "ዋና ገጽ"
  - [ ] "Articles" becomes "መጣጥፍ"
  - [ ] "Multimedia" becomes "ሚዲያ"
  - [ ] "Settings" becomes "ቅንጅቶች"
- [ ] Click "EN" to switch back to English
- [ ] Language preference persists on page reload

---

## Logout

- [ ] Click logout button in sidebar
- [ ] Redirected to login page
- [ ] Can no longer access `/admin` without logging in
- [ ] Attempting to visit `/admin` redirects to `/admin/login`

---

## Authentication & Security

- [ ] JWT token stored in httpOnly cookie (not visible in localStorage)
  ```javascript
  // In browser console:
  console.log(document.cookie); // Should show admin_token
  ```
- [ ] Can't access admin pages without valid JWT token
- [ ] Session persists across page refreshes (cookie still valid)
- [ ] Logout clears the authentication cookie

---

## Form Validation

### Create Article - Test Validation
- [ ] Submit form with empty English title: error shows
- [ ] Submit form with empty Amharic title: error shows
- [ ] Submit form with empty English body: error shows
- [ ] Submit form with empty Amharic body: error shows
- [ ] Submit form with invalid slug format: error shows
- [ ] All required fields must be filled before saving

---

## Responsive Design

### Mobile (≤576px)
- [ ] Sidebar hides, hamburger menu visible
- [ ] Click hamburger to open sidebar
- [ ] Click background overlay to close sidebar
- [ ] Forms stack vertically
- [ ] Buttons full width
- [ ] Tables scroll horizontally
- [ ] Font sizes readable

### Tablet (≤768px)
- [ ] Layout adapts to tablet width
- [ ] Sidebar still hamburger
- [ ] Two-column grids collapse to single column
- [ ] Everything touch-friendly

### Desktop (>992px)
- [ ] Sidebar visible
- [ ] Multi-column layouts work
- [ ] Proper spacing and alignment

---

## API Endpoints Verification

Use browser DevTools Network tab or curl:

```bash
# Login
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@football.et","password":"admin123"}'

# Should return: { "success": true, "user": {...} }
# And set admin_token cookie

# Get articles
curl -X GET http://localhost:3000/api/admin/blogs

# Should return: { "blogs": [...], "pagination": {...} }

# Get stats
curl -X GET http://localhost:3000/api/admin/dashboard/stats

# Should return: { "blogs": {...}, "multimedia": {...}, "recentActivity": [...] }
```

- [ ] GET /api/admin/blogs returns 200
- [ ] POST /api/admin/blogs with valid data returns 201
- [ ] PUT /api/admin/blogs/[id] updates successfully
- [ ] DELETE /api/admin/blogs/[id] deletes successfully
- [ ] GET /api/admin/multimedia returns 200
- [ ] GET /api/admin/dashboard/stats returns 200
- [ ] Endpoints return 401 without valid JWT token

---

## Performance & Browser Compatibility

- [ ] Page loads in <2 seconds
- [ ] Images load correctly
- [ ] No JavaScript errors in console
- [ ] Smooth animations and transitions
- [ ] Works in Chrome/Edge
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works on mobile browsers

---

## Data Persistence

- [ ] Create article, refresh page, article still there
- [ ] Create multimedia, navigate away, content saved
- [ ] Change language, refresh page, language preference saved
- [ ] Logout, close browser, can log back in with same credentials

---

## Error Handling

- [ ] Invalid login credentials show error message
- [ ] Network errors display gracefully
- [ ] Validation errors show inline
- [ ] Delete confirmation prevents accidental deletion
- [ ] Long content truncates properly in lists
- [ ] Special characters (Amharic, etc.) display correctly

---

## Visual Design Consistency

- [ ] Colors match design system (charcoal, blue, offwhite)
- [ ] Typography consistent (Noto Sans Ethiopic, Inter)
- [ ] Spacing consistent throughout
- [ ] Card styling consistent (borders, shadows, hover)
- [ ] Buttons styled consistently
- [ ] Icons/emojis display properly
- [ ] Form inputs consistent style
- [ ] Status badges color-coded

---

## Final Sign-Off

- [ ] **All items checked** ✅
- [ ] **No errors in console** ✅
- [ ] **No warnings in console** ✅
- [ ] **Ready for deployment** ✅

---

## Notes

Record any issues found during verification:

```
Issue: _______________________
Expected: ____________________
Actual: ______________________
Solution: ____________________
```

---

## Sign-Off

- Admin Panel Verified By: ________________
- Date: ________________
- Status: ✅ READY FOR PRODUCTION

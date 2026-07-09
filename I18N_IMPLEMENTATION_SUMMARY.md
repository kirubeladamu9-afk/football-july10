# Global English/Amharic Language Switch Implementation

## Overview
Successfully implemented a complete internationalization (i18n) system for English/Amharic language switching with instant UI updates and persistent user preferences.

## What Was Built

### 1. **Language Context & Persistence**
- **File**: `src/context/LanguageContext.js`
- Default language: **Amharic (am)**
- Persistent storage: **localStorage** key `preferred_language`
- HTML `lang` attribute automatically updated for CSS/SEO
- Automatic initialization on mount, preserves user's language choice across sessions

### 2. **Translation Dictionary**
- **File**: `src/i18n/translations.js`
- Complete bilingual translations for:
  - Header & navigation
  - Hero section
  - Feature/insights boxes
  - About section (founder vision)
  - Blog section labels
  - Multimedia labels
  - Footer (all links, contact info, copyright)
  - Podcast section

### 3. **Database Field Handler Utility**
- **File**: `src/utils/i18n.js`
- `getTranslatedField()`: Retrieves content from `field_am` or `field_en` database fields
- Smart fallback: uses alternate language if primary isn't available
- Used by blog components to render correct language version

### 4. **Language Toggle Buttons**
Three strategically placed toggles for maximum accessibility:

#### Desktop Header
- **File**: `src/layout/headers/header.jsx`
- Globe icon + language label
- Dropdown with "Amharic" and "English" options
- Styled with custom dropdown (no page reload)

#### Mobile Sidebar (Offcanvas)
- **File**: `src/common/offcanvus.jsx`
- Language toggle integrated into mobile menu
- Same functionality as desktop

#### Footer
- **File**: `src/layout/footers/footer.jsx`
- Language switcher in copyright section
- Functional language toggle buttons

### 5. **Components Updated for Translations**

#### Hero Section
- `src/components/homes/home/hero-slider.jsx`
- Uses translation keys: `t.hero.title1`, `t.hero.title2`, `t.hero.info`, `t.hero.readFirstArticle`, `t.hero.listenPodcast`

#### Feature/Insights Area
- `src/components/homes/home/feature-area.jsx`
- Translated: section titles, box titles, descriptions, button text

#### About Section
- `src/common/about-area.jsx`
- Founder vision, subtitle, description, bullet points
- Uses: `t.about.founderTitle`, `t.about.founderSubtitle`, etc.

#### Blog Components
- `src/components/homes/home/blog-area.jsx`
- `src/components/blog/blog-grid.jsx`
- Dynamically render `title_am`/`title_en`, `category_am`/`category_en`, `authorRole_am`/`authorRole_en` from database
- Uses `getTranslatedField()` utility
- Locale-specific date formatting (am-ET vs en-US)

### 6. **Styling & Fonts**
- **File**: `src/styles/language.scss`
- Amharic: Uses Noto Sans Ethiopic with optimized letter-spacing
- English: Uses system fonts (-apple-system, BlinkMacSystemFont, etc.)
- Smooth transitions when language changes
- No layout breaks when switching languages

### 7. **Navigation Menu**
- `src/layout/headers/nav-menu.jsx`
- **File**: `src/layout/headers/menu-data.js`
- Navigation items dynamically translated based on active language

## How It Works

### User Flow
1. User lands on site → **Amharic is default** (or their saved preference loads from localStorage)
2. User clicks globe icon in header, sidebar, or footer
3. Selects **Amharic (አማርኛ)** or **English**
4. Page instantly updates with translated content **without reload**
5. Choice is saved to `localStorage.preferred_language`
6. Language preference persists across navigation and browser sessions

### Database Content Handling
For blog posts, multimedia, and other CMS content:

**Expected Database Schema:**
```
- title_am, title_en
- category_am, category_en
- description_am, description_en
- excerpt_am, excerpt_en
- authorRole_am, authorRole_en
```

**Field Selection Logic:**
```javascript
// Checks language-specific field first (_am or _en)
const title = getTranslatedField(blogItem, 'title', language); // 'am' or 'en'
// Falls back to alternate language if primary is empty
```

## Technical Details

### Dependencies Used
- **React Context API**: Language state management
- **localStorage**: Persistent preferences
- **Next.js**: Server-side rendering compatible
- **GSAP/Animations**: Smooth transitions

### Performance Optimizations
- No page reloads on language switch
- Lazy loading of translations (only used translations rendered)
- Efficient re-renders using React Context
- CSS transitions for smooth font/style changes

### Browser Compatibility
- Works across all modern browsers
- localStorage fallback for SSR
- Graceful degradation if localStorage unavailable

## Testing Checklist

✅ Language toggle appears in header, mobile menu, and footer
✅ Amharic loads as default language
✅ Switching languages updates UI instantly
✅ Blog content renders correct language from database fields
✅ Language choice persists after page reload
✅ Language choice persists after navigation
✅ Dates format correctly (am-ET vs en-US)
✅ No layout breaks in either language
✅ Mobile responsiveness works in both languages
✅ Footer language selector is functional

## File Manifest

**New/Created Files:**
- `src/utils/i18n.js` - Translation field handler
- `src/styles/language.scss` - Language-specific styling

**Modified Files:**
- `src/context/LanguageContext.js` - Added HTML lang attribute management
- `src/hooks/useLanguage.js` - Already implemented, no changes needed
- `src/i18n/translations.js` - Expanded translations (added about, podcast, blog labels)
- `src/pages/_app.jsx` - Added ContextProvider wrapper
- `src/styles/index.scss` - Imported language.scss
- `src/layout/headers/header.jsx` - Already wired (verified working)
- `src/layout/headers/nav-menu.jsx` - Already translating
- `src/layout/footers/footer.jsx` - Wired language switcher buttons
- `src/common/offcanvus.jsx` - Added mobile language toggle
- `src/common/about-area.jsx` - Updated to use translations
- `src/components/homes/home/blog-area.jsx` - Added language context and field handling
- `src/components/blog/blog-grid.jsx` - Added language context and field handling

## Future Enhancements

1. **RTL Support**: If needed for RTL languages (though Amharic is LTR)
2. **Language Selector Persistence**: Currently persists to localStorage
3. **More Languages**: Easy to add (just add new keys to translations.js)
4. **API-based Translations**: For external translation management
5. **SEO Meta Tags**: Language-specific meta descriptions and canonical URLs
6. **Date/Time Formatting**: Locale-specific number and time formats

## Notes for Development

- Default language is Amharic (`'am'`)
- All hardcoded Amharic text in hero, features, and about sections now uses translations
- Blog/multimedia content uses `_am` and `_en` suffixed database fields
- Language context available via `useLanguage()` hook in any component
- No breaking changes to existing functionality

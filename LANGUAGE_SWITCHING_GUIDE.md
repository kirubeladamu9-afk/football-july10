# Language Switching Implementation Guide

## Quick Start for Developers

### Using the Language Hook in Any Component

```jsx
import { useLanguage } from '@/src/hooks/useLanguage';

const MyComponent = () => {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <div>
      <p>Current language: {language}</p> {/* 'am' or 'en' */}
      <p>Hero title: {t.hero.title1}</p>
      <button onClick={() => setLanguage('en')}>Switch to English</button>
    </div>
  );
};
```

### Accessing Translated Text

All text is available through the `t` object returned by `useLanguage()`:

```jsx
// Navigation
t.nav.home          // 'Home' or 'መነሻ'
t.nav.about         // 'About Us' or 'ስለ እኛ'

// Header
t.header.register   // 'Register' or 'ይመዝገቡ'
t.header.language   // 'English' or 'አማርኛ'

// Hero
t.hero.title1       // First line of hero title
t.hero.readFirstArticle  // CTA button text

// Features/Insights
t.insights.title    // Section title
t.insights.box1Title // First feature box

// About
t.about.founderTitle     // 'Thought Leader and Visionary' or equivalent
t.about.founderSubtitle  // Hayu's vision subtitle
t.about.founderList      // Array of bullet points

// Blog
t.blog.readMore     // 'Read More' button text
t.blog.postedBy     // 'Posted by' label

// Footer
t.footer.newsTitle  // Newsletter section title
t.footer.contact    // 'Contact Us'
```

### Working with Database Content

For blog posts, multimedia, or any CMS content with language variants:

```jsx
import { getTranslatedField } from '@/src/utils/i18n';
import { useLanguage } from '@/src/hooks/useLanguage';

const BlogItem = ({ blogData }) => {
  const { language } = useLanguage();
  
  // Get the correct language version from database
  const title = getTranslatedField(blogData, 'title', language);
  const category = getTranslatedField(blogData, 'category', language);
  const authorRole = getTranslatedField(blogData, 'authorRole', language);
  
  return (
    <div>
      <h2>{title}</h2>
      <span>{category}</span>
      <p>{authorRole}</p>
    </div>
  );
};
```

### Database Schema for Multi-Language Content

Your database should have these fields for content:

```javascript
{
  id: 1,
  title_am: 'ዘመናዊ እግር ኳስን የቀየሩ አሰልጣኞች ስልት',
  title_en: 'Modern Coaches Who Changed Football Strategy',
  
  category_am: 'ስልታዊ ትንተና',
  category_en: 'Strategic Analysis',
  
  description_am: 'ተዛማጅ Amharic content...',
  description_en: 'Related English content...',
  
  excerpt_am: 'አጭር Amharic summary...',
  excerpt_en: 'Brief English summary...',
  
  authorRole_am: 'አድሚን',
  authorRole_en: 'Admin',
}
```

## How Language Switching Works

### 1. **Default Language**
- Default: **Amharic (`'am'`)**
- Set in: `src/context/LanguageContext.js`

### 2. **User Preference Persistence**
- Stored in: `localStorage.preferred_language`
- Persists across: browser sessions, page navigations, refreshes

### 3. **UI Updates Without Reload**
- Language change is instant
- No page reload required
- All components using `useLanguage()` hook re-render

### 4. **HTML Lang Attribute**
- Automatically updated on language change
- Set in: `document.documentElement.lang`
- Useful for: CSS rules, screen readers, SEO

## Adding New Translations

### Step 1: Add to translations dictionary

Edit `src/i18n/translations.js`:

```javascript
const translations = {
  am: {
    // ... existing content ...
    myNewSection: {
      title: 'ሊተርጉም ያለበት ጽሑፍ',
      description: 'Amharic description here',
    },
  },
  
  en: {
    // ... existing content ...
    myNewSection: {
      title: 'Text to translate',
      description: 'English description here',
    },
  },
};
```

### Step 2: Use in component

```jsx
import { useLanguage } from '@/src/hooks/useLanguage';

const MyComponent = () => {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t.myNewSection.title}</h1>
      <p>{t.myNewSection.description}</p>
    </div>
  );
};
```

## Component Language Toggle Locations

Users can switch languages from:

1. **Header** (desktop only, hidden on small screens)
   - Globe icon with "English" or "አማርኛ" label
   - Dropdown with both options

2. **Mobile Sidebar** (offcanvas menu)
   - Integrated language toggle
   - Appears when sidebar is open

3. **Footer**
   - Language selector in copyright section
   - Bottom right on larger screens

## Styling Considerations

### Font Changes
- **Amharic**: Uses `Noto Sans Ethiopic` with adjusted letter-spacing
- **English**: Uses system fonts with standard spacing

### Letter Spacing
- Both languages adjust dynamically
- Transition is smooth (0.3s ease)
- Defined in: `src/styles/language.scss`

### No Breaking Layouts
- Spacing is pre-calculated for both languages
- Text doesn't overflow or break layout on switch
- RTL not required (Amharic uses LTR)

## Troubleshooting

### Language Not Persisting
Check browser's localStorage:
```javascript
// In browser console
localStorage.getItem('preferred_language') // should return 'am' or 'en'
```

### Missing Translation Key
If `t.something.text` is undefined:
1. Check spelling in `translations.js`
2. Ensure key exists in both `am` and `en` sections
3. Use optional chaining: `{t?.something?.text || 'Fallback'}`

### Database Content Not Switching
Verify database fields exist:
```javascript
// Check that these fields are in your database
title_am, title_en
category_am, category_en
description_am, description_en
```

If a field is missing, `getTranslatedField()` falls back to the alternate language.

## Performance Tips

1. **Use Memoization** for expensive re-renders:
   ```jsx
   const MemoizedBlog = React.memo(({ blogData }) => {
     // Component code
   });
   ```

2. **Lazy Load Translations** - currently they're all loaded (small size, ~10KB)

3. **Batch Language Updates** - avoid calling `setLanguage()` multiple times

## Testing the Implementation

### Quick Manual Test
1. Open browser DevTools → Application → localStorage
2. Check `preferred_language` key exists
3. Click language toggle → verify language changes
4. Refresh page → language should persist
5. Navigate to different page → language should stick

### Component Testing Example
```jsx
import { render, screen } from '@testing-library/react';
import { LanguageProvider } from '@/src/context/LanguageContext';
import MyComponent from './MyComponent';

test('renders in correct language', () => {
  render(
    <LanguageProvider>
      <MyComponent />
    </LanguageProvider>
  );
  
  expect(screen.getByText('English text or Amharic text')).toBeInTheDocument();
});
```

## Files Modified/Created

**Key Files:**
- ✅ `src/context/LanguageContext.js` - Language state & persistence
- ✅ `src/hooks/useLanguage.js` - Hook for accessing language
- ✅ `src/i18n/translations.js` - All translation strings
- ✅ `src/utils/i18n.js` - Database field handler
- ✅ `src/styles/language.scss` - Language-specific styling
- ✅ `src/layout/headers/header.jsx` - Desktop language toggle
- ✅ `src/common/offcanvus.jsx` - Mobile language toggle
- ✅ `src/layout/footers/footer.jsx` - Footer language toggle
- ✅ Components updated: hero, features, about, blog sections

## Support & Questions

For issues or questions about language implementation:
1. Check this guide first
2. Review `src/i18n/translations.js` for available keys
3. Check component imports for `useLanguage()` hook
4. Verify database fields follow `field_am`/`field_en` naming

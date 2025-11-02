# Next.js App Router Internationalization (i18n) Setup

This project is now configured with **next-intl** for internationalization support.

## 🎯 Overview

The application supports multiple languages:
- **English (en)** - Default locale
- **Vietnamese (vi)**

## 📁 File Structure

```
src/
├── i18n/
│   ├── routing.ts          # Routing configuration
│   └── navigation.ts       # Navigation utilities
├── middleware.ts           # Next.js middleware for locale detection
├── messages/
│   ├── en.json            # English translations
│   └── vi.json            # Vietnamese translations
└── app/
    ├── layout.tsx         # Root layout
    └── [locale]/
        ├── layout.tsx     # Locale-specific layout
        ├── (main)/
        │   ├── page.tsx
        │   ├── explore/
        │   └── layout.tsx
        └── (dashboard)/
            ├── dashboard/
            └── layout.tsx
```

## 🚀 Key Features

### 1. **Automatic Locale Detection**
- Browser language detection enabled
- Seamless locale switching via `LocaleSwitcher` component
- URL-based locale routing

### 2. **URL Structure**
- Default locale (English) has no prefix: `/dashboard`
- Other locales have prefix: `/vi/dashboard`
- Clean URLs maintained across all routes

### 3. **Components**

#### LocaleSwitcher
Located at `src/components/locale-switcher.tsx`
- Dropdown selector for language switching
- Integrated into the main navbar

#### Configuration Files
- `src/i18n/routing.ts` - Centralized routing configuration
- `src/i18n/navigation.ts` - i18n-aware navigation hooks
- `src/i18n.ts` - Request configuration

## 📝 Usage

### Using Translations in Components

**Server Components:**
```tsx
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('hero');
  
  return <h1>{t('title')}</h1>;
}
```

**Client Components:**
```tsx
'use client';
import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('common');
  
  return <button>{t('submit')}</button>;
}
```

### Using i18n-aware Navigation

Replace Next.js navigation imports with i18n versions:

```tsx
// ❌ Old way
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ✅ New way
import { Link, useRouter } from '@/i18n/navigation';
```

### Adding New Translations

1. Open `messages/en.json` and `messages/vi.json`
2. Add your translations in the same structure:
```json
{
  "mySection": {
    "key": "English Text",
    "anotherKey": "More English"
  }
}
```
```json
{
  "mySection": {
    "key": "Văn Bản Tiếng Việt",
    "anotherKey": "Thêm Tiếng Việt"
  }
}
```

## 🔧 Configuration

### Locale Configuration
Edit `src/i18n/routing.ts` to:
- Add/remove locales
- Change default locale
- Modify locale prefix behavior
- Configure locale detection

### Middleware Configuration
Edit `src/middleware.ts` to:
- Adjust matcher patterns
- Add custom locale detection logic

## 🎨 Styling

The locale switcher is automatically styled to match your design system. Customize it in `src/components/locale-switcher.tsx`.

## 🧪 Testing

Run the development server:
```bash
yarn dev
```

Visit:
- English: http://localhost:3001
- Vietnamese: http://localhost:3001/vi
- Dashboard (English): http://localhost:3001/dashboard
- Dashboard (Vietnamese): http://localhost:3001/vi/dashboard

## 📚 Resources

- [next-intl Documentation](https://next-intl.dev)
- [Next.js App Router](https://nextjs.org/docs/app)
- [React Server Components](https://react.dev/reference/rsc/server-components)

## 🔄 Migration Notes

### Completed
✅ Routing restructured under `[locale]` dynamic segment
✅ Middleware configured for automatic locale detection
✅ Locale switcher component created
✅ Navigation utilities set up
✅ Message files created for en/vi
✅ Configuration files properly structured

### Next Steps
- Add translations to existing components
- Update navigation links to use i18n Link component
- Consider adding more languages
- Add locale-specific metadata for SEO


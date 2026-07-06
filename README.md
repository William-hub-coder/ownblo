# Portfolio — Deep Space Personal Portfolio

A modern personal portfolio website with a **deep space cosmic theme**. Built with Next.js 16, TypeScript, Tailwind CSS v4, Framer Motion, Canvas 2D, and local JSON storage.

## Features

### Core Modules
- **Projects** — Bento Grid layout with category filtering, smart cover images, tech challenges and role info
- **Photography** — Album-based gallery with auto-cover from first photo, EXIF overlay, masonry layout
- **Blog** — Markdown articles with syntax highlighting, copy-code buttons, reading progress bar, Table of Contents, Schema.org structured data

### Supplementary Modules
- **About Me** — Avatar, social links, typewriter text effect, skills radar chart (6-axis SVG), vertical timeline
- **Contact** — Form with Zod validation + react-hook-form, paper plane animation on submit
- **Bookmarks** — Curated resources with functional search + category filtering
- **Visitor Stats** — Animated counter dashboard with source distribution chart
- **i18n** — Full Chinese/English localization via next-intl
- **RSS + SEO** — RSS feed, sitemap.xml, robots.txt, dynamic OpenGraph metadata

### Admin Backend (Chinese UI)
- **Dashboard** — Content statistics + quick actions
- **Site Settings** — Site name, description, social links (real-time save)
- **Projects** — Full CRUD with tech stack tags, cover image URL
- **Articles** — Full CRUD with Markdown editor, tag management, publish control
- **Bookmarks** — Full CRUD with category management
- **Albums** — Photo album management, add photos from media library, auto-cover
- **Media Library** — Drag-drop upload, grid/list view, search filter, batch delete, metadata editing, pagination
- **Auth** — JWT login (httpOnly cookie, 7-day expiry), Web Crypto API

### Visual Features (Deep Space Theme)
- Canvas 2D cosmic background: nebulae (3 gradient clouds), starfield (300 stars / 3 depth layers), dust particles (100), pulsars (5 with cross glow)
- Gravitational lens mouse interaction on starfield
- Supernova particle burst on click (80-120 particles, gravity-curved trajectory)
- Custom cursor system (12px cyan ring, 40px purple ring on hover, mix-blend-mode)
- Magnetic button pull effect (spring-based, 100px range)
- Hologram cards with scanlines, HUD corner brackets, anti-gravity hover lift
- Page warp transition (scaleX blur animation)
- Infinite scroll cosmic background (60s nebula drift cycle)

### Smart Content Display
- **Auto-cover**: Albums automatically display the first uploaded photo as cover
- **Real-time updates**: Admin edits appear on the public site immediately without restart
- **Smart fallbacks**: Emoji placeholders when no cover image is set

## Tech Stack

| Category | Technologies |
|----------|-------------|
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4, CSS custom properties |
| Animation | Framer Motion, Canvas 2D |
| Icons | Lucide React + custom SVG brand icons |
| i18n | next-intl (zh/en) |
| Theme | next-themes (dark/light) |
| Forms | react-hook-form + zod |
| Auth | JWT (Web Crypto API, zero dependencies) |
| Storage | Local JSON files + filesystem uploads |
| Markdown | react-markdown + remark-gfm |

## Quick Start

```bash
# Install
npm install

# Generate admin password hash (replace 'your-password' with your actual password)
node -e "
const crypto = require('crypto');
async function hash(pw) {
  const salt = crypto.randomUUID();
  const data = new TextEncoder().encode(salt + ':' + pw);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hex = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,'0')).join('');
  console.log('ADMIN_PASSWORD_HASH=\"' + salt + ':' + hex + '\"');
}
hash('your-password-here');
"

# Add the output to .env.local:
# ADMIN_PASSWORD_HASH="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxx..."

# Start
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — auto-redirects to Chinese homepage.

## Admin Panel

**URL**: `http://localhost:3000/admin`  
**Login**: Enter your password (set in `.env.local`)

### Features
| Page | Description |
|------|-------------|
| Dashboard | Content stats cards + quick action buttons |
| Settings | Site name, description, URL, social links |
| Projects | Create/edit/delete projects with tech stack tags |
| Articles | Write Markdown articles with tag management |
| Bookmarks | Manage curated resource links |
| Albums | Photo album management, add photos from Media Library |
| Media Library | Upload images, browse/list/search, bulk delete, metadata editing |

### Content Flow
```
Media Library (upload) → Albums (add photos) → Public Photography page (auto-cover)
Media Library (upload) → Copy URL → Projects/Articles (paste cover URL) → Public display
Settings (edit) → Save → Refresh public page → Changes live immediately
```

## Project Structure

```
src/
├── app/
│   ├── [locale]/              # Public pages (zh/en)
│   │   ├── page.tsx           # Home (Hero + featured projects + articles)
│   │   ├── projects/          # Project listing + detail
│   │   ├── photography/       # Photo albums + gallery
│   │   ├── blog/              # Article listing + detail
│   │   ├── about/             # About + skills radar + timeline
│   │   ├── bookmarks/         # Curated links
│   │   ├── contact/           # Contact form
│   │   └── stats/             # Visitor stats
│   └── admin/                 # Admin dashboard (Chinese UI)
│       ├── login/             # Login page
│       ├── settings/          # Site settings editor
│       ├── projects/          # Project CRUD
│       ├── articles/          # Article CRUD
│       ├── bookmarks/         # Bookmark CRUD
│       ├── albums/            # Album + photo management
│       └── media/             # Media library (upload/browse/search)
├── components/
│   ├── cosmic/                # CosmicBackground, HologramCard
│   ├── interactions/          # SupernovaBurst, CosmicCursor, MagneticButton, etc.
│   ├── admin/                 # AdminFormField, Toast, MediaPicker, ConfirmDialog
│   ├── shared/                # ScrollReveal, GlowCard, EmptyState, LazyImage, BackToTop
│   ├── layout/                # Nav, Footer, MusicPlayer, ThemeToggle, SkipToContent
│   ├── hero/                  # ParticleNetwork, TypewriterText, HeroSection
│   ├── projects/              # ProjectGrid, FeaturedProjects
│   ├── blog/                  # ArticleList, ReadingProgress, TableOfContents, ArticleMarkdown
│   ├── bookmarks/             # BookmarkGrid
│   └── contact/               # ContactForm with Zod validation
├── lib/
│   ├── auth/                  # Password hashing, JWT, API auth guard
│   ├── data-reader.ts         # Real-time JSON file reading (no restart needed)
│   ├── data-store.ts          # JSON read/write for admin API
│   ├── admin-i18n.ts          # Admin Chinese translations
│   ├── i18n/                  # next-intl config + zh/en message files
│   ├── hooks/                 # useAnalytics
│   ├── validations/           # Zod schemas
│   └── utils/                 # cn() utility
├── types/                     # TypeScript interfaces
├── data/                      # JSON data files (source of truth)
└── middleware.ts               # i18n routing + admin auth guard
```

## Data Files

All content lives in `src/data/*.json`. Edit via Admin Panel or directly:

| File | Content |
|------|---------|
| `site-config.json` | Site name, description, URLs, social links |
| `skills.json` | Skills radar (label, level, color) |
| `timeline.json` | Work/education/milestone entries |
| `projects.json` | Projects with tech stack, role, timeline |
| `articles.json` | Blog articles (Markdown content) |
| `bookmarks.json` | Curated resource links |
| `albums.json` | Photo albums with nested photo entries |
| `media.json` | Uploaded file metadata (auto-managed) |

## Customization

### Personal Info
- **Site settings**: `http://localhost:3000/admin/settings` or edit `src/data/site-config.json`
- **About bio**: Edit `src/lib/i18n/messages/zh.json` → `about.bio`
- **Skills**: `http://localhost:3000/admin/settings` or edit `src/data/skills.json`
- **Timeline**: Edit `src/data/timeline.json`

### Theme Colors
Edit CSS custom properties in `src/app/globals.css`:
- Dark mode: `.dark { ... }` — deep space palette
- Light mode: `:root { ... }` — LEO daylight palette

### Fonts
Edit `src/app/layout.tsx` — swap Inter, JetBrains Mono, or Noto Sans SC.

## Deployment

### Vercel
```bash
# 1. Push to GitHub
# 2. Import in Vercel
# 3. Add environment variable: ADMIN_PASSWORD_HASH
# 4. Deploy
```

### Environment Variables
| Variable | Required | Description |
|----------|----------|-------------|
| `ADMIN_PASSWORD_HASH` | Yes | SHA-256 hashed admin password |
| `NEXT_PUBLIC_SITE_URL` | No | Production URL (default: http://localhost:3000) |

## Performance

- Lighthouse target: 90+
- Canvas 2D particle pool ≤ 600 elements
- Screen-off animations paused via IntersectionObserver
- `prefers-reduced-motion` respected (disables parallax, particles, animations)
- All animations use transform + opacity only (compositor-thread)
- Tailwind CSS v4 JIT compilation
- Lazy images with shimmer placeholders

## License

MIT — free to use as a template for your own portfolio!

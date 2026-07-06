-- ============================================
-- Portfolio CMS: Initial Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Projects
-- ============================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  tech_challenges TEXT,
  role TEXT,
  timeline TEXT,
  cover_url TEXT,
  screenshots TEXT[] DEFAULT '{}',
  tech_stack TEXT[] DEFAULT '{}',
  github_url TEXT,
  demo_url TEXT,
  category TEXT DEFAULT 'web' CHECK (category IN ('web', 'mobile', 'design', 'other')),
  featured BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Photo Albums
-- ============================================
CREATE TABLE albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Photos
-- ============================================
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID REFERENCES albums(id) ON DELETE SET NULL,
  title TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  camera_model TEXT,
  aperture TEXT,
  shutter_speed TEXT,
  iso INT,
  focal_length TEXT,
  taken_at DATE,
  width INT,
  height INT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Articles
-- ============================================
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content_mdx TEXT,
  cover_url TEXT,
  tags TEXT[] DEFAULT '{}',
  reading_time INT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  og_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Bookmarks
-- ============================================
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'resource',
  favicon_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Contact Messages
-- ============================================
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Visitor Stats
-- ============================================
CREATE TABLE visitor_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  referrer TEXT,
  country TEXT,
  visited_at DATE DEFAULT CURRENT_DATE,
  visit_count INT DEFAULT 1
);

CREATE UNIQUE INDEX idx_visitor_stats_unique ON visitor_stats (page_path, visited_at);

-- ============================================
-- Article Views
-- ============================================
CREATE TABLE article_views (
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  view_date DATE NOT NULL DEFAULT CURRENT_DATE,
  view_count INT DEFAULT 1,
  PRIMARY KEY (article_id, view_date)
);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_featured ON projects(featured) WHERE featured = true;
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_published ON articles(published, published_at) WHERE published = true;
CREATE INDEX idx_photos_album ON photos(album_id, sort_order);
CREATE INDEX idx_visitor_stats_date ON visitor_stats(visited_at);
CREATE INDEX idx_visitor_stats_path ON visitor_stats(page_path);
CREATE INDEX idx_bookmarks_category ON bookmarks(category);

-- ============================================
-- Row Level Security (RLS)
-- ============================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_views ENABLE ROW LEVEL SECURITY;

-- Public read access for content tables
CREATE POLICY "Public can read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public can read albums" ON albums FOR SELECT USING (true);
CREATE POLICY "Public can read photos" ON photos FOR SELECT USING (true);
CREATE POLICY "Public can read published articles" ON articles FOR SELECT USING (published = true);
CREATE POLICY "Public can read bookmarks" ON bookmarks FOR SELECT USING (true);

-- Public can insert contact messages
CREATE POLICY "Public can insert contact messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- Public can insert/update visitor stats
CREATE POLICY "Public can insert visitor stats" ON visitor_stats FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update visitor stats" ON visitor_stats FOR UPDATE USING (true);

-- Public can read visitor stats (aggregated)
CREATE POLICY "Public can read visitor stats" ON visitor_stats FOR SELECT USING (true);
CREATE POLICY "Public can read article views" ON article_views FOR SELECT USING (true);

-- ============================================
-- Seed Data: Sample Content
-- ============================================

-- Sample Projects
INSERT INTO projects (slug, title, description, tech_stack, category, featured, github_url, demo_url) VALUES
('e-commerce-platform', 'E-Commerce Platform', 'A full-stack e-commerce platform with real-time inventory management and Stripe payment integration.', ARRAY['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'Tailwind CSS'], 'web', true, 'https://github.com/yourusername/ecommerce', 'https://demo-ecommerce.vercel.app'),
('ai-image-generator', 'AI Image Generator', 'An AI-powered image generation tool using Stable Diffusion with a React frontend and Python FastAPI backend.', ARRAY['React', 'Python', 'FastAPI', 'Stable Diffusion', 'Docker'], 'web', true, 'https://github.com/yourusername/ai-generator', NULL),
('mobile-fitness-app', 'Fitness Tracker App', 'A cross-platform mobile fitness tracking app with workout plans, progress charts, and social features.', ARRAY['React Native', 'TypeScript', 'Node.js', 'MongoDB'], 'mobile', false, 'https://github.com/yourusername/fitness-app', NULL),
('design-system', 'Component Design System', 'A comprehensive design system with 50+ components, documentation site, and Figma integration.', ARRAY['React', 'Storybook', 'Figma', 'CSS Modules'], 'design', false, 'https://github.com/yourusername/design-system', 'https://design-system-demo.vercel.app');

-- Sample Photo Albums
INSERT INTO albums (slug, title, description) VALUES
('city-nightscapes', 'City Nightscapes', 'Urban landscapes captured during the golden hour and late night explorations.'),
('nature-wonders', 'Nature Wonders', 'Landscapes and macro photography celebrating the beauty of the natural world.'),
('portraits', 'Portraits', 'Candid and composed portraits capturing human emotions and stories.');

-- Sample Articles
INSERT INTO articles (slug, title, excerpt, tags, reading_time, published, published_at, content_mdx) VALUES
('building-modern-portfolio', 'Building a Modern Portfolio with Next.js', 'A comprehensive guide on building a performant portfolio website using Next.js 14, Tailwind CSS, and Framer Motion.', ARRAY['Next.js', 'React', 'Tutorial', 'Web Development'], 8, true, NOW(),
'## Introduction

Building a personal portfolio is one of the best ways to showcase your skills and projects. In this guide, I''ll walk through creating a modern portfolio site using Next.js 14.

## Why Next.js?

Next.js offers server-side rendering, static site generation, and excellent developer experience. With the App Router, we get a powerful routing system built on React Server Components.

## Getting Started

First, create a new Next.js project:

```bash
npx create-next-app@latest portfolio --typescript --tailwind
```

## Styling with Tailwind

Tailwind CSS provides utility-first styling that enables rapid UI development. Combined with custom theme tokens, we can create a unique visual identity.

## Adding Animations

Framer Motion makes it easy to add smooth animations for page transitions and scroll reveals. The `useInView` hook is particularly useful for triggering animations when elements enter the viewport.

## Deployment

Deploying to Vercel is seamless - just connect your GitHub repository and push. Automatic preview deployments for each PR make collaboration easy.

## Conclusion

A well-built portfolio can make a great first impression. Focus on performance, accessibility, and showcasing your best work.'),
('urban-night-photography', 'The Art of Urban Night Photography', 'Tips and techniques for capturing stunning city nightscapes, from camera settings to post-processing workflows.', ARRAY['Photography', 'Guide', 'Urban'], 6, true, NOW(),
'## Introduction

Urban night photography offers a unique perspective on cities. The interplay of artificial lights, architecture, and darkness creates dramatic compositions.

## Essential Gear

- A camera with good low-light performance
- A sturdy tripod (essential for long exposures)
- A wide-angle lens (24mm or wider)
- Remote shutter release

## Camera Settings

### Aperture
Use f/8 to f/11 for sharp cityscapes with good depth of field.

### Shutter Speed
Long exposures (2-30 seconds) create light trails and smooth water.

### ISO
Keep ISO as low as possible (100-400) to minimize noise.

## Composition Tips

- Look for leading lines created by roads and bridges
- Use reflections in water and glass
- Include foreground elements for depth
- Experiment with different perspectives

## Post-Processing

Lightroom and Photoshop can enhance night photos significantly:

1. Adjust white balance for accurate colors
2. Reduce noise while preserving detail
3. Enhance contrast and clarity
4. Fine-tune individual color channels

## Conclusion

Night photography requires patience and practice, but the results can be truly magical. Get out there and explore your city after dark!');

-- Sample Bookmarks
INSERT INTO bookmarks (title, url, description, category) VALUES
('Next.js Documentation', 'https://nextjs.org/docs', 'The official Next.js documentation with guides and API references.', 'resource'),
('Tailwind CSS', 'https://tailwindcss.com', 'A utility-first CSS framework for rapidly building custom designs.', 'tool'),
('MDN Web Docs', 'https://developer.mozilla.org', 'Comprehensive web development documentation by Mozilla.', 'resource'),
('Figma', 'https://figma.com', 'Collaborative interface design tool.', 'tool'),
('Dribbble', 'https://dribbble.com', 'Design inspiration and community for creatives.', 'inspiration'),
('GitHub', 'https://github.com', 'Code hosting platform for version control and collaboration.', 'tool');

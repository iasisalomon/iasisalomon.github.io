# iasisalomon.pages.dev

Personal portfolio and blog of **Iasi Salomon** — Technical Delivery Manager. Live at [iasisalomon.pages.dev](https://iasisalomon.pages.dev).

Built with [Astro 5](https://astro.build), deployed on Cloudflare Pages.

## Commands

| Command           | Action                                       |
| ----------------- | -------------------------------------------- |
| `npm install`     | Install dependencies                         |
| `npm run dev`     | Start the dev server at `localhost:4321`     |
| `npm run build`   | Build the production site to `./dist/`      |
| `npm run preview` | Preview the production build locally         |

## Structure

```
src/
├── components/       # Homepage sections (Hero, About, Experience, SelectedWork,
│                     # Engineering, Writing, Skills, Testimonials, Contact)
│                     # plus shared Navbar, SEO, and CustomFooter
├── layouts/
│   ├── MainLayout.astro   # Root HTML shell for every page
│   └── BlogPost.astro     # Article layout for blog posts
├── pages/
│   ├── index.astro        # Homepage (composed from components)
│   ├── blog/              # Blog archive + individual posts
│   ├── projects/          # Project case-study pages
│   └── rss.xml.js         # RSS feed
├── data/
│   ├── projects.json      # Project catalog (single source of truth)
│   ├── portfolio.ts       # Zod-validated access to projects.json
│   ├── areas.ts           # Project categories and their colors/gradients
│   ├── proof.json         # Testimonials
│   ├── partnerBrands.json # "Worked With" logos
│   ├── blog/              # Blog posts (Markdown)
│   └── caseStudies/       # Long-form case studies (Markdown)
├── content.config.ts      # Content collection schemas (blog, caseStudies)
└── consts.ts              # Site title/description, LINKS, NAV_LINKS, BLOG_CATEGORIES
```

## Content

### Blog posts

Markdown files in `src/data/blog/`, validated by the `blog` collection schema. Required frontmatter: `title`, `description`, `pubDate`. Optional: `updatedDate`, `heroImage`, `category` (`tech` | `business` | `other`), and `lang` (BCP-47 tag, defaults to `en`).

Blog categories are defined in `src/consts.ts` (`BLOG_CATEGORIES`) and must stay in sync with the `category` enum in `src/content.config.ts`.

### Case studies

Markdown files in `src/data/caseStudies/`. Each file's name must match a project slug in `src/data/projects.json` — the catalog entry supplies shared metadata (date, skills, links), while the Markdown body holds the narrative. Optional frontmatter: `role`, `timeframe`, `outcome`, `heroImage`, `gallery`.

### Projects

`src/data/projects.json` is the single source of truth for all portfolio projects. Components read it through `src/data/portfolio.ts`, which validates it at build time.

### Images

`public/` holds the optimized images the site serves (WebP, max 1600px wide). Full-size source photos live in `originals/`, which mirrors the `public/` paths (e.g. `originals/images/gallery/axiecon/`) and is not deployed. Keep the originals there when adding or re-optimizing photos.

### Links and navigation

Contact links (email, LinkedIn, GitHub, Calendly) live in `LINKS`, and the homepage section links in `NAV_LINKS` (both in `src/consts.ts`). The navbar and footer render from `NAV_LINKS`, so its order must match the section order in `src/pages/index.astro`.

## Key patterns

- **Context-aware Navbar** — switches between homepage section links and blog category links at render time; scroll-based active state is tracked client-side.
- **MainLayout** — root HTML shell for all pages; loads CDN assets and inlines client-side scripts.
- **SEO** — dedicated `SEO.astro` component, sitemap via `@astrojs/sitemap`, RSS via `@astrojs/rss`, and `public/robots.txt`.

# iasisalomon.pages.dev

Personal portfolio and blog of **Iasi Salomon** — operations & strategy lead and software engineer. Live at [iasisalomon.pages.dev](https://iasisalomon.pages.dev).

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
├── components/       # Homepage sections (Hero, About, Expertise, Projects,
│                     # SelectedWork, Testimonials, Writing, Discussion, …)
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
│   ├── brands.json        # Personal brands
│   ├── blog/              # Blog posts (Markdown)
│   ├── caseStudies/       # Long-form case studies (Markdown)
│   └── *.json / *.ts      # About, expertise, proof, partner brands, …
├── content.config.ts      # Content collection schemas (blog, caseStudies)
└── consts.ts              # SITE_TITLE, SITE_DESCRIPTION, BLOG_CATEGORIES
```

## Content

### Blog posts

Markdown files in `src/data/blog/`, validated by the `blog` collection schema. Required frontmatter: `title`, `description`, `pubDate`. Optional: `updatedDate`, `heroImage`, `category` (`tech` | `business` | `other`), and `lang` (BCP-47 tag, defaults to `en`).

Blog categories are defined in `src/consts.ts` (`BLOG_CATEGORIES`) and must stay in sync with the `category` enum in `src/content.config.ts`.

### Case studies

Markdown files in `src/data/caseStudies/`. Each file's name must match a project slug in `src/data/projects.json` — the catalog entry supplies shared metadata (brand, date, skills, links), while the Markdown body holds the narrative. Optional frontmatter: `role`, `timeframe`, `outcome`, `heroImage`, `gallery`.

### Projects

`src/data/projects.json` is the single source of truth for all portfolio projects. Components read it directly.

## Key patterns

- **Context-aware Navbar** — switches between homepage section links and blog category links at render time; scroll-based active state is tracked client-side.
- **MainLayout** — root HTML shell for all pages; loads CDN assets and inlines client-side scripts.
- **SEO** — dedicated `SEO.astro` component, sitemap via `@astrojs/sitemap`, RSS via `@astrojs/rss`, and `public/robots.txt`.

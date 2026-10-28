# iasisalomon.pages.dev

Personal portfolio and blog of **Iasi Salomon** — Technical Delivery Manager. Live at [iasisalomon.pages.dev](https://iasisalomon.pages.dev).

Built with [Astro 5](https://astro.build), deployed on Cloudflare Pages.

## Commands

The project uses **pnpm** (`pnpm-lock.yaml` is the only lockfile). Don't add a `package-lock.json` or `yarn.lock`.

Versions are pinned so Cloudflare Pages builds the same way as your machine. Without the pins, it falls back to Node 18 and pnpm 8, which can't read the lockfile.

- **Node:** 22, set in `.nvmrc`.
- **pnpm:** the `packageManager` field in `package.json` (Corepack installs that exact version). Change it with `pnpm self-update`, then run `pnpm install` so the lockfile records the new version.
- **Build scripts:** `pnpm-workspace.yaml` (`allowBuilds`) approves the install scripts for esbuild and sharp. A new dependency with an install script needs an entry there, or the install stops.

| Command        | Action                                   |
| -------------- | ---------------------------------------- |
| `pnpm install` | Install dependencies                     |
| `pnpm dev`     | Start the dev server at `localhost:4321` |
| `pnpm build`   | Build the production site to `./dist/`   |
| `pnpm preview` | Preview the production build locally     |
| `pnpm thumbs`  | Generate gallery thumbnails (see Images) |

## Structure

```
src/
├── components/       # Homepage sections (Hero, About, Experience, SelectedWork,
│                     # Engineering, Writing, Skills, Organizations,
│                     # Testimonials, Contact)
│                     # plus shared Navbar, SEO, and CustomFooter
├── layouts/
│   ├── MainLayout.astro     # Root HTML shell for every page
│   ├── LongformLayout.astro # Shared reading layout for case studies and posts
│   └── BlogPost.astro       # Maps a post's frontmatter onto LongformLayout
├── styles/
│   └── global.css         # Design tokens and the few truly global rules
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

`public/` holds the optimized images the site serves (WebP, max 1600px wide). Full-size source photos live in `originals/`, which mirrors the `public/` paths (e.g. `originals/images/gallery/axiecon/`). It is ignored by git and not deployed, so it exists only on your machine: back it up separately. Keep the originals there when adding or re-optimizing photos. Never delete one: when a file in `public/` is replaced by an optimized version, move the old file into `originals/`.

- **Gallery photos:** after adding photos to `public/images/gallery/<folder>/`, run `pnpm thumbs`. It writes WebP thumbnails sized for the 3:2 grid tiles into a `thumbs/` folder next to them (`--force` regenerates them). Project pages show the thumbnail and the lightbox opens the full-size photo. A photo without a thumbnail falls back to the full-size file.
- **Logos** (`public/images/brands/`): WebP or SVG at about 2× the displayed size, so at most 400×144 for the "Teams and organizations" tiles.
- **Portrait:** `cara.webp` (520px) is what pages display. `cara.jpg` stays only as the SEO/social image.
- **Favicons:** `public/assets/favicon.ico` (16/32/48px) and `public/apple-touch-icon.png` (180px). The original 128px source is `originals/assets/favicon-128.png`.

### Links and navigation

Contact links (email, LinkedIn, GitHub, Calendly) live in `LINKS`, and the homepage section links in `NAV_LINKS` (both in `src/consts.ts`). The navbar and footer render from `NAV_LINKS`, so its order must match the section order in `src/pages/index.astro`.

## Key patterns

- **Context-aware Navbar** — switches between homepage section links and blog category links at render time; scroll-based active state is tracked client-side.
- **MainLayout** — root HTML shell for all pages: SEO tags, the pre-paint theme script, Bootstrap's stylesheet and the global stylesheet.
- **SEO** — dedicated `SEO.astro` component, sitemap via `@astrojs/sitemap`, RSS via `@astrojs/rss`, and `public/robots.txt`.

## Front-end standard

Everything the site loads is served from its own domain. **No CDN links**: add libraries with `pnpm add` and bundle them.

### CSS

- **Bootstrap** comes from npm. `MainLayout.astro` links its stylesheet by URL (`bootstrap/dist/css/bootstrap.min.css?url`) at the top of `<head>`, so all of our CSS loads after it and overrides it. Don't change it to a plain `import`: Astro would then decide the order and can place page styles before Bootstrap.
- **`src/styles/global.css`** holds the design tokens (`:root` and `[data-theme="dark"]`), dark-mode shims for Bootstrap utilities, and rules that really are site-wide (base elements, badges, `.py-6`, `.section-divider`, the 76px navbar height and the offsets that depend on it). It is imported in `MainLayout.astro`, so Astro minifies and hashes it.
- **Component styles stay in the component's `<style>` block**, not in `global.css`. Don't style a component's classes or IDs globally (for example `.nav-link` or `#about p`), and avoid `!important` overrides that fight a component's own rules.
- Use colors, spacing and radii from the tokens (`var(--color-…)`, `var(--space-…)`) so both themes keep working.
- Don't reuse Bootstrap's component class names (`.card`, `.card-title`, …) for custom markup. Prefix them instead (for example `.blog-card-title`).
- Give `@keyframes` unique names. Keyframe names are global even in scoped styles.

### Icons

Icons are inline SVGs from [astro-icon](https://www.astroicon.dev) with the Iconify Font Awesome 6 sets (`@iconify-json/fa6-solid`, `fa6-regular`, `fa6-brands`). No icon fonts.

```astro
---
import { Icon } from 'astro-icon/components';
---
<Icon name="fa6-solid:arrow-right" class="ms-1" aria-hidden="true" />
```

- Names are `set:icon`, e.g. `fa6-brands:github`. Browse names at [icones.js.org](https://icones.js.org).
- Data files use the same format: the `icon` field in `src/data/projects.json` is validated by `portfolio.ts` and fails the build on anything else.
- Decorative icons get `aria-hidden="true"`. An icon-only button needs an `aria-label`.
- To style icons, target `svg` (e.g. `.read-cta svg`), not `i`.

### JavaScript

- Use Astro `<script>` tags (bundled modules) and import only the Bootstrap plugins you need, e.g. `import Collapse from 'bootstrap/js/dist/collapse'`. There is no global `window.bootstrap`.
- Importing a plugin also enables its `data-bs-*` attributes (the navbar toggler relies on this).
- Load page-specific libraries lazily. Tooltip and Popper are only imported on pages that contain `[data-bs-toggle="tooltip"]`.
- `is:inline` is only for code that must run before first paint (the theme script in `MainLayout.astro`).

### Old URLs and 404

`src/pages/404.astro` is a normal site page (navbar, footer, links to home, case studies and blog) marked `noindex`. When a URL changes or a page is removed, add a 301 to `public/_redirects` so existing links and search results keep working.

### Response headers

`public/_headers` (Cloudflare Pages) sets cache and security headers:

- `/_astro/*` is cached for a year as immutable, which is safe because those file names are content-hashed.
- `/images/*` is cached for a week.
- Every page gets `nosniff`, `Referrer-Policy`, `X-Frame-Options: DENY` and a `Permissions-Policy`.
- The Content-Security-Policy runs in **report-only** mode and allows only `'self'`. If you add an external service (embed, analytics, font), add its host to the CSP. Before switching to an enforced CSP, the inline theme script and JSON-LD need hashes.

## Line endings

All text files use **LF** (`\n`), both in the repository and in working copies, on every OS.

- `.gitattributes` (`* text=auto eol=lf`) enforces it in Git and overrides each machine's `core.autocrlf`, so Windows checkouts stay LF and Git no longer warns about LF/CRLF conversion. Images, fonts and other binaries are marked `binary` and never converted.
- `.editorconfig` tells editors to save new files with LF, UTF-8 and a final newline.

If a file ever shows up with CRLF, re-normalize it:

```bash
git add --renormalize .
```

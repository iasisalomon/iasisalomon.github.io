# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

### Data Sources
- **Projects & Brands:** single source of truth for all portfolio projects (8 projects with categories: code, event, data-science, education) and 3 personal brands (iasi, glunis, oxaciano). Components read this directly.
- **Blog Posts:** Markdown files managed via Astro content collections. (requires title, description, pubDate).

### Key Patterns
- **MainLayout** root HTML shell for all pages. Loads CDN assets, inlines three client-side scripts
- **Context-aware Navbar** switches between homepage section links and blog category links at render time. Scroll-based active state is tracked client-side.
- **Homepage composition** assembles Navbar + Hero + About + Brands + Projects + Discussion + Footer components in sequence.
- **Site constants** SITE_TITLE and SITE_DESCRIPTION used across pages and RSS feed.


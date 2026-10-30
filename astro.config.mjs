// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
    site: "https://iasisalomon.pages.dev",
    integrations: [sitemap({ filter: (page) => !page.includes("404") }), icon()],
    // Fetch internal pages on hover so navigation feels instant.
    prefetch: { prefetchAll: true },
    // Never inline scripts or styles: the CSP in public/_headers only allows
    // same-origin files (plus the hashed theme script in MainLayout).
    build: { inlineStylesheets: "never" },
    vite: { build: { assetsInlineLimit: 0 } },
});

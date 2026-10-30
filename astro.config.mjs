// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import { rename, rm } from "node:fs/promises";

// Cloudflare Pages answers an unknown URL with the nearest 404.html, so
// /es/… needs dist/es/404.html; Astro only writes the root one that way.
const localized404 = {
    name: "localized-404",
    hooks: {
        "astro:build:done": async ({ dir }) => {
            await rename(new URL("es/404/index.html", dir), new URL("es/404.html", dir));
            await rm(new URL("es/404/", dir), { recursive: true });
        },
    },
};

// https://astro.build/config
export default defineConfig({
    site: "https://iasisalomon.pages.dev",
    // English at /, Spanish under /es/. Each page exists once per language
    // with the same path after the prefix (see src/i18n/).
    i18n: {
        locales: ["en", "es"],
        defaultLocale: "en",
        routing: { prefixDefaultLocale: false },
    },
    integrations: [
        sitemap({
            filter: (page) => !page.includes("404"),
            // Adds hreflang alternates between /x/ and /es/x/.
            i18n: { defaultLocale: "en", locales: { en: "en", es: "es" } },
        }),
        icon(),
        localized404,
    ],
    // Fetch internal pages on hover so navigation feels instant.
    prefetch: { prefetchAll: true },
    // Never inline scripts or styles: the CSP in public/_headers only allows
    // same-origin files (plus the hashed theme script in MainLayout).
    build: { inlineStylesheets: "never" },
    vite: { build: { assetsInlineLimit: 0 } },
});

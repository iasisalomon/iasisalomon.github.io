// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
    site: "https://iasisalomon.pages.dev",
    integrations: [mdx(), sitemap({ filter: (page) => !page.includes("404") }), icon()],
});

import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import sitemap from "@astrojs/sitemap";
import { SITE, RESUME } from "./src/config";
import compress from "astro-compress";
import preload from "astro-preload";
import vercel from "@astrojs/vercel/serverless";
import remarkMermaid from 'remark-mermaidjs'

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    preload(),
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    sitemap(),
    compress(),
  ],
  markdown: {
    syntaxHighlight: "shiki",
    remarkPlugins: [
      [
        remarkMermaid,
        {
          strategy: 'img-png',
          dark: true,
          css: new URL("./src/styles/base.css", import.meta.url).href
        }
      ],
      [
        remarkToc,
        {
          heading: "Contents",
          tight: true,
          maxDepth: 3,
        },
      ],
      [
        remarkCollapse,
        {
          test: "Contents",
          content: "show contents",
        },
      ],
      //[stripMarkdown, {}]
    ],
    smartypants: true,
    shikiConfig: {
      wrap: true,
      themes: {"light": "github-light", "dark": "github-dark"},
    },
  },
  output: "hybrid",
  adapter: vercel(),

  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  scopedStyleStrategy: "where",
});

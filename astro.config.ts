import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import sitemap from "@astrojs/sitemap";
import { SITE, RESUME } from "./src/config";
import compress from "astro-compress";
import preload from "astro-preload";
import remarkMermaid from 'remark-mermaidjs'
import { chromium as playwright } from "playwright";


async function getBrowserType(){
  const {default: chromium} = await import("@sparticuz/chromium");
  chromium.setHeadlessMode = true;

  const browser = await playwright.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });
  
  return browser.browserType()
}


playwright

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
          browserType: process.env.NODE_ENV === "production" ?  await getBrowserType(): undefined,
          strategy: 'img-svg',
          dark: true,
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
  output: "static",

  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  scopedStyleStrategy: "where",
});

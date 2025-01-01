import { defineConfig, envField } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config";
import compress from "astro-compress";
import preload from "astro-preload";
import remarkMermaid from 'remark-mermaidjs'
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  env: {
    schema: {
      TELEGRAM_BOT_TOKEN: envField.string({ context: "server", access: "secret" }),
      MY_CHAT_ID: envField.number({ context: "server", access: "secret",  }),
      OMDB_API_KEY: envField.string({ context: "server", access: "secret" }),
      KV_URL: envField.string({ context: "server", access: "secret" }),
      KV_REST_API_READ_ONLY_TOKEN:envField.string({ context: "server", access: "secret" }),
      KV_REST_API_TOKEN:envField.string({ context: "server", access: "secret" }),
      KV_REST_API_URL:envField.string({ context: "server", access: "secret" }),
    }
  },
  integrations: [preload(), tailwind({
    applyBaseStyles: false,
  }), react(), sitemap(), compress()],
  markdown: {
    syntaxHighlight: "shiki",
    remarkPlugins: [
      [
        remarkMermaid,
        {
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
  output: "server",
  adapter: vercel(),
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  scopedStyleStrategy: "where",
});
import { Redis } from '@upstash/redis';
import { KV_URL, KV_REST_API_TOKEN } from "astro:env/server";

export const redis = new Redis({
  url: KV_URL,
  token: KV_REST_API_TOKEN,
})

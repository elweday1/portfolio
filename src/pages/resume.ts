export const prerender = false;
import type { APIRoute } from "astro";
import { RESUME } from "@config";


export const GET: APIRoute = async ({ redirect, clientAddress }) => {
  fetch("/notify-resume", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({clientAddress})
  })
  return redirect(RESUME.normal);
};



type IpData = {
  query: string;
  status: "success" | "fail";
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
};


export const prerender = false;
import type { APIRoute } from "astro";
import { RESUME } from "@config";
import YAML from 'yaml'

const { TELEGRAM_BOT_TOKEN, MY_CHAT_ID } = import.meta.env;


export const POST: APIRoute = async ({ request }) => {
    const body = await request.json()
    const response = await fetch(`http://ip-api.com/json/${body.clientAddress}`);
    const data = (await response.json()) as IpData
    const msg = encodeURIComponent(YAML.stringify(data));
    const endPoint = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${MY_CHAT_ID}&text=${msg}`;

    await fetch(endPoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    return new Response(JSON.stringify({
        "status": "owner notified"
    }))
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

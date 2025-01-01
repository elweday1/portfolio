import { MY_CHAT_ID, TELEGRAM_BOT_TOKEN } from "astro:env/server";

export async function sendMessage(message: string){
    const msg = encodeURIComponent(message);
    const endPoint = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${MY_CHAT_ID}&text=${msg}`;
    const res = await fetch(endPoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    return await res.text();    

}
import type { APIRoute } from 'astro';
import { MY_CHAT_ID } from 'astro:env/server';
import { redis } from 'db';

import { actions } from 'astro:actions';
import { SITE } from '@config';

type TelegramMessage = {
    message_id: number;
    date: number;
    text: string;
    reply_to_message?: TelegramMessage;
    chat: {
      id: number;
      first_name: string;
      last_name: string;
      username: string;
      type: "private" | "group" | "supergroup" | "channel";
    };
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      last_name: string;
      username: string;
      language_code: string;
    };
  };
  
  type TelegramUpdate = {
    update_id: number;
    message: TelegramMessage;
  };
  
  const twitterBasePost = "https://x.com/intent/tweet?text="
  const mySiteLink = SITE.website + "/questions"
  const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
    }

export const POST: APIRoute = async ({ request }) => {
    const updateData = await request.json() as TelegramUpdate;
    if (updateData.message.reply_to_message && updateData.message.from.id === Number(MY_CHAT_ID) ) {
      await actions.telegram.sendMessage(shareToTwitter(updateData));
      const question = updateData.message.reply_to_message.text;
      const answer = updateData.message.text;
      const clientAddress = await redis.get(question) ?? null;
      const data = JSON.stringify({ answer, clientAddress, date: new Date().getTime() });
      await redis.set(question, data);
      await redis.sadd('questions', question);
    }
    return new Response(updateData.message.text, { status: 200, headers }); 
}

  function shareToTwitter(update : TelegramUpdate) {
    const message = `-> ${update.message.reply_to_message?.text || ""}
=> ${update.message.text}
    
${mySiteLink}
    `.trim();
    return `
    Sharing Link:
    ${twitterBasePost}${encodeURIComponent(message)}`.trim();
  }
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const server = {
    sendMessage: defineAction({
        input: z.object({
            message: z.string(),
        }),
        handler: async ({message}) => {
            const res = await fetch("https://api.elweday.workers.dev/questions/ask", {
                method: "POST",
                body: message,
                headers: {
                  "Content-Type": "application/json",
                  "Allow-Control-Allow-Origin": "*",
                },
            })

            const data = await res.text();
            return data;

        }
    })
}
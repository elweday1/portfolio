import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { redis } from 'db';
import { sendMessage } from './telegram';

const questions = {
    ask: defineAction({
        input: z.object({
            message: z.string(),
        }),
        handler: async ({message}) => {
            const res = await sendMessage({message});
            return res.data;
        }
    }),
    getAll: defineAction({
        handler: async () => {
            const questions = await redis.smembers('questions');
            const qa = await Promise.all(questions.map(async question => {
                const answer = await redis.get<string>(question);
                return { question, answer };
            }));
            return qa as { question: string, answer: string }[];
        }
    })

}

export const server  = {
    questions,
    telegram: {
        sendMessage
    }
}

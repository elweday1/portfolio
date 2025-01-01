import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { redis } from 'db';
import { sendMessage } from './telegram';

const questions = {
    ask: defineAction({
        input: z.object({
            question: z.string(),
        }),
        handler: async ({ question }, { clientAddress}) => {
            await redis.set(question, clientAddress);
            const res = await sendMessage(question);
            return res;
        }
    }),
    getAll: async () =>  {
            const questions = await redis.smembers('questions');
            const qa = await Promise.all(questions.map(async question => {
                const answerJson = await redis.get<string>(question);
                const answer = JSON.parse(answerJson!);
                return answer as { question: string, answer: string, date: number, clientAddress: string };
            }));
            return qa;
    }
}

export const server  = {
    questions,
    telegram: {
        sendMessage
    }
}

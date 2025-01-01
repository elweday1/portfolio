import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { redis } from 'db';
import { sendMessage } from './telegram';
import { assertFulfilled } from '@components/utils';


type Answer = { question: string, answer: string, date: number, clientAddress: string }
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
            const responses = await Promise.allSettled(questions.map(async question => {
                const answerJson = await redis.get<string>(question);
                try {
                    const answer = JSON.parse(answerJson!);
                    return answer as Answer
                } catch (error) {
                    throw new Error("Failed to parse answer");
                }
            }));
            return responses.filter(assertFulfilled).map(res => res.value);
    }
}

export const server  = {
    questions,
    telegram: {
        sendMessage
    }
}

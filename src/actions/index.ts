import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { redis } from 'db';
import { sendMessage } from './telegram';
import { assertFulfilled, safeParse } from '@components/utils';

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
            console.log({questions})
            const responses = await Promise.allSettled(questions.map(async question => {
                const answerJson = await redis.get<Answer>(question);
                return {...answerJson, question};
            }));
            console.log({responses})
            const answers = responses.filter(assertFulfilled).map(res => res.value);
            console.log({answers})
            return  answers;
    }
}

export const server  = {
    questions,
    telegram: {
        sendMessage
    }
}

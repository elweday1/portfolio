import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { redis } from 'db';
import { sendMessage } from './telegram';

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
            const answers: Answer[] = [];
            await Promise.allSettled(questions.map(async question => {
                const answerJson = await redis.get<string>(question);
                try {
                    const answer = JSON.parse(answerJson!);
                    answers.push(answer);
                } catch (error) {
                    return
                }
            }));
            return answers;
    }
}

export const server  = {
    questions,
    telegram: {
        sendMessage
    }
}

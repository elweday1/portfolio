import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function hsl(h: number, a = 100, s = 40, l = 50) { return `hsl(${h} ${s}%  ${l}% / ${a}%)` }

export function quickHash(s: string) { return Array.from(s).reduce((a, b) => a + b.charCodeAt(0) * 17, 0) % 360};  


export function assertFulfilled<T>(item: PromiseSettledResult<T>): item is PromiseFulfilledResult<T> {
  return item.status === 'fulfilled';
}

export function safeParse<T>(jsonText: string): T | undefined {
   try {
     return JSON.parse(jsonText);
  } catch {
     return undefined
  }
} 
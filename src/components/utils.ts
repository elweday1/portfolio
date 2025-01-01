import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function hsl(h: number, a = 100, s = 40, l = 50) { return `hsl(${h} ${s}%  ${l}% / ${a}%)` }

export function quickHash(s: string) { return Array.from(s).reduce((a, b) => a + b.charCodeAt(0) * 17, 0) % 360};  

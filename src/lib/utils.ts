import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// utils/getMatchColor.ts
export const getMatchColor = (matchPercentage?: number): string => {
  if (matchPercentage === undefined) return "bg-[#FFC251]"; // Default
  if (matchPercentage < 40) return "bg-[#FF0000]"; // Red
  if (matchPercentage < 70) return "bg-[#FFEE51]"; // Yellowish
  if (matchPercentage <= 90) return "bg-[#FFC251]"; // Orangish-yellow
  return "bg-[#37D3AE]"; // Dark blue
};
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// utils/getMatchColor.ts
export const getMatchColor = (matchPercentage?: number): string => {
  if (matchPercentage === undefined) return "bg-[#B8D4FF]"; // Default
  if (matchPercentage  < 70) return "bg-[#ffe300]"; // Yellowish
  if (matchPercentage > 70) return "bg-[#FFB952]"; // Orange
  if (matchPercentage > 80) return "bg-emerald-400"; // green
  return "bg-[#B8D4FF]"; // Dark blue
};
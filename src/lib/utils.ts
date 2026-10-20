import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export type WinnerTierCount = 3 | 5 | 10;

export interface PrizeTierDistribution {
  rank: number;
  percentage: number;
  amount: number;
  label: string;
}

// Default percentages for Top 3, Top 5, and Top 10
export const PRIZE_SPLIT_PRESETS: Record<WinnerTierCount, number[]> = {
  3: [50, 30, 20],
  5: [40, 25, 15, 12, 8],
  10: [30, 20, 15, 10, 8, 5, 4, 3, 3, 2],
};

export function calculateConfigurablePrizePool(totalBudget: number, winnerCount: WinnerTierCount = 3) {
  const percentages = PRIZE_SPLIT_PRESETS[winnerCount] || PRIZE_SPLIT_PRESETS[3];
  
  const tiers: PrizeTierDistribution[] = percentages.map((pct, idx) => ({
    rank: idx + 1,
    percentage: pct,
    amount: Math.round(totalBudget * (pct / 100)),
    label: idx === 0 ? "1st Place" : idx === 1 ? "2nd Place" : idx === 2 ? "3rd Place" : `${idx + 1}th Place`,
  }));

  const platformFee = Math.round(totalBudget * 0.1); // 10% platform fee
  const taxGst = Math.round(platformFee * 0.18); // 18% GST on platform fee
  const totalPayable = Math.round(totalBudget + platformFee + taxGst);

  return {
    winnerCount,
    tiers,
    firstPlace: tiers[0]?.amount || 0,
    secondPlace: tiers[1]?.amount || 0,
    thirdPlace: tiers[2]?.amount || 0,
    platformFee,
    taxGst,
    totalPayable,
  };
}

// Backward compatibility helper
export function calculatePrizePool(totalBudget: number) {
  return calculateConfigurablePrizePool(totalBudget, 3);
}

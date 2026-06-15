import type { DiaryEntry, Nutriments } from '@/db/types';

export const EMPTY_NUTRIMENTS: Nutriments = { kcal: 0, protein: 0, carbs: 0, fat: 0 };

/** Scale per-100g nutriments to an arbitrary amount (grams/ml). */
export function scaleNutriments(per100: Nutriments, amount: number): Nutriments {
  const f = amount / 100;
  return {
    kcal: round1(per100.kcal * f),
    protein: round1(per100.protein * f),
    carbs: round1(per100.carbs * f),
    fat: round1(per100.fat * f),
  };
}

export function addNutriments(a: Nutriments, b: Nutriments): Nutriments {
  return {
    kcal: round1(a.kcal + b.kcal),
    protein: round1(a.protein + b.protein),
    carbs: round1(a.carbs + b.carbs),
    fat: round1(a.fat + b.fat),
  };
}

export function sumDiary(entries: DiaryEntry[]): Nutriments {
  return entries.reduce((acc, e) => addNutriments(acc, e.totals), {
    ...EMPTY_NUTRIMENTS,
  });
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function clampPct(value: number, total: number): number {
  if (total <= 0) return 0;
  return Math.max(0, Math.min(100, (value / total) * 100));
}

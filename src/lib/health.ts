import type { ActivityLevel, Goal, Profile, Targets } from '@/db/types';
import { ageFromBirthdate } from './date';

/**
 * Health calculations (§5 of the spec). All outputs are *suggestions* the user
 * may override — values are estimates/orientation, not medical advice.
 */

const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  extra: 1.9,
};

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'Sitzend (kaum Bewegung)',
  light: 'Leicht aktiv (1–3×/Woche)',
  moderate: 'Mäßig aktiv (3–5×/Woche)',
  very: 'Sehr aktiv (6–7×/Woche)',
  extra: 'Extrem aktiv (körperliche Arbeit)',
};

export const GOAL_LABELS: Record<Goal, string> = {
  lose: 'Abnehmen',
  maintain: 'Gewicht halten',
  gain: 'Zunehmen',
};

/** Mifflin–St Jeor basal metabolic rate. */
export function bmr(profile: Pick<Profile, 'sex' | 'weightKg' | 'heightCm' | 'birthdate'>): number {
  const age = ageFromBirthdate(profile.birthdate);
  const base = 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * age;
  // 'd' (divers) uses the average of the male/female constants.
  const constant = profile.sex === 'm' ? 5 : profile.sex === 'w' ? -161 : -78;
  return base + constant;
}

export function tdee(profile: Pick<Profile, 'sex' | 'weightKg' | 'heightCm' | 'birthdate' | 'activityLevel'>): number {
  return bmr(profile) * ACTIVITY_FACTORS[profile.activityLevel];
}

/** Daily kcal/macro targets derived from the profile (before manual override). */
export function calculateTargets(profile: Profile): Targets {
  const maintenance = tdee(profile);
  const dailyAdjust = (Math.abs(profile.targetRateKgPerWeek) * 7700) / 7;

  let kcal = maintenance;
  if (profile.goal === 'lose') kcal = maintenance - dailyAdjust;
  else if (profile.goal === 'gain') kcal = maintenance + dailyAdjust;
  kcal = Math.max(1200, Math.round(kcal));

  // Protein ~1.8 g/kg, fat ~28 % of kcal, carbs = remainder.
  const protein = Math.round(1.8 * profile.weightKg);
  const fat = Math.round((kcal * 0.28) / 9);
  const carbsKcal = kcal - protein * 4 - fat * 9;
  const carbs = Math.max(0, Math.round(carbsKcal / 4));

  return { kcal, protein, carbs, fat };
}

/** Effective targets: calculated values overridden by any custom values. */
export function effectiveTargets(profile: Profile): Targets {
  const base = calculateTargets(profile);
  const c = profile.customTargets;
  return {
    kcal: c?.kcal ?? base.kcal,
    protein: c?.protein ?? base.protein,
    carbs: c?.carbs ?? base.carbs,
    fat: c?.fat ?? base.fat,
  };
}

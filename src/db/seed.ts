import type { LocalFood } from './types';

/**
 * ~30 realistic German pantry/fresh basics, values per 100 g (or 100 ml for
 * liquids). Editable in the app. Used by the "Essen loggen" free-food picker.
 */
export const SEED_FOODS: Omit<LocalFood, 'id'>[] = [
  { name: 'Banane', kcal: 89, protein: 1.1, carbs: 23, fat: 0.3, defaultUnit: 'g' },
  { name: 'Apfel', kcal: 52, protein: 0.3, carbs: 14, fat: 0.2, defaultUnit: 'g' },
  { name: 'Ei (Huhn)', kcal: 155, protein: 13, carbs: 1.1, fat: 11, defaultUnit: 'g' },
  { name: 'Hähnchenbrust (roh)', kcal: 165, protein: 31, carbs: 0, fat: 3.6, defaultUnit: 'g' },
  { name: 'Reis (gekocht)', kcal: 130, protein: 2.7, carbs: 28, fat: 0.3, defaultUnit: 'g' },
  { name: 'Haferflocken', kcal: 372, protein: 13, carbs: 59, fat: 7, defaultUnit: 'g' },
  { name: 'Milch (3,5 %)', kcal: 64, protein: 3.4, carbs: 4.8, fat: 3.6, defaultUnit: 'ml' },
  { name: 'Joghurt (natur)', kcal: 61, protein: 3.5, carbs: 4.7, fat: 3.3, defaultUnit: 'g' },
  { name: 'Kartoffel (gekocht)', kcal: 87, protein: 1.9, carbs: 20, fat: 0.1, defaultUnit: 'g' },
  { name: 'Brot (Mischbrot)', kcal: 250, protein: 8, carbs: 47, fat: 3, defaultUnit: 'g' },
  { name: 'Nudeln (gekocht)', kcal: 158, protein: 5.8, carbs: 31, fat: 0.9, defaultUnit: 'g' },
  { name: 'Olivenöl', kcal: 884, protein: 0, carbs: 0, fat: 100, defaultUnit: 'ml' },
  { name: 'Butter', kcal: 717, protein: 0.9, carbs: 0.7, fat: 81, defaultUnit: 'g' },
  { name: 'Quark (Magerstufe)', kcal: 67, protein: 12, carbs: 4, fat: 0.3, defaultUnit: 'g' },
  { name: 'Tomate', kcal: 18, protein: 0.9, carbs: 3.9, fat: 0.2, defaultUnit: 'g' },
  { name: 'Gurke', kcal: 15, protein: 0.7, carbs: 3.6, fat: 0.1, defaultUnit: 'g' },
  { name: 'Karotte', kcal: 41, protein: 0.9, carbs: 10, fat: 0.2, defaultUnit: 'g' },
  { name: 'Zwiebel', kcal: 40, protein: 1.1, carbs: 9, fat: 0.1, defaultUnit: 'g' },
  { name: 'Paprika (rot)', kcal: 31, protein: 1, carbs: 6, fat: 0.3, defaultUnit: 'g' },
  { name: 'Brokkoli', kcal: 34, protein: 2.8, carbs: 7, fat: 0.4, defaultUnit: 'g' },
  { name: 'Rinderhackfleisch', kcal: 254, protein: 17, carbs: 0, fat: 20, defaultUnit: 'g' },
  { name: 'Lachsfilet', kcal: 208, protein: 20, carbs: 0, fat: 13, defaultUnit: 'g' },
  { name: 'Thunfisch (in Wasser)', kcal: 116, protein: 26, carbs: 0, fat: 1, defaultUnit: 'g' },
  { name: 'Linsen (gekocht)', kcal: 116, protein: 9, carbs: 20, fat: 0.4, defaultUnit: 'g' },
  { name: 'Kidneybohnen (gekocht)', kcal: 127, protein: 8.7, carbs: 22, fat: 0.5, defaultUnit: 'g' },
  { name: 'Käse (Gouda)', kcal: 356, protein: 25, carbs: 2.2, fat: 27, defaultUnit: 'g' },
  { name: 'Mandeln', kcal: 579, protein: 21, carbs: 22, fat: 50, defaultUnit: 'g' },
  { name: 'Erdnussbutter', kcal: 588, protein: 25, carbs: 20, fat: 50, defaultUnit: 'g' },
  { name: 'Zucker', kcal: 387, protein: 0, carbs: 100, fat: 0, defaultUnit: 'g' },
  { name: 'Mehl (Weizen 405)', kcal: 348, protein: 10, carbs: 72, fat: 1, defaultUnit: 'g' },
  { name: 'Honig', kcal: 304, protein: 0.3, carbs: 82, fat: 0, defaultUnit: 'g' },
  { name: 'Avocado', kcal: 160, protein: 2, carbs: 9, fat: 15, defaultUnit: 'g' },
];

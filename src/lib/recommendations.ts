import type {
  DiaryEntry,
  InventoryItem,
  LocalFood,
  OwnRecipe,
  Targets,
  Nutriments,
} from '@/db/types';
import { daysUntil } from './date';

export interface Recommendation {
  id: string;
  kind: 'goal' | 'expiring' | 'variety';
  title: string;
  detail: string;
}

/**
 * Combine three sources into a short, ranked list of suggestions (§4.7):
 *   1. Fill daily targets  – propose foods/recipes for the remaining macros.
 *   2. Use up expiring items – highlight stock with the nearest best-before.
 *   3. Variety             – de-prioritise things eaten/cooked very recently.
 */
export function buildRecommendations(args: {
  remaining: Targets;
  inventory: InventoryItem[];
  foods: LocalFood[];
  recipes: OwnRecipe[];
  recentDiary: DiaryEntry[];
}): Recommendation[] {
  const { remaining, inventory, foods, recipes, recentDiary } = args;
  const recs: Recommendation[] = [];

  const recentNames = new Set(
    recentDiary
      .flatMap((e) => e.items.map((i) => i.name.toLowerCase()))
      .slice(0, 40),
  );

  // 1. Goal: which macro is most lacking relative to its target?
  const lacking = mostLackingMacro(remaining);
  if (lacking && remaining.kcal > 120) {
    const candidates = [...foods]
      .filter((f) => !recentNames.has(f.name.toLowerCase()))
      .sort((a, b) => macroDensity(b, lacking) - macroDensity(a, lacking))
      .slice(0, 3);
    if (candidates.length) {
      recs.push({
        id: `goal-${lacking}`,
        kind: 'goal',
        title: goalTitle(lacking, remaining),
        detail: candidates.map((c) => c.name).join(', '),
      });
    }
  }

  // 2. Expiring: items within 3 days that are still in stock.
  const expiring = inventory
    .filter((i) => i.bestBefore && daysUntil(i.bestBefore) <= 3 && i.amount > 0)
    .sort((a, b) => daysUntil(a.bestBefore!) - daysUntil(b.bestBefore!))
    .slice(0, 3);
  if (expiring.length) {
    const usable = recipes.filter((r) =>
      r.ingredients.some((ing) =>
        expiring.some((e) => matchName(e.name, ing.name)),
      ),
    );
    recs.push({
      id: 'expiring',
      kind: 'expiring',
      title: 'Bald Ablaufendes verwerten',
      detail:
        expiring.map((e) => e.name).join(', ') +
        (usable.length ? ` · Passt zu: ${usable[0]!.title}` : ''),
    });
  }

  // 3. Variety: surface an own recipe not cooked recently.
  const freshRecipe = recipes.find(
    (r) => !recentNames.has(r.title.toLowerCase()),
  );
  if (freshRecipe && recs.length < 3) {
    recs.push({
      id: `variety-${freshRecipe.id}`,
      kind: 'variety',
      title: 'Für Abwechslung',
      detail: `Lange nicht gekocht: ${freshRecipe.title}`,
    });
  }

  return recs.slice(0, 3);
}

type MacroKey = 'protein' | 'carbs' | 'fat';

function mostLackingMacro(remaining: Targets): MacroKey | null {
  const entries: [MacroKey, number][] = [
    ['protein', remaining.protein],
    ['carbs', remaining.carbs],
    ['fat', remaining.fat],
  ];
  const positive = entries.filter(([, v]) => v > 0);
  if (!positive.length) return null;
  positive.sort((a, b) => b[1] - a[1]);
  return positive[0]![0];
}

function macroDensity(food: Nutriments, macro: MacroKey): number {
  return food[macro];
}

function goalTitle(macro: MacroKey, remaining: Targets): string {
  const labels: Record<MacroKey, string> = {
    protein: 'Protein',
    carbs: 'Kohlenhydrate',
    fat: 'Fett',
  };
  return `${labels[macro]} fehlt noch (${Math.round(remaining[macro])} g) – Vorschläge`;
}

function matchName(a: string, b: string): boolean {
  const x = a.toLowerCase();
  const y = b.toLowerCase();
  return x.includes(y) || y.includes(x);
}

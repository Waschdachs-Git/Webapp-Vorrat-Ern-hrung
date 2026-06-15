import type { Nutriments } from '@/db/types';

/**
 * Minimal Spoonacular client. The free-tier API key comes from Settings and is
 * passed as a query param. Responses are cached in-memory for the session (the
 * service worker additionally caches them across reloads). Errors and the daily
 * limit are surfaced cleanly so the UI can degrade instead of crashing.
 */

const BASE = 'https://api.spoonacular.com';

export interface RecipeHit {
  id: number;
  title: string;
  image?: string;
  usedIngredientCount?: number;
  missedIngredientCount?: number;
  missedIngredients?: string[];
}

export interface RecipeDetail {
  id: number;
  title: string;
  image?: string;
  servings: number;
  readyInMinutes?: number;
  sourceUrl?: string;
  instructions?: string;
  ingredients: string[];
  nutritionPerServing?: Nutriments;
}

export type ApiOutcome<T> =
  | { ok: true; data: T }
  | { ok: false; reason: 'no-key' | 'limit' | 'network' | 'http'; message: string };

const memCache = new Map<string, unknown>();

export class SpoonacularClient {
  constructor(private apiKey: string | undefined) {}

  get hasKey(): boolean {
    return !!this.apiKey && this.apiKey.trim().length > 0;
  }

  async findByIngredients(
    ingredients: string[],
    number = 10,
  ): Promise<ApiOutcome<RecipeHit[]>> {
    const params = new URLSearchParams({
      ingredients: ingredients.join(','),
      number: String(number),
      ranking: '2', // minimise missing ingredients
      ignorePantry: 'true',
    });
    return this.request<SpoonByIngredient[]>(
      `/recipes/findByIngredients?${params}`,
    ).then((r) =>
      r.ok
        ? {
            ok: true,
            data: r.data.map((x) => ({
              id: x.id,
              title: x.title,
              image: x.image,
              usedIngredientCount: x.usedIngredientCount,
              missedIngredientCount: x.missedIngredientCount,
              missedIngredients: (x.missedIngredients ?? []).map((m) => m.name),
            })),
          }
        : r,
    );
  }

  async complexSearch(
    query: string,
    diet?: string,
    intolerances?: string,
    number = 12,
  ): Promise<ApiOutcome<RecipeHit[]>> {
    const params = new URLSearchParams({ number: String(number) });
    if (query) params.set('query', query);
    if (diet) params.set('diet', diet);
    if (intolerances) params.set('intolerances', intolerances);
    return this.request<{ results: SpoonSearchResult[] }>(
      `/recipes/complexSearch?${params}`,
    ).then((r) =>
      r.ok
        ? {
            ok: true,
            data: r.data.results.map((x) => ({
              id: x.id,
              title: x.title,
              image: x.image,
            })),
          }
        : r,
    );
  }

  async recipeInformation(id: number): Promise<ApiOutcome<RecipeDetail>> {
    const params = new URLSearchParams({ includeNutrition: 'true' });
    return this.request<SpoonInformation>(
      `/recipes/${id}/information?${params}`,
    ).then((r) =>
      r.ok ? { ok: true, data: parseInformation(r.data) } : r,
    );
  }

  private async request<T>(path: string): Promise<ApiOutcome<T>> {
    if (!this.hasKey) {
      return { ok: false, reason: 'no-key', message: 'Kein Spoonacular API-Key hinterlegt.' };
    }
    const sep = path.includes('?') ? '&' : '?';
    const url = `${BASE}${path}${sep}apiKey=${encodeURIComponent(this.apiKey!)}`;
    const cacheKey = path; // exclude the key from the cache identity

    if (memCache.has(cacheKey)) {
      return { ok: true, data: memCache.get(cacheKey) as T };
    }

    try {
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (res.status === 402 || res.status === 429) {
        return { ok: false, reason: 'limit', message: 'Tageslimit erreicht. Bitte später erneut versuchen.' };
      }
      if (!res.ok) {
        return { ok: false, reason: 'http', message: `Fehler ${res.status}` };
      }
      const data = (await res.json()) as T;
      memCache.set(cacheKey, data);
      return { ok: true, data };
    } catch (err) {
      return {
        ok: false,
        reason: 'network',
        message: err instanceof Error ? err.message : 'Netzwerkfehler',
      };
    }
  }
}

// ---- raw response shapes (only the fields we use) ----

interface SpoonByIngredient {
  id: number;
  title: string;
  image?: string;
  usedIngredientCount?: number;
  missedIngredientCount?: number;
  missedIngredients?: { name: string }[];
}

interface SpoonSearchResult {
  id: number;
  title: string;
  image?: string;
}

interface SpoonInformation {
  id: number;
  title: string;
  image?: string;
  servings: number;
  readyInMinutes?: number;
  sourceUrl?: string;
  instructions?: string;
  extendedIngredients?: { original: string }[];
  nutrition?: {
    nutrients?: { name: string; amount: number }[];
  };
}

function parseInformation(d: SpoonInformation): RecipeDetail {
  const nutrients = d.nutrition?.nutrients ?? [];
  const find = (name: string) =>
    nutrients.find((n) => n.name.toLowerCase() === name.toLowerCase())?.amount;
  const kcal = find('Calories');
  const hasNutrition = kcal !== undefined;
  return {
    id: d.id,
    title: d.title,
    image: d.image,
    servings: d.servings,
    readyInMinutes: d.readyInMinutes,
    sourceUrl: d.sourceUrl,
    instructions: d.instructions,
    ingredients: (d.extendedIngredients ?? []).map((i) => i.original),
    nutritionPerServing: hasNutrition
      ? {
          kcal: kcal ?? 0,
          protein: find('Protein') ?? 0,
          carbs: find('Carbohydrates') ?? 0,
          fat: find('Fat') ?? 0,
        }
      : undefined,
  };
}

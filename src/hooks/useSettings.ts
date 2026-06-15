import { useLiveQuery } from 'dexie-react-hooks';
import { db, SETTINGS_ID, DEFAULT_ACCENT } from '@/db/database';
import type { Settings } from '@/db/types';

const FALLBACK: Settings = {
  id: SETTINGS_ID,
  accentColor: DEFAULT_ACCENT,
  theme: 'system',
};

/** Live settings; returns sensible defaults until the row is loaded. */
export function useSettings(): Settings {
  const settings = useLiveQuery(() => db.settings.get(SETTINGS_ID), []);
  return settings ?? FALLBACK;
}

export async function updateSettings(patch: Partial<Settings>): Promise<void> {
  const current = (await db.settings.get(SETTINGS_ID)) ?? FALLBACK;
  await db.settings.put({ ...current, ...patch, id: SETTINGS_ID });
}

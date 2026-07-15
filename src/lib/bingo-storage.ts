import { getStorage } from '@/lib/local-storage';

/**
 * Local persistence for bingo progress, keyed by card id so a future CMS card
 * (new id) starts with fresh progress.
 *
 * Format v2 stores when each balloon was spotted: `{ id, spottedAt? }[]`.
 * Records migrated from v1 (a plain `string[]` of ids) have no `spottedAt`.
 * All functions are failure-proof: they never throw.
 */

export type SpotRecord = {
  id: string;
  /** ISO timestamp of the spot; absent for records migrated from v1. */
  spottedAt?: string;
};

const V1_KEY_PREFIX = 'ballonbingo:spotted:v1:';
const V2_KEY_PREFIX = 'ballonbingo:spots:v2:';

/**
 * Parses a raw stored value into spot records. Accepts both formats:
 * v2 (`{id, spottedAt?}[]`) and v1 (`string[]`, mapped to records without a
 * moment). Returns null for anything malformed. Pure — unit-testable.
 */
export function parseStoredSpots(raw: string | null): SpotRecord[] | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    if (parsed.every((item) => typeof item === 'string')) {
      return (parsed as string[]).map((id) => ({ id }));
    }
    if (
      parsed.every(
        (item) =>
          typeof item === 'object' &&
          item !== null &&
          typeof (item as { id?: unknown }).id === 'string' &&
          ((item as { spottedAt?: unknown }).spottedAt === undefined ||
            typeof (item as { spottedAt?: unknown }).spottedAt === 'string')
      )
    ) {
      return (parsed as { id: string; spottedAt?: string }[]).map(({ id, spottedAt }) =>
        spottedAt === undefined ? { id } : { id, spottedAt }
      );
    }
    return null;
  } catch {
    return null;
  }
}

export async function loadSpots(cardId: string): Promise<SpotRecord[]> {
  try {
    const store = getStorage();
    const rawV2 = await store.getItem(V2_KEY_PREFIX + cardId);
    const v2 = parseStoredSpots(rawV2);
    if (v2) return v2;

    // Migrate v1 (plain id array, no timestamps) once, then remove it.
    const rawV1 = await store.getItem(V1_KEY_PREFIX + cardId);
    const migrated = parseStoredSpots(rawV1);
    if (migrated && migrated.length > 0) {
      await store.setItem(V2_KEY_PREFIX + cardId, JSON.stringify(migrated));
      await store.removeItem(V1_KEY_PREFIX + cardId);
      return migrated;
    }
    return [];
  } catch {
    return [];
  }
}

export async function saveSpots(cardId: string, spots: readonly SpotRecord[]): Promise<void> {
  try {
    await getStorage().setItem(V2_KEY_PREFIX + cardId, JSON.stringify(spots));
  } catch (error) {
    if (__DEV__) console.warn('Ballonbingo: voortgang opslaan mislukt', error);
  }
}

export async function clearSpots(cardId: string): Promise<void> {
  try {
    const store = getStorage();
    await store.removeItem(V2_KEY_PREFIX + cardId);
    await store.removeItem(V1_KEY_PREFIX + cardId);
  } catch (error) {
    if (__DEV__) console.warn('Ballonbingo: voortgang wissen mislukt', error);
  }
}

/** Convenience wrapper: just the spotted ids (used by summary/catalogue views). */
export async function loadSpottedIds(cardId: string): Promise<string[]> {
  const spots = await loadSpots(cardId);
  return spots.map((spot) => spot.id);
}

/**
 * DEMO — dev-only. Seeds a few spots for the 2025 demo card so the passport
 * year archive has something to show. Remove together with the demo card in
 * `@/mocks/bingo-data` once the CMS provides real editions.
 */
export async function seedDemoArchiveSpots(cardId: string, spots: readonly SpotRecord[]): Promise<void> {
  // typeof-guard: this module also runs in plain node (tsx verification scripts).
  if (typeof __DEV__ === 'undefined' || !__DEV__) return;
  try {
    const store = getStorage();
    const existing = await store.getItem(V2_KEY_PREFIX + cardId);
    if (existing !== null) return;
    await store.setItem(V2_KEY_PREFIX + cardId, JSON.stringify(spots));
  } catch {
    // Seeding is best-effort only.
  }
}

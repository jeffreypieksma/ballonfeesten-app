/**
 * Local persistence for bingo progress, keyed by card id so a future CMS card
 * (new id) starts with fresh progress.
 *
 * Format v2 stores when each balloon was spotted: `{ id, spottedAt? }[]`.
 * Records migrated from v1 (a plain `string[]` of ids) have no `spottedAt`.
 *
 * This is the only file that touches AsyncStorage. On web it is backed by
 * localStorage. AsyncStorage is a native module: on a dev client built before
 * it was installed, importing it throws — so we load it lazily and fall back
 * to in-memory storage (game works, progress just doesn't survive a restart)
 * instead of crashing. All functions are failure-proof: they never throw.
 */

export type SpotRecord = {
  id: string;
  /** ISO timestamp of the spot; absent for records migrated from v1. */
  spottedAt?: string;
};

type StorageLike = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

const memoryStore = new Map<string, string>();

const memoryFallback: StorageLike = {
  getItem: async (key) => memoryStore.get(key) ?? null,
  setItem: async (key, value) => {
    memoryStore.set(key, value);
  },
  removeItem: async (key) => {
    memoryStore.delete(key);
  },
};

let storage: StorageLike | null = null;

function getStorage(): StorageLike {
  if (storage) return storage;
  try {
    // Lazy require: the module throws at import time when the native binary
    // doesn't include it (dev client not yet rebuilt after install).
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    storage = require('@react-native-async-storage/async-storage').default as StorageLike;
  } catch {
    if (__DEV__) {
      console.warn(
        'Ballonbingo: AsyncStorage niet beschikbaar — voortgang wordt alleen in het geheugen bewaard. ' +
          'Herbouw de dev-client (npx expo run:ios / run:android) voor echte opslag.'
      );
    }
    storage = memoryFallback;
  }
  return storage;
}

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

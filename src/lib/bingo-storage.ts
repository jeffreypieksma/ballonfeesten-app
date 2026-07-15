/**
 * Local persistence for bingo progress: the set of spotted tile ids, keyed by
 * card id so a future CMS card (new id) starts with fresh progress.
 *
 * This is the only file that touches AsyncStorage. On web it is backed by
 * localStorage. AsyncStorage is a native module: on a dev client built before
 * it was installed, importing it throws — so we load it lazily and fall back
 * to in-memory storage (game works, progress just doesn't survive a restart)
 * instead of crashing. All functions are failure-proof: they never throw.
 */

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

const STORAGE_KEY_PREFIX = 'ballonbingo:spotted:v1:';

export async function loadSpottedIds(cardId: string): Promise<string[]> {
  try {
    const raw = await getStorage().getItem(STORAGE_KEY_PREFIX + cardId);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === 'string')) {
      return parsed;
    }
    return [];
  } catch {
    return [];
  }
}

export async function saveSpottedIds(cardId: string, ids: readonly string[]): Promise<void> {
  try {
    await getStorage().setItem(STORAGE_KEY_PREFIX + cardId, JSON.stringify(ids));
  } catch (error) {
    if (__DEV__) console.warn('Ballonbingo: voortgang opslaan mislukt', error);
  }
}

export async function clearSpottedIds(cardId: string): Promise<void> {
  try {
    await getStorage().removeItem(STORAGE_KEY_PREFIX + cardId);
  } catch (error) {
    if (__DEV__) console.warn('Ballonbingo: voortgang wissen mislukt', error);
  }
}

/**
 * Shared lazy loader for AsyncStorage with an in-memory fallback.
 *
 * AsyncStorage is a native module: on a dev client built before it was
 * installed, importing it throws — so we load it lazily and fall back to
 * in-memory storage (features work, data just doesn't survive a restart)
 * instead of crashing. On web it is backed by localStorage.
 */

export type StorageLike = {
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

export function getStorage(): StorageLike {
  if (storage) return storage;
  try {
    // Lazy require: the module throws at import time when the native binary
    // doesn't include it (dev client not yet rebuilt after install).
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    storage = require('@react-native-async-storage/async-storage').default as StorageLike;
  } catch {
    if (__DEV__) {
      console.warn(
        'Opslag: AsyncStorage niet beschikbaar — gegevens worden alleen in het geheugen bewaard. ' +
          'Herbouw de dev-client (npx expo run:ios / run:android) voor echte opslag.'
      );
    }
    storage = memoryFallback;
  }
  return storage;
}

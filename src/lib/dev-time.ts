import { useSyncExternalStore } from 'react';

/**
 * Dev-only simulated clock, shared across screens so Home and Programma agree
 * on the same "nu" while time-travelling. Always null in production: only the
 * DevTimeTravel control (rendered under __DEV__) ever sets it.
 */

let override: Date | null = null;
const listeners = new Set<() => void>();

export function setDevTimeOverride(value: Date | null): void {
  override = value;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Date | null {
  return override;
}

export function useDevTimeOverride(): Date | null {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

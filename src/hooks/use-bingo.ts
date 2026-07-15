import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  getBingoCard,
  getBingoSummary,
  getCompletedLines,
  getNewlyCompletedLines,
  isCardComplete,
} from '@/lib/bingo';
import { clearSpots, loadSpots, loadSpottedIds, saveSpots, type SpotRecord } from '@/lib/bingo-storage';
import type { BingoCard, BingoLine } from '@/types/bingo';

export type BingoCelebration =
  | { kind: 'line'; line: BingoLine; key: number }
  | { kind: 'card'; key: number };

export type BingoState =
  | { status: 'loading' }
  | { status: 'error'; retry: () => void }
  | {
      status: 'ready';
      card: BingoCard;
      spottedIds: string[];
      completedLines: BingoLine[];
      isComplete: boolean;
      /** Freshly spotted tile — drives the stamp-slam animation (never set on load). */
      lastSpottedId: string | null;
      toggleSpot: (tileId: string) => void;
      celebration: BingoCelebration | null;
      dismissCelebration: () => void;
      /** Dev tools + future settings: replace progress wholesale (persists). */
      setSpottedIds: (ids: string[]) => void;
      resetProgress: () => void;
    };

/**
 * Owns the bingo game state: loads the card through the `getBingoCard()` seam,
 * merges it with locally stored progress, and handles spot/un-spot with
 * optimistic updates, persistence, and celebration detection (new line / full card).
 */
export function useBingo(): BingoState {
  const [data, setData] = useState<{ card: BingoCard; spots: SpotRecord[] } | 'loading' | 'error'>(
    'loading'
  );
  const [lastSpottedId, setLastSpottedId] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<BingoCelebration | null>(null);
  const celebrationKey = useRef(0);
  // Mirrors the latest spots so rapid successive updates never read stale state.
  const spotsRef = useRef<SpotRecord[]>([]);

  const load = useCallback(() => {
    let cancelled = false;

    getBingoCard()
      .then(async (card) => {
        const stored = await loadSpots(card.id);
        if (cancelled) return;
        spotsRef.current = stored;
        setData({ card, spots: stored });
      })
      .catch(() => {
        if (!cancelled) setData('error');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => load(), [load]);

  // Called from an event handler (never from an effect), so resetting state here is fine.
  const retry = () => {
    setData('loading');
    setLastSpottedId(null);
    setCelebration(null);
    load();
  };

  if (data === 'loading') return { status: 'loading' };
  if (data === 'error') return { status: 'error', retry };

  const { card } = data;
  const currentIds = data.spots.map((spot) => spot.id);

  const applySpots = (next: SpotRecord[], options?: { spottedId?: string; celebrate?: boolean }) => {
    const nextIds = next.map((spot) => spot.id);
    const prevIds = spotsRef.current.map((spot) => spot.id);
    const before = getCompletedLines(card, prevIds);
    const after = getCompletedLines(card, nextIds);
    const wasComplete = isCardComplete(card, prevIds);
    const nowComplete = isCardComplete(card, nextIds);

    spotsRef.current = next;
    setData({ card, spots: next });
    setLastSpottedId(options?.spottedId ?? null);

    if (options?.celebrate) {
      if (nowComplete && !wasComplete) {
        celebrationKey.current += 1;
        setCelebration({ kind: 'card', key: celebrationKey.current });
      } else {
        const newLines = getNewlyCompletedLines(before, after);
        if (newLines.length > 0) {
          celebrationKey.current += 1;
          setCelebration({ kind: 'line', line: newLines[0], key: celebrationKey.current });
        }
      }
    }

    void saveSpots(card.id, next);
  };

  const toggleSpot = (tileId: string) => {
    const current = spotsRef.current;
    if (current.some((spot) => spot.id === tileId)) {
      // Un-spotting never celebrates and clears the slam target.
      applySpots(current.filter((spot) => spot.id !== tileId));
    } else {
      applySpots([...current, { id: tileId, spottedAt: new Date().toISOString() }], {
        spottedId: tileId,
        celebrate: true,
      });
    }
  };

  return {
    status: 'ready',
    card,
    spottedIds: currentIds,
    completedLines: getCompletedLines(card, currentIds),
    isComplete: isCardComplete(card, currentIds),
    lastSpottedId,
    toggleSpot,
    celebration,
    dismissCelebration: () => setCelebration(null),
    setSpottedIds: (ids) =>
      applySpots(
        ids.map((id) => spotsRef.current.find((spot) => spot.id === id) ?? { id, spottedAt: new Date().toISOString() }),
        { celebrate: true }
      ),
    resetProgress: () => {
      spotsRef.current = [];
      setData({ card, spots: [] });
      setLastSpottedId(null);
      setCelebration(null);
      void clearSpots(card.id);
    },
  };
}

/**
 * Lightweight read-only summary for the home hero. Reloads whenever the screen
 * regains focus, so spotting on the bingo tab is reflected on home immediately.
 */
export function useBingoSummary(): { found: number; total: number } | null {
  const [summary, setSummary] = useState<{ found: number; total: number } | null>(null);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      getBingoCard()
        .then(async (card) => {
          const stored = await loadSpottedIds(card.id);
          if (!cancelled) setSummary(getBingoSummary(card, stored));
        })
        .catch(() => {
          if (!cancelled) setSummary(null);
        });
      return () => {
        cancelled = true;
      };
    }, [])
  );

  return summary;
}

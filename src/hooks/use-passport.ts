import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { getBalloons, type Balloon } from '@/lib/balloons';
import { getBingoCard } from '@/lib/bingo';
import { loadSpots } from '@/lib/bingo-storage';

export type PassportStampEntry = {
  balloon: Balloon;
  /** ISO moment of the spot; absent for progress migrated from the old format. */
  spottedAt?: string;
};

export type PassportState =
  | { status: 'loading' }
  | { status: 'error'; retry: () => void }
  | {
      status: 'ready';
      /** Spotted balloons, newest first. */
      stamps: PassportStampEntry[];
      /** Not-yet-spotted balloons, in card order. */
      locked: Balloon[];
      totalPoints: number;
      found: number;
      total: number;
    };

type InternalState =
  | 'loading'
  | 'error'
  | { stamps: PassportStampEntry[]; locked: Balloon[]; totalPoints: number; found: number; total: number };

/**
 * The passport view over the balloon catalogue + stored bingo progress.
 * Reloads on tab focus so fresh spots show up as stamps immediately.
 */
export function usePassport(): PassportState {
  const [state, setState] = useState<InternalState>('loading');

  const load = useCallback(() => {
    let cancelled = false;

    Promise.all([getBalloons(), getBingoCard().then((card) => loadSpots(card.id))])
      .then(([balloons, spots]) => {
        if (cancelled) return;
        const spotById = new Map(spots.map((spot) => [spot.id, spot]));

        const stamps = balloons
          .filter((balloon) => spotById.has(balloon.id))
          .map((balloon) => ({ balloon, spottedAt: spotById.get(balloon.id)?.spottedAt }))
          .sort((a, b) => (b.spottedAt ?? '').localeCompare(a.spottedAt ?? ''));

        const locked = balloons.filter((balloon) => !spotById.has(balloon.id));
        const totalPoints = stamps.reduce((sum, stamp) => sum + (stamp.balloon.points ?? 0), 0);

        setState({ stamps, locked, totalPoints, found: stamps.length, total: balloons.length });
      })
      .catch(() => {
        if (!cancelled) setState('error');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useFocusEffect(load);

  // Called from an event handler, never from an effect.
  const retry = () => {
    setState('loading');
    load();
  };

  if (state === 'loading') return { status: 'loading' };
  if (state === 'error') return { status: 'error', retry };
  return { status: 'ready', ...state };
}

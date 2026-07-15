import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import type { Balloon } from '@/lib/balloons';
import { getBingoCards } from '@/lib/bingo';
import { loadSpots } from '@/lib/bingo-storage';
import type { BingoCard } from '@/types/bingo';

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
      /** All editions, newest first. First card = the active edition. */
      cards: BingoCard[];
      /** The edition currently shown. */
      card: BingoCard;
      /** Spotted balloons on this edition, newest first. */
      stamps: PassportStampEntry[];
      /** Not-yet-spotted balloons, in card order. */
      locked: Balloon[];
      totalPoints: number;
      found: number;
      total: number;
    };

type ReadyData = Extract<PassportState, { status: 'ready' }>;
type InternalState = 'loading' | 'error' | Omit<ReadyData, 'status'>;

/**
 * The passport view over one festival edition + stored progress. Pass a card
 * id to view an archived year; null shows the active edition. Reloads on tab
 * focus so fresh spots show up as stamps immediately.
 */
export function usePassport(selectedCardId: string | null): PassportState {
  const [state, setState] = useState<InternalState>('loading');

  const load = useCallback(() => {
    let cancelled = false;

    getBingoCards()
      .then(async (cards) => {
        const card = cards.find((candidate) => candidate.id === selectedCardId) ?? cards[0];
        const spots = await loadSpots(card.id);
        if (cancelled) return;

        const spotById = new Map(spots.map((spot) => [spot.id, spot]));
        const stamps = card.tiles
          .filter((balloon) => spotById.has(balloon.id))
          .map((balloon) => ({ balloon, spottedAt: spotById.get(balloon.id)?.spottedAt }))
          .sort((a, b) => (b.spottedAt ?? '').localeCompare(a.spottedAt ?? ''));

        const locked = card.tiles.filter((balloon) => !spotById.has(balloon.id));
        const totalPoints = stamps.reduce((sum, stamp) => sum + (stamp.balloon.points ?? 0), 0);

        setState({ cards, card, stamps, locked, totalPoints, found: stamps.length, total: card.tiles.length });
      })
      .catch(() => {
        if (!cancelled) setState('error');
      });

    return () => {
      cancelled = true;
    };
  }, [selectedCardId]);

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

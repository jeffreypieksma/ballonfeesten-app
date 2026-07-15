import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { getBalloons, type Balloon } from '@/lib/balloons';
import { getBingoCard } from '@/lib/bingo';
import { loadSpottedIds } from '@/lib/bingo-storage';

export type BalloonsState =
  | { status: 'loading' }
  | { status: 'error'; retry: () => void }
  | { status: 'ready'; balloons: Balloon[]; spottedIds: string[] };

type InternalState = 'loading' | 'error' | { balloons: Balloon[]; spottedIds: string[] };

/**
 * Loads the balloon catalogue plus the player's bingo progress (for the
 * "gespot" badges). Reloads on tab focus so a spot made on the bingo tab
 * shows up here immediately.
 */
export function useBalloons(): BalloonsState {
  const [state, setState] = useState<InternalState>('loading');

  const load = useCallback(() => {
    let cancelled = false;

    Promise.all([getBalloons(), getBingoCard().then((card) => loadSpottedIds(card.id))])
      .then(([balloons, spottedIds]) => {
        if (!cancelled) setState({ balloons, spottedIds });
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
  return { status: 'ready', balloons: state.balloons, spottedIds: state.spottedIds };
}

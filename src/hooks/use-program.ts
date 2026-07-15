import { useCallback, useEffect, useState } from 'react';

import { getProgram } from '@/lib/program';
import type { ProgramDay } from '@/types/program';

export type ProgramState =
  | { status: 'loading' }
  | { status: 'error'; retry: () => void }
  | { status: 'ready'; days: ProgramDay[] };

/**
 * Loads the festival programme through the `getProgram()` seam. This is the
 * first async boundary in the app, so the hook owns loading/error/ready state;
 * swapping the mock for a remote source later requires no changes here.
 */
export function useProgram(): ProgramState {
  const [state, setState] = useState<ProgramState>({ status: 'loading' });

  const load = useCallback(() => {
    let cancelled = false;
    setState({ status: 'loading' });

    getProgram()
      .then((days) => {
        if (!cancelled) setState({ status: 'ready', days });
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error', retry: load });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => load(), [load]);

  return state;
}

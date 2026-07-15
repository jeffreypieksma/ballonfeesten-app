import { useState } from 'react';

import type { HomeScreenStateKey } from '@/types/home';

export function useHomeScreenState() {
  const [state, setState] = useState<HomeScreenStateKey>(__DEV__ ? 'active' : 'active');

  if (!__DEV__) {
    return { state: 'active' as HomeScreenStateKey, setState: () => {} };
  }

  return { state, setState };
}

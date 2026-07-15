import { useEffect, useState } from 'react';

import { loadProfile, saveProfile, clearProfile, type Profile } from '@/lib/profile-storage';

export type ProfileState =
  | { status: 'loading' }
  | {
      status: 'ready';
      profile: Profile | null;
      saveNickname: (nickname: string) => void;
      updateNickname: (nickname: string) => void;
    };

/**
 * The local user profile. `profile` is null until onboarding completes;
 * `saveNickname` creates it (optimistic update + persist).
 * `updateNickname` updates an existing profile's nickname only (preserves onboardedAt).
 */
export function useProfile(): ProfileState {
  const [state, setState] = useState<Profile | null | 'loading'>('loading');

  useEffect(() => {
    let cancelled = false;
    loadProfile().then((profile) => {
      if (!cancelled) setState(profile);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (state === 'loading') return { status: 'loading' };

  return {
    status: 'ready',
    profile: state,
    saveNickname: (nickname: string) => {
      const profile: Profile = { nickname: nickname.trim(), onboardedAt: new Date().toISOString() };
      setState(profile);
      void saveProfile(profile);
    },
    updateNickname: (nickname: string) => {
      if (!state) {
        // Fallback to creation if profile doesn't exist (shouldn't happen in settings).
        const profile: Profile = { nickname: nickname.trim(), onboardedAt: new Date().toISOString() };
        setState(profile);
        void saveProfile(profile);
      } else {
        const profile: Profile = { ...state, nickname: nickname.trim() };
        setState(profile);
        void saveProfile(profile);
      }
    },
  };
}

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { loadProfile, saveProfile, clearProfile, type Profile } from '@/lib/profile-storage';

export type ProfileState =
  | { status: 'loading' }
  | {
      status: 'ready';
      profile: Profile | null;
      saveNickname: (nickname: string) => void;
      updateNickname: (nickname: string) => void;
      resetProfile: () => void;
    };

const ProfileContext = createContext<ProfileState | null>(null);

/**
 * Holds the local user profile for the whole app, so a nickname change (or a
 * dev reset) is instantly visible on every screen and in the onboarding gate.
 */
export function ProfileProvider({ children }: { children: ReactNode }) {
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

  const value = useMemo<ProfileState>(() => {
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
      resetProfile: () => {
        setState(null);
        void clearProfile();
      },
    };
  }, [state]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

/**
 * The local user profile. `profile` is null until onboarding completes;
 * `saveNickname` creates it (optimistic update + persist).
 * `updateNickname` updates an existing profile's nickname only (preserves onboardedAt).
 * `resetProfile` clears it, which re-triggers onboarding.
 */
export function useProfile(): ProfileState {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}

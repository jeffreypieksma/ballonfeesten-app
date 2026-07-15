import { getStorage } from '@/lib/local-storage';

/**
 * Local user profile, created once by the onboarding screen. When accounts
 * arrive later this can migrate to the backend; the shape stays this simple.
 */

export type Profile = {
  nickname: string;
  /** ISO moment the onboarding was completed. */
  onboardedAt: string;
};

const PROFILE_KEY = 'ballonfeesten:profiel:v1';

/** Pure parser — returns null for anything malformed. Unit-testable. */
export function parseProfile(raw: string | null): Profile | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      typeof (parsed as { nickname?: unknown }).nickname === 'string' &&
      (parsed as { nickname: string }).nickname.trim().length > 0 &&
      typeof (parsed as { onboardedAt?: unknown }).onboardedAt === 'string'
    ) {
      const { nickname, onboardedAt } = parsed as Profile;
      return { nickname, onboardedAt };
    }
    return null;
  } catch {
    return null;
  }
}

export async function loadProfile(): Promise<Profile | null> {
  try {
    return parseProfile(await getStorage().getItem(PROFILE_KEY));
  } catch {
    return null;
  }
}

export async function saveProfile(profile: Profile): Promise<void> {
  try {
    await getStorage().setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    if (__DEV__) console.warn('Profiel opslaan mislukt', error);
  }
}

export async function clearProfile(): Promise<void> {
  try {
    await getStorage().removeItem(PROFILE_KEY);
  } catch (error) {
    if (__DEV__) console.warn('Profiel wissen mislukt', error);
  }
}

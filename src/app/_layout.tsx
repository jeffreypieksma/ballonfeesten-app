import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { OnboardingScreen } from '@/components/onboarding/onboarding-screen';
import { useProfile } from '@/hooks/use-profile';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const profile = useProfile();

  // While the profile loads the splash overlay is still covering the app,
  // so there is no flash of the wrong state.
  const showOnboarding = profile.status === 'ready' && profile.profile === null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
      {showOnboarding && <OnboardingScreen onComplete={profile.saveNickname} />}
    </ThemeProvider>
  );
}

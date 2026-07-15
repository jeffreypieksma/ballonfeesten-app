import { Stack } from 'expo-router/stack';

// Home is the anchor so /instellingen always has Home beneath it on deep links.
export const unstable_settings = { anchor: 'index' };

export default function HomeStackLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}

import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];
  const theme = useTheme();

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>
      {/*
        disableTransparentOnScrollEdge: our screens render a fixed header above
        the ScrollView, so the scroll-edge appearance can't attach and the bar
        turns fully transparent (icons floating over photos). An opaque bar is
        the readable, brand-safe choice.
      */}
      <NativeTabs.Trigger name="index" disableTransparentOnScrollEdge>
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="programma" disableTransparentOnScrollEdge>
        <NativeTabs.Trigger.Label>Programma</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="calendar" md="event" />
      </NativeTabs.Trigger>

      {/*
        NativeTabs has no API for custom middle-tab size/shape/glow — it wraps
        a real UITabBarController / BottomNavigation. Bingo emphasis instead
        comes from the prominent "Ballonbingo" hero card on the Home screen.
        Here we only give the tab a brand-red, non-template icon so it still
        stands out inside the native bar.
      */}
      <NativeTabs.Trigger name="bingo" disableTransparentOnScrollEdge>
        <NativeTabs.Trigger.Label>Bingo</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="balloon.2.fill" md="celebration" renderingMode="original" selectedColor={theme.primary} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="ballonnen" disableTransparentOnScrollEdge>
        <NativeTabs.Trigger.Label>Ballonnen</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="balloon" md="filter_vintage" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="paspoort" disableTransparentOnScrollEdge>
        <NativeTabs.Trigger.Label>Paspoort</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="book.closed.fill" md="menu_book" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

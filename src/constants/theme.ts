/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

/**
 * Friese Ballonfeesten brand palette.
 * Primary = firebrick red (#c0272d), secondary = dark slate blue (#06397b),
 * with a gold (#fcc405) highlight — taken straight from the logo.
 */
export const Brand = {
  red: '#c0272d',
  redDark: '#9e2025',
  blue: '#06397b',
  blue2: '#2b43bb',
  gold: '#fcc405',
} as const;

export const Colors = {
  light: {
    text: '#0B2545',
    background: '#ffffff',
    backgroundElement: '#F1F5FB',
    backgroundSelected: '#E1E9F5',
    textSecondary: '#5A6B84',
  },
  dark: {
    text: '#F4F7FC',
    background: '#081426',
    backgroundElement: '#122540',
    backgroundSelected: '#1B3255',
    textSecondary: '#9DB0CC',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const BalloonColors = {
  light: {
    // Brand roles
    primary: Brand.red,
    primaryPressed: Brand.redDark,
    primarySoft: '#F7DADC',
    secondary: Brand.blue,
    secondarySoft: '#DCE7F5',
    gold: Brand.gold,
    goldSoft: '#FBE7A6',
    onBrand: '#ffffff',
    // Scenic / illustrative
    sky: '#E9F1FC',
    skyTop: Brand.blue,
    skyHorizon: '#FBE7A6',
    sunrise: Brand.gold,
    sunriseSoft: '#FBE7A6',
    balloonRed: Brand.red,
    balloonYellow: Brand.gold,
    balloonGreen: '#2F9E6F',
    balloonPurple: Brand.blue2,
    accent: Brand.blue,
    accentSoft: '#DCE7F5',
    success: '#2F9E6F',
    warning: Brand.gold,
    danger: Brand.red,
    stampBrown: Brand.red,
    cardShadow: 'rgba(6, 57, 123, 0.14)',
  },
  dark: {
    // Brand roles
    primary: '#D93B41',
    primaryPressed: '#B22F34',
    primarySoft: '#3A171A',
    secondary: '#6FA8FF',
    secondarySoft: '#16294A',
    gold: '#FFD23F',
    goldSoft: '#5A4A1E',
    onBrand: '#ffffff',
    // Scenic / illustrative
    sky: '#0E2036',
    skyTop: '#0A2E63',
    skyHorizon: '#3A2E12',
    sunrise: '#FFD23F',
    sunriseSoft: '#5A4A1E',
    balloonRed: '#E4565B',
    balloonYellow: '#FFD23F',
    balloonGreen: '#57C08C',
    balloonPurple: '#5A6BE0',
    accent: '#6FA8FF',
    accentSoft: '#16294A',
    success: '#57C08C',
    warning: '#FFD23F',
    danger: '#E4565B',
    stampBrown: '#E4565B',
    cardShadow: 'rgba(0, 0, 0, 0.45)',
  },
} as const;

export type BalloonThemeColor = keyof typeof BalloonColors.light & keyof typeof BalloonColors.dark;

export type AppThemeColor = ThemeColor | BalloonThemeColor;

/**
 * Embedded at build time by the `expo-font` config plugin (see app.json).
 * Android derives the family from the file name, iOS from the font's internal
 * name — both are `ExcludedItalic` for this file, so one constant covers both.
 */
export const HeadingFontFamily = 'ExcludedItalic';

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** Excluded Italic, used for headings */
    heading: HeadingFontFamily,
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    heading: HeadingFontFamily,
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    heading: 'var(--font-heading)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

export const Radius = {
  card: 24,
  pill: 999,
  chip: 12,
  avatar: 999,
} as const;

export const CardShadow = Platform.select({
  ios: { boxShadow: '0px 6px 16px rgba(6,57,123,0.14)' },
  android: { boxShadow: '0px 4px 10px rgba(6,57,123,0.20)' },
  default: { boxShadow: '0px 6px 16px rgba(6,57,123,0.14)' },
}) as { boxShadow: string };

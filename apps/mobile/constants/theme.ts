/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = "#B08D57";
const tintColorDark = "#C8A46B";

export const Colors = {
  light: {
    text: "#1F1F1F",
    mutedText: "#6B6B6B",
    background: "#F6F1EA",
    surface: "#FFFFFF",
    card: "#EFE7DD",
    border: "#D6C8B8",
    tint: tintColorLight,
    primary: "#B08D57",
    secondary: "#8b8d90",
    danger: "#8E3B3B",
    success: "#5E7A54",
    icon: "#6B6B6B",
    tabIconDefault: "#6B6B6B",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#F4F1EC",
    mutedText: "#B8B2AA",
    background: "#0F0F10",
    surface: "#181818",
    card: "#222222",
    border: "#3A3128",
    tint: tintColorDark,
    primary: "#8C6A43",
    secondary: "#343B45",
    danger: "#B24D4D",
    success: "#7FA36F",
    icon: "#B8B2AA",
    tabIconDefault: "#B8B2AA",
    tabIconSelected: tintColorDark,
  },
};

// const tintColorLight = '#0a7ea4';
// const tintColorDark = '#fff';

// export const Colors = {
//   light: {
//     text: '#11181C',
//     background: '#fff',
//     border: "#687076",
//     tint: tintColorLight,
//     icon: '#687076',
//     tabIconDefault: '#687076',
//     tabIconSelected: tintColorLight,
//   },
//   dark: {
//     text: '#ECEDEE',
//     background: '#151718',
//     border: "#9BA1A6",
//     tint: tintColorDark,
//     icon: '#9BA1A6',
//     tabIconDefault: '#9BA1A6',
//     tabIconSelected: tintColorDark,
//   },
// };

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { fontSize , fontFamily} from '@/constants/tokens';
import { Fonts } from '@/constants/theme';

function getFontFamily(key: keyof typeof fontFamily) {
  return Fonts[fontFamily[key]];
}

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  defaultSemiBold: {
    fontSize: fontSize.md,
    lineHeight: 24,
    fontWeight: "600",
    fontFamily: getFontFamily("body"),
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: "bold",
    lineHeight: 36,
    textAlign: "center",
    fontFamily: getFontFamily("title"),
  },
  subtitle: {
    fontSize: fontSize.lg,
    fontWeight: "bold",
    fontFamily: getFontFamily("body"),
  },
  link: {
    fontSize: fontSize.md,
    lineHeight: 30,
    fontFamily: getFontFamily("body"),
  },
  default: {
    fontSize: fontSize.md,
    lineHeight: 24,
    fontFamily: getFontFamily("body"),
  },
});

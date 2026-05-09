import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { fontSize } from '@/constants/token';

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
  default: {
    fontSize: fontSize.md,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: fontSize.md,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    lineHeight: 32,
    textAlign: "center"
  },
  subtitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
  },
  link: {
    fontSize: fontSize.md,
    lineHeight: 30,
    color: '#0a7ea4',
  },
});

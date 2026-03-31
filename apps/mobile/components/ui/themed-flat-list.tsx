import { FlatList, type FlatListProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedFlatListProps<T> = FlatListProps<T> & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedFlatList<T>({ style, lightColor, darkColor, ...otherProps }: ThemedFlatListProps<T>) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <FlatList style={[{ backgroundColor }, style]} {...otherProps} />;
}
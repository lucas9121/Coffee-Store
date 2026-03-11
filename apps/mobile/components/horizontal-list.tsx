import { StyleSheet, type FlatListProps } from "react-native";
import { ThemedFlatList } from "./themed-flat-list";

type HorizontalListProps<T> = FlatListProps<T>;

export function HorizontalList<T>(props: HorizontalListProps<T>) {
  return (
    <ThemedFlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
  },
});
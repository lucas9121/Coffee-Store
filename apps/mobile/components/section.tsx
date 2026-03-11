import { View, StyleSheet, type ViewProps } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

type SectionProps = ViewProps & {
  title: string;
};

export function Section({ title, children, style, ...otherProps }: SectionProps) {
  return(
    <ThemedView style={[styles.section, style]} {...otherProps}>
      <ThemedText type="subtitle">{title}</ThemedText>
      <ThemedView style={styles.content}>{children}</ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: 12
  },
  content:{
    gap: 12
  }
})


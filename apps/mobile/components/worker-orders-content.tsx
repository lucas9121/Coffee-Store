import { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { ThemedScrollView } from "./ui/themed-scroll-view";
import { ThemedText } from "./ui/themed-text";
import { Section } from "./section";


export function WorkerOrdersContent() {
  return (
    <ThemedScrollView contentContainerStyle={styles.screenContent}>
      <ThemedText type="title">Worker Orders</ThemedText>

      {/* <Section title="Mobile Orders">
        <ThemedText>Incoming mobile orders will appear here</ThemedText>
      </Section>

      <Section title="In-Person Orders">
        <ThemedText>Walk-up orders will appear here</ThemedText>
      </Section> */}

            <Section title="Placed">
        <ThemedText>No placed orders yet</ThemedText>
      </Section>

      <Section title="In Progress">
        <ThemedText>No orders in progress</ThemedText>
      </Section>

      <Section title="Ready">
        <ThemedText>No ready orders</ThemedText>
      </Section>
    </ThemedScrollView>
  );
};

// export function WorkerOrdersContent() {
//   return (
//     <ThemedScrollView contentContainerStyle={styles.screenContent}>
//       <ThemedText type="title">Worker Orders</ThemedText>

//       <Section title="Placed">
//         <ThemedText>No placed orders yet</ThemedText>
//       </Section>

//       <Section title="In Progress">
//         <ThemedText>No orders in progress</ThemedText>
//       </Section>

//       <Section title="Ready">
//         <ThemedText>No ready orders</ThemedText>
//       </Section>
//     </ThemedScrollView>
//   );
// };


const styles = StyleSheet.create({
  screenContent:{
    padding: 24,
    gap: 24,
  },
  categoryBlock: {
    borderTopWidth: 2,
    paddingVertical: 12,
    gap: 12,
  }
})
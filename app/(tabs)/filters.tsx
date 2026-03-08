import { ThemedText } from "@/shared/components/themed-text";
import React from "react";
import { StyleSheet, View } from "react-native";

// This screen is not used anymore since filters opens a bottom sheet
// But we keep it to avoid routing errors
export default function FiltersScreen() {
  return (
    <View style={styles.container}>
      <ThemedText>Filtry</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

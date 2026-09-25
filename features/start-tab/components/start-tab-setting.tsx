import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/shared/components/themed-text/themed-text";
import { useTheme } from "@/shared/context/ThemeContext";

import { useStartTabPreference } from "../hooks/use-start-tab-preference";
import { StartTabPreference } from "../start-tab-preference";

const OPTIONS: { value: StartTabPreference; label: string; description?: string }[] = [
  {
    value: "auto",
    label: "Automatycznie",
    description: "Plan zajęć, gdy jesteś zalogowany, w przeciwnym razie Eventuje",
  },
  { value: "schedule", label: "Plan zajęć" },
  { value: "events", label: "Eventuje" },
];

export function StartTabSetting() {
  const { colors } = useTheme();
  const { preference, setPreference } = useStartTabPreference();

  return (
    <View>
      <View style={styles.header}>
        <ThemedText style={[styles.title, { color: colors.textPrimary }]}>Ekran startowy</ThemedText>
        <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
          Zakładka, na której otwiera się aplikacja
        </ThemedText>
      </View>

      <View accessibilityRole="radiogroup">
        {OPTIONS.map((option) => {
          const isSelected = preference === option.value;
          return (
            <Pressable
              key={option.value}
              style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
              onPress={() => setPreference(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
            >
              <View style={styles.optionText}>
                <ThemedText style={[styles.optionLabel, { color: colors.textPrimary }]}>
                  {option.label}
                </ThemedText>
                {option.description && (
                  <ThemedText style={[styles.optionDescription, { color: colors.textSecondary }]}>
                    {option.description}
                  </ThemedText>
                )}
              </View>
              <View
                style={[
                  styles.radio,
                  { borderColor: isSelected ? colors.primary : colors.textSecondary },
                ]}
              >
                {isSelected && <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 4,
  },
  title: {
    fontSize: 16,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  optionPressed: {
    opacity: 0.6,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 15,
  },
  optionDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

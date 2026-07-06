import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import { ThemedText } from "@/shared/components/themed-text/themed-text";
import { useTheme } from "@/shared/context/ThemeContext";

import { styles } from "./offline-no-data-placeholder.styles";

interface OfflineNoDataPlaceholderProps {
  title: string;
  subtitle: string;
}

export const OfflineNoDataPlaceholder = ({
  title,
  subtitle,
}: OfflineNoDataPlaceholderProps) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Ionicons
        name="cloud-offline-outline"
        size={44}
        color={colors.textMuted}
      />
      <ThemedText style={[styles.title, { color: colors.textPrimary }]}>{title}</ThemedText>
      <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</ThemedText>
    </View>
  );
};

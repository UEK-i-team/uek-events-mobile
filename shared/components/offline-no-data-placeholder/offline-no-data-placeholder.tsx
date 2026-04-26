import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import { ThemedText } from "@/shared/components/themed-text/themed-text";
import { theme } from "@/shared/constants/theme";

import { styles } from "./offline-no-data-placeholder.styles";

interface OfflineNoDataPlaceholderProps {
  title: string;
  subtitle: string;
}

export const OfflineNoDataPlaceholder = ({
  title,
  subtitle,
}: OfflineNoDataPlaceholderProps) => {
  return (
    <View style={styles.container}>
      <Ionicons
        name="cloud-offline-outline"
        size={44}
        color={theme.light.textMuted}
      />
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
    </View>
  );
};

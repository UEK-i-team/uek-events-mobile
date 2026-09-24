import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { useTheme } from "@/shared/context/ThemeContext";

import { useAuth } from "../../contexts/auth-context";
import { useEndSession } from "../../hooks/use-end-session";
import { getStyles } from "./account-section.styles";

export function AccountSection() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { status } = useAuth();
  const { loggingOut, endSession } = useEndSession();

  if (status !== "authenticated" && status !== "unverified") {
    return null;
  }

  return (
    <View>
      <Text style={styles.sectionTitle}>Konto</Text>
      <Pressable
        style={styles.item}
        onPress={() => void endSession()}
        disabled={loggingOut}
      >
        <View>
          <Text style={styles.itemText}>Wyloguj</Text>
          <Text style={styles.description}>
            {status === "unverified"
              ? "Brak połączenia – sesja zostanie zakończona na tym urządzeniu"
              : "Zakończ sesję na tym urządzeniu"}
          </Text>
        </View>
        {loggingOut ? (
          <ActivityIndicator color={colors.primary} />
        ) : null}
      </Pressable>
    </View>
  );
}

import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { useTheme } from "@/shared/context/ThemeContext";

import { getStyles } from "./email-step.styles";

interface EmailStepProps {
  email: string;
  loading: boolean;
  error: string | null;
  infoMessage: string | null;
  onEmailChange: (email: string) => void;
  onSubmit: (email: string) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmailStep({
  email,
  loading,
  error,
  infoMessage,
  onEmailChange,
  onSubmit,
}: EmailStepProps) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setLocalError("Podaj adres e-mail.");
      return;
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      setLocalError("Podaj poprawny adres e-mail.");
      return;
    }

    setLocalError(null);
    onSubmit(normalizedEmail);
  };

  const displayError = localError ?? error;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plan zajęć</Text>
      <Text style={styles.subtitleLead}>
        Aby zobaczyć plan zajęc musisz potwierdzić że jesteś studentem lub pracownikiem UEK.
      </Text>
      <Text style={styles.subtitleWithoutMargin}>
        Spokojnie, u nas{" "}
        <Text style={styles.subtitleBold}>potwierdzisz to w 20 sekund</Text>
        , podając swój adres uczelniany oraz przepisując kod z maila.
      </Text>
      <Text style={styles.subtitle}>
        Twoje dane są bezpieczne,{" "}
        <Text style={styles.subtitleBold}>nie przechowujemy twoich danych</Text>
        , nawet maila!
      </Text>

      <TextInput
        key="email-input"
        style={styles.input}
        value={email}
        onChangeText={(value) => {
          setLocalError(null);
          onEmailChange(value);
        }}
        placeholder="Adres e-mail uczelniany"
        placeholderTextColor={colors.textMuted}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        editable={!loading}
        returnKeyType="send"
        onSubmitEditing={handleSubmit}
      />

      {displayError ? <Text style={styles.errorText}>{displayError}</Text> : null}
      {infoMessage ? <Text style={styles.infoText}>{infoMessage}</Text> : null}

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Wyślij kod</Text>
        )}
      </Pressable>
    </View>
  );
}

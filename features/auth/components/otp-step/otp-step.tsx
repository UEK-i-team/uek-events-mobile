import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { useTheme } from "@/shared/context/ThemeContext";

import { getStyles } from "./otp-step.styles";

interface OtpStepProps {
  email: string;
  loading: boolean;
  error: string | null;
  infoMessage: string | null;
  resendCooldown: number;
  onSubmit: (code: string) => void;
  onResend: () => void;
  onBack: () => void;
}

function sanitizeCode(value: string): string {
  return value.replace(/\D/g, "").slice(0, 6);
}

export function OtpStep({
  email,
  loading,
  error,
  infoMessage,
  resendCooldown,
  onSubmit,
  onResend,
  onBack,
}: OtpStepProps) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [code, setCode] = useState("");

  const handleChange = (value: string) => {
    setCode(sanitizeCode(value));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wpisz kod</Text>
      <Text style={styles.subtitle}>
        Wysłaliśmy 6-cyfrowy kod na{" "}
        <Text style={styles.emailHighlight}>{email}</Text>
      </Text>

      <TextInput
        key="otp-input"
        style={styles.input}
        defaultValue=""
        onChangeText={handleChange}
        placeholder="000000"
        placeholderTextColor={colors.textMuted}
        keyboardType="number-pad"
        autoComplete="sms-otp"
        maxLength={6}
        editable={!loading}
        contextMenuHidden={false}
        smartInsertDelete={false}
        autoFocus
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {infoMessage ? <Text style={styles.infoText}>{infoMessage}</Text> : null}

      <Pressable
        style={[styles.button, (loading || code.length !== 6) && styles.buttonDisabled]}
        onPress={() => onSubmit(code)}
        disabled={loading || code.length !== 6}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Potwierdź</Text>
        )}
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={onResend}
        disabled={loading || resendCooldown > 0}
      >
        <Text style={styles.secondaryButtonText}>
          {resendCooldown > 0
            ? `Wyślij ponownie za ${resendCooldown}s`
            : "Wyślij kod ponownie"}
        </Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={onBack} disabled={loading}>
        <Text style={styles.secondaryButtonText}>Zmień adres e-mail</Text>
      </Pressable>
    </View>
  );
}

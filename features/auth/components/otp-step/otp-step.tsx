import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/shared/context/ThemeContext";

import { getStyles } from "./otp-step.styles";

const CODE_LENGTH = 6;

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
  return value.replace(/\D/g, "").slice(0, CODE_LENGTH);
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
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (value: string) => {
    setCode(sanitizeCode(value));
  };

  const isResendDisabled = loading || resendCooldown > 0;

  return (
    <View style={styles.container}>
      <View style={styles.iconBadge}>
        <Ionicons name="mail-unread-outline" size={34} color={colors.primary} />
      </View>

      <Text style={styles.title}>Wpisz kod</Text>
      <Text style={styles.subtitle}>
        Wysłaliśmy 6-cyfrowy kod na{"\n"}
        <Text style={styles.emailHighlight}>{email}</Text>
      </Text>

      <View style={styles.hintCard}>
        <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
        <View style={styles.hintTextContainer}>
          <Text style={styles.hintTitle}>
            Kod przychodzi na Twoją uczelnianą skrzynkę Outlook.
          </Text>
          <Text style={styles.hintText}>
            Nie widzisz wiadomości? Sprawdź zakładkę{" "}
            <Text style={styles.hintHighlight}>„Inne”</Text> oraz folder{" "}
            <Text style={styles.hintHighlight}>„Wiadomości-śmieci”</Text>.
          </Text>
        </View>
      </View>

      <View style={styles.codeRow}>
        {Array.from({ length: CODE_LENGTH }, (_, index) => {
          const digit = code[index];
          const isActive = isFocused && index === Math.min(code.length, CODE_LENGTH - 1);
          return (
            <View
              key={index}
              style={[
                styles.codeCell,
                !!digit && styles.codeCellFilled,
                isActive && styles.codeCellActive,
                !!error && styles.codeCellError,
              ]}
            >
              <Text style={styles.codeDigit}>{digit ?? ""}</Text>
            </View>
          );
        })}
        {/* Transparent input over the cells keeps paste, autofill and the native keyboard. */}
        <TextInput
          key="otp-input"
          style={styles.hiddenInput}
          defaultValue=""
          onChangeText={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType="number-pad"
          autoComplete="sms-otp"
          textContentType="oneTimeCode"
          maxLength={CODE_LENGTH}
          editable={!loading}
          contextMenuHidden={false}
          smartInsertDelete={false}
          caretHidden
          autoFocus
          accessibilityLabel="Kod weryfikacyjny"
        />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {infoMessage ? <Text style={styles.infoText}>{infoMessage}</Text> : null}

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          (loading || code.length !== CODE_LENGTH) && styles.buttonDisabled,
        ]}
        onPress={() => onSubmit(code)}
        disabled={loading || code.length !== CODE_LENGTH}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Text style={styles.buttonText}>Potwierdź</Text>
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
          </>
        )}
      </Pressable>

      <View style={styles.secondaryActions}>
        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
          onPress={onResend}
          disabled={isResendDisabled}
        >
          <Ionicons
            name="refresh"
            size={16}
            color={isResendDisabled ? colors.textMuted : colors.primary}
          />
          <Text
            style={[
              styles.secondaryButtonText,
              isResendDisabled ? styles.secondaryButtonTextDisabled : styles.secondaryButtonTextAccent,
            ]}
          >
            {resendCooldown > 0
              ? `Wyślij ponownie za ${resendCooldown}s`
              : "Wyślij kod ponownie"}
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
          onPress={onBack}
          disabled={loading}
        >
          <Ionicons name="arrow-back" size={16} color={colors.textSecondary} />
          <Text style={styles.secondaryButtonText}>Zmień adres e-mail</Text>
        </Pressable>
      </View>
    </View>
  );
}

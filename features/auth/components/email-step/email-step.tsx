import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/shared/context/ThemeContext";

import { getStyles } from "./email-step.styles";

const heroImage = require("@/assets/images/schedule-auth.jpg");

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
  const [isFocused, setIsFocused] = useState(false);

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
      <Image source={heroImage} style={styles.hero} resizeMode="cover" />

      <Text style={styles.title}>Plan zajęć</Text>
      <Text style={styles.lead}>
        Aby zobaczyć plan zajęć, potwierdź, że jesteś studentem lub pracownikiem UEK.
      </Text>

      <View style={styles.features}>
        <FeatureRow
          icon="flash-outline"
          title="Potwierdzisz to w 20 sekund"
          description={
            <>
              Podaj swój adres uczelniany i{" "}
              <Text style={styles.featureDescriptionStrong}>przepisz kod z maila</Text>, który
              wyślemy Ci na skrzynkę.
            </>
          }
          styles={styles}
          iconColor={colors.primary}
        />
        <FeatureRow
          icon="shield-checkmark-outline"
          title="Twoje dane są bezpieczne"
          description="Nie przechowujemy twoich danych, nawet maila!"
          styles={styles}
          iconColor={colors.primary}
        />
      </View>

      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          !!displayError && styles.inputWrapperError,
        ]}
      >
        <Ionicons
          name="mail-outline"
          size={20}
          color={isFocused ? colors.primary : colors.textMuted}
        />
        <TextInput
          key="email-input"
          style={styles.input}
          value={email}
          onChangeText={(value) => {
            setLocalError(null);
            onEmailChange(value);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
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
      </View>

      {displayError ? <Text style={styles.errorText}>{displayError}</Text> : null}
      {infoMessage ? <Text style={styles.infoText}>{infoMessage}</Text> : null}

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          loading && styles.buttonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Text style={styles.buttonText}>Wyślij kod</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </>
        )}
      </Pressable>
    </View>
  );
}

interface FeatureRowProps {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  description: React.ReactNode;
  iconColor: string;
  styles: ReturnType<typeof getStyles>;
}

function FeatureRow({ icon, title, description, iconColor, styles }: FeatureRowProps) {
  return (
    <View style={styles.featureRow}>
      <View style={styles.featureIcon}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
}

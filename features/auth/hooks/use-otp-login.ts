import { useCallback, useEffect, useState } from "react";

import { AuthSessionService } from "../services/auth-session.service";
import { AuthErrorCode, OtpLoginStep } from "../types";
import {
  mapAuthError,
  shouldRestartOtpFlow,
  toOtpErrorCode,
} from "../utils/map-auth-error";

const RESEND_COOLDOWN_SECONDS = 60;

interface UseOtpLoginOptions {
  authSessionService: AuthSessionService;
}

export function useOtpLogin({ authSessionService }: UseOtpLoginOptions) {
  const [step, setStep] = useState<OtpLoginStep>("email");
  const [email, setEmail] = useState("");
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [expiresIn, setExpiresIn] = useState<number | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  useEffect(() => {
    if (resendCooldown <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendCooldown((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const resetFlow = useCallback(() => {
    setStep("email");
    setChallengeId(null);
    setExpiresIn(null);
    setError(null);
    setInfoMessage(null);
  }, []);

  const clearFlow = useCallback(() => {
    resetFlow();
    setEmail("");
    setResendCooldown(0);
  }, [resetFlow]);

  const handleAuthError = useCallback(
    (caughtError: unknown) => {
      const code = toOtpErrorCode(caughtError);
      if (shouldRestartOtpFlow(code)) {
        resetFlow();
      }

      setError(mapAuthError(code));
    },
    [resetFlow],
  );

  const submitEmail = useCallback(
    async (submittedEmail: string): Promise<boolean> => {
      const normalizedEmail = submittedEmail.trim().toLowerCase();
      setLoading(true);
      setError(null);
      setInfoMessage(null);

      try {
        const response = await authSessionService.startChallenge(normalizedEmail);

        if (!response.challengeId) {
          setEmail(normalizedEmail);
          setInfoMessage(response.message);
          return false;
        }

        setEmail(normalizedEmail);
        setChallengeId(response.challengeId);
        setExpiresIn(response.expiresIn ?? 600);
        setStep("code");
        setResendCooldown(RESEND_COOLDOWN_SECONDS);
        return true;
      } catch (caughtError) {
        handleAuthError(caughtError);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [authSessionService, handleAuthError],
  );

  const resendCode = useCallback(async () => {
    if (!email || resendCooldown > 0) {
      return;
    }

    const sent = await submitEmail(email);
    if (!sent) {
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    }
  }, [email, resendCooldown, submitEmail]);

  const submitCode = useCallback(
    async (code: string) => {
      if (!challengeId) {
        resetFlow();
        setError(mapAuthError("invalid_challenge"));
        return;
      }

      setLoading(true);
      setError(null);

      try {
        await authSessionService.verify(challengeId, code);
        // The challenge is consumed whether the session ends up authenticated
        // or unverified, so the code step must never be shown for it again.
        resetFlow();
      } catch (caughtError) {
        handleAuthError(caughtError);
      } finally {
        setLoading(false);
      }
    },
    [authSessionService, challengeId, handleAuthError, resetFlow],
  );

  const goBackToEmail = useCallback(() => {
    resetFlow();
  }, [resetFlow]);

  return {
    step,
    email,
    challengeId,
    expiresIn,
    resendCooldown,
    loading,
    error,
    infoMessage,
    setEmail,
    submitEmail,
    submitCode,
    resendCode,
    goBackToEmail,
    resetFlow,
    clearFlow,
  };
}

export type { AuthErrorCode };

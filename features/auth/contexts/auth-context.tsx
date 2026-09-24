import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AppState, AppStateStatus } from "react-native";

import { useDependencies } from "@/shared/di/DependencyProvider";

import { AuthSessionService } from "../services/auth-session.service";
import { AuthStatus, MeResponse } from "../types";

interface AuthContextValue {
  status: AuthStatus;
  user: MeResponse | null;
  isAuthenticated: boolean;
  authSessionService: AuthSessionService;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { authSessionService } = useDependencies();
  const [status, setStatus] = useState<AuthStatus>(authSessionService.getStatus());
  const [user, setUser] = useState<MeResponse | null>(authSessionService.getUser());

  useEffect(() => {
    void authSessionService.restore();
  }, [authSessionService]);

  useEffect(() => {
    return authSessionService.subscribe((nextStatus, nextUser) => {
      setStatus(nextStatus);
      setUser(nextUser);
    });
  }, [authSessionService]);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextState: AppStateStatus) => {
        if (nextState === "active") {
          void authSessionService.revalidate();
        }
      },
    );

    return () => subscription.remove();
  }, [authSessionService]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      isAuthenticated: status === "authenticated",
      authSessionService,
      logout: () => authSessionService.logout(),
    }),
    [authSessionService, status, user],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }

  return context;
}

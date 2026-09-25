import { useEffect, useRef, useState } from "react";
import { usePathname, useRootNavigationState, useRouter } from "expo-router";

import { useDependencies } from "@/shared/di/DependencyProvider";

import { parseStartTabPreference, resolveStartTab } from "../start-tab-preference";
import { startTabPreferenceStorage } from "../start-tab-storage";

/**
 * On a cold start the app lands on the events tab ("/"); switch to the
 * schedule when the start tab preference resolves to it. Runs once per launch.
 *
 * Returns whether the start tab is settled, so startup overlays can wait
 * instead of popping up on a tab the user is about to leave.
 */
export function useInitialTabRedirect(): boolean {
  const router = useRouter();
  const pathname = usePathname();
  const { authSessionService } = useDependencies();
  const isNavigationReady = Boolean(useRootNavigationState()?.key);
  const [isResolved, setIsResolved] = useState(false);

  const initialPathnameRef = useRef(pathname);
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (!isNavigationReady || hasRunRef.current) return;
    hasRunRef.current = true;

    // Opened through a deep link (e.g. a shared event): keep the requested screen.
    if (initialPathnameRef.current !== "/") {
      setIsResolved(true);
      return;
    }

    void Promise.all([startTabPreferenceStorage.get(), authSessionService.hasStoredSession()])
      .then(([storedPreference, hasSession]) => {
        const startTab = resolveStartTab(parseStartTabPreference(storedPreference), hasSession);
        // Skip if the user already moved elsewhere while the check was running.
        if (startTab === "schedule" && pathnameRef.current === "/") {
          router.navigate("/schedule");
        }
      })
      .finally(() => setIsResolved(true));
  }, [isNavigationReady, authSessionService, router]);

  return isResolved;
}

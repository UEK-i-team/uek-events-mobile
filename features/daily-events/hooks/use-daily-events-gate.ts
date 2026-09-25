import { useEffect, useRef } from "react";
import { InteractionManager } from "react-native";
import { usePathname, useRouter } from "expo-router";

import { useNewEvents } from "../contexts/new-events-context";

const EVENTS_TAB_PATHNAME = "/";

interface UseDailyEventsGateOptions {
  /** False until the start tab is settled, so nothing pops up mid-redirect. */
  enabled: boolean;
}

/**
 * Shows the new events screen once per launch, but only on the events tab:
 * users who start on the schedule see it after they open the events tab.
 */
export function useDailyEventsGate({ enabled }: UseDailyEventsGateOptions) {
  const { newEvents } = useNewEvents();
  const router = useRouter();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;
  const hasShownRef = useRef(false);

  const isOnEventsTab = pathname === EVENTS_TAB_PATHNAME;

  useEffect(() => {
    if (!enabled || !isOnEventsTab) return;
    if (hasShownRef.current || newEvents.length === 0) return;

    let timeout: ReturnType<typeof setTimeout> | undefined;
    const task = InteractionManager.runAfterInteractions(() => {
      timeout = setTimeout(() => {
        if (pathnameRef.current !== EVENTS_TAB_PATHNAME) return;
        hasShownRef.current = true;
        router.push("/daily-events");
      }, 150);
    });

    return () => {
      task.cancel();
      if (timeout) clearTimeout(timeout);
    };
  }, [enabled, isOnEventsTab, newEvents, router]);
}

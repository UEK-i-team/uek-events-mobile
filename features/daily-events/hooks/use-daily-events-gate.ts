import { useEffect, useRef } from "react";
import { InteractionManager } from "react-native";
import { useRouter } from "expo-router";

import { useNewEvents } from "../contexts/new-events-context";

export function useDailyEventsGate() {
  const { newEvents } = useNewEvents();
  const router = useRouter();
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    if (hasNavigatedRef.current) return;
    if (newEvents.length === 0) return;

    hasNavigatedRef.current = true;

    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        router.push("/daily-events");
      }, 150);
    });
  }, [newEvents, router]);
}

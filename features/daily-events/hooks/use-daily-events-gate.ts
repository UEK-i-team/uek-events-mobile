import { useContext, useEffect, useRef } from "react";
import { InteractionManager } from "react-native";
import { useRouter } from "expo-router";

import { EventContext } from "@/shared/context/EventContext/EventContext";
import { AsyncStorageService } from "@/shared/storage/async-storage-service/async-storage-service";
import { getEventsStartingToday } from "@/utils/functions/event-utils";

const lastShownStorage = new AsyncStorageService<string>(
  "daily-showcase-last-shown",
);

function getTodayKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function useDailyEventsGate() {
  const { events, status } = useContext(EventContext);
  const router = useRouter();
  const hasEvaluatedRef = useRef(false);

  useEffect(() => {
    if (hasEvaluatedRef.current) return;
    if (status !== "success" || !events) return;

    const todaysEvents = getEventsStartingToday(events);
    if (todaysEvents.length === 0) {
      hasEvaluatedRef.current = true;
      return;
    }

    hasEvaluatedRef.current = true;

    const evaluate = async () => {
      const todayKey = getTodayKey();
      // const lastShown = await lastShownStorage.get();
      // if (lastShown === todayKey) return;

      await lastShownStorage.set(todayKey);

      // Defer navigation until the initial UI has settled to avoid jank
      // from mounting the heavy showcase right as the app becomes interactive.
      InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          router.push("/daily-events");
        }, 150);
      });
    };

    evaluate();
  }, [events, status, router]);
}

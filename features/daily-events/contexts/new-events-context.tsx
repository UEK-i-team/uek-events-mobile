import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { EventContext } from "@/shared/context/EventContext/EventContext";
import { AsyncStorageService } from "@/shared/storage/async-storage-service/async-storage-service";
import { IEvent } from "@/shared/types/event";
import { safeParseDate } from "@/utils/functions/event-utils";

const knownEventIdsStorage = new AsyncStorageService<number[]>(
  "daily-showcase-known-event-ids",
);

const MAX_MONTHS_AHEAD = 2;

function isWithinShowcaseWindow(event: IEvent): boolean {
  const startDate = safeParseDate(event.start_date);
  if (!startDate) return false;

  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() + MAX_MONTHS_AHEAD);

  return startDate <= cutoff;
}

function hasEventEnded(event: IEvent): boolean {
  const endDate =
    safeParseDate(event.end_date) ?? safeParseDate(event.start_date);
  if (!endDate) return false;

  return endDate.getTime() < Date.now();
}

function isEligibleForShowcase(event: IEvent): boolean {
  return isWithinShowcaseWindow(event) && !hasEventEnded(event);
}

interface NewEventsContextType {
  newEvents: IEvent[];
}

const NewEventsContext = createContext<NewEventsContextType | undefined>(
  undefined,
);

export function NewEventsProvider({ children }: { children: React.ReactNode }) {
  const { events, status } = useContext(EventContext);
  const [newEvents, setNewEvents] = useState<IEvent[]>([]);
  const hasEvaluatedRef = useRef(false);

  useEffect(() => {
    if (hasEvaluatedRef.current) return;
    if (status !== "success" || !events) return;

    hasEvaluatedRef.current = true;

   

    const evaluate = async () => {
      const currentIds = events.map((event) => event.id);
      const knownIds = await knownEventIdsStorage.get();

      if (knownIds === null) {
        await knownEventIdsStorage.set(currentIds);
        return;
      }

      const knownSet = new Set(knownIds);
      const freshEvents = events.filter(
        (event) => !knownSet.has(event.id) && isEligibleForShowcase(event),
      );

      await knownEventIdsStorage.set(currentIds);

      if (freshEvents.length > 0) {
        setNewEvents(freshEvents);
      }
    };

    evaluate();
  }, [events, status]);

  return (
    <NewEventsContext.Provider value={{ newEvents }}>
      {children}
    </NewEventsContext.Provider>
  );
}

export function useNewEvents() {
  const context = useContext(NewEventsContext);
  if (!context) {
    throw new Error("useNewEvents must be used within NewEventsProvider");
  }
  return context;
}

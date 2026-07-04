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

const knownEventIdsStorage = new AsyncStorageService<number[]>(
  "daily-showcase-known-event-ids",
);

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
      const freshEvents = events.filter((event) => !knownSet.has(event.id));

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

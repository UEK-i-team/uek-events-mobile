import { useDependencies } from "@/shared/di/DependencyProvider";
import { IEvent } from "@/shared/types/event";
import { IDictionaries } from "@/shared/types/dictionaries";
import { createContext, useEffect, useState } from "react";

export interface IEventContext {
  events: IEvent[] | null;
  dictionaries: IDictionaries | null;
  status: "idle" | "loading" | "success" | "error";
  errorMessage?: string | null;
  toggleFavoriteEvent: (eventId: number, isFavorite: boolean) => Promise<void>;
  getEventById: (eventId: number) => IEvent | undefined;
}

const defualtEventsContext: IEventContext = {
  events: null,
  dictionaries: null,
  status: "idle",
  toggleFavoriteEvent: async () => {},
  getEventById: () => undefined,
};

export const EventContext = createContext<IEventContext>(defualtEventsContext);

export const EventContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { eventsService, favoriteEventsRepository, dictionariesRepository } = useDependencies();

  const [events, setEvents] = useState<IEvent[] | null>(null);
  const [dictionaries, setDictionaries] = useState<IDictionaries | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleFavoriteEvent = async (eventId: number, isFavorite: boolean) => {
    setEvents((prev) =>
      prev
        ? prev.map((e) => (e.id === eventId ? { ...e, isFavorite } : e))
        : null,
    );

    try {
      if (isFavorite) {
        await favoriteEventsRepository.addFavoriteEvent(eventId);
      } else {
        await favoriteEventsRepository.removeFavoriteEvent(eventId);
      }
    } catch (e) {
      setEvents((prev) =>
        prev
          ? prev.map((e) =>
              e.id === eventId ? { ...e, isFavorite: !isFavorite } : e,
            )
          : null,
      );
      console.error("Failed to toggle favorite:", e);
    }
  };

  const getEventById = (eventId: number) => {
    return events?.find((e) => e.id === eventId);
  };

  useEffect(() => {
    setStatus("loading");

    Promise.all([
      eventsService.getAllEvents(),
      dictionariesRepository.getDictionaries(),
    ])
      .then(([events, dictionaries]) => {
        setEvents(events);
        setDictionaries(dictionaries);
        setStatus("success");
      })
      .catch((error) => {
        setStatus("error");
        setErrorMessage(error.message);
      });
  }, [eventsService, dictionariesRepository]);

  return (
    <EventContext.Provider
      value={{
        events,
        dictionaries,
        status,
        errorMessage,
        toggleFavoriteEvent,
        getEventById,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

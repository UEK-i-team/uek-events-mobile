import { useDependencies } from "@/shared/di/DependencyProvider";
import { IEvent } from "@/shared/types/event";
import { createContext, useEffect, useState } from "react";

export interface IEventContext {
  events: IEvent[] | null;
  status: "idle" | "loading" | "success" | "error";
  errorMessage?: string | null;
  toggleFavoriteEvent: (eventId: string, isFavorite: boolean) => Promise<void>;
  getEventById: (eventId: string) => IEvent | undefined;
}

const defualtEventsContext: IEventContext = {
  events: null,
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
  const { eventsService, favoriteEventsRepository } = useDependencies();

  const [events, setEvents] = useState<IEvent[] | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleFavoriteEvent = async (eventId: string, isFavorite: boolean) => {
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

  const getEventById = (eventId: string) => {
    return events?.find((e) => e.id === eventId);
  };

  useEffect(() => {
    setStatus("loading");

    eventsService
      .getAllEvents()
      .then((events) => {
        setEvents(events);
        setStatus("success");
      })
      .catch((error) => {
        setStatus("error");
        setErrorMessage(error.message);
      });
  }, [eventsService]);

  return (
    <EventContext.Provider
      value={{
        events,
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

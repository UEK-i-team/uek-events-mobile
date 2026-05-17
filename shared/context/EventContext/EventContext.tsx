import NetInfo from "@react-native-community/netinfo";

import { useDependencies } from "@/shared/di/DependencyProvider";
import { OfflineNoCacheError } from "@/shared/services/get-events-services/get-events.services";
import { IEvent } from "@/shared/types/event";
import { sortEventsAscending, filterOldEvents } from "@/utils/functions/event-utils";
import { NotificationContext } from "@/features/notifications/contexts/notification-context";
import { NotificationType } from "@/features/notifications/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

export interface IEventContext {
  events: IEvent[] | null;
  status: "idle" | "loading" | "success" | "error" | "offline_no_data";
  errorMessage?: string | null;
  toggleFavoriteEvent: (eventId: number, isFavorite: boolean) => Promise<void>;
  getEventById: (eventId: number) => IEvent | undefined;
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
  const { eventsService, favoriteEventsRepository, notificationsService } = useDependencies();
  const notificationContext = useContext(NotificationContext);

  const [events, setEvents] = useState<IEvent[] | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error" | "offline_no_data"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const showNotificationRef = useRef<
    ((type: NotificationType, message: string) => void) | undefined
  >(notificationContext?.showNotification);

  useEffect(() => {
    showNotificationRef.current = notificationContext?.showNotification;
  }, [notificationContext]);

  const startedLoadingDataRef = useRef(false);

  useEffect(() => {
    if (startedLoadingDataRef.current) return;
    startedLoadingDataRef.current = true;

    setStatus("loading");

    eventsService
      .getAllEvents({
        onLateUpdate: (lateEvents) => {
          setEvents(sortEventsAscending(lateEvents));
        },
      })
      .then((events) => {
        setEvents(sortEventsAscending(events));
        setStatus("success");
      })
      .catch((error) => {
        if (error instanceof OfflineNoCacheError) {
          setStatus("offline_no_data");
          setErrorMessage(null);
          return;
        }
        setStatus("error");
        setErrorMessage(error.message);
      });
  }, [eventsService]);

  const prevConnectedRef = useRef<boolean | null>(null);
  const refetchInFlightRef = useRef<boolean>(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isOnline = state.isConnected === true;
      const previous = prevConnectedRef.current;
      prevConnectedRef.current = isOnline;

      if (previous === null) return;
      if (!(previous === false && isOnline)) return;
      if (refetchInFlightRef.current) return;


      refetchInFlightRef.current = true;
      eventsService
        .getAllEvents({
          onLateUpdate: (lateEvents) => {
            setEvents(sortEventsAscending(lateEvents));
          },
        })
        .then((freshEvents) => {
          setEvents(sortEventsAscending(freshEvents));
          setStatus("success");
          setErrorMessage(null);
          showNotificationRef.current?.("info", "Załadowano nowe wydarzenia");
        })
        .catch((error) => {
          console.error("[EventContext] Refetch on online failed", error);
        })
        .finally(() => {
          refetchInFlightRef.current = false;
        });
    });

    return unsubscribe;
  }, [eventsService]);

  const getEventById = useCallback(
    (eventId: number) => {
      return events?.find((e) => e.id === eventId);
    },
    [events],
  );

  const toggleFavoriteEvent = useCallback(
    async (eventId: number, isFavorite: boolean) => {
      const eventToSchedule = events?.find((e) => e.id === eventId);
      
      setEvents((prev) =>
        prev
          ? prev.map((e) => (e.id === eventId ? { ...e, isFavorite } : e))
          : null,
      );

      try {
        if (isFavorite) {
          await favoriteEventsRepository.addFavoriteEvent(eventId);
          if (eventToSchedule) {
            await notificationsService.scheduleEventReminder(eventToSchedule);
          }
        } else {
          await favoriteEventsRepository.removeFavoriteEvent(eventId);
          await notificationsService.cancelEventReminder(eventId);
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
    },
    [setEvents, favoriteEventsRepository, events, notificationsService],
  );

  const contextValue = useMemo(
    () => ({
      events,
      status,
      errorMessage,
      toggleFavoriteEvent,
      getEventById,
    }),
    [events, status, errorMessage, toggleFavoriteEvent, getEventById],
  );

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  );
};

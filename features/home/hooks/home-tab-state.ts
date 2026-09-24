import { IEvent } from "@/shared/types/event";
import { isSameDay, resetTime } from "@/utils/functions/date-utils";
import { safeParseDate } from "@/utils/functions/event-utils";

export interface HomeTabStateParams {
  events: IEvent[] | null | undefined;
  /** Data aktualnie oglądanego dnia (z wybranego/widocznego eventu). */
  actualSelectedDate: Date | null | undefined;
  /** Indeks „domu" — najbliższego eventu (z fallbackiem na ostatni, patrz findNearestFutureEventIndex). */
  nearestFutureEventIndex: number;
  /** Wstrzykiwalne „teraz" (ułatwia testy). Domyślnie bieżąca data. */
  now?: Date;
}

/**
 * Czy w tabbarze pokazać przycisk powrotu (zamiast „Strona główna").
 *
 * Zasada: „dom" to najbliższy NADCHODZĄCY event (dziś lub w przyszłości) — to
 * pozycja, na którą ekran startuje i na którą wraca przycisk. Przycisk powrotu
 * pojawia się, gdy oglądany dzień jest inny niż dzień „domu".
 *
 * Przypadek brzegowy (wszystkie eventy w przeszłości): `nearestFutureEventIndex`
 * jest wtedy fallbackiem na OSTATNI (przeszły) event. Takiego eventu NIE
 * traktujemy jak „dom" — punktem odniesienia staje się dzisiejsza data, dzięki
 * czemu przeszły event nie udaje „strony głównej" (naprawia fallback), a stanie
 * na dowolnym przeszłym dniu poprawnie pokazuje przycisk powrotu.
 *
 * Świadomie NIE ma tu osobnego warunku „pierwszy event listy" — wcześniej ukrywał
 * on przycisk na pierwszym (często przeszłym) evencie bez uzasadnienia.
 */
export function shouldShowReturnToToday({
  events,
  actualSelectedDate,
  nearestFutureEventIndex,
  now = new Date(),
}: HomeTabStateParams): boolean {
  const hasEvents = !!events && events.length > 0;
  if (!hasEvents || !actualSelectedDate) return false;

  const homeEvent = events![nearestFutureEventIndex];
  const homeEventDate = homeEvent ? safeParseDate(homeEvent.start_date) : null;

  // „Dom" liczy się tylko wtedy, gdy najbliższy event jest nadchodzący (dziś lub w przyszłości).
  const homeIsUpcoming =
    !!homeEventDate &&
    resetTime(homeEventDate).getTime() >= resetTime(now).getTime();

  const homeReferenceDate = homeIsUpcoming ? homeEventDate! : now;

  return !isSameDay(actualSelectedDate, homeReferenceDate);
}

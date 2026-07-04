import { IEvent } from "@/shared/types/event";

export function safeParseDate(dateStr: string | null | undefined): Date | null {
  if (!dateStr || dateStr === "null") return null;
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) return parsed;

  const parts = dateStr.split(".");
  if (parts.length === 3) {
    const day = parts[0].padStart(2, "0");
    const month = parts[1].padStart(2, "0");
    
    const yearTimeParts = parts[2].trim().split(" ");
    const year = yearTimeParts[0];
    let time = "00:00:00";
    
    if (yearTimeParts.length > 1) {
      const timeParts = yearTimeParts[1].split(":");
      const hours = timeParts[0].padStart(2, "0");
      const minutes = (timeParts[1] || "00").padStart(2, "0");
      const seconds = (timeParts[2] || "00").padStart(2, "0");
      time = `${hours}:${minutes}:${seconds}`;
    }
    
    const fallback = new Date(`${year}-${month}-${day}T${time}`);
    if (!isNaN(fallback.getTime())) return fallback;
  }
  return null;
}

export function sortEventsAscending(events: IEvent[]): IEvent[] {
  return [...events].sort((a, b) => {
    const dateA = safeParseDate(a.start_date);
    const dateB = safeParseDate(b.start_date);
    const timeA = dateA ? dateA.getTime() : 0;
    const timeB = dateB ? dateB.getTime() : 0;
    return timeA - timeB;
  });
}

export function filterOldEvents(events: IEvent[]): IEvent[] {
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  return events.filter((event) => {
    let dateToCompareStr = event.end_date;
    if (!dateToCompareStr || dateToCompareStr === "null") {
      dateToCompareStr = event.start_date;
    }

    const eventDate = safeParseDate(dateToCompareStr);
    if (!eventDate) return true; // Keep events with totally invalid dates just in case

    return eventDate >= twoWeeksAgo;
  });
}

export function getEventsStartingToday(events: IEvent[]): IEvent[] {
  const today = new Date();

  return events.filter((event) => {
    const start = safeParseDate(event.start_date);
    if (!start) return false;
    return (
      start.getFullYear() === today.getFullYear() &&
      start.getMonth() === today.getMonth() &&
      start.getDate() === today.getDate()
    );
  });
}

export function findNearestFutureEventIndex(
  events: IEvent[] | null | undefined,
): number {
  if (!events || events.length === 0) return 0;
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const index = events.findIndex((e) => {
    const eStartParsed = safeParseDate(e.start_date);
    if (!eStartParsed) return false;
    eStartParsed.setHours(0, 0, 0, 0);
    return eStartParsed >= now;
  });

  return index !== -1 ? index : events.length - 1;
}

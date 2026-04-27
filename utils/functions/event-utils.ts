import { IEvent } from "@/shared/types/event";

export function safeParseDate(dateStr: string | null | undefined): Date | null {
  if (!dateStr || dateStr === "null") return null;
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) return parsed;

  const parts = dateStr.split(".");
  if (parts.length === 3) {
    const fallback = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`);
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

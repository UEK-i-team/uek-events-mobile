export function resetTime(date: Date | string | number): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isSameDay(
  date1: Date | string | number,
  date2: Date | string | number,
): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  return (
    d1.getFullYear() === d2.getFullYear() && 
    d1.getMonth() === d2.getMonth() && 
    d1.getDate() === d2.getDate()
  );
}

export function formatMonthPL(date: Date | string | number): string {
  const d = new Date(date);
  const formatted = d.toLocaleString("pl-PL", { month: "long" });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

const DAYS_SHORT = ["niedz", "pon", "wt", "śr", "czw", "pt", "sob"];
const MONTHS_SHORT = [
  "sty",
  "lut",
  "mar",
  "kwi",
  "maj",
  "cze",
  "lip",
  "sie",
  "wrz",
  "paź",
  "lis",
  "gru",
];

export function formatEventDate(isoString: string): string {
  const date = new Date(isoString);
  const day = DAYS_SHORT[date.getDay()];
  const dayNum = date.getDate();
  const month = MONTHS_SHORT[date.getMonth()];
  return `${day} - ${dayNum} ${month}`;
}

export function formatEventTime(isoString: string): string {
  const date = new Date(isoString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

const DAYS_LOCATIVE = [
  "niedzielę",
  "poniedziałek",
  "wtorek",
  "środę",
  "czwartek",
  "piątek",
  "sobotę",
];
const PREPOSITIONS = ["W", "W", "We", "W", "W", "W", "W"];

export function formatShareEventDate(isoString: string): string {
  const date = new Date(isoString);
  const dayIndex = date.getDay();
  const day = DAYS_LOCATIVE[dayIndex];
  const prep = PREPOSITIONS[dayIndex];
  const dayNum = date.getDate();
  const month = MONTHS_SHORT[date.getMonth()];
  return `${prep} ${day} ${dayNum} ${month}`;
}

const MONTHS_POLISH_GENITIVE = [
  "Stycznia",
  "Lutego",
  "Marca",
  "Kwietnia",
  "Maja",
  "Czerwca",
  "Lipca",
  "Sierpnia",
  "Września",
  "Października",
  "Listopada",
  "Grudnia",
];

export function formatEventDateWithMonth(isoString: string): string {
  const dateObj = new Date(isoString);
  const day = dateObj.getDate();
  const month = MONTHS_POLISH_GENITIVE[dateObj.getMonth()];
  return `${day} ${month}`;
}

import { useEffect, useMemo, useState } from "react";

import { safeParseDate } from "@/utils/functions/event-utils";

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  isEnded: boolean;
  isValid: boolean;
}

export function useCountdown(
  targetDate: string | null | undefined,
  endDate?: string | null | undefined,
): Countdown {
  const target = useMemo(() => safeParseDate(targetDate), [targetDate]);
  const end = useMemo(() => safeParseDate(endDate), [endDate]);
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    if (!target) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [target]);

  return useMemo(() => {
    if (!target) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isPast: false,
        isEnded: false,
        isValid: false,
      };
    }

    const isEnded = end ? now >= end.getTime() : false;
    const diff = target.getTime() - now;

    if (diff <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isPast: true,
        isEnded,
        isValid: true,
      };
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      days,
      hours,
      minutes,
      seconds,
      isPast: false,
      isEnded: false,
      isValid: true,
    };
  }, [target, end, now]);
}

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

export function formatCountdown(countdown: Countdown): string {
  const { days, hours, minutes, seconds } = countdown;
  const base = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return days > 0 ? `${days}d ${base}` : base;
}

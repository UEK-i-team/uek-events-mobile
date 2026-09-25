export type StartTabPreference = "auto" | "schedule" | "events";
export type StartTab = "schedule" | "events";

const PREFERENCES: readonly StartTabPreference[] = ["auto", "schedule", "events"];

export function parseStartTabPreference(value: unknown): StartTabPreference {
  return PREFERENCES.includes(value as StartTabPreference) ? (value as StartTabPreference) : "auto";
}

/** "auto" opens the schedule for logged-in users and events for everyone else. */
export function resolveStartTab(preference: StartTabPreference, hasSession: boolean): StartTab {
  if (preference === "auto") return hasSession ? "schedule" : "events";
  return preference;
}

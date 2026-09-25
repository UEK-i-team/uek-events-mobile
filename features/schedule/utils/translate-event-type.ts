/** Kolory z planu w starej aplikacji: zielony wykład, pomarańcz reszta, czerwień przeniesień i rezerwacji. */
const CLASS_COLORS = {
  lecture: "#19D022",
  activity: "#FFA608",
  alert: "#FF3F1D",
  custom: "#94FCC6",
  other: "#00D2D3",
} as const;

export type ScheduleClassTypeStyle = {
  label: string;
  /** Kolor paska na karcie zajęć i odznaki typu. */
  color: string;
};

export const SCHEDULE_CLASS_TYPES: Record<string, ScheduleClassTypeStyle> = {
  UNKNOWN: {
    label: "Nieznane",
    color: CLASS_COLORS.activity,
  },
  CLASS_MOVED: {
    label: "Przeniesienie zajęć",
    color: CLASS_COLORS.alert,
  },
  COLLOQUIUM: {
    label: "Kolokwium",
    color: CLASS_COLORS.activity,
  },
  COURSE_PASS: {
    label: "Zaliczenie",
    color: CLASS_COLORS.activity,
  },
  DISCUSSION_SESSION: {
    label: "Konwersatorium",
    color: CLASS_COLORS.activity,
  },
  DISCUSSION_SESSION_CHOICE: {
    label: "Konwersatorium do wyboru",
    color: CLASS_COLORS.activity,
  },
  DISCUSSION_SESSION_E_LEARN: {
    label: "Konwersatorium e-learning",
    color: CLASS_COLORS.activity,
  },
  DISCUSSION_SESSION_REMOTE: {
    label: "Konwersatorium zdalne",
    color: CLASS_COLORS.activity,
  },
  EXAM: {
    label: "Egzamin",
    color: CLASS_COLORS.activity,
  },
  EXERCISES: {
    label: "Ćwiczenia",
    color: CLASS_COLORS.activity,
  },
  EXERCISES_CHOICE: {
    label: "Ćwiczenia do wyboru",
    color: CLASS_COLORS.activity,
  },
  EXERCISES_E_LEARN: {
    label: "Ćwiczenia e-learningowe",
    color: CLASS_COLORS.activity,
  },
  EXERCISES_REMOTE: {
    label: "Ćwiczenia zdalne",
    color: CLASS_COLORS.activity,
  },
  EXERCISES_CHOICE_REMOTE: {
    label: "Ćwiczenia do wyboru zdalne",
    color: CLASS_COLORS.activity,
  },
  FIELD_ACTIVITIES: {
    label: "Zajęcia terenowe",
    color: CLASS_COLORS.activity,
  },
  LABORATORY: {
    label: "Laboratorium",
    color: CLASS_COLORS.activity,
  },
  LABORATORY_CHOICE: {
    label: "Laboratorium do wyboru",
    color: CLASS_COLORS.activity,
  },
  LABORATORY_REMOTE: {
    label: "Laboratorium zdalne",
    color: CLASS_COLORS.activity,
  },
  E_LABORATORY: {
    label: "E-laboratorium",
    color: CLASS_COLORS.activity,
  },
  LANGUAGE_COURSE: {
    label: "Lektorat",
    color: CLASS_COLORS.activity,
  },
  LECTURE: {
    label: "Wykład",
    color: CLASS_COLORS.lecture,
  },
  LECTURE_REMOTE: {
    label: "Wykład zdalny",
    color: CLASS_COLORS.activity,
  },
  LECTURE_CHOICE: {
    label: "Wykład do wyboru",
    color: CLASS_COLORS.lecture,
  },
  LECTURE_E_LEARN: {
    label: "Wykład e-learningowy",
    color: CLASS_COLORS.activity,
  },
  LECTURE_E_LEARN_OTHER: {
    label: "Wykład e-learningowy (inne)",
    color: CLASS_COLORS.activity,
  },
  LECTURE_CHOICE_REMOTE: {
    label: "Wykład do wyboru zdalny",
    color: CLASS_COLORS.activity,
  },
  POSTGRADUATE_STUDIES: {
    label: "Studia podyplomowe",
    color: CLASS_COLORS.activity,
  },
  PROJECT: {
    label: "Projekt",
    color: CLASS_COLORS.activity,
  },
  PROJECT_REMOTE: {
    label: "Projekt zdalny",
    color: CLASS_COLORS.activity,
  },
  PROJECT_E_LEARN: {
    label: "Projekt e-learning",
    color: CLASS_COLORS.activity,
  },
  RESERVATION: {
    label: "Rezerwacja",
    color: CLASS_COLORS.alert,
  },
  RESERVATION_INITIAL: {
    label: "Wstępna rezerwacja",
    color: CLASS_COLORS.activity,
  },
  SEMINAR: {
    label: "Seminarium",
    color: CLASS_COLORS.activity,
  },
  WORKSHOP: {
    label: "Warsztaty",
    color: CLASS_COLORS.activity,
  },
  WORKSHOP_CHOICE: {
    label: "Warsztaty do wyboru",
    color: CLASS_COLORS.activity,
  },
  WORKSHOP_E_LEARN: {
    label: "Warsztaty e-learningowe",
    color: CLASS_COLORS.activity,
  },
  WORKSHOP_REMOTE: {
    label: "Warsztaty zdalne",
    color: CLASS_COLORS.activity,
  },
  PHYSICAL_EDUCATION: {
    label: "Wychowanie fizyczne",
    color: CLASS_COLORS.activity,
  },
  CUSTOM: {
    label: "Niestandardowe",
    color: CLASS_COLORS.custom,
  },
  OTHER: {
    label: "Inne",
    color: CLASS_COLORS.other,
  },
};

const FALLBACK_COLOR = CLASS_COLORS.other;

export const translateEventType = (type: string) => SCHEDULE_CLASS_TYPES[type]?.label ?? type;

export const getScheduleClassColor = (type: string) =>
  SCHEDULE_CLASS_TYPES[type]?.color ?? FALLBACK_COLOR;

// TODO: to będzie do usunięcia i refactoru

/**
 * Typy dla kategorii, lokalizacji, tagów i typów wydarzeń
 */

export enum EventCategory {
  Scientific = "SCIENTIFIC",
  Career = "CAREER",
  Cultural = "CULTURAL",
  Integration = "INTEGRATION",
  Sports = "SPORTS",
  Social = "SOCIAL",
  Official = "OFFICIAL",
  Informational = "INFORMATIONAL",
  Business = "BUSINESS",
}

export const eventCategoryTranslations: Record<EventCategory, string> = {
  [EventCategory.Scientific]: "Naukowe",
  [EventCategory.Career]: "Karierowe",
  [EventCategory.Cultural]: "Kulturalne",
  [EventCategory.Integration]: "Integracja",
  [EventCategory.Sports]: "Sport",
  [EventCategory.Social]: "Społeczne",
  [EventCategory.Official]: "Oficjalne",
  [EventCategory.Informational]: "Informacyjne",
  [EventCategory.Business]: "Biznesowe",
};

export enum EventLocation {
  OnUekCampus = "ON_UEK_CAMPUS",
  Online = "ONLINE",
  Hybrid = "HYBRID",
  OffUekCampus = "OFF_UEK_CAMPUS",
}

export const eventLocationTranslations: Record<EventLocation, string> = {
  [EventLocation.OnUekCampus]: "Na kampusie UEK",
  [EventLocation.Online]: "Online",
  [EventLocation.Hybrid]: "Hybrydowo",
  [EventLocation.OffUekCampus]: "Poza kampusem UEK",
};

export enum EventTag {
  Science = "SCIENCE",
  Research = "RESEARCH",
  Technology = "TECHNOLOGY",
  Business = "BUSINESS",
  Entrepreneurship = "ENTREPRENEURSHIP",
  Marketing = "MARKETING",
  Finance = "FINANCE",
  Law = "LAW",
  Economics = "ECONOMICS",
  Psychology = "PSYCHOLOGY",
  PoliticalScience = "POLITICAL_SCIENCE",
  Film = "FILM",
  Music = "MUSIC",
  Health = "HEALTH",
  ForeignLanguages = "FOREIGN_LANGUAGES",
  Travel = "TRAVEL",
  PersonalDevelopment = "PERSONAL_DEVELOPMENT",
  Ecology = "ECOLOGY",
}

export const eventTagTranslations: Record<EventTag, string> = {
  [EventTag.Science]: "Nauka",
  [EventTag.Research]: "Badania naukowe",
  [EventTag.Technology]: "Technologia",
  [EventTag.Business]: "Biznes",
  [EventTag.Entrepreneurship]: "Przedsiębiorczość",
  [EventTag.Marketing]: "Marketing",
  [EventTag.Finance]: "Finanse",
  [EventTag.Law]: "Prawo",
  [EventTag.Economics]: "Ekonomia",
  [EventTag.Psychology]: "Psychologia",
  [EventTag.PoliticalScience]: "Politologia",
  [EventTag.Film]: "Film",
  [EventTag.Music]: "Muzyka",
  [EventTag.Health]: "Zdrowie",
  [EventTag.ForeignLanguages]: "Języki obce",
  [EventTag.Travel]: "Podróże",
  [EventTag.PersonalDevelopment]: "Rozwój osobisty",
  [EventTag.Ecology]: "Ekologia",
};

export enum EventType {
  Lecture = "LECTURE",
  Conference = "CONFERENCE",
  Debate = "DEBATE",
  Discussion = "DISCUSSION",
  Workshop = "WORKSHOP",
  Training = "TRAINING",
  Show = "SHOW",
  JobFair = "JOB_FAIR",
  Meeting = "MEETING",
  CareerConsultation = "CAREER_CONSULTATION",
  CaseStudy = "CASE_STUDY",
  Networking = "NETWORKING",
  Concert = "CONCERT",
  Performance = "PERFORMANCE",
  Exhibition = "EXHIBITION",
  Party = "PARTY",
  Trip = "TRIP",
  Tournament = "TOURNAMENT",
  Run = "RUN",
  SportsClass = "SPORTS_CLASS",
  CharityEvent = "CHARITY_EVENT",
  Fundraiser = "FUNDRAISER",
  Volunteering = "VOLUNTEERING",
  Ceremony = "CEREMONY",
  AuthorMeeting = "AUTHOR_MEETING",
  OpenDays = "OPEN_DAY",
  Contest = "CONTEST",
  Internship = "INTERNSHIP",
  Consultation = "CONSULTATION",
  Job = "JOB",
}

export const eventTypeTranslations: Record<EventType, string> = {
  [EventType.Lecture]: "Wykład",
  [EventType.Conference]: "Konferencja",
  [EventType.Debate]: "Debata",
  [EventType.Discussion]: "Dyskusja",
  [EventType.Workshop]: "Warsztat praktyczny",
  [EventType.Training]: "Szkolenie",
  [EventType.Show]: "Pokaz",
  [EventType.JobFair]: "Targi pracy",
  [EventType.Meeting]: "Spotkanie",
  [EventType.CareerConsultation]: "Konsultacje zawodowe",
  [EventType.CaseStudy]: "Case study",
  [EventType.Networking]: "Networking",
  [EventType.Concert]: "Koncert",
  [EventType.Performance]: "Spektakl",
  [EventType.Exhibition]: "Wystawa",
  [EventType.Party]: "Impreza",
  [EventType.Trip]: "Wyjazd",
  [EventType.Tournament]: "Turniej",
  [EventType.Run]: "Bieg",
  [EventType.SportsClass]: "Zajęcia sportowe",
  [EventType.CharityEvent]: "Akcja charytatywna",
  [EventType.Fundraiser]: "Zbiórka",
  [EventType.Volunteering]: "Wolontariat",
  [EventType.Ceremony]: "Uroczystość",
  [EventType.AuthorMeeting]: "Spotkanie autorskie",
  [EventType.OpenDays]: "Dzień otwarty",
  [EventType.Contest]: "Konkurs",
  [EventType.Internship]: "Staż/Praktyka",
  [EventType.Consultation]: "Konsultacja",
  [EventType.Job]: "Praca",
};

export enum OrganizerType {
  UekAuthorities = "UEK_AUTHORITIES",
  UekUnit = "UEK_UNIT",
  ScientificCircle = "SCIENTIFIC_CIRCLE",
  StudentOrganization = "STUDENT_ORGANIZATION",
  Company = "COMPANY",
  SocialOrganization = "SOCIAL_ORGANIZATION",
  PublicInstitution = "PUBLIC_INSTITUTION",
}

export const organizerTypeTranslations: Record<OrganizerType, string> = {
  [OrganizerType.UekAuthorities]: "Władze UEK",
  [OrganizerType.UekUnit]: "Jednostka UEK",
  [OrganizerType.ScientificCircle]: "Koło Naukowe",
  [OrganizerType.StudentOrganization]: "Organizacja studencka",
  [OrganizerType.Company]: "Firma",
  [OrganizerType.SocialOrganization]: "Organizacja społeczna",
  [OrganizerType.PublicInstitution]: "Instytucja publiczna",
};

export enum RegistrationType {
  RegistrationRequired = "REGISTRATION_REQUIRED",
  FreeEntry = "FREE_ENTRY",
  PaidEntry = "PAID_ENTRY",
}

export const registrationTypeTranslations: Record<RegistrationType, string> = {
  [RegistrationType.RegistrationRequired]: "Wymagana rejestracja",
  [RegistrationType.FreeEntry]: "Wstęp wolny",
  [RegistrationType.PaidEntry]: "Wstęp płatny",
};

import { IDictionaries } from "@/shared/types/dictionaries";
import { IDictionariesRepository } from "./dictionaries-repository";

export class DictionariesRepositoryMock implements IDictionariesRepository {
  public async getDictionaries(): Promise<IDictionaries> {
    return {
      source_names: {
        MAIN_PAGE_UEK: "Strona główna UEK",
        ACK_CALENDAR: "Kalendarz ACK",
      },
      event_location: {
        CAM: "Kampus UEK",
        ONLINE: "Online",
        ONL: "Zdalnie",
        OUT: "W plenerze",
      },
      tags: {
        AI: "Sztuczna Inteligencja",
        NET: "Networking",
        Komunikacja: "Komunikacja",
        Biznes: "Biznes",
        Rozwój: "Rozwój",
        Prawo: "Prawo",
        Kariera: "Kariera",
        Przedsiębiorczość: "Przedsiębiorczość",
        Rekrutacja: "Rekrutacja",
        Praca: "Praca",
        Networking: "Networking",
        Muzyka: "Muzyka",
        Zabawa: "Zabawa",
      },
      organizer_types: {
        ACK: "ACK UEK",
        COMPANY: "Firma",
        KNR: "Koło Naukowe Rachunkowości",
        NZS: "Niezależne Zrzeszenie Studentów",
        SS: "Samorząd Studencki",
      },
      registration_types: {
        FREE: "Darmowe",
        REGISTRATION_REQUIRED: "Wymagana rejestracja",
        PAID: "Płatne",
      },
      event_types: {
        IT: "Technologie Informatyczne",
        BUSINESS: "Biznes i Zarządzanie",
        TRAINING: "Szkolenie",
        ENTERTAINMENT: "Kultura i Rozrywka",
      },
    };
  }
}

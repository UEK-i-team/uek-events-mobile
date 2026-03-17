import { IDictionaries } from "@/shared/types/dictionaries";
import { IDictionariesRepository } from "./dictionaries-repository";

export class DictionariesRepositoryMock implements IDictionariesRepository {
  public async getDictionaries(): Promise<IDictionaries> {
    return {
      categories: {
        IT: "Technologie Informatyczne",
        BUSINESS: "Biznes i Zarządzanie",
        TRAINING: "Szkolenie",
        ENTERTAINMENT: "Kultura i Rozrywka",
      },
      location_categories: {
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
      organizer_categories: {
        ACK: "ACK UEK",
        COMPANY: "Firma",
        KNR: "Koło Naukowe Rachunkowości",
        NZS: "Niezależne Zrzeszenie Studentów",
        SS: "Samorząd Studencki",
      },
      registration_categories: {
        FREE: "Darmowe",
        REGISTRATION_REQUIRED: "Wymagana rejestracja",
        PAID: "Płatne",
      },
    };
  }
}

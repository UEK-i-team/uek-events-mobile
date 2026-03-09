import { IDictionaries } from "@/shared/types/dictionaries";
import { IDictionariesRepository } from "./dictionaries-repository";

export class DictionariesRepositoryMock implements IDictionariesRepository {
  public async getDictionaries(): Promise<IDictionaries> {
    return {
      categories: {
        IT: "Technologie Informatyczne",
        BUSINESS: "Biznes i Zarządzanie",
        ENTERTAINMENT: "Kultura i Rozrywka",
      },
      location_categories: {
        CAM: "Kampus UEK",
        ONL: "Zdalnie",
        OUT: "W plenerze",
      },
      tags: {
        AI: "Sztuczna Inteligencja",
        NET: "Networking",
        Praca: "Praca",
        Networking: "Networking",
        Muzyka: "Muzyka",
        Zabawa: "Zabawa",
      },
      organizer_categories: {
        KNR: "Koło Naukowe Rachunkowości",
        NZS: "Niezależne Zrzeszenie Studentów",
        SS: "Samorząd Studencki",
      },
      registration_categories: {
        FREE: "Darmowe",
        PAID: "Płatne",
      },
    };
  }
}

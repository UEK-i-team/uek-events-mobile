import { IDictionaries } from "@/shared/types/dictionaries";
import { IDictionariesRepository } from "./dictionaries-repository";

export class DictionariesRepositoryMock implements IDictionariesRepository {
  public async getDictionaries(): Promise<IDictionaries> {
    return {
      categories: {
        IT: "Technologie Informatyczne",
        BUSINESS: "Biznes i Zarządzanie",
      },
      location_categories: {
        CAM: "Kampus UEK",
        ONL: "Zdalnie",
      },
      tags: {
        AI: "Sztuczna Inteligencja",
        NET: "Networking",
      },
      organizer_categories: {
        KNR: "Koło Naukowe Rachunkowości",
        NZS: "Niezależne Zrzeszenie Studentów",
      },
      registration_categories: {
        FREE: "Darmowe",
        PAID: "Płatne",
      },
    };
  }
}

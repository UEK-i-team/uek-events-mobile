import { DictionariesCacheService } from "@/shared/storage/dictionaries-cache-service/dictionaries-cache-service";
import { IDictionaries } from "@/shared/types/dictionaries";
import { IHttpConnector } from "../../../connectors/http-connector";

export type ApiDictionaryItem = { key: string; value: string };

export interface ApiDictionariesData {
  categories: ApiDictionaryItem[];
  location_categories: ApiDictionaryItem[];
  tags: ApiDictionaryItem[];
  organizer_categories: ApiDictionaryItem[];
  registration_categories: ApiDictionaryItem[];
}

export interface ApiDictionariesMetaData {
  version: number;
}

export interface ApiDictionariesResponse {
  data: ApiDictionariesData;
  meta_data: ApiDictionariesMetaData;
}

export interface IDictionariesRepository {
  getDictionaries(): Promise<IDictionaries>;
}

export class DictionariesRepository implements IDictionariesRepository {
  private readonly URL = "api/dictionaries";

  constructor(
    private readonly http: IHttpConnector,
    private readonly dictionariesCacheService: DictionariesCacheService,
  ) {}

  public async getDictionaries(): Promise<IDictionaries> {
    try {
      const cachedVersion =
        await this.dictionariesCacheService.getDictionariesVersion();

      const params = cachedVersion ? { version: cachedVersion } : undefined;

      const response = await this.http.get<ApiDictionariesResponse>(this.URL, {
        params,
      });

      if (response.status === 200) {
        const responseData = response.data;

        const mappedDictionaries = this.mapDictionaries(responseData.data);

        await this.dictionariesCacheService.saveDictionaries(
          mappedDictionaries,
          responseData.meta_data.version,
        );
      }

      const dictionaries =
        await this.dictionariesCacheService.getDictionaries();

      if (!dictionaries) {
        throw new Error("Dictionaries not found");
      }

      return dictionaries;
    } catch (error) {
      throw error;
    }
  }

  private mapDictionaries(dictionaries: ApiDictionariesData): IDictionaries {
    return {
      categories: dictionaries.categories.reduce(
        (acc, item) => {
          acc[item.key] = item.value;
          return acc;
        },
        {} as Record<string, string>,
      ),
      location_categories: dictionaries.location_categories.reduce(
        (acc, item) => {
          acc[item.key] = item.value;
          return acc;
        },
        {} as Record<string, string>,
      ),
      tags: dictionaries.tags.reduce(
        (acc, item) => {
          acc[item.key] = item.value;
          return acc;
        },
        {} as Record<string, string>,
      ),
      organizer_categories: dictionaries.organizer_categories.reduce(
        (acc, item) => {
          acc[item.key] = item.value;
          return acc;
        },
        {} as Record<string, string>,
      ),
      registration_categories: dictionaries.registration_categories.reduce(
        (acc, item) => {
          acc[item.key] = item.value;
          return acc;
        },
        {} as Record<string, string>,
      ),
    };
  }
}

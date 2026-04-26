import { DictionariesCacheService } from "@/shared/storage/dictionaries-cache-service/dictionaries-cache-service";
import { IDictionaries } from "@/shared/types/dictionaries";
import { IHttpConnector } from "../../../connectors/http-connector";

export type ApiDictionaryItem = { key: string; value: string };

export interface ApiDictionariesData {
  source_names: ApiDictionaryItem[];
  event_location: ApiDictionaryItem[];
  tags: ApiDictionaryItem[];
  organizer_types: ApiDictionaryItem[];
  registration_types: ApiDictionaryItem[];
  event_types: ApiDictionaryItem[];
}

export interface ApiDictionariesMetaData {
  version: number;
}

export interface ApiDictionariesResponse {
  data: ApiDictionariesData;
  meta_data: ApiDictionariesMetaData;
}

export interface IDictionariesRepository {
  getDictionariesFromCache(): Promise<IDictionaries | null>;
  fetchAndSyncDictionaries(): Promise<IDictionaries>;
}

export class DictionariesRepository implements IDictionariesRepository {
  private readonly URL = "api/tags";

  constructor(
    private readonly http: IHttpConnector,
    private readonly dictionariesCacheService: DictionariesCacheService,
  ) {}

 

  public async getDictionariesFromCache(): Promise<IDictionaries | null> {
    return this.dictionariesCacheService.getDictionaries();
  }

  public async fetchAndSyncDictionaries(): Promise<IDictionaries> {
    const cachedVersion =
      await this.dictionariesCacheService.getDictionariesVersion();

    const params = cachedVersion ? { version: cachedVersion } : undefined;

    const response = await this.http.get<ApiDictionariesResponse>(this.URL, {
      params,
    });

    if (response.status === 200 && response.data) {
      const responseData = response.data;
      const mappedDictionaries = this.mapDictionaries(responseData.data);

      await this.dictionariesCacheService.saveDictionaries(
        mappedDictionaries,
        responseData.meta_data.version,
      );
    }

    const dictionaries = await this.dictionariesCacheService.getDictionaries();

    if (!dictionaries) {
      throw new Error("Dictionaries not found");
    }

    return dictionaries;
  }

  private mapDictionaries(dictionaries: ApiDictionariesData): IDictionaries {
    const arrayToDict = (items: ApiDictionaryItem[]) =>
      items.reduce(
        (acc, item) => {
          acc[item.key] = item.value;
          return acc;
        },
        {} as Record<string, string>,
      );

    return {
      source_names: arrayToDict(dictionaries.source_names),
      event_location: arrayToDict(dictionaries.event_location),
      tags: arrayToDict(dictionaries.tags),
      organizer_types: arrayToDict(dictionaries.organizer_types),
      registration_types: arrayToDict(dictionaries.registration_types),
      event_types: arrayToDict(dictionaries.event_types),
    };
  }
}

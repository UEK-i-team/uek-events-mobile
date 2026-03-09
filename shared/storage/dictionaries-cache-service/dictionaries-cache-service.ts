import { CacheService } from "@/shared/storage/cache-service/cache-service";
import type { IDictionaries } from "@/shared/types/dictionaries";

interface CacheMetadata {
  lastCached: number;
  version: number;
}

export class DictionariesCacheService {
  private readonly dictionariesFileName = "dictionaries-data.json";
  private readonly metadataFileName = "dictionaries-metadata.json";

  constructor(private readonly disk: CacheService) {}

  public async saveDictionaries(
    data: IDictionaries,
    version: number,
  ): Promise<void> {
    await this.disk.set(this.dictionariesFileName, data);

    await this.disk.set<CacheMetadata>(this.metadataFileName, {
      lastCached: Date.now(),
      version,
    });
  }

  public async getDictionaries(): Promise<IDictionaries | null> {
    return await this.disk.get<IDictionaries>(this.dictionariesFileName);
  }

  public async getDictionariesVersion(): Promise<number | null> {
    const metadata = await this.disk.get<CacheMetadata>(this.metadataFileName);
    return metadata?.version || null;
  }

  public async clearDictionariesCache(): Promise<void> {
    await this.disk.remove(this.dictionariesFileName);
    await this.disk.remove(this.metadataFileName);
  }
}

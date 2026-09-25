import { AsyncStorageService } from "@/shared/storage/async-storage-service/async-storage-service";

export const startTabPreferenceStorage = new AsyncStorageService<unknown>("start-tab-preference");

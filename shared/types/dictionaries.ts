export type DictionaryItem = Record<string, string>;

export interface IDictionaries {
  categories: DictionaryItem;
  location_categories: DictionaryItem;
  tags: DictionaryItem;
  organizer_categories: DictionaryItem;
  registration_categories: DictionaryItem;
}

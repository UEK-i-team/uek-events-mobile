export type DictionaryItem = Record<string, string>;

export interface IDictionaries {
  source_names: DictionaryItem;
  event_location: DictionaryItem;
  tags: DictionaryItem;
  organizer_types: DictionaryItem;
  registration_types: DictionaryItem;
  event_types: DictionaryItem;
}

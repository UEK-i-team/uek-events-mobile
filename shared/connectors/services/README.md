# Cache Service

Serwis do automatycznego cache'owania danych w pamięci urządzenia używając Expo FileSystem (legacy API).

> **Uwaga**: Używamy `expo-file-system/legacy` dla kompatybilności z Expo SDK 54+. Legacy API jest stabilne i będzie wspierane długoterminowo.

## Główne funkcje

- ✅ **Automatyczne zapisywanie**: Pobrane eventy są automatycznie cache'owane
- ✅ **Offline support**: Aplikacja działa bez internetu dzięki cache
- ✅ **Brak duplikatów**: Inteligentne zarządzanie cache przy paginacji
- ✅ **Większa pojemność**: Brak limitów AsyncStorage (6MB)
- ✅ **Metadata**: Śledzenie czasu i liczby zapisanych obiektów

## Użycie

### Automatyczne (zalecane)

Cache działa automatycznie przez repozytoria - nie musisz robić nic specjalnego:

```tsx
import { useEventsRepository } from '@/shared/connectors';

const eventsRepo = useEventsRepository();

// Pobiera z API i automatycznie zapisuje w cache
const events = await eventsRepo.getEvents();

// Przy braku internetu automatycznie ładuje z cache
```

### Ręczne (zaawansowane)

```tsx
import { cacheService } from '@/shared/connectors';

// Zapisz eventy
await cacheService.saveEvents(events);

// Odczytaj z cache
const cachedEvents = await cacheService.getEvents();

// Dodaj nowe bez duplikatów
await cacheService.appendEvents(newEvents);

// Sprawdź świeżość cache
const isFresh = await cacheService.isCacheFresh(3600000); // 1h

// Pobierz info o cache
const info = await cacheService.getCacheInfo();

// Wyczyść cache
await cacheService.clearEventsCache();
```

## API

### `saveEvents(events: Event[]): Promise<void>`
Zapisuje eventy w cache (nadpisuje istniejące).

### `getEvents(): Promise<Event[] | null>`
Odczytuje eventy z cache. Zwraca `null` jeśli cache nie istnieje.

### `appendEvents(newEvents: Event[]): Promise<void>`
Dodaje nowe eventy do cache bez duplikatów (sprawdza po ID).

### `clearEventsCache(): Promise<void>`
Usuwa cache eventów i metadata.

### `isCacheFresh(maxAge: number = 3600000): Promise<boolean>`
Sprawdza czy cache jest świeży (domyślnie 1 godzina).

### `getCacheInfo(): Promise<CacheInfo>`
Zwraca informacje o cache:
```typescript
{
  exists: boolean;
  size: number;           // rozmiar w bajtach
  eventsCount: number;    // liczba eventów
  lastCached: number | null;  // timestamp
}
```

## Struktura danych

### Lokalizacja
```
FileSystem.documentDirectory/cache/
├── events-cache.json      # Tablica eventów
└── cache-metadata.json    # Metadata (timestamp, count)
```

### Format events-cache.json
```json
[
  {
    "id": "1",
    "title": "Event Title",
    "description": "...",
    ...
  },
  ...
]
```

### Format cache-metadata.json
```json
{
  "lastCached": 1699999999000,
  "eventsCount": 42
}
```

## Zalety vs AsyncStorage

| Feature | Cache Service (FileSystem) | AsyncStorage |
|---------|---------------------------|--------------|
| Max size | Brak limitu (GB) | ~6MB |
| Performance | Szybkie dla dużych plików | Wolniejsze dla dużych danych |
| Format | JSON files (czytelne) | Key-value store |
| Debugowanie | Łatwe (pliki JSON) | Trudniejsze |
| Use case | Duże ilości danych | Małe ustawienia, tokeny |

## Implementacja

Cache Service jest singletonem - jedna instancja dla całej aplikacji:

```typescript
// Singleton pattern
const cacheService = CacheService.getInstance();
```

## Best Practices

1. **Pozwól działać automatycznie**: Nie musisz ręcznie zarządzać cache w większości przypadków
2. **Sprawdzaj świeżość**: Używaj `isCacheFresh()` jeśli dane muszą być aktualne
3. **Obsługuj błędy**: Zawsze miej fallback gdy cache nie istnieje
4. **Czyść gdy potrzeba**: Wywołaj `clearEventsCache()` przy wylogowaniu lub zmianie użytkownika

## Przykład użycia w komponencie

```tsx
import { useEventsRepository } from '@/shared/connectors';
import { useState, useEffect } from 'react';

export default function EventsScreen() {
  const eventsRepo = useEventsRepository();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      setLoading(true);
      // Automatyczne cache'owanie - ładuje z API lub cache
      const data = await eventsRepo.getEvents();
      setEvents(data);
      setIsOffline(false);
    } catch (error) {
      console.error('Failed to load events:', error);
      setIsOffline(true);
      
      // Sprawdź info o cache
      const info = await eventsRepo.getCacheInfo();
      if (info.exists) {
        console.log(`Using cached data from ${new Date(info.lastCached!)}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View>
      {isOffline && (
        <Text>📱 Offline mode - showing cached data</Text>
      )}
      {/* ... render events ... */}
    </View>
  );
}
```


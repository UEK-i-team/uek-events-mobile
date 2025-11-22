# Events Connectors & Repositories

System komunikacji z backendem eventów z obsługą **prawdziwego API** oraz **mockowanych danych**.

## Struktura

```
shared/connectors/
├── context/                    # React Context do zarządzania repozytoriami
│   ├── repositories-context.tsx
│   └── index.ts
├── repositories/               # Prawdziwe repozytoria (API)
│   └── eventsRepository.ts
├── repositoriesMocks/          # Mockowane repozytoria
│   └── eventsRepository.ts
├── services/                   # Serwisy (cache, etc.)
│   ├── cache-service.ts
│   └── index.ts
├── types/                      # TypeScript typy i interfejsy
│   └── index.ts
├── http-connector.ts          # Bazowa klasa HTTP z Axios
└── index.ts                   # Główny export
```

## Szybki Start

### 1. Owijanie aplikacji w Provider

W głównym pliku layoutu (`app/_layout.tsx`):

```tsx
import { RepositoriesProvider } from '@/shared/connectors';

export default function RootLayout() {
  return (
    <RepositoriesProvider>
      {/* Twoja aplikacja */}
      <Stack>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </RepositoriesProvider>
  );
}
```

### 2. Użycie w komponencie

```tsx
import { useEventsRepository } from '@/shared/connectors';

export default function MyScreen() {
  const eventsRepo = useEventsRepository();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      const data = await eventsRepo.getEvents();
      setEvents(data);
    }
    fetchEvents();
  }, []);

  return (
    <View>
      {events.map(event => (
        <Text key={event.id}>{event.title}</Text>
      ))}
    </View>
  );
}
```

## Konfiguracja - Prawdziwe API vs Mocki

### Zmiana trybu w `app.json`

```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "https://your-api.com",
      "isApiMockEnabled": false    // ← true = mocki, false = prawdziwe API
    }
  }
}
```

**Wartości:**
- `isApiMockEnabled: false` (domyślnie) - używa prawdziwego API
- `isApiMockEnabled: true` - używa mockowanych danych

### Zmiana przez zmienną środowiskową

Możesz też użyć pliku `.env`:

```bash
IS_API_MOCK_ENABLED=true
```

## API

### Hooki

#### `useEventsRepository()`

Zwraca instancję eventsRepository (prawdziwą lub mockowaną).

```tsx
const eventsRepo = useEventsRepository();
const events = await eventsRepo.getEvents();
const filteredEvents = await eventsRepo.getEvents(1699999999);
```

#### `useRepositories()`

Zwraca obiekt z wszystkimi repozytoriami i informacją o trybie.

```tsx
const { eventsRepository, isMockEnabled } = useRepositories();

if (isMockEnabled) {
  console.log('🎭 Używasz mockowanych danych');
}
```

### Metody EventsRepository

#### `getEvents(since?: string | null, useCache?: boolean): Promise<Event[]>`

Pobiera eventy z opcjonalnym filtrem `since` w formacie ISO 8601. **Automatycznie zapisuje pobrane dane w pamięci urządzenia** i używa cache przy braku połączenia.

**Parametry:**
- `since` (opcjonalny) - ISO 8601 timestamp (np. `'2024-11-22T10:30:00Z'`) - pobierz tylko nowsze eventy
- `useCache` (opcjonalny, domyślnie `true`) - Czy użyć cache przy braku połączenia

**Przykłady:**
```tsx
// Wszystkie eventy (zapisywane w cache)
const events = await eventsRepo.getEvents();

// Tylko eventy nowsze niż określona data (dodawane do cache)
const newEvents = await eventsRepo.getEvents('2024-11-22T10:30:00Z');

// Pobierz bez używania cache (wymusza błąd przy braku połączenia)
const freshEvents = await eventsRepo.getEvents(null, false);

// Automatyczne odświeżanie - pobierz od najnowszego w cache
import { cacheService } from '@/shared/connectors';
const newestDate = await cacheService.getNewestEventDate();
if (newestDate) {
  const freshEvents = await eventsRepo.getEvents(newestDate);
}
```

#### `clearCache(): Promise<void>`

Czyści cache eventów z pamięci urządzenia.

```tsx
await eventsRepo.clearCache();
```

#### `getCacheInfo(): Promise<CacheInfo>`

Pobiera informacje o cache (rozmiar, liczba eventów, data ostatniego cache'owania).

```tsx
const info = await eventsRepo.getCacheInfo();
console.log(`Cache size: ${info.size} bytes, Events: ${info.eventsCount}`);
```

## Cache Service (Automatyczne zapisywanie w pamięci)

System automatycznie zapisuje pobrane eventy w pamięci urządzenia używając **Expo FileSystem**. Cache działa transparentnie - nie musisz się o niego martwić.

### Jak działa?

1. **Automatyczne zapisywanie**: Każde pobrane eventy są automatycznie zapisywane w pamięci urządzenia
2. **Brak połączenia**: Gdy nie ma internetu, automatycznie ładowane są dane z cache
3. **Paginacja**: Nowe eventy są dodawane do cache (bez duplikatów)
4. **Przechowywanie**: Dane zapisywane są w `FileSystem.documentDirectory/cache/`

### Przykłady użycia Cache Service

```tsx
import { cacheService } from '@/shared/connectors';

// Ręczne zapisanie eventów
await cacheService.saveEvents(events);

// Odczytanie eventów z cache
const cachedEvents = await cacheService.getEvents();

// Dodanie nowych eventów bez duplikatów
await cacheService.appendEvents(newEvents);

// Sprawdzenie czy cache jest świeży (młodszy niż 1 godzina)
const isFresh = await cacheService.isCacheFresh(60 * 60 * 1000);

// Informacje o cache
const info = await cacheService.getCacheInfo();
console.log('Cache info:', {
  exists: info.exists,
  size: info.size,
  eventsCount: info.eventsCount,
  lastCached: new Date(info.lastCached!)
});

// Wyczyszczenie cache
await cacheService.clearEventsCache();
```

### Struktura plików cache

```
FileSystem.documentDirectory/
└── cache/
    ├── events-cache.json      # Zapisane eventy
    └── cache-metadata.json    # Metadata (data, liczba eventów)
```

### Zalety FileSystem vs AsyncStorage

- ✅ **Większa pojemność**: Brak limitu 6MB jak w AsyncStorage
- ✅ **Lepsze dla dużych danych**: Optymalizowane dla plików
- ✅ **Czytelne pliki JSON**: Łatwe do debugowania
- ✅ **Metadata**: Śledzenie kiedy cache był aktualizowany

## Automatyczne odświeżanie przy wejściu do aplikacji

System automatycznie pobiera nowe eventy przy każdym wejściu (focus) do aplikacji:

### Hook: `useAutoRefreshEvents`

```tsx
import { useAutoRefreshEvents } from '@/shared/connectors';

function MyScreen() {
  const { 
    events,       // Wszystkie eventy (z cache + nowe)
    loading,      // Pierwsze ładowanie
    isRefreshing, // Odświeżanie w tle
    refresh,      // Ręczne odświeżenie
    error 
  } = useAutoRefreshEvents();

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
      }
    >
      {events.map(event => <EventCard key={event.id} event={event} />)}
    </ScrollView>
  );
}
```

### Jak to działa?

1. **Pierwszy launch**: Pobiera wszystkie eventy (bez `since`)
2. **Kolejne wejścia**: Pobiera tylko nowe eventy używając `since=<najnowszy event z cache>`
3. **Bez internetu**: Automatycznie ładuje z cache
4. **App focus**: Wykrywa powrót do aplikacji i odświeża w tle

### API format

```
GET /api/events/                           → Wszystkie eventy
GET /api/events/?since=2024-11-22T10:30:00Z → Tylko nowsze niż ta data
```

Więcej informacji w [AUTO_REFRESH_IMPLEMENTATION.md](../../AUTO_REFRESH_IMPLEMENTATION.md).

## Tworzenie własnych repozytoriów

### 1. Dodaj interfejs do `types/index.ts`

```typescript
export interface IEventsRepository {
  getEvents(): Promise<Event[]>;
  getEventById(id: number): Promise<Event>;
}
```

### 2. Stwórz prawdziwe repozytorium

`repositories/eventsRepository.ts`:

```typescript
import { HttpConnector } from '../http-connector';
import type { IEventsRepository } from '../types';

export class EventsRepository extends HttpConnector implements IEventsRepository {
  private static instance: EventsRepository;

  private constructor() {
    const baseURL = process.env.API_BASE_URL || 'https://api.example.com';
    super(baseURL, { maxRetries: 3, retryDelay: 1000 });
  }

  public static getInstance(): EventsRepository {
    if (!EventsRepository.instance) {
      EventsRepository.instance = new EventsRepository();
    }
    return EventsRepository.instance;
  }

  public async getEvents(): Promise<Event[]> {
    const response = await this.get<Event[]>('/events');
    return response.data;
  }
}

export const eventsRepository = EventsRepository.getInstance();
```

### 3. Stwórz mockowe repozytorium

`repositoriesMocks/eventsRepository.ts`:

```typescript
import type { IEventsRepository } from '../types';

export class MockEventsRepository implements IEventsRepository {
  private static instance: MockEventsRepository;

  private constructor() {}

  public static getInstance(): MockEventsRepository {
    if (!MockEventsRepository.instance) {
      MockEventsRepository.instance = new MockEventsRepository();
    }
    return MockEventsRepository.instance;
  }

  public async getEvents(): Promise<Event[]> {
    // Symuluj opóźnienie
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      { id: 1, title: 'Mock Event 1', date: '2024-01-01' },
      { id: 2, title: 'Mock Event 2', date: '2024-01-02' },
    ];
  }
}

export const mockEventsRepository = MockEventsRepository.getInstance();
```

### 4. Dodaj do kontekstu

W `context/repositories-context.tsx`:

```typescript
interface RepositoriesContextValue {
  postsRepository: IPostsRepository;
  eventsRepository: IEventsRepository; // ← dodaj
  isMockEnabled: boolean;
}

// W RepositoriesProvider:
return {
  postsRepository: isMockEnabled ? mockPostsRepository : postsRepository,
  eventsRepository: isMockEnabled ? mockEventsRepository : eventsRepository,
  isMockEnabled,
};
```

### 5. Stwórz hook

```typescript
export function useEventsRepository(): IEventsRepository {
  const { eventsRepository } = useRepositories();
  return eventsRepository;
}
```

## Korzyści z tego podejścia

### ✅ Dla Developmentu

- **Szybki rozwój** - pracuj z mockami bez uruchamiania backendu
- **Testowanie UI** - testuj różne stany bez konieczności tworzenia danych w API
- **Offline development** - pracuj bez połączenia z internetem
- **Predyktywalne dane** - zawsze te same dane do testów

### ✅ Dla Testów

- **Unit testy** - łatwo mockuj repozytoria
- **Integration testy** - przełączaj się między prawdziwym API a mockami
- **Consistent data** - zawsze te same dane testowe

### ✅ Dla Produkcji

- **Clean code** - ten sam interface dla prawdziwych i mockowanych danych
- **Type safety** - TypeScript wymusza spójność między API a mockami
- **Easy switching** - jedna zmienna do przełączania trybów

## Przykłady użycia

### Hook z loading i error handling

```tsx
function usePostsData() {
  const postsRepo = usePostsRepository();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await postsRepo.getPosts();
        setPosts(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [postsRepo]);

  return { posts, loading, error };
}
```

### Komponent z paginacją

```tsx
function PostsList() {
  const postsRepo = usePostsRepository();
  const [posts, setPosts] = useState([]);
  const [lastDate, setLastDate] = useState(null);

  const loadMore = async () => {
    const newPosts = await postsRepo.getPosts(lastDate);
    setPosts(prev => [...prev, ...newPosts]);
    
    if (newPosts.length > 0) {
      setLastDate(newPosts[newPosts.length - 1].timestamp);
    }
  };

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => <PostCard post={item} />}
      onEndReached={loadMore}
    />
  );
}
```

### Sprawdzanie trybu w komponencie

```tsx
function DebugInfo() {
  const { isMockEnabled } = useRepositories();

  return (
    <View>
      <Text>Tryb: {isMockEnabled ? '🎭 Mock' : '🌐 API'}</Text>
    </View>
  );
}
```

## Troubleshooting

### Błąd: "useRepositories must be used within a RepositoriesProvider"

**Problem:** Hook został użyty poza providerem.

**Rozwiązanie:** Upewnij się że `<RepositoriesProvider>` owijuje całą aplikację w `_layout.tsx`.

### Mocki nie działają mimo ustawienia `isApiMockEnabled: true`

**Problem:** Aplikacja nie odczytuje zmian w `app.json`.

**Rozwiązanie:** Zrestartuj dev server (`expo start --clear`).

### TypeScript pokazuje błędy w mockach

**Problem:** Mock nie implementuje wszystkich metod z interfejsu.

**Rozwiązanie:** Upewnij się że mock implementuje `IPostsRepository` i ma wszystkie wymagane metody.


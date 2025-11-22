# Integracja z API

Dokumentacja opisująca integrację z backendem UEK Events API.

## Format odpowiedzi API

### Sukces (z danymi)

```json
{
  "status": "success",
  "count": 2,
  "data": [
    {
      "id": 14,
      "create_date": "2025-11-22T17:10:01.387140Z",
      "event_date_start": "2025-11-26T10:00:00Z",
      "event_date_end": "2025-11-26T10:30:00Z",
      "title": "Nowości na platformach EBSCO",
      "short_desc": "Opis wydarzenia...",
      "hash": "737c2852_1d4e37753d6cbda1",
      "event_category": "INFORMATIONAL",
      "event_type": "TRAINING",
      "location": "Online",
      "location_category": "ONLINE",
      "organisators": "EBSCO",
      "organisators_category": "EXTERNAL",
      "tags": "EBSCO,PLATFORM,LIBRARY",
      "topics": "Citations Counts, AI Insights...",
      "image_url": "https://bg.uek.krakow.pl/...",
      "origin_url": "https://bg.uek.krakow.pl/...",
      "availability": null,
      "registration_type": "REQUIRED",
      "source_name": "BIBLIOTEKA_UEK"
    }
  ]
}
```

### Brak nowych eventów

```json
{
  "status": "success",
  "count": 0,
  "data": []
}
```

## Mapowanie pól API → Model aplikacji

| Pole API | Pole Event | Transformacja |
|----------|-----------|---------------|
| `id` (number) | `id` (string) | `String(id)` |
| `create_date` | `createdAt` | Bez zmian (ISO 8601) |
| `event_date_start` | `date` | Format: "26 lis" |
| `event_date_start` | `time` | Format: "10:00" |
| `title` | `title` | Bez zmian |
| `short_desc` | `description` | Bez zmian |
| `image_url` | `image` | Bez zmian |
| `location` | `location` | Bez zmian |
| `tags` (string) | `tags` (array) | Split by comma, map do EventTag[] |
| `organisators` | `organizer` | Bez zmian |
| `event_type` | `eventType` | Map do EventType enum |
| `event_category` | `eventCategory` | Map do EventCategory enum |
| `location_category` | `eventLocation` | Map do EventLocation enum |
| `availability` | `availableSpots` | Bez zmian |
| `registration_type` | `requiresRegistration` | `=== "REQUIRED"` |
| `origin_url` | `originalLink` | Bez zmian |
| `event_category` | `cardColor` | Map do kolorów |

## EventMapper

Klasa `EventMapper` automatycznie konwertuje dane z API na model aplikacji.

### Użycie

```typescript
import { EventMapper } from '@/shared/connectors';
import type { ApiEvent } from '@/shared/connectors';

// Pojedynczy event
const event = EventMapper.toEvent(apiEvent);

// Tablica eventów
const events = EventMapper.toEvents(apiEventsArray);
```

### Mapowanie enumów

#### Event Type

| API | Aplikacja |
|-----|-----------|
| `WORKSHOP` | `EventType.Workshop` |
| `TRAINING` | `EventType.Workshop` |
| `LECTURE` | `EventType.Lecture` |
| `CONFERENCE` | `EventType.Conference` |
| `TOURNAMENT` | `EventType.Tournament` |
| `MEETING` | `EventType.Meeting` |
| `EXHIBITION` | `EventType.Exhibition` |
| `OTHER` | `EventType.Other` |

#### Event Category

| API | Aplikacja |
|-----|-----------|
| `SCIENTIFIC` | `EventCategory.Scientific` |
| `INFORMATIONAL` | `EventCategory.Scientific` |
| `CULTURAL` | `EventCategory.Cultural` |
| `SPORTS` | `EventCategory.Sports` |
| `SOCIAL` | `EventCategory.Social` |
| `CAREER` | `EventCategory.Career` |
| `OTHER` | `EventCategory.Other` |

#### Event Location

| API | Aplikacja |
|-----|-----------|
| `ON_UEK_CAMPUS` | `EventLocation.OnUekCampus` |
| `ONLINE` | `EventLocation.Online` |
| `OUTSIDE_UEK` | `EventLocation.OutsideUek` |
| `HYBRID` | `EventLocation.Hybrid` |

#### Tags

Tagi są przekazywane jako string rozdzielony przecinkami: `"TECHNOLOGY,SCIENCE,BUSINESS"`.

Mapowanie:

| API Tag | EventTag |
|---------|----------|
| `TECHNOLOGY` | `EventTag.Technology` |
| `SCIENCE` | `EventTag.Science` |
| `BUSINESS` | `EventTag.Business` |
| `ART` | `EventTag.Art` |
| `SPORT` | `EventTag.Sport` |
| `ENTREPRENEURSHIP` | `EventTag.Entrepreneurship` |
| `PERSONAL_DEVELOPMENT` | `EventTag.PersonalDevelopment` |
| `RESEARCH` | `EventTag.Research` |
| `NETWORKING` | `EventTag.Networking` |
| `LIBRARY` | `EventTag.Technology` |
| `EBSCO` | `EventTag.Technology` |
| `PLATFORM` | `EventTag.Technology` |
| `LAW` | `EventTag.Business` |
| `SOFTWARE` | `EventTag.Technology` |
| `TRAINING` | `EventTag.PersonalDevelopment` |

### Formatowanie dat

```typescript
// Input: "2025-11-26T10:00:00Z"
// Output date: "26 lis"
// Output time: "10:00"
```

Miesiące w języku polskim:
`sty, lut, mar, kwi, maj, cze, lip, sie, wrz, paź, lis, gru`

### Kolory kart

Kolory przypisywane na podstawie `event_category`:

| Kategoria | Kolor hex | Opis |
|-----------|-----------|------|
| `SCIENTIFIC` | `#E8F5E9` | Jasny zielony |
| `INFORMATIONAL` | `#E3F2FD` | Jasny niebieski |
| `CULTURAL` | `#F3E5F5` | Jasny fioletowy |
| `SPORTS` | `#FFF3E0` | Jasny pomarańczowy |
| `SOCIAL` | `#FCE4EC` | Jasny różowy |
| `CAREER` | `#E0F2F1` | Jasny turkusowy |
| Inne | `#F5F5F5` | Szary |

## EventsRepository

Repository automatycznie używa `EventMapper` do konwersji danych.

### Pobieranie eventów

```typescript
import { eventsRepository } from '@/shared/connectors';

// Wszystkie eventy
const events = await eventsRepository.getEvents();

// Tylko nowsze niż określona data
const newEvents = await eventsRepository.getEvents('2024-11-22T10:30:00Z');
```

### Obsługa pustych odpowiedzi

Gdy `count === 0` i `data === []`:

1. **Pierwsze pobranie (bez since)**:
   - Próbuje załadować z cache
   - Jeśli brak cache, zwraca `[]`

2. **Odświeżanie (z since)**:
   - Zwraca `[]` (brak nowych eventów)
   - Cache pozostaje niezmieniony

### Logi

```
✅ Fetched 2 events from API
💾 Saved 2 events to cache
```

```
ℹ️ No new events from API
📦 No new events, returning cache
```

## Typy TypeScript

### ApiEventsResponse

```typescript
interface ApiEventsResponse {
  status: string;
  count: number;
  data: ApiEvent[];
}
```

### ApiEvent

```typescript
interface ApiEvent {
  id: number;
  create_date: string;
  event_date_start: string;
  event_date_end: string | null;
  title: string;
  short_desc: string;
  hash: string;
  event_category: string;
  event_type: string;
  location: string;
  location_category: string;
  organisators: string;
  organisators_category: string;
  tags: string;
  topics: string;
  image_url: string | null;
  origin_url: string;
  availability: number | null;
  registration_type: string;
  source_name: string;
}
```

## Testowanie

### Z prawdziwym API

Upewnij się że `.env` ma:

```bash
EXPO_PUBLIC_API_BASE_URL=https://api.uek-events.com
EXPO_PUBLIC_IS_API_MOCK_ENABLED=false
```

### Z mockiem

```bash
EXPO_PUBLIC_IS_API_MOCK_ENABLED=true
```

Mock nadal używa starych danych (będzie zwracał mockowane eventy w starym formacie).

## Rozszerzanie mappera

Jeśli API doda nowe pola:

1. Dodaj pole do `ApiEvent` w `types/api-types.ts`
2. Zaktualizuj `EventMapper.toEvent()` w `mappers/event-mapper.ts`
3. Dodaj mapowanie enumów jeśli potrzebne

## Debugging

Sprawdź console logi:

```typescript
console.log('✅ Fetched X events from API');
console.log('ℹ️ No new events from API');
console.log('➕ Added X new events to cache');
console.log('💾 Saved X events to cache');
```

Sprawdź raw response API:

```typescript
const response = await eventsRepository.getEvents();
console.log('Raw API response:', JSON.stringify(response, null, 2));
```


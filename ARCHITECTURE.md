# Architektura Projektu UEK Events Mobile

## 📁 Struktura Projektu

Projekt używa **Feature-Based Architecture**, gdzie kod jest organizowany według funkcjonalności biznesowych, a nie według typu pliku.

```
uek-events-mobile/
├── app/                          # Expo Router - routing aplikacji
│   ├── (tabs)/                   # Nawigacja tabularna
│   │   ├── index.tsx            # Ekran główny (Home)
│   │   ├── saved.tsx            # Zapisane wydarzenia
│   │   ├── filters.tsx          # Filtry
│   │   └── profile.tsx          # Profil
│   ├── event/                   
│   │   └── [id].tsx             # Szczegóły wydarzenia
│   └── _layout.tsx              # Główny layout
│
├── features/                     # Funkcjonalności biznesowe
│   ├── home/                    # 📱 Ekran główny
│   │   ├── components/          
│   │   │   ├── event-card.tsx
│   │   │   ├── filter-button.tsx
│   │   │   ├── home-header.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── use-home-screen.ts
│   │   │   └── index.ts
│   │   ├── constants/
│   │   │   ├── events.ts
│   │   │   └── index.ts
│   │   └── README.md
│   │
│   ├── filters/                 # 🔍 Filtry
│   │   ├── components/
│   │   │   ├── filters-bottom-sheet.tsx
│   │   │   └── index.ts
│   │   ├── contexts/
│   │   │   ├── filters-context.tsx
│   │   │   └── index.ts
│   │   └── README.md
│   │
│   ├── saved/                   # 💾 Zapisane wydarzenia
│   │   └── components/
│   │
│   ├── profile/                 # 👤 Profil użytkownika
│   │   └── components/
│   │
│   └── README.md
│
├── shared/                       # Współdzielone zasoby
│   ├── components/              # Komponenty UI
│   │   ├── themed-text.tsx
│   │   ├── themed-view.tsx
│   │   ├── ui/                 # Niskopoziomowe komponenty
│   │   │   ├── icon-symbol.tsx
│   │   │   ├── svg-icon.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── hooks/                   # Custom React hooki
│   │   ├── use-color-scheme.ts
│   │   ├── use-theme-color.ts
│   │   └── index.ts
│   ├── types/                   # Typy TypeScript
│   │   ├── event.ts
│   │   └── index.ts
│   ├── constants/               # Stałe i konfiguracja
│   │   ├── theme.ts
│   │   └── index.ts
│   └── README.md
│
└── assets/                       # Zasoby statyczne
    ├── icons/
    └── images/
```

## 🎯 Zasady Organizacji

### 1. Feature-Based Structure

Każda funkcjonalność biznesowa ma własny folder w `/features`:

```typescript
features/
  feature-name/
    components/     // Komponenty UI specyficzne dla tej funkcjonalności
    hooks/          // Custom hooki używane tylko tutaj
    constants/      // Stałe i konfiguracja
    contexts/       // React contexts (jeśli potrzebne)
    types/          // Typy TypeScript (jeśli potrzebne)
    utils/          // Funkcje pomocnicze (jeśli potrzebne)
    index.ts        // Publiczny API modułu
    README.md       // Dokumentacja
```

### 2. Shared Resources

Wspólne zasoby używane w wielu miejscach znajdują się w `/shared`:

- ✅ **Komponenty UI** - reużywalne w całej aplikacji
- ✅ **Custom hooki** - logika używana w wielu features
- ✅ **Typy** - definicje TypeScript współdzielone
- ✅ **Stałe** - konfiguracja globalna (motywy, kolory)

### 3. Import Paths

Używamy alias path `@/` dla wszystkich importów:

```typescript
// ✅ Poprawnie - importy z features
import { EventCard } from '@/features/home/components/event-card';
import { EXAMPLE_EVENTS } from '@/features/home/constants/events';

// ✅ Poprawnie - importy ze shared
import { ThemedText } from '@/shared/components/themed-text';
import { useColorScheme } from '@/shared/hooks/use-color-scheme';
import { Event } from '@/shared/types/event';

// ✅ Jeszcze lepiej - używając index.ts
import { EventCard } from '@/features/home/components';
import { ThemedText } from '@/shared/components';
```

### 4. Index Files

Każdy folder z komponentami ma plik `index.ts` eksportujący publiczne API:

```typescript
// features/home/components/index.ts
export { EventCard } from './event-card';
export { FilterButton } from './filter-button';
export { HomeHeader } from './home-header';
```

Dzięki temu importy są prostsze:

```typescript
// Zamiast:
import { EventCard } from '@/features/home/components/event-card';
import { FilterButton } from '@/features/home/components/filter-button';

// Możemy:
import { EventCard, FilterButton } from '@/features/home/components';
```

## 📦 Dependency Rules

### Zasady zależności między modułami:

1. **Features NIE mogą importować z innych features**
   ```typescript
   // ❌ Źle
   import { EventCard } from '@/features/home/components';
   ```

2. **Features MOGĄ importować ze shared**
   ```typescript
   // ✅ Dobrze
   import { ThemedText } from '@/shared/components';
   ```

3. **Shared NIE może importować z features**
   ```typescript
   // ❌ Źle
   import { useHomeScreen } from '@/features/home/hooks';
   ```

4. **App może importować z features i shared**
   ```typescript
   // ✅ Dobrze
   import { EventCard } from '@/features/home/components';
   import { ThemedText } from '@/shared/components';
   ```

## 🚀 Dodawanie Nowej Funkcjonalności

1. Stwórz nowy folder w `/features`:
   ```bash
   mkdir -p features/new-feature/{components,hooks,constants}
   ```

2. Dodaj pliki `index.ts` dla eksportów:
   ```typescript
   // features/new-feature/components/index.ts
   export { NewComponent } from './new-component';
   ```

3. Stwórz `README.md` dokumentujący funkcjonalność

4. Dodaj ekran w `/app` jeśli potrzebny:
   ```typescript
   // app/(tabs)/new-screen.tsx
   import { NewComponent } from '@/features/new-feature/components';
   ```

## 🎨 Style Guide

- **Nazwy plików**: kebab-case (`event-card.tsx`, `use-home-screen.ts`)
- **Nazwy komponentów**: PascalCase (`EventCard`, `HomeHeader`)
- **Nazwy funkcji/zmiennych**: camelCase (`useHomeScreen`, `cardHeight`)
- **Nazwy stałych**: UPPER_SNAKE_CASE (`EXAMPLE_EVENTS`, `FILTER_OPTIONS`)

## 📚 Dodatkowe Zasoby

- [Features README](./features/README.md)
- [Shared README](./shared/README.md)
- [Expo Router Docs](https://docs.expo.dev/router/introduction/)


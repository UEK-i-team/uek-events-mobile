# AI.md — Przewodnik dla AI Agentów

Plik ten opisuje architekturę, konwencje i reguły projektu **uek-events-mobile**. Przeczytaj go przed wprowadzaniem jakichkolwiek zmian.

---

## Przegląd projektu

Mobilna aplikacja na Expo/React Native do przeglądania wydarzeń organizowanych przez UEK (Uniwersytet Ekonomiczny w Krakowie). Aplikacja wyświetla listę wydarzeń, pozwala je filtrować, zapisywać jako ulubione i wyświetlać szczegóły.

---

## Stack technologiczny

| Warstwa       | Technologia                                                    |
| ------------- | -------------------------------------------------------------- |
| Framework     | Expo ~54, React Native 0.81.5, React 19                        |
| Routing       | expo-router ~6 (file-based)                                    |
| Nawigacja     | @react-navigation/bottom-tabs                                  |
| Język         | TypeScript ~5.9                                                |
| HTTP          | Axios + własny HttpConnector                                   |
| Storage       | @react-native-async-storage/async-storage                      |
| Cache obrazów | expo-image (`cachePolicy="disk"`)                              |
| Ikony         | SVG importowane jako komponenty (react-native-svg-transformer) |
| Bottom sheet  | @gorhom/bottom-sheet                                           |
| Animacje      | react-native-reanimated, react-native-gesture-handler          |
| Testy         | Jest + jest-expo                                               |
| Build         | EAS Build                                                      |

---

## Struktura folderów

```
/
├── app/                        # Warstwa routingu — TYLKO ekrany Expo Router
│   ├── _layout.tsx             # Root layout: wszystkie providery globalne
│   ├── modal.tsx               # Modal screen
│   ├── (tabs)/                 # Nawigacja zakładkowa
│   │   ├── _layout.tsx         # Konfiguracja tab bara
│   │   ├── index.tsx           # Zakładka Home
│   │   ├── saved.tsx           # Zakładka Ulubione
│   │   ├── filters.tsx         # Zakładka Filtry
│   │   └── info.tsx            # Zakładka Info
│   └── event/
│       └── [id].tsx            # Dynamiczny ekran szczegółów wydarzenia
│
├── features/                   # Moduły funkcjonalne (feature-based)
│   ├── home/
│   ├── event-details/
│   ├── favorite/
│   ├── filters/
│   ├── notifications/
│   └── viewed/
│
├── shared/                     # Kod współdzielony między featurami
│   ├── components/             # Reużywalne komponenty UI
│   ├── connectors/             # HTTP/API connectory
│   ├── constants/              # Motyw, kolory, fonty
│   ├── context/                # Globalne konteksty (EventContext)
│   ├── di/                     # Dependency Injection (DependencyProvider)
│   ├── repositories/           # Repozytoria danych
│   ├── services/               # Serwisy biznesowe
│   ├── storage/                # Abstrakcje storage
│   └── types/                  # Globalne typy TypeScript
│
├── assets/
│   ├── icons/                  # Ikony SVG
│   └── images/                 # Obrazy statyczne (PNG)
│
└── scripts/                    # Skrypty pomocnicze
```

---

## Anatomia Feature (`/features/<feature-name>/`)

Każdy feature ma identyczną strukturę wewnętrzną:

```
features/<feature-name>/
├── views/
│   ├── <feature-name>-view.tsx          # Główny komponent widoku (połączony z kontekstem)
│   └── <feature-name>-view.styles.ts    # Style dla widoku
├── components/
│   └── <component-name>/
│       ├── <component-name>.tsx         # Komponent UI
│       └── <component-name>.styles.ts   # Style komponentu
├── hooks/
│   └── use-<feature-name>.ts            # Custom hooki specyficzne dla feature
├── contexts/
│   ├── <name>-context.tsx               # Definicja kontekstu + Provider + hook
│   └── index.ts                         # Barrel export
├── types/
│   └── index.ts                         # Typy specyficzne dla feature
└── index.ts                             # Publiczne API feature (barrel export)
```

**Reguła:** Pliki ekranów w `/app` są cienką warstwą — renderują tylko widok z `/features`.

---

## Konwencje nazewnictwa

| Element              | Konwencja                              | Przykład                               |
| -------------------- | -------------------------------------- | -------------------------------------- |
| Pliki/foldery        | kebab-case                             | `event-card.tsx`, `home-view.tsx`      |
| Komponenty (eksport) | PascalCase                             | `EventCard`, `HomeView`                |
| Hooki                | `use-<name>.ts` / `use<Name>`          | `use-home-screen.ts` → `useHomeScreen` |
| Konteksty            | `<name>-context.tsx`                   | `filters-context.tsx`                  |
| Style                | `<name>.styles.ts`                     | `event-card.styles.ts`                 |
| Repozytoria          | `<name>-repository.ts`                 | `events-repository.ts`                 |
| Mocki                | `<name>.mock.ts`                       | `events-repository.mock.ts`            |
| Serwisy              | `<name>.services.ts`                   | `get-events.services.ts`               |
| Typy/interfejsy      | PascalCase, prefix `I` dla interfejsów | `IEvent`, `IEventsRepository`          |
| Barrel exports       | `index.ts`                             | `features/notifications/index.ts`      |

---

## Wzorce kodowania

### Komponent UI

```tsx
// component-name.tsx
import { styles } from "./component-name.styles";

interface ComponentNameProps {
  prop: string;
}

export function ComponentName({ prop }: ComponentNameProps) {
  return ( ... );
}
```

### Style (zawsze oddzielny plik)

```ts
// component-name.styles.ts
import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants/theme";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.light.mainBackground,
  },
});
```

### Kontekst + Provider + Hook (wszystko w jednym pliku)

```tsx
// <name>-context.tsx
const MyContext = createContext<MyContextType | null>(null);

export const MyProvider = ({ children }: { children: ReactNode }) => { ... };

export const useMy = () => {
  const context = useContext(MyContext);
  if (!context) throw new Error("useMy must be used inside <MyProvider>");
  return context;
};
```

### Repozytorium (interfejs + implementacja + mock)

```ts
// events-repository.ts
export interface IEventsRepository {
  getEvents(): Promise<IEvent[]>;
}

export class EventsRepository implements IEventsRepository { ... }

// events-repository.mock.ts
export class EventsRepositoryMock implements IEventsRepository { ... }
```

---

## Dependency Injection

Wszystkie zależności (repozytoria, serwisy) są tworzone w `shared/di/DependencyProvider.tsx` i wstrzykiwane przez `DependencyContext`.

- Dostęp w komponentach: `useDependencies()` hook
- Nie twórz instancji serwisów/repozytoriów bezpośrednio w komponentach
- Dodając nowy serwis: utwórz go w `DependencyProvider`, dodaj do interfejsu `AppDependencies`

### Aktualny stan mocków

Mocki są tymczasowo na sztywno włączone w `DependencyProvider.tsx` (zakomentowany przełącznik `IS_API_MOCK_ENABLED`). Nie usuwaj komentarzy przy `eventsRepository` i `dictionariesRepository`.

---

## Routing (Expo Router)

- Pliki w `/app` definiują trasy automatycznie
- Tab navigation: folder `(tabs)` z nawiasami
- Dynamiczne trasy: `[id].tsx` — parametr dostępny przez `useLocalSearchParams()`
- Nawigacja: `useRouter()` z `expo-router`
- Powrót: `router.back()`
- Push: `router.push('/event/123')`

---

## Theming i kolory

Jedyne źródło prawdy: `shared/constants/theme.ts`

```ts
theme.light.primary; // #FF6A2A — kolor główny (pomarańczowy)
theme.light.mainBackground; // #E1DDD9 — tło aplikacji
theme.light.ligth_grey; // #F4F3F2 — jasny szary
theme.light.dark_grey; // #111111 — ciemny (tekst)
theme.light.red_light; // #FFE7E7 — tło dla ulubionych
theme.light.red_regular; // #FF5252 — kolor serca (ulubione)
```

**Uwaga:** `Colors` z `theme.ts` jest oznaczony jako deprecated ("To delete soon") — nie używaj go w nowym kodzie.

Ciemny motyw nie jest jeszcze zaimplementowany (wartości identyczne z light). Nie dodawaj logiki dark mode bez uzgodnienia.

---

## Ikony SVG

- Wszystkie ikony to pliki `.svg` w `/assets/icons/`
- Import jak komponent React: `import MyIcon from "@/assets/icons/my-icon.svg"`
- Deklaracje typów: `shared/types/svg.d.ts`
- Do renderowania używaj `shared/components/svg-icon/svg-icon.tsx` lub bezpośrednio jako komponent

---

## Zmienne środowiskowe

Plik `.env` w katalogu głównym. Zmienne muszą mieć prefix `EXPO_PUBLIC_`:

| Zmienna                           | Opis                           |
| --------------------------------- | ------------------------------ |
| `EXPO_PUBLIC_API_BASE_URL`        | Bazowy URL API                 |
| `EXPO_PUBLIC_IS_API_MOCK_ENABLED` | Włącz mocki (`"true"/"false"`) |

Nie commituj `.env` — jest w `.gitignore`.

---

## Warstwy architektury (od dołu do góry)

```
Storage (AsyncStorage, Cache)
    ↓
Repositories (dane z API lub local storage)
    ↓
Services (logika biznesowa, łączenie danych)
    ↓
Contexts (stan aplikacji, dostępny przez React)
    ↓
Views (komponenty widoków, korzystają z kontekstu)
    ↓
App screens (tylko routing, renderują Views)
```

---

## Gdzie co umieszczać

| Co dodajesz              | Gdzie                                                         |
| ------------------------ | ------------------------------------------------------------- |
| Nowy ekran/zakładka      | `/app/(tabs)/` lub `/app/<name>.tsx`                          |
| Nowy feature             | `/features/<feature-name>/` z pełną strukturą                 |
| Reużywalny komponent UI  | `/shared/components/<component-name>/`                        |
| Globalny stan (kontekst) | `/shared/context/` lub `/features/<feature>/contexts/`        |
| Nowe typy danych         | `/shared/types/` (globalne) lub `/features/<feature>/types/`  |
| Wywołanie API            | Nowe repozytorium w `/shared/repositories/api-repositiores/`  |
| Logika biznesowa         | Serwis w `/shared/services/`                                  |
| Stała / kolor            | `/shared/constants/theme.ts` lub `/shared/constants/index.ts` |
| Nowa ikona               | `/assets/icons/` (plik `.svg`)                                |
| Nowy storage             | `/shared/storage/<name>-service/`                             |

---

## Komendy

```bash
npm start              # Uruchom Expo (dev)
npm run ios            # iOS simulator
npm run android        # Android emulator
npm run lint           # ESLint
npm test               # Testy jednostkowe (Jest)
npm run test:watch     # Testy w trybie watch
npm run test:coverage  # Pokrycie testami
```

---

## Ważne uwagi dla agentów

1. **Nie modyfikuj `/app` poza routingiem** — logika należy do `/features` lub `/shared`
2. **Każdy nowy komponent** wymaga oddzielnego pliku `.styles.ts`
3. **Nie twórz instancji serwisów w komponentach** — korzystaj z `useDependencies()`
4. **Alias `@/`** to skrót do katalogu głównego projektu (skonfigurowany w `tsconfig.json`)
5. **Barrel exports (`index.ts`)** — przy dodawaniu nowych elementów publicznych do feature, eksportuj przez `index.ts`
6. **Język UI** — teksty w aplikacji są po polsku
7. **Obraz** — zawsze używaj `expo-image` z `cachePolicy="disk"`, nie `Image` z React Native

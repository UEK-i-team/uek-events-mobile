# Features

Ten folder zawiera wszystkie główne funkcjonalności aplikacji, podzielone według feature-based architecture.

## Struktura

### 📱 `/home`
Główny ekran aplikacji z listą wydarzeń.

**Zawiera:**
- `components/` - Komponenty związane z ekranem głównym (EventCard, FilterButton, HomeHeader)
- `hooks/` - Custom hooki (useHomeScreen)
- `constants/` - Dane i konfiguracja (EXAMPLE_EVENTS, FILTER_OPTIONS)

### 🔍 `/filters`
Funkcjonalność filtrowania wydarzeń.

**Zawiera:**
- `components/` - Komponenty filtrow (FiltersBottomSheet)
- `contexts/` - Context do zarządzania stanem filtrów (FiltersContext)

### 💾 `/saved`
Zapisane wydarzenia użytkownika.

**Zawiera:**
- `components/` - Komponenty dla zapisanych wydarzeń

### 👤 `/profile`
Profil użytkownika i ustawienia.

**Zawiera:**
- `components/` - Komponenty profilu użytkownika

## Zasady organizacji

1. Każda funkcjonalność ma własny folder
2. Wewnątrz folderu tworzymy podfoldery:
   - `components/` - komponenty UI specyficzne dla tej funkcjonalności
   - `hooks/` - custom hooki używane tylko w tej funkcjonalności
   - `constants/` - stałe i konfiguracja
   - `contexts/` - React contexts (jeśli potrzebne)
   - `types/` - typy TypeScript specyficzne dla feature (jeśli potrzebne)

3. Wspólne komponenty, hooki i typy znajdują się w folderze `/shared`


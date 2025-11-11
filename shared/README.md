# Shared

Ten folder zawiera wszystkie współdzielone zasoby używane w wielu miejscach aplikacji.

## Struktura

### 🧩 `/components`
Komponenty UI używane w całej aplikacji.

**Zawiera:**
- `themed-text.tsx` - Komponent tekstu z obsługą motywów
- `themed-view.tsx` - Komponent widoku z obsługą motywów
- `parallax-scroll-view.tsx` - ScrollView z efektem paralaksy
- `external-link.tsx` - Link do zewnętrznych zasobów
- `haptic-tab.tsx` - Tab z feedbackiem haptycznym
- `hello-wave.tsx` - Animowany komponent powitania

### 🎨 `/components/ui`
Niskopoziomowe komponenty UI.

**Zawiera:**
- `icon-symbol.tsx` - Komponenty ikon
- `svg-icon.tsx` - Obsługa ikon SVG
- `collapsible.tsx` - Składany komponent

### 🎣 `/hooks`
Custom React hooki używane w całej aplikacji.

**Zawiera:**
- `use-color-scheme.ts` - Hook do zarządzania motywem (jasny/ciemny)
- `use-theme-color.ts` - Hook do pobierania kolorów z motywu

### 📝 `/types`
Definicje typów TypeScript używane w całej aplikacji.

**Zawiera:**
- `event.ts` - Typy dla wydarzeń i filtrów
- `svg.d.ts` - Deklaracje typów dla SVG

### 🎨 `/constants`
Stałe i konfiguracja używana w całej aplikacji.

**Zawiera:**
- `theme.ts` - Definicja motywów kolorystycznych (light/dark)

## Zasady użycia

1. **Import z shared:** Zawsze używaj aliasu `@/shared/...`
2. **Nie dodawaj logiki biznesowej:** Ten folder to tylko współdzielone narzędzia
3. **Komponenty muszą być reużywalne:** Jeśli komponent jest specyficzny dla jednej funkcjonalności, umieść go w odpowiednim folderze `/features`


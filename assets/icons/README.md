# Ikony SVG

Tutaj możesz wrzucić swoje ikony SVG, które będą używane w dolnym pasku nawigacji.

## Jak dodać nową ikonę:

1. Wrzuć plik SVG do tego folderu (np. `moja-ikona.svg`)
2. Otwórz plik `index.ts` w tym folderze
3. Dodaj import: `import MojaIkona from './moja-ikona.svg';`
4. Dodaj do eksportu: `export { MojaIkona };`
5. Użyj w `app/(tabs)/_layout.tsx`:
   ```tsx
   import { MojaIkona } from '@/assets/icons';
   // ...
   tabBarIcon: ({ color }) => <SvgIcon Icon={MojaIkona} size={28} color={color} />
   ```

## Wymagania dla plików SVG:

- Plik powinien być w formacie SVG
- Użyj `fill="currentColor"` w ścieżkach SVG, aby ikona mogła zmieniać kolor
- Upewnij się, że SVG ma atrybut `viewBox` (np. `viewBox="0 0 24 24"`)

## Przykład poprawnego SVG:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="..." />
</svg>
```

## Ważne:

Po dodaniu nowego pliku SVG, **zrestartuj serwer deweloperski** (`npm start`), aby Metro bundler mógł poprawnie przetworzyć nowy plik.


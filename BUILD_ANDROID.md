# Instrukcja budowania Android App Bundle (.aab) dla Google Play Store

## Wymagania wstępne

1. Zaloguj się do EAS CLI (jeśli jeszcze nie jesteś):
   ```bash
   eas login
   ```

2. Upewnij się, że masz zainstalowane EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

## Konfiguracja projektu (jednorazowo)

Jeśli projekt nie jest jeszcze skonfigurowany w EAS, uruchom:

```bash
eas init
```

Wybierz swoje konto Expo, gdy zostaniesz o to poproszony.

## Budowanie aplikacji Android

### Budowanie Android App Bundle (.aab) - dla Google Play Store

#### Opcja 1: Budowanie w chmurze (zalecane)

Uruchom następujące polecenie:

```bash
npm run build:android
```

lub bezpośrednio:

```bash
eas build --platform android --profile production
```

Build zostanie wykonany w chmurze Expo. Po zakończeniu otrzymasz link do pobrania pliku `.aab`.

#### Opcja 2: Budowanie lokalne

Jeśli chcesz zbudować aplikację lokalnie na swoim komputerze:

```bash
npm run build:android:local
```

**Uwaga:** Budowanie lokalne wymaga zainstalowanego Android SDK i może być wolniejsze.

### Budowanie Android APK - do testowania lub dystrybucji bezpośredniej

#### Opcja 1: Budowanie w chmurze (zalecane)

Uruchom następujące polecenie:

```bash
npm run build:android:apk
```

lub bezpośrednio:

```bash
eas build --platform android --profile apk
```

Build zostanie wykonany w chmurze Expo. Po zakończeniu otrzymasz link do pobrania pliku `.apk`.

#### Opcja 2: Budowanie lokalne

Jeśli chcesz zbudować aplikację lokalnie na swoim komputerze:

```bash
npm run build:android:apk:local
```

**Uwaga:** Budowanie lokalne wymaga zainstalowanego Android SDK i może być wolniejsze.

**Różnica między .aab a .apk:**
- **.aab (App Bundle)** - wymagany format dla Google Play Store, optymalizowany rozmiar
- **.apk** - format do bezpośredniej instalacji na urządzeniach, przydatny do testowania

## Ważne informacje

1. **Package name**: W pliku `app.json` ustawiono `package: "com.item.uekevents"`. Jeśli chcesz zmienić ten identyfikator, edytuj plik `app.json` przed budowaniem.

2. **Version code**: W `app.json` ustawiono `versionCode: 1`. Przy każdej nowej wersji aplikacji musisz zwiększyć tę wartość (2, 3, 4, itd.).

3. **Version**: Wersja aplikacji jest ustawiona w `app.json` jako `version: "1.0.0"`. Zmień ją przed każdą nową wersją.

## Publikacja w Google Play Store

1. Po zakończeniu builda pobierz plik `.aab` z linku otrzymanego w terminalu lub z [Expo Dashboard](https://expo.dev/accounts/szymonusb/projects/uek-events-mobile/builds).

2. Zaloguj się do [Google Play Console](https://play.google.com/console).

3. Przejdź do swojej aplikacji (lub utwórz nową).

4. W sekcji "Production" (lub "Testing") kliknij "Create new release".

5. Prześlij pobrany plik `.aab`.

6. Wypełnij informacje o wersji i opublikuj.

## Aktualizacja wersji przed kolejnym buildem

Przed każdym nowym buildem zaktualizuj w `app.json`:
- `version` - wersja widoczna dla użytkowników (np. "1.0.1")
- `android.versionCode` - musi być większy niż poprzedni (np. 2, 3, 4...)

## Troubleshooting

- Jeśli build się nie powiedzie, sprawdź logi w terminalu lub na [Expo Dashboard](https://expo.dev).
- Upewnij się, że wszystkie ikony i obrazy są poprawnie skonfigurowane w `app.json`.
- Sprawdź, czy jesteś zalogowany: `eas whoami`


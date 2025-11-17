# System Powiadomień (Notifications)

Globalny system powiadomień typu toast dla aplikacji React Native.

## Funkcjonalności

- ✅ 4 typy powiadomień: `info`, `success`, `error`, `loading`
- ✅ Automatyczne znikanie po 5 sekundach (oprócz typu `loading`)
- ✅ Płynne animacje wejścia/wyjścia
- ✅ Dostęp z dowolnego miejsca w aplikacji przez Context API
- ✅ Responsywne pozycjonowanie z uwzględnieniem safe area

## Instalacja

System jest już zintegrowany w aplikacji. Provider jest dodany w głównym `_layout.tsx`.

## Użycie

### Podstawowe przykłady

```typescript
import { useNotification } from '@/features/notifications';

function MyComponent() {
  const { showNotification } = useNotification();

  // Powiadomienie informacyjne
  const handleInfo = () => {
    showNotification('info', 'To jest informacja dla użytkownika');
  };

  // Powiadomienie o sukcesie
  const handleSuccess = () => {
    showNotification('success', 'Operacja zakończona sukcesem!');
  };

  // Powiadomienie o błędzie
  const handleError = () => {
    showNotification('error', 'Wystąpił błąd podczas operacji');
  };

  // Powiadomienie ładowania
  const handleLoading = () => {
    showNotification('loading', 'Trwa ładowanie danych...');
  };

  return (
    <View>
      <Button title="Pokaż Info" onPress={handleInfo} />
      <Button title="Pokaż Success" onPress={handleSuccess} />
      <Button title="Pokaż Error" onPress={handleError} />
      <Button title="Pokaż Loading" onPress={handleLoading} />
    </View>
  );
}
```

### Przykład z async operacją

```typescript
const handleSaveData = async () => {
  const { showNotification } = useNotification();
  
  // Pokaż loading
  showNotification('loading', 'Zapisywanie danych...');
  
  try {
    await saveDataToAPI();
    // Po sukcesie - loading automatycznie zniknie i pojawi się success
    showNotification('success', 'Dane zostały zapisane!');
  } catch (error) {
    showNotification('error', 'Nie udało się zapisać danych');
  }
};
```

### Ręczne ukrywanie powiadomienia

```typescript
const { showNotification, hideNotification } = useNotification();

// Pokaż powiadomienie
showNotification('info', 'Ważna informacja');

// Ukryj ręcznie po 2 sekundach
setTimeout(() => {
  hideNotification();
}, 2000);
```

## Typy powiadomień

| Typ | Kolor | Ikona | Czas znikania | Użycie |
|-----|-------|-------|----------------|---------|
| `info` | Niebieski (#3B82F6) | ℹ️ | 5 sekund | Ogólne informacje |
| `success` | Zielony (#10B981) | ✓ | 5 sekund | Potwierdzenia sukcesu |
| `error` | Czerwony (#EF4444) | ✕ | 5 sekund | Komunikaty błędów |
| `loading` | Fioletowy (#8B5CF6) | ⟳ | Ręcznie/przez następne | Operacje w toku |

## API

### `useNotification()`

Hook zwracający obiekt z następującymi metodami:

#### `showNotification(type: NotificationType, message: string)`

Wyświetla powiadomienie.

**Parametry:**
- `type`: Typ powiadomienia (`'info' | 'success' | 'error' | 'loading'`)
- `message`: Treść wiadomości do wyświetlenia

#### `hideNotification()`

Ręcznie ukrywa aktualnie wyświetlane powiadomienie.

#### `currentNotification: Notification | null`

Aktualne powiadomienie (jeśli jest wyświetlane).

## Struktura

```
features/notifications/
├── components/
│   ├── notification-toast.tsx    # Komponent z animacjami
│   └── index.ts
├── contexts/
│   ├── notification-context.tsx  # Context Provider
│   └── index.ts
├── hooks/
│   ├── use-notification.ts       # Hook do użycia
│   └── index.ts
├── types/
│   └── index.ts                  # Typy TypeScript
├── index.ts                      # Główny export
└── README.md
```

## Customizacja

Kolory i style można dostosować w pliku `notification-toast.tsx` w obiekcie `notificationConfigs`.

```typescript
const notificationConfigs: Record<NotificationType, NotificationConfig> = {
  info: {
    backgroundColor: '#3B82F6',  // Zmień kolor
    textColor: '#FFFFFF',
    icon: 'ℹ️',                   // Zmień ikonę
  },
  // ...
};
```


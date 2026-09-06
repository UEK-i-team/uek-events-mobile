
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.uekeventuje.pl/';

export const trackEvent = async (eventName: string, parameters?: Record<string, any>) => {
    try {
        const url = new URL('/api/analytics/', API_BASE_URL).toString();

        const payload = {
            event_type: eventName,
            metadata: parameters || {},
            timestamp: new Date().toISOString(),
        };

        console.log(`[Analytics] Sending to ${url}:`, JSON.stringify(payload, null, 2));

        // Zabezpieczenie przed wyrzuceniem błędu do UI w przypadku braku połączenia
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        }).catch((err) => {
            console.warn(`[Analytics] Nie udało się wysłać zdarzenia ${eventName}:`, err.message);
        });

    } catch (e) {
        console.warn(`[Analytics] Błąd inicjalizacji zapytania dla ${eventName}`);
    }
};

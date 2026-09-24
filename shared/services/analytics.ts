import { apiConnector } from "@/shared/connectors/api-connector/api-connector";

const ANALYTICS_ENDPOINT = "api/analytics/";

export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    const payload = {
        event_type: eventName,
        metadata: parameters || {},
        timestamp: new Date().toISOString(),
    };

    if (__DEV__) {
        console.log(`[Analytics] ${eventName}:`, JSON.stringify(payload, null, 2));
    }

    // Fire-and-forget: nie blokujemy UI i nie propagujemy błędów sieciowych do interfejsu.
    // Korzystamy z apiConnector (spójny base URL, nagłówki, retry).
    apiConnector.post(ANALYTICS_ENDPOINT, payload).catch((err) => {
        if (__DEV__) {
            console.warn(`[Analytics] Nie udało się wysłać zdarzenia ${eventName}:`, err?.message);
        }
    });
};

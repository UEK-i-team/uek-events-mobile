import { useViewedEvents } from '@/features/viewed';
import { Event } from '@/shared/types/event';
import { useEffect, useState } from 'react';

/**
 * Hook do sortowania wydarzeń z priorytetem dla niezobaczonych
 * 
 * WAŻNE: Sortowanie wykonuje się tylko RAZ przy załadowaniu eventów,
 * a nie reaktywnie podczas przeglądania. Dzięki temu kolejność nie zmienia się
 * podczas używania aplikacji.
 * 
 * viewedEventIds z kontekstu jest "zamrożony" na czas sesji (zapisany w useRef w kontekście),
 * więc sortowanie nie zmienia się gdy użytkownik przegląda eventy.
 * 
 * Logika sortowania:
 * 1. Niezobaczone wydarzenia na górze (sortowane po dacie wydarzenia - najbliższe najpierw)
 * 2. Zobaczone wydarzenia na dole (sortowane po dacie wydarzenia - najbliższe najpierw)
 */
export function useSortedEvents(events: Event[]): Event[] {
  const { viewedEventIds } = useViewedEvents(); // To jest "zamrożone" w kontekście
  const [sortedEvents, setSortedEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (events.length === 0) return;
    
    // Sortuj TYLKO gdy zmieniają się events (np. po załadowaniu z API)
    // viewedEventIds jest stały przez całą sesję
    
    console.log('🔄 Sortowanie eventów. Total:', events.length, 'Viewed IDs:', viewedEventIds.length);
    
    // 1. Rozdziel na zobaczone i niezobaczone
    const unseen = events.filter((e) => !viewedEventIds.includes(e.id));
    const seen = events.filter((e) => viewedEventIds.includes(e.id));

    console.log('📊 Niezobaczone:', unseen.length, 'Zobaczone:', seen.length);

    // Helper do sortowania po dacie wydarzenia
    const sortByEventDate = (a: Event, b: Event) => {
      const dateA = new Date(a.eventDateStart || a.date).getTime();
      const dateB = new Date(b.eventDateStart || b.date).getTime();
      return dateA - dateB;
    };

    // 2. Sortuj niezobaczone po dacie eventu (najbliższe najpierw)
    const sortedUnseen = unseen.sort(sortByEventDate);

    // 3. Sortuj zobaczone po dacie eventu (najbliższe najpierw)
    const sortedSeen = seen.sort(sortByEventDate);

    // 4. Jeśli są jakieś zobaczone eventy, dodaj separator "Jesteś na bieżąco"
    let result: Event[];
    if (sortedSeen.length > 0 && sortedUnseen.length > 0) {
      const separator: Event = {
        id: '__CAUGHT_UP_SEPARATOR__',
        title: 'Jesteś na bieżąco!',
        description: 'Świetnie! Obejrzałeś wszystkie nowe wydarzenia. Poniżej znajdziesz te, które już widziałeś.',
        date: '',
        time: '',
        location: '',
        tags: [],
        isSeparator: true,
      };
      
      result = [...sortedUnseen, separator, ...sortedSeen];
      console.log('✨ Dodano separator "Jesteś na bieżąco"');
    } else {
      result = [...sortedUnseen, ...sortedSeen];
    }
    
    console.log('✅ Posortowano. Kolejność pierwszych 5:', result.slice(0, 5).map(e => e.isSeparator ? '⭐ SEPARATOR' : `${e.title.substring(0, 20)}... (${viewedEventIds.includes(e.id) ? 'seen' : 'NEW'})`));
    
    setSortedEvents(result);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, viewedEventIds]); // events i viewedEventIds (ustawiane raz przy starcie)

  return sortedEvents;
}

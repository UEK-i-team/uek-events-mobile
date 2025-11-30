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
 * 1. Niezobaczone wydarzenia na górze:
 *    - Najpierw przyszłe/dzisiejsze (sortowane od najbliższych)
 *    - Potem przeszłe (sortowane od najnowszych)
 * 2. Zobaczone wydarzenia na dole (z takim samym sortowaniem jak wyżej)
 */
export function useSortedEvents(events: Event[]): Event[] {
  const { viewedEventIds } = useViewedEvents(); // To jest "zamrożone" w kontekście
  const [sortedEvents, setSortedEvents] = useState<Event[]>([]);

  // Debug: Log każdej zmiany events
  console.log('🔄 useSortedEvents wywołany z events.length:', events.length);

  useEffect(() => {
    // Sortuj TYLKO gdy zmieniają się events (np. po załadowaniu z API lub po filtrowaniu)
    // viewedEventIds jest stały przez całą sesję
    
    console.log('🔄 Sortowanie eventów. Total:', events.length, 'Viewed IDs:', viewedEventIds.length);
    
    // Jeśli events są puste (np. po filtrowaniu), zwróć pustą tablicę
    if (events.length === 0) {
      console.log('📭 Brak wydarzeń do sortowania - zwracam pustą tablicę');
      setSortedEvents([]);
      return;
    }
    
    // 1. Rozdziel na zobaczone i niezobaczone
    const unseen = events.filter((e) => !viewedEventIds.includes(e.id));
    const seen = events.filter((e) => viewedEventIds.includes(e.id));

    console.log('📊 Niezobaczone:', unseen.length, 'Zobaczone:', seen.length);

    // Helper do sortowania wydarzeń z priorytetem dla przyszłych/dzisiejszych
    const sortWithFuturePriority = (events: Event[]) => {
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Ustawienie na początek dzisiejszego dnia
      
      // Rozdziel na przyszłe/dzisiejsze i przeszłe
      const futureEvents: Event[] = [];
      const pastEvents: Event[] = [];
      
      events.forEach((event) => {
        const eventDate = new Date(event.eventDateStart || event.date);
        eventDate.setHours(0, 0, 0, 0); // Porównujemy tylko daty, bez godzin
        
        if (eventDate >= now) {
          futureEvents.push(event);
        } else {
          pastEvents.push(event);
        }
      });
      
      // Sortuj przyszłe/dzisiejsze rosnąco (najbliższe najpierw)
      futureEvents.sort((a, b) => {
        const dateA = new Date(a.eventDateStart || a.date).getTime();
        const dateB = new Date(b.eventDateStart || b.date).getTime();
        return dateA - dateB;
      });
      
      // Sortuj przeszłe malejąco (najnowsze z przeszłości najpierw)
      pastEvents.sort((a, b) => {
        const dateA = new Date(a.eventDateStart || a.date).getTime();
        const dateB = new Date(b.eventDateStart || b.date).getTime();
        return dateB - dateA;
      });
      
      // Zwróć: najpierw przyszłe/dzisiejsze, potem przeszłe
      return [...futureEvents, ...pastEvents];
    };

    // 2. Sortuj niezobaczone z priorytetem dla przyszłych
    const sortedUnseen = sortWithFuturePriority(unseen);

    // 3. Sortuj zobaczone z priorytetem dla przyszłych
    const sortedSeen = sortWithFuturePriority(seen);

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

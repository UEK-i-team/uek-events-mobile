import { useAppliedFilters } from '@/features/filters/contexts';
import { Event, FilterId } from '@/shared/types/event';
import { useMemo } from 'react';

/**
 * Hook do filtrowania wydarzeń według wybranego filtru czasowego oraz filtrów z kontekstu
 */
export function useFilteredEvents(events: Event[], selectedFilter: FilterId): Event[] {
  const appliedFilters = useAppliedFilters();
  
  // Użyj bezpośrednio wartości z appliedFilters
  const categories = appliedFilters.appliedCategories;
  const locations = appliedFilters.appliedLocations;
  const tags = appliedFilters.appliedTags;

  // Stwórz klucze do dependencies - używamy JSON.stringify aby React wykrywał zmiany również dla pustych tablic
  const categoriesKey = JSON.stringify(categories);
  const locationsKey = JSON.stringify(locations);
  const tagsKey = JSON.stringify(tags);

  console.log('🔍 useFilteredEvents - filtry:', {
    categories,
    locations,
    tags,
    categoriesKey,
    locationsKey,
    tagsKey,
    eventsCount: events.length,
  });

  return useMemo(() => {
    console.log('♻️ useMemo PRZELICZA się - filtry się zmieniły!');
    let filtered = events;

    // Filtrowanie po kategoriach
    if (categories && categories.length > 0) {
      console.log('📊 Filtrowanie po kategoriach:', categories);
      filtered = filtered.filter(
        (event) => event.eventCategory && categories.includes(event.eventCategory)
      );
      console.log(`✅ Po filtrowaniu kategorii: ${filtered.length} z ${events.length} wydarzeń`);
    }

    // Filtrowanie po lokalizacjach
    if (locations && locations.length > 0) {
      filtered = filtered.filter(
        (event) => event.eventLocation && locations.includes(event.eventLocation)
      );
    }

    // Filtrowanie po tagach (wydarzenie musi mieć przynajmniej jeden z wybranych tagów)
    if (tags && tags.length > 0) {
      filtered = filtered.filter(
        (event) =>
          event.tags && event.tags.some((tag) => tags.includes(tag))
      );
    }

    // Filtrowanie po czasie
    if (!selectedFilter) {
      return filtered;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const getDateFromEventString = (dateStr: string): Date | null => {
      // Prosta funkcja parsująca daty z formatu polskiego
      // Format: "15 lis", "17 wrz (jutro)", "20 wrz", etc.
      
      const monthMap: { [key: string]: number } = {
        'sty': 0, 'styczeń': 0,
        'lut': 1, 'luty': 1,
        'mar': 2, 'marzec': 2,
        'kwi': 3, 'kwiecień': 3,
        'maj': 4,
        'cze': 5, 'czerwiec': 5,
        'lip': 6, 'lipiec': 6,
        'sie': 7, 'sierpień': 7,
        'wrz': 8, 'wrzesień': 8,
        'paź': 9, 'październik': 9,
        'lis': 10, 'listopad': 10,
        'gru': 11, 'grudzień': 11,
      };

      // Usuń tekst w nawiasach jak "(jutro)"
      const cleanDateStr = dateStr.replace(/\([^)]*\)/g, '').trim();
      
      // Wyciągnij dzień i miesiąc
      const parts = cleanDateStr.split(' ');
      if (parts.length < 2) return null;

      const day = parseInt(parts[0]);
      const monthStr = parts[1].toLowerCase();
      const month = monthMap[monthStr];

      if (isNaN(day) || month === undefined) return null;

      // Użyj aktualnego roku, ale jeśli miesiąc jest mniejszy niż obecny,
      // prawdopodobnie chodzi o następny rok
      const currentMonth = today.getMonth();
      let year = today.getFullYear();
      
      if (month < currentMonth - 1) {
        year += 1;
      }

      const eventDate = new Date(year, month, day);
      eventDate.setHours(0, 0, 0, 0);
      
      return eventDate;
    };

    const filterByDate = (event: Event): boolean => {
      const eventDate = getDateFromEventString(event.date);
      if (!eventDate) return true; // Jeśli nie możemy sparsować daty, pokaż wydarzenie

      const diffTime = eventDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (selectedFilter) {
        case 'today':
          // Tylko wydarzenia dzisiaj
          return diffDays === 0;
        
        case 'week':
          // Wydarzenia w najbliższych 7 dniach
          return diffDays >= 0 && diffDays <= 7;
        
        case 'month':
          // Wydarzenia w najbliższych 30 dniach
          return diffDays >= 0 && diffDays <= 30;
        
        default:
          return true;
      }
    };

    return filtered.filter(filterByDate);
  }, [events, selectedFilter, categoriesKey, locationsKey, tagsKey]);
}


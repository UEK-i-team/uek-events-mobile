/**
 * Typy dla odpowiedzi z API
 */

/**
 * Format odpowiedzi z API dla eventów
 */
export interface ApiEventsResponse {
  status: string;
  count: number;
  data: ApiEvent[];
}

/**
 * Event z API (format backendowy)
 */
export interface ApiEvent {
  id: number;
  create_date: string; // ISO 8601
  event_date_start: string; // ISO 8601
  event_date_end: string | null; // ISO 8601
  title: string;
  short_desc: string;
  hash: string;
  event_category: string; // np. "INFORMATIONAL", "SCIENTIFIC"
  event_type: string; // np. "TRAINING", "WORKSHOP"
  location: string;
  location_category: string; // np. "ONLINE", "ON_UEK_CAMPUS"
  organisators: string;
  organisators_category: string; // np. "EXTERNAL", "UEK"
  tags: string; // comma-separated
  topics: string; // newline-separated markdown list (np. "- Punkt 1\n- Punkt 2")
  image_url: string | null;
  origin_url: string;
  availability: number | null; // liczba wolnych miejsc
  registration_type: string; // np. "REQUIRED", "NOT_REQUIRED"
  source_name: string;
}


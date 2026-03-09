export interface IEvent {
  id: string;
  update_date: string;
  start_date: string;
  end_date: string;
  title: string;
  short_desc: string;
  topics: string[];
  event_category: string;
  location_category: string;
  location: string;
  organisators_category: string;
  organisators: string;
  tags: string[];
  image_url: string;
  origin_url: string;
  registration_type: string;
  isFavorite?: boolean;
}

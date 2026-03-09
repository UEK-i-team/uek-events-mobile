import { IEventsRepository } from "./events-repository";

export class EventsRepositoryMock implements IEventsRepository {
  public async getEvents() {
    return [
      {
        id: "1",
        update_date: "2024-03-01T10:00:00Z",
        start_date: "2024-04-10T15:00:00Z",
        end_date: "2024-04-10T18:00:00Z",
        title: "Wielki Hackathon IT",
        short_desc:
          "24-godzinny maraton programowania dla studentów z nagrodami.",
        topics: ["IT", "Programowanie"],
        event_category: "IT",
        location_category: "CAM",
        location: "Pawilon C, sala 300",
        organisators_category: "KNR",
        organisators: "Koło Naukowe IT",
        tags: ["AI", "NET"],
        image_url:
          "https://via.placeholder.com/600x400/1a1a1a/ffffff?text=Hackathon",
        origin_url: "https://example.com/events/1",
        registration_type: "FREE",
      },
      {
        id: "2",
        update_date: "2024-03-05T09:00:00Z",
        start_date: "2024-05-15T09:00:00Z",
        end_date: "2024-05-15T12:00:00Z",
        title: "Targi Pracy i Kariery UEK",
        short_desc: "Największe Akademickie Targi Pracy w Krakowie.",
        topics: ["Kariera", "Biznes"],
        event_category: "BUSINESS",
        location_category: "CAM",
        location: "Pawilon G, Hala Główna",
        organisators_category: "NZS",
        organisators: "NZS UEK",
        tags: ["Praca", "Networking"],
        image_url:
          "https://via.placeholder.com/600x400/1a1a1a/ffffff?text=Targi+Pracy",
        origin_url: "https://example.com/events/2",
        registration_type: "FREE",
      },
      {
        id: "3",
        update_date: "2024-03-10T11:00:00Z",
        start_date: "2024-06-01T18:00:00Z",
        end_date: "2024-06-01T23:00:00Z",
        title: "Gala Finałowa Juwenaliów",
        short_desc: "Uroczyste zakończenie Dni Studentów z koncertami.",
        topics: ["Rozrywka", "Kultura"],
        event_category: "ENTERTAINMENT",
        location_category: "OUT",
        location: "Scena Główna - Miasteczko Studenckie",
        organisators_category: "SS",
        organisators: "Samorząd Studencki",
        tags: ["Muzyka", "Zabawa"],
        image_url:
          "https://via.placeholder.com/600x400/1a1a1a/ffffff?text=Juwenalia",
        origin_url: "https://example.com/events/3",
        registration_type: "PAID",
      },
    ];
  }
}

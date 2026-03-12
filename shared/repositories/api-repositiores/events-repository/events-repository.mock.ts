import { IEventsRepository } from "./events-repository";

export class EventsRepositoryMock implements IEventsRepository {
  public async getEvents() {
    return [
      {
        id: "1",
        update_date: "2026-03-01T10:00:00Z",
        start_date: "2026-04-10T15:00:00Z",
        end_date: "2026-04-10T18:00:00Z",
        title: "Wielki Hackathon IT",
        short_desc:
          "24-godzinny maraton programowania dla studentów z nagrodami.",
        topics: [
          "Tworzenie innowacyjnych rozwiązań z wykorzystaniem sztucznej inteligencji.",
          "Optymalizacja algorytmów w środowisku rozproszonym.",
          "Projektowanie skalowalnych architektur systemowych.",
        ],
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
        update_date: "2026-03-05T09:00:00Z",
        start_date: "2026-05-15T09:00:00Z",
        end_date: "2026-05-15T12:00:00Z",
        title: "Targi Pracy i Kariery UEK",
        short_desc: "Największe Akademickie Targi Pracy w Krakowie.",
        topics: [
          "Spotkania z przedstawicielami największych firm z branży finansowej i technologicznej.",
          "Konsultacje dokumentów aplikacyjnych oraz próbne rozmowy kwalifikacyjne z rekruterami.",
          "Warsztaty z zakresu planowania ścieżki zawodowej i budowania marki osobistej.",
        ],
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
        update_date: "2026-03-15T12:00:00Z",
        start_date: "2026-05-15T13:00:00Z",
        end_date: "2026-05-15T16:00:00Z",
        title: "Targi Pracy i Kariery UEK 2",
        short_desc: "Największe Akademickie Targi Pracy w Krakowie 2.",
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
        id: "4",
        update_date: "2026-03-10T11:00:00Z",
        start_date: "2026-06-15T18:00:00Z",
        end_date: "2026-06-15T23:00:00Z",
        title: "Gala Finałowa Juwenaliów",
        short_desc: "Uroczyste zakończenie Dni Studentów z koncertami.",
        topics: [
          "Występy czołowych artystów polskiej sceny muzycznej i rozrywkowej.",
          "Uroczyste wręczenie kluczy do miasta oraz nagród w konkursach juwenaliowych.",
          "Widowiskowe pokazy laserowe i pirotechniczne wieńczące święto studentów.",
        ],
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

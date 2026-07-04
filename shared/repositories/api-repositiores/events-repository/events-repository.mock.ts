import { IEvent } from "@/shared/types/event";
import { IEventsRepository } from "./events-repository";

export class EventsRepositoryMock implements IEventsRepository {
  public async getEventsFromCache(): Promise<IEvent[] | null> {
    return null;
  }

  public async fetchAndSyncEvents() {
    const events =  [
      {
        id: 4,
        update_date: "2026-03-12T16:00:00Z",
        start_date: "2026-06-05T18:00:00Z",
        end_date: "2026-06-05T20:00:00Z",
        title: "Webinar biznesowy z Jacobs",
        short_desc:
          "Naucz się skutecznej komunikacji biznesowej na darmowym webinarze firmy Jacobs.",
        topics: [
          "Poznasz techniki dostosowywania komunikacji do różnych kultur i uczestników.",
          "Nauczysz się poprawnie strukturyzować spotkania biznesowe i maile.",
          "Zdobędziesz praktyczne porady z zakresu delegowania zadań i ustalania terminów.",
        ],
        event_type: "BUSINESS",
        location_category: "ONLINE",
        location: "MS Teams",
        organisators_category: "ACK",
        organisators: "ACK UEK, Jacobs",
        tags: ["Komunikacja", "Biznes", "Rozwój"],
        image_url:
          "https://kariery.uek.krakow.pl/wp-content/uploads/2026/01/V1_Webinar_UEK_rev01.png",
        origin_url:
          "https://kariery.uek.krakow.pl/szkolenia-i-kosultacje/academy-of-development-webinar-with-jacobs-master-the-art-of-business-communication-and-correspondence/",
        registration_type: "FREE",
      },
      {
        id: 5,
        update_date: "2026-03-12T16:10:00Z",
        start_date: "2026-06-05T18:00:00Z",
        end_date: "2026-06-05T20:00:00Z",
        title: "Prawo w biznesie - szkolenie",
        short_desc:
          "Poznaj wpływ regulacji prawnych na Twój pomysł i bezpieczny rozwój firmy.",
        topics: [
          "Wpływ aktualnych regulacji prawnych na innowacyjne pomysły biznesowe.",
          "Praktyczne wskazówki dotyczące bezpiecznego i legalnego rozwoju własnej firmy.",
          "Szkolenie prowadzone przez doświadczonego radcę prawnego, dr. Kamila Dobosza.",
        ],
        event_type: "BUSINESS",
        location_category: "CAM",
        location: "Sala G13, Budynek G (KSB)",
        organisators_category: "ACK",
        organisators: "ACK UEK",
        tags: ["Prawo", "Biznes", "Kariera"],
        image_url:
          "https://kariery.uek.krakow.pl/wp-content/uploads/2026/03/gok2026_fb_1920-x-1080-px.png",
        origin_url:
          "https://kariery.uek.krakow.pl/startuje-ix-edycja-gry-o-kariere/",
        registration_type: "FREE",
      },

      {
        id: 6,
        update_date: "2026-03-12T16:11:00Z",
        start_date: "2026-06-05T18:00:00Z",
        end_date: "2026-06-05T20:00:00Z",
        title: "Szkolenie: Prawo w biznesie",
        short_desc:
          "Zrozum wpływ prawa na rozwój firmy. Szkolenie z radcą prawnym.",
        topics: [
          "Dowiesz się, jak regulacje kształtują model biznesowy i możliwości rozwoju firmy.",
          "Poznasz kluczowe decyzje prawne na starcie (forma działalności, wspólnicy).",
          "Nauczysz się identyfikować ryzyka regulacyjne przed wejściem na rynek.",
        ],
        event_type: "TRAINING",
        location_category: "CAM",
        location: "Sala G13, Budynek G (Krakowska Szkoła Biznesu)",
        organisators_category: "ACK",
        organisators: "ACK UEK",
        tags: ["Prawo", "Biznes", "Przedsiębiorczość"],
        image_url:
          "https://kariery.uek.krakow.pl/wp-content/uploads/2026/02/Grafika-promocyjna-2.png",
        origin_url:
          "https://kariery.uek.krakow.pl/akademia-rozwoju-ack-szkolenie-prawo-w-biznesie-jak-regulacje-wplywaja-na-twoj-pomysl-i-rozwoj-firmy/",
        registration_type: "REGISTRATION_REQUIRED",
      },
      {
        id: 7,
        update_date: "2026-03-12T16:12:00Z",
        start_date: "2026-03-05T11:30:00Z",
        end_date: "2026-03-05T12:30:00Z",
        title: "Kulisy rekrutacji Alior Bank",
        short_desc:
          "Zbuduj CV i przygotuj się do rekrutacji podczas prezentacji Alior Bank.",
        topics: [
          "Dowiesz się, jak identyfikować mocne strony i stworzyć profesjonalne CV.",
          "Odkryjesz sposoby na autentyczne przejście przez rozmowę kwalifikacyjną.",
          "Zrozumiesz, jak zbudować silną markę osobistą na rynku pracy.",
        ],
        event_type: "TRAINING",
        location_category: "CAM",
        location: "Pawilon S, I piętro, sala nr 3",
        organisators_category: "COMPANY",
        organisators: "Alior Bank, ACK UEK",
        tags: ["Kariera", "Rekrutacja", "Praca"],
        image_url:
          "https://kariery.uek.krakow.pl/wp-content/uploads/2026/02/Kopia-%E2%80%93-Kopia-%E2%80%93-Facebook-7-e1770726376700.png",
        origin_url:
          "https://kariery.uek.krakow.pl/szkolenia-i-kosultacje/rekrutacyjny-backstage-kulisy-skutecznego-poszukiwania-pracy-prezentacja-alior-bank-targi-pracy-uek/",
        registration_type: "REGISTRATION_REQUIRED",
      },
      {
        id: 8,
        update_date: "2026-03-12T16:15:00Z",
        start_date: "2026-01-19T18:00:00Z",
        end_date: "2026-01-19T20:00:00Z",
        title: "Zarządzanie międzykulturowe",
        short_desc:
          "Poznaj zasady współpracy w międzynarodowym zespole na webinarze firmy Jacobs.",
        topics: [
          "Zrozumiesz, jak różnice kulturowe wpływają na komunikację i pracę w zespole.",
          "Nauczysz się dostosowywać swój styl pracy do osób z różnych środowisk.",
          "Zdobędziesz praktyczne wskazówki do udanej kolaboracji na rynku globalnym.",
        ],
        event_type: "TRAINING",
        location_category: "ONLINE",
        location: "MS Teams",
        organisators_category: "COMPANY",
        organisators: "Jacobs, ACK UEK",
        tags: ["Rozwój", "Kariera", "Biznes"],
        image_url:
          "https://kariery.uek.krakow.pl/wp-content/uploads/2026/01/V2_Webinar_UEK_rev01.png",
        origin_url:
          "https://kariery.uek.krakow.pl/szkolenia-i-kosultacje/academy-of-development-webinar-with-jacobs-managing-across-cultures/",
        registration_type: "REGISTRATION_REQUIRED",
      },
      {
        id: 9,
        update_date: "2026-07-04T10:00:00Z",
        start_date: "2026-07-15T17:00:00Z",
        end_date: "2026-07-15T19:00:00Z",
        title: "Warsztaty: Personal branding na LinkedIn",
        short_desc:
          "Zbuduj profesjonalny profil i dotrzyj do rekruterów dzięki praktycznym warsztatom ACK UEK.",
        topics: [
          "Poznasz elementy skutecznego profilu LinkedIn i sposób prezentacji osiągnięć.",
          "Nauczysz się tworzyć treści, które zwiększają widoczność na rynku pracy.",
          "Otrzymasz checklistę do samodzielnej optymalizacji profilu po warsztatach.",
        ],
        event_type: "TRAINING",
        location_category: "ONLINE",
        location: "MS Teams",
        organisators_category: "ACK",
        organisators: "ACK UEK",
        tags: ["Kariera", "Rozwój", "Networking"],
        image_url:
          "https://kariery.uek.krakow.pl/wp-content/uploads/2026/01/V1_Webinar_UEK_rev01.png",
        origin_url: "https://kariery.uek.krakow.pl/",
        registration_type: "FREE",
      },
      {
        id: 10,
        update_date: "2026-07-04T10:05:00Z",
        start_date: "2026-07-20T12:00:00Z",
        end_date: "2026-07-20T14:00:00Z",
        title: "Spotkanie z przedstawicielami Targów Pracy UEK",
        short_desc:
          "Poznaj firmy i oferty staży jeszcze przed oficjalnym startem Targów Pracy UEK.",
        topics: [
          "Dowiesz się, jakie branże i stanowiska będą reprezentowane na tegorocznych targach.",
          "Przygotujesz listę pytań i plan wizyty u wybranych pracodawców.",
          "Otrzymasz wskazówki dotyczące dress code i pierwszego wrażenia na stoisku.",
        ],
        event_type: "BUSINESS",
        location_category: "CAM",
        location: "Aula UEK, Budynek A",
        organisators_category: "ACK",
        organisators: "ACK UEK",
        tags: ["Kariera", "Rekrutacja", "Praca"],
        image_url:
          "https://kariery.uek.krakow.pl/wp-content/uploads/2026/03/gok2026_fb_1920-x-1080-px.png",
        origin_url: "https://kariery.uek.krakow.pl/",
        registration_type: "REGISTRATION_REQUIRED",
      },
      {
        id: 11,
        update_date: "2026-07-04T11:00:00Z",
        start_date: "2026-07-25T10:00:00Z",
        end_date: "2026-07-25T12:00:00Z",
        title: "Szkolenie: Negocjacje w biznesie",
        short_desc:
          "Opanuj techniki negocjacyjne przydatne w rozmowach o pracę i współpracy z klientami.",
        topics: [
          "Poznasz modele negocjacji win-win i sposoby przygotowania do trudnych rozmów.",
          "Przećwiczysz scenariusze negocjacji wypłaty i warunków zatrudnienia.",
          "Dowiesz się, jak bronić swoich interesów bez eskalacji konfliktu.",
        ],
        event_type: "TRAINING",
        location_category: "CAM",
        location: "Sala G13, Budynek G (KSB)",
        organisators_category: "ACK",
        organisators: "ACK UEK",
        tags: ["Biznes", "Rozwój", "Komunikacja"],
        image_url:
          "https://kariery.uek.krakow.pl/wp-content/uploads/2026/02/Grafika-promocyjna-2.png",
        origin_url: "https://kariery.uek.krakow.pl/",
        registration_type: "FREE",
      },
      {
        id: 12,
        update_date: "2026-07-04T11:05:00Z",
        start_date: "2026-08-01T16:00:00Z",
        end_date: "2026-08-01T18:00:00Z",
        title: "Webinar: Finanse osobiste dla studentów",
        short_desc:
          "Naucz się planować budżet, oszczędzać i unikać pułapek finansowych na starcie kariery.",
        topics: [
          "Poznasz podstawy budżetu domowego i narzędzia do śledzenia wydatków.",
          "Dowiesz się, jak budować poduszkę finansową i planować większe cele.",
          "Omówisz najczęstsze błędy finansowe studentów i sposoby ich unikania.",
        ],
        event_type: "BUSINESS",
        location_category: "ONLINE",
        location: "MS Teams",
        organisators_category: "ACK",
        organisators: "ACK UEK",
        tags: ["Rozwój", "Biznes", "Kariera"],
        image_url:
          "https://kariery.uek.krakow.pl/wp-content/uploads/2026/01/V2_Webinar_UEK_rev01.png",
        origin_url: "https://kariery.uek.krakow.pl/",
        registration_type: "REGISTRATION_REQUIRED",
      },
    ];

    events.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
    return events;
  }
}

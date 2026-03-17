import { useLocalSearchParams } from "expo-router";
import { EventDetailsView } from "../../features/event-details/views/event-details";

export default function EventDetailsScreen() {
  const params = useLocalSearchParams<{ id: string }>();

  const eventId = params.id;

  return <EventDetailsView eventId={eventId} />;
}

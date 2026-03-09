import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

export default function EventDetailsScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const eventId = params.id;

  return (
    // podmienić safeAreaView na react-native-safe-area-context
    <SafeAreaView>
      <View>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
          <Text style={{ color: "#0066FF", fontSize: 40 }}>Wróć do listy</Text>
        </TouchableOpacity>
        <Text>{eventId}</Text>
      </View>
    </SafeAreaView>
  );
}

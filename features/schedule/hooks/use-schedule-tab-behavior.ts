import { useEffect } from "react";
import { useNavigation } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { isToday } from "date-fns";

interface UseScheduleTabBehaviorProps {
  selectedDate: Date;
  onReturnToToday: () => void;
}

/**
 * While the schedule tab is focused on a day other than today, its tab bar
 * label becomes „Wróć do dziś" and pressing the tab jumps back to today.
 */
export function useScheduleTabBehavior({ selectedDate, onReturnToToday }: UseScheduleTabBehaviorProps) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const showReturnToToday = isFocused && !isToday(selectedDate);

  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress" as never, () => {
      if (showReturnToToday) onReturnToToday();
    });

    return unsubscribe;
  }, [navigation, onReturnToToday, showReturnToToday]);

  useEffect(() => {
    navigation.setOptions({
      tabBarLabel: showReturnToToday ? "Wróć do dziś" : "Plan zajęć",
    });
    // The view can unmount while the tab stays (e.g. the login screen replaces it).
    return () => navigation.setOptions({ tabBarLabel: "Plan zajęć" });
  }, [navigation, showReturnToToday]);
}

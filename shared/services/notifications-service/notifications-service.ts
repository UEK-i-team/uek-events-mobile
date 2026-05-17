import * as Notifications from "expo-notifications";
import { IEvent } from "@/shared/types/event";
import { safeParseDate } from "@/utils/functions/event-utils";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('default', {
    name: 'Wydarzenia',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF231F7C',
  });
}

export class NotificationsService {
  async requestPermissionsAsync(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === "granted";
  }

  async scheduleEventReminder(event: IEvent): Promise<void> {
    const hasPermission = await this.requestPermissionsAsync();
    if (!hasPermission) {
      console.warn("Notification permission not granted");
      return;
    }

    const alarmDate = safeParseDate(event.start_date);
    if (!alarmDate) {
      console.warn("Invalid event start date", event.start_date);
      return;
    }

    // Set exact time: 18:00 the day before
    const triggerDate = new Date(alarmDate);
    triggerDate.setDate(triggerDate.getDate() - 1);
    triggerDate.setHours(18, 0, 0, 0);

    // NOTIFICATION TESTING
    // Ustaw na true żeby ustawić powiadomienia za 5 sekund
    const IS_TESTING = false;
    if (IS_TESTING) {
      triggerDate.setTime(Date.now() + 5000);
    }
    // -------------------------------  

    const now = new Date();
    if (triggerDate.getTime() <= now.getTime()) {
      return; // Do not schedule in the past
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Przypomnienie o wydarzeniu",
          body: `Jutro o ${event.start_date.split("T")[1]?.slice(0, 5) || "nieznanej porze"} odbędzie się wydarzenie: ${event.title}.`,
          data: { eventId: event.id },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerDate,
        },
        identifier: event.id.toString(),
      });
      console.log(`Scheduling notification for event ${event.id} at ${triggerDate.toString()}`);
    } catch (e: any) {
      console.error("Failed to schedule notification:", e);
    }
  }

  async cancelEventReminder(eventId: number): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(eventId.toString());
      console.log(`Cancelled notification for event ${eventId}`);
    } catch (e) {
      console.error("Failed to cancel scheduled notification:", e);
    }
  }
}

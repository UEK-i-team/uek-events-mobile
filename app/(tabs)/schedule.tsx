import { AuthGate } from "@/features/auth";
import { ScheduleView } from "@/features/schedule/views/schedule-view";

export default function ScheduleScreen() {
  return (
    <AuthGate>
      <ScheduleView />
    </AuthGate>
  );
}

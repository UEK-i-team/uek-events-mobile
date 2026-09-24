import { AuthGate } from "@/features/auth";
import { useSchedule } from "@/features/schedule/contexts/schedule-context";
import { ScheduleView } from "@/features/schedule/views/schedule-view";

export default function ScheduleScreen() {
  const { hasCachedSchedule, isCacheHydrated } = useSchedule();

  return (
    <AuthGate
      allowOfflineAccess={hasCachedSchedule}
      isOfflineAccessReady={isCacheHydrated}
    >
      <ScheduleView />
    </AuthGate>
  );
}

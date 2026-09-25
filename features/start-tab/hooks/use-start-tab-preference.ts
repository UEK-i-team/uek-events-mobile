import { useCallback, useEffect, useState } from "react";

import { parseStartTabPreference, StartTabPreference } from "../start-tab-preference";
import { startTabPreferenceStorage } from "../start-tab-storage";

export function useStartTabPreference() {
  const [preference, setPreferenceState] = useState<StartTabPreference>("auto");

  useEffect(() => {
    let isMounted = true;
    startTabPreferenceStorage.get().then((stored) => {
      if (isMounted) setPreferenceState(parseStartTabPreference(stored));
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const setPreference = useCallback((next: StartTabPreference) => {
    setPreferenceState(next);
    startTabPreferenceStorage.set(next).catch(console.error);
  }, []);

  return { preference, setPreference };
}

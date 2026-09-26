import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo, useRef } from "react";
import { AppState } from "react-native";
import { useAuth } from "@/features/auth";
import { NotificationContext } from "@/features/notifications/contexts/notification-context";
import { AsyncStorageService } from "@/shared/storage/async-storage-service/async-storage-service";
import { useDependencies } from "@/shared/di/DependencyProvider";
import { IScheduleEvent, IScheduleGroupsResponse } from "@/shared/types/schedule";
import { describeError } from "@/shared/utils/describe-error";
import {
  buildVersionsParam,
  flattenScheduleEvents,
  mergeScheduleResult,
  migrateScheduleCache,
  ScheduleCache,
} from "../utils/schedule-cache";
import { pruneUnknownGroupIds } from "../utils/prune-group-ids";

interface RefreshScheduleOptions {
  /** Show a "synced" toast once the backend responds successfully. */
  notifyOnSuccess?: boolean;
}

interface ScheduleContextProps {
  selectedGroupIds: number[];
  scheduleEvents: IScheduleEvent[];
  isLoading: boolean;
  isCacheHydrated: boolean;
  hasCachedSchedule: boolean;
  lastUpdatedAt: Date | null;
  fetchError: boolean;
  setSelectedGroupIds: (ids: number[]) => void;
  refreshSchedule: (options?: RefreshScheduleOptions) => Promise<void>;
  getGroupName: (groupId: number) => string;
  groupsData: IScheduleGroupsResponse | null;
  isGroupsLoading: boolean;
  groupsError: boolean;
  refreshGroups: () => Promise<void>;
}

const ScheduleContext = createContext<ScheduleContextProps | undefined>(undefined);

const RESUME_REFRESH_THROTTLE_MS = 60_000;
const SYNCED_TOAST_DURATION_MS = 1000;

const selectedGroupsStorage = new AsyncStorageService<number[]>("selected-schedule-groups");
const scheduleCacheStorage = new AsyncStorageService<unknown>("schedule-events-cache");
// Versions used to live under a separate key; they are now stored with the classes.
const legacyScheduleVersionsStorage = new AsyncStorageService<unknown>("schedule-versions-cache");

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
  const { scheduleRepository } = useDependencies();
  const { status } = useAuth();
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);
  const [scheduleCache, setScheduleCache] = useState<ScheduleCache | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCacheHydrated, setIsCacheHydrated] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [groupsData, setGroupsData] = useState<IScheduleGroupsResponse | null>(null);
  const [isGroupsLoading, setIsGroupsLoading] = useState(false);
  const [groupsError, setGroupsError] = useState(false);
  // Only a network response may prune the selection; cached groups can be stale.
  const [freshGroupsData, setFreshGroupsData] = useState<IScheduleGroupsResponse | null>(null);

  const statusRef = useRef(status);
  statusRef.current = status;
  const fetchIdRef = useRef(0);
  const groupsDataRef = useRef(groupsData);
  groupsDataRef.current = groupsData;
  const groupsRequestRef = useRef<Promise<void> | null>(null);
  const scheduleCacheRef = useRef(scheduleCache);
  const isCacheHydratedRef = useRef(isCacheHydrated);
  isCacheHydratedRef.current = isCacheHydrated;
  const lastFetchSucceededAtRef = useRef(0);
  const notifySyncedRef = useRef(false);
  const notificationContext = useContext(NotificationContext);
  const showNotificationRef = useRef(notificationContext?.showNotification);
  showNotificationRef.current = notificationContext?.showNotification;

  const scheduleEvents = useMemo(
    () => flattenScheduleEvents(scheduleCache, selectedGroupIds),
    [scheduleCache, selectedGroupIds],
  );
  const lastUpdatedAt = useMemo(
    () => (scheduleCache?.fetchedAt ? new Date(scheduleCache.fetchedAt) : null),
    [scheduleCache],
  );

  const applyCache = useCallback((cache: ScheduleCache | null) => {
    scheduleCacheRef.current = cache;
    setScheduleCache(cache);
  }, []);

  // Load selected groups, cached schedule and cached groups on mount
  useEffect(() => {
    const loadInitData = async () => {
      try {
        const [storedIds, cachedSchedule, cachedGroups] = await Promise.all([
          selectedGroupsStorage.get(),
          scheduleCacheStorage.get().then(migrateScheduleCache),
          scheduleRepository.getCachedGroups(),
        ]);
        legacyScheduleVersionsStorage.remove().catch(console.error);

        if (storedIds) {
          setSelectedGroupIds(storedIds);
        }
        if (cachedGroups) {
          setGroupsData((current) => current ?? cachedGroups);
        }
        if (cachedSchedule && statusRef.current !== "unauthenticated") {
          applyCache(cachedSchedule);
        }
      } catch (error) {
        console.error("Failed to load schedule context data:", error);
      } finally {
        setIsCacheHydrated(true);
      }
    };

    loadInitData();
  }, [scheduleRepository, applyCache]);

  // Sync selected group IDs to storage whenever they change
  useEffect(() => {
    if (isCacheHydrated) {
      selectedGroupsStorage.set(selectedGroupIds).catch(console.error);
    }
  }, [selectedGroupIds, isCacheHydrated]);

  // The schedule belongs to the logged-in user: drop it once the session ends.
  // Selected groups are kept so the schedule comes back after logging in again.
  useEffect(() => {
    if (status !== "unauthenticated") return;

    fetchIdRef.current++;
    notifySyncedRef.current = false;
    setIsLoading(false);
    setFetchError(false);
    applyCache(null);
    scheduleCacheStorage.remove().catch(console.error);
  }, [status, applyCache]);

  const saveSchedule = useCallback(async (cache: ScheduleCache) => {
    applyCache(cache);
    setFetchError(false);
    lastFetchSucceededAtRef.current = Date.now();
    await scheduleCacheStorage.set(cache);
  }, [applyCache]);

  const refreshGroups = useCallback(() => {
    if (statusRef.current !== "authenticated") return Promise.resolve();
    if (groupsRequestRef.current) return groupsRequestRef.current;

    setIsGroupsLoading(true);
    const request = scheduleRepository
      .getAvailableGroups()
      .then((groups) => {
        setGroupsData(groups);
        setFreshGroupsData(groups);
        setGroupsError(false);
      })
      .catch((error) => {
        console.warn("Failed to fetch schedule groups:", describeError(error));
        setGroupsError(true);
      })
      .finally(() => {
        groupsRequestRef.current = null;
        setIsGroupsLoading(false);
      });

    groupsRequestRef.current = request;
    return request;
  }, [scheduleRepository]);

  // Waits for hydration: groups may arrive before the stored selection is read.
  useEffect(() => {
    if (!freshGroupsData || !isCacheHydrated) return;
    setSelectedGroupIds((current) => pruneUnknownGroupIds(current, freshGroupsData));
  }, [freshGroupsData, isCacheHydrated]);

  /**
   * `notifyOnSuccess` stays pending until a fetch succeeds or fails, so it also
   * covers the fetch started automatically once an unverified session is restored.
   */
  const refreshSchedule = useCallback(async (options?: RefreshScheduleOptions) => {
    if (options?.notifyOnSuccess) {
      notifySyncedRef.current = true;
    }
    if (statusRef.current !== "authenticated") return;

    if (!groupsDataRef.current) {
      void refreshGroups();
    }

    const currentFetchId = ++fetchIdRef.current;
    const requestedIds = selectedGroupIds;

    if (requestedIds.length === 0) {
      setIsLoading(false);
      notifySyncedRef.current = false;
      await saveSchedule({ groups: {}, fetchedAt: new Date().toISOString() }).catch(console.error);
      return;
    }

    setIsLoading(true);

    try {
      const versions = buildVersionsParam(scheduleCacheRef.current, requestedIds);
      const result = await scheduleRepository.fetchScheduleForGroup(requestedIds, versions);

      if (currentFetchId === fetchIdRef.current) {
        const nextCache = mergeScheduleResult(scheduleCacheRef.current, requestedIds, result, {
          sentVersions: versions !== undefined,
          fetchedAt: new Date().toISOString(),
        });
        await saveSchedule(nextCache);
        if (notifySyncedRef.current) {
          notifySyncedRef.current = false;
          showNotificationRef.current?.("success", "Zsynchronizowano plan zajęć", SYNCED_TOAST_DURATION_MS);
        }
      }
    } catch (error) {
      // Keep the cached schedule: only an explicit session end removes it.
      console.warn("Failed to fetch schedule events:", describeError(error));
      if (currentFetchId === fetchIdRef.current) {
        notifySyncedRef.current = false;
        setFetchError(true);
      }
    } finally {
      if (currentFetchId === fetchIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [selectedGroupIds, scheduleRepository, saveSchedule, refreshGroups]);

  // Fetch the latest schedule once the session is confirmed and whenever groups change.
  // Only a change of the groups is the user's own action worth confirming; the
  // first fetch after startup or login stays silent.
  const fetchedGroupsKeyRef = useRef<string | null>(null);
  useEffect(() => {
    if (status !== "authenticated" || !isCacheHydrated) return;

    const groupsKey = [...selectedGroupIds].sort((a, b) => a - b).join(",");
    const groupsChanged = fetchedGroupsKeyRef.current !== null && fetchedGroupsKeyRef.current !== groupsKey;
    fetchedGroupsKeyRef.current = groupsKey;
    refreshSchedule(groupsChanged ? { notifyOnSuccess: true } : undefined);
  }, [status, isCacheHydrated, refreshSchedule, selectedGroupIds]);

  useEffect(() => {
    if (status === "authenticated") {
      refreshGroups();
    }
  }, [status, refreshGroups]);

  // Resuming the app does not change the auth status, so it would not trigger
  // the effects above.
  const refreshScheduleRef = useRef(refreshSchedule);
  refreshScheduleRef.current = refreshSchedule;

  // Only a return from "background" means the user was in another app; iOS
  // also goes active -> inactive -> active for Control Center or system prompts.
  const appStateRef = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      const previousState = appStateRef.current;
      appStateRef.current = nextState;

      if (
        nextState !== "active" ||
        previousState !== "background" ||
        statusRef.current !== "authenticated" ||
        !isCacheHydratedRef.current ||
        Date.now() - lastFetchSucceededAtRef.current < RESUME_REFRESH_THROTTLE_MS
      ) {
        return;
      }

      void refreshScheduleRef.current({ notifyOnSuccess: true });
      void refreshGroups();
    });

    return () => subscription.remove();
  }, [refreshGroups]);

  const getGroupName = useCallback((groupId: number) => {
    if (!groupsData) return `Grupa ${groupId}`;
    
    // search in planzajec
    if (groupsData.planzajec) {
      const pz = groupsData.planzajec.find((g: any) => g.id === groupId);
      if (pz) return pz.group_code || pz.name;
    }
    
    // search in usos
    if (groupsData.usos) {
      for (const g of groupsData.usos) {
        const sg = g.sub_groups.find((s: any) => s.id === groupId);
        if (sg) return g.group_code ? `${g.group_code} • ${sg.group_number}` : `Grupa ${sg.group_number}`;
      }
    }
    
    return `Grupa ${groupId}`;
  }, [groupsData]);

  return (
    <ScheduleContext.Provider
      value={{
        selectedGroupIds,
        scheduleEvents,
        isLoading,
        isCacheHydrated,
        hasCachedSchedule: scheduleCache !== null,
        lastUpdatedAt,
        fetchError,
        setSelectedGroupIds,
        refreshSchedule,
        getGroupName,
        groupsData,
        isGroupsLoading,
        groupsError,
        refreshGroups,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error("useSchedule must be used within a ScheduleProvider");
  }
  return context;
};

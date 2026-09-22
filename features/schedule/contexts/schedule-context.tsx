import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { AsyncStorageService } from "@/shared/storage/async-storage-service/async-storage-service";
import { useDependencies } from "@/shared/di/DependencyProvider";
import { IScheduleEvent, IScheduleGroupsResponse } from "@/shared/types/schedule";

interface ScheduleContextProps {
  selectedGroupIds: number[];
  scheduleEvents: IScheduleEvent[];
  isLoading: boolean;
  setSelectedGroupIds: (ids: number[]) => void;
  refreshSchedule: () => Promise<void>;
  getGroupName: (groupId: number) => string;
  groupsData: IScheduleGroupsResponse | null;
}

const ScheduleContext = createContext<ScheduleContextProps | undefined>(undefined);

const selectedGroupsStorage = new AsyncStorageService<number[]>("selected-schedule-groups");
const scheduleCacheStorage = new AsyncStorageService<IScheduleEvent[]>("schedule-events-cache");
const scheduleVersionsStorage = new AsyncStorageService<Record<number, string>>("schedule-versions-cache");

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
  const { scheduleRepository } = useDependencies();
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);
  const [scheduleEvents, setScheduleEvents] = useState<IScheduleEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [groupsData, setGroupsData] = useState<any>(null);

  // Load selected groups and cached schedule on mount
  useEffect(() => {
    const loadInitData = async () => {
      try {
        const storedIds = await selectedGroupsStorage.get();
        if (storedIds) {
          setSelectedGroupIds(storedIds);
        }
        
        const cachedEvents = await scheduleCacheStorage.get();
        if (cachedEvents) {
          setScheduleEvents(cachedEvents);
        }
      } catch (error) {
        console.error("Failed to load schedule context data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitData();
    
    // Also background fetch groups to populate names
    scheduleRepository.getAvailableGroups().then(setGroupsData).catch(console.error);
  }, [scheduleRepository]);

  // Sync selected group IDs to storage whenever they change
  useEffect(() => {
    if (!isLoading) {
      selectedGroupsStorage.set(selectedGroupIds).catch(console.error);
    }
  }, [selectedGroupIds, isLoading]);



  const fetchIdRef = React.useRef(0);

  const refreshSchedule = useCallback(async () => {
    if (selectedGroupIds.length === 0) {
      setScheduleEvents([]);
      await scheduleCacheStorage.remove();
      return;
    }
    
    const currentFetchId = ++fetchIdRef.current;
    setIsLoading(true);
    
    try {
      const versions = await scheduleVersionsStorage.get() || {};
      const versionsArray = selectedGroupIds.map(id => Number(versions[id]) || 0);
      
      const newEvents = await scheduleRepository.fetchScheduleForGroup(selectedGroupIds, versionsArray);
      
      if (currentFetchId === fetchIdRef.current) {
        if (newEvents) {
          setScheduleEvents(newEvents);
          await scheduleCacheStorage.set(newEvents);
        }
      }
    } catch (error) {
      console.error("Failed to fetch schedule events:", error);
    } finally {
      if (currentFetchId === fetchIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [selectedGroupIds, scheduleRepository]);

  // Whenever selected groups change, try to fetch the latest schedule
  useEffect(() => {
    if (!isLoading) {
      refreshSchedule();
    }
  }, [selectedGroupIds]);

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
    <ScheduleContext.Provider value={{ selectedGroupIds, scheduleEvents, isLoading, setSelectedGroupIds, refreshSchedule, getGroupName, groupsData }}>
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

export interface IUsosSubGroup {
  id: number;
  group_number: number;
}

export interface IUsosGroup {
  group_code: string;
  name: string;
  schedule_category: string;
  sub_groups: IUsosSubGroup[];
}

export interface IPlanzajecGroup {
  id: number;
  group_code: string;
  name: string;
  schedule_category: string;
}

export interface IScheduleGroupsResponse {
  usos: IUsosGroup[];
  planzajec: IPlanzajecGroup[];
}

export interface ISelectedGroup {
  id: number;
  type: "usos" | "planzajec";
  name: string;
  schedule_category: string;
}

export interface IScheduleFetchRequest {
  group_ids?: number[];
  versions?: Record<number, string>; // Maps group ID to its version if available
}

export interface IScheduleEvent {
  id?: number;
  group_id?: number;
  start_time: string; // ISO date string from API
  end_time: string; // ISO date string from API
  course: string; // API field for title
  room?: {
    name: string;
  };
  type: string; // e.g. "PHYSICAL_EDUCATION"
  teacher?: {
    name: string;
    url?: string;
  };
  duration?: number;
  url?: string;
  notes?: string;
  borderColor?: string;
  roomDotColor?: string;
}

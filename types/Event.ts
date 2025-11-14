export interface EventType {
    id: number;
    name: string;
    singleUrl?: string;
    location?: {
      latitude: string;
      longitude: string;
    };
    type?: {
      id: number;
      name: string;
    };
    "@entityType"?: string;
  }
  
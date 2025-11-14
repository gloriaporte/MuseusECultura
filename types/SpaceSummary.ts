export interface SpaceSummary {
    id: number;
    name: string;
    singleUrl?: string;
    type?: {
      id: number;
      name: string;
    };
    location?: {
      latitude: string;
      longitude: string;
    };
  }
  
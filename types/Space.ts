export interface SpaceType {
  id: number;
  name: string;
  singleUrl: string;
  "@entityType": "space";
  location: {
    latitude: string;
    longitude: string;
  };
  type: {
    id: number;
    name: string;
  };
  terms?: {
    tag?: string[];
    area?: string[];
  };
  files?: {
    header?: {
      url: string;
      [key: string]: any;
    };
    avatar?: {
      url: string;
      [key: string]: any;
    };
  };
}

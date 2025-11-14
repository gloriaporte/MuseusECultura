export interface SpaceDetail {
    id: number;
    name: string;
    public: boolean;
    shortDescription?: string;
    longDescription?: string;
    status?: number;
  
    location?: {
      latitude: string;
      longitude: string;
    };
  
    type?: {
      id: number;
      name: string;
    };
  
    endereco?: string;
    En_Nome_Logradouro?: string;
    En_Num?: string;
    En_Complemento?: string;
    En_Bairro?: string;
    En_CEP?: string;
    En_Municipio?: string;
    En_Estado?: string;
  
    telefonePublico?: string;
    emailPublico?: string;
    horario?: string;
  
    acessibilidade?: string;
    acessibilidade_fisica?: string[];
  
    geoEstado?: string;
    geoMunicipio?: string;
  
    terms?: {
      tag?: string[];
      area?: string[];
    };
  
    metalists?: {
      videos?: {
        id: number;
        title: string;
        value: string; // URL do vídeo
      }[];
    };
  
    files?: {
      header?: {
        id: number;
        url: string;
      };
      avatar?: {
        id: number;
        url: string;
        transformations?: {
          avatarSmall?: { url: string };
          avatarMedium?: { url: string };
          avatarBig?: { url: string };
        };
      };
    };
  
    seals?: {
      sealId: number;
      name: string;
      singleUrl: string;
      files?: {
        avatar?: {
          url: string;
        };
      };
    }[];
  
    createTimestamp?: { date: string };
    updateTimestamp?: { date: string };
  
    singleUrl?: string;
  }
  
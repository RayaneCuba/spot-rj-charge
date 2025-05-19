
export interface Station {
  id: number;
  name: string;
  city: string;
  lat: number;
  lng: number;
  type: string;
  hours: string;
  distance?: number;
  availability?: "disponível" | "ocupado" | "offline";
  connectorTypes?: string[];
}

export interface RouteInfo {
  distance: number; // em km
  duration: number; // em minutos
  geometry: any; // GeoJSON
}

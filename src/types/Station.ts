
export interface Station {
  id: number;
  name: string;
  city: string;
  lat: number;
  lng: number;
  type: string;
  hours: string;
  distance?: number;
}

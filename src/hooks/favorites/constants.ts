
import { Station } from '@/types/Station';

// Mock de estações favoritas para modo visitante
export const VISITOR_FAVORITES: Station[] = [
  {
    id: 1,
    name: "Estação Central",
    city: "São Paulo",
    lat: -23.550520,
    lng: -46.633308,
    type: "fast",
    hours: "24h",
    availability: "disponível",
    connectorTypes: ["Type 2", "CCS"]
  },
  {
    id: 5,
    name: "Shopping Vila Olímpia",
    city: "São Paulo",
    lat: -23.595066,
    lng: -46.686631,
    type: "ultra-fast",
    hours: "10h-22h",
    availability: "disponível",
    connectorTypes: ["Type 2", "CCS", "CHAdeMO"]
  }
];

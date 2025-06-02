
import { Station } from '@/types/Station';

export function getUniqueConnectorTypes(stations: Station[]): string[] {
  return Array.from(
    new Set(
      stations
        .flatMap(station => station.connectorTypes || [])
        .filter(Boolean)
    )
  );
}

export function isStationAvailable(station: Station): boolean {
  return station.availability === "disponível";
}

export function formatDistance(distance?: number): string {
  if (distance === undefined) return '';
  return `${distance.toFixed(1)} km`;
}

export function getStationStatusColor(availability: string): string {
  switch (availability) {
    case "disponível":
      return "text-green-600";
    case "ocupado":
      return "text-yellow-600";
    case "offline":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
}


import { memo } from "react";
import { ChargingMapContainer } from "./map/ChargingMapContainer";
import { AsyncBoundary } from "./ui/AsyncBoundary";

interface ChargingMapProps {
  cityFilter?: string;
}

export const ChargingMap = memo(function ChargingMap({ cityFilter = "" }: ChargingMapProps) {
  return (
    <div className="space-y-6">
      <AsyncBoundary>
        <ChargingMapContainer cityFilter={cityFilter} />
      </AsyncBoundary>
    </div>
  );
});

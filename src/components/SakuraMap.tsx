"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, CircleMarker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { STATUS_CONFIG, type SakuraSpot, type BloomStatus } from "@/lib/data";

function statusColor(status: BloomStatus): string {
  return STATUS_CONFIG[status]?.color ?? "#ccc";
}

function FitBounds({ spots }: { spots: SakuraSpot[] }) {
  const map = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (fitted.current || spots.length === 0) return;
    fitted.current = true;
    map.setView([36.5, 137.0], 6);
  }, [spots, map]);

  return null;
}

function FlyTo({ spot }: { spot: SakuraSpot | null }) {
  const map = useMap();

  useEffect(() => {
    if (spot?.lat != null && spot?.lng != null) {
      map.flyTo([spot.lat, spot.lng], 14, { duration: 1 });
    }
  }, [spot, map]);

  return null;
}

export default function SakuraMap({
  spots,
  onSpotClick,
  focusSpot,
}: {
  spots: SakuraSpot[];
  onSpotClick: (spot: SakuraSpot) => void;
  focusSpot?: SakuraSpot | null;
}) {
  return (
    <MapContainer
      center={[36.5, 137.0]}
      zoom={6}
      className="h-full w-full"
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
      />
      <FitBounds spots={spots} />
      <FlyTo spot={focusSpot ?? null} />
      {spots.map((spot) => {
        if (spot.lat == null || spot.lng == null) return null;
        const isMankai = spot.status === "満開";
        return (
          <CircleMarker
            key={spot.id}
            center={[spot.lat, spot.lng]}
            radius={isMankai ? 7 : 5}
            pathOptions={{
              fillColor: statusColor(spot.status),
              fillOpacity: 0.9,
              color: STATUS_CONFIG[spot.status]?.borderColor ?? "#999",
              weight: 2,
            }}
            eventHandlers={{
              click: () => onSpotClick(spot),
            }}
          />
        );
      })}
    </MapContainer>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
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
    // Default Japan bounds
    map.setView([36.5, 137.0], 6);
  }, [spots, map]);

  return null;
}

export default function SakuraMap({
  spots,
  onSpotClick,
}: {
  spots: SakuraSpot[];
  onSpotClick: (spot: SakuraSpot) => void;
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
              color: isMankai ? "#e91e63" : "#999",
              weight: isMankai ? 2 : 1,
            }}
            eventHandlers={{
              click: () => onSpotClick(spot),
            }}
          >
            <Tooltip direction="top" offset={[0, -6]}>
              <b>{spot.name}</b>
              <br />
              {STATUS_CONFIG[spot.status]?.emoji ?? ""} {spot.status}
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}

"use client";

import Link from "next/link";
import StatusBadge from "./StatusBadge";
import type { SakuraSpot } from "@/lib/data";

export default function SpotCard({ spot }: { spot: SakuraSpot }) {
  const tierLabel = spot.tier === "A" ? "気象庁" : spot.tier === "B" ? "実測" : "推定";

  return (
    <Link
      href={`/spot/${spot.id}`}
      className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
    >
      {spot.imageUrl ? (
        <img
          src={spot.imageUrl}
          alt={spot.name}
          className="h-16 w-16 rounded-lg object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-pink-50 text-2xl">
          🌸
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-gray-900">
          {spot.name}
        </h3>
        <p className="text-xs text-gray-500">{spot.region}</p>
        <div className="mt-1 flex items-center gap-2">
          <StatusBadge status={spot.status} />
          <span className="text-[10px] text-gray-400">{tierLabel}</span>
        </div>
      </div>
    </Link>
  );
}

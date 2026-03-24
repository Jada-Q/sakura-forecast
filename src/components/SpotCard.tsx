"use client";

import Link from "next/link";
import StatusBadge from "./StatusBadge";
import { useLocale } from "@/lib/locale-context";
import type { SakuraSpot } from "@/lib/data";

export default function SpotCard({ spot }: { spot: SakuraSpot }) {
  const { t } = useLocale();
  const tierKey = spot.tier === "A" ? "tierShortA" : spot.tier === "B" ? "tierShortB" : "tierShortC";

  return (
    <Link
      href={`/spot?id=${spot.id}`}
      className="flex items-center gap-3 rounded-xl border border-warm-border bg-warm-card p-3 shadow-sm transition-shadow hover:shadow-md"
    >
      {spot.imageUrl ? (
        <img
          src={spot.imageUrl}
          alt={spot.name}
          className="h-16 w-16 rounded-lg object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-warm-peach text-2xl">
          🌸
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-warm-text">
          {spot.name}
        </h3>
        <p className="text-xs text-warm-muted">{spot.region}</p>
        <div className="mt-1 flex items-center gap-2">
          <StatusBadge status={spot.status} />
          <span className="text-[10px] text-warm-muted">{t(tierKey)}</span>
        </div>
      </div>
    </Link>
  );
}

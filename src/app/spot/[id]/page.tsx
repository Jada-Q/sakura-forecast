"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";
import { DATA_URL, STATUS_CONFIG, type SakuraSpot, type SakuraData } from "@/lib/data";
import { toggleFavorite, isFavorite } from "@/lib/favorites";
import { useLocale } from "@/lib/locale-context";

export default function SpotPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const spotId = parseInt(id, 10);
  const router = useRouter();
  const { t } = useLocale();
  const [spot, setSpot] = useState<SakuraSpot | null>(null);
  const [fav, setFav] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(DATA_URL)
      .then((r) => r.json())
      .then((data: SakuraData) => {
        const indexed = data.spots.map((s, i) => ({ ...s, id: i }) as SakuraSpot);
        setSpot(indexed[spotId] ?? null);
        setFav(isFavorite(spotId));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [spotId]);

  if (loading) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <span className="animate-pulse text-3xl">🌸</span>
      </div>
    );
  }

  if (!spot) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4 pb-nav">
        <p className="text-gray-500">{t("spotNotFound")}</p>
        <button
          onClick={() => router.push("/")}
          className="rounded-full bg-pink-500 px-6 py-2 text-sm text-white"
        >
          {t("backToMap")}
        </button>
      </div>
    );
  }

  const tierKey = spot.tier === "A" ? "tierA" : spot.tier === "B" ? "tierB" : "tierC";
  const statusConfig = STATUS_CONFIG[spot.status];

  return (
    <div className="min-h-dvh bg-white pb-nav">
      {/* Hero */}
      <div
        className="relative h-56"
        style={{ backgroundColor: statusConfig?.color ?? "#f5f5f5" }}
      >
        {spot.imageUrl ? (
          <img src={spot.imageUrl} alt={spot.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-6xl opacity-30">🌸</div>
        )}
        <button
          onClick={() => router.back()}
          className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm"
        >
          <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button
          onClick={() => { toggleFavorite(spotId); setFav(!fav); }}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm"
        >
          <svg
            className={`h-5 w-5 ${fav ? "fill-pink-500 text-pink-500" : "text-gray-700"}`}
            fill={fav ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pt-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{spot.name}</h1>
            <p className="mt-0.5 text-sm text-gray-500">{spot.region}</p>
          </div>
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500">
            {t(tierKey)}
          </span>
        </div>

        <div className="mt-3">
          <StatusBadge status={spot.status} size="md" />
        </div>

        <div className="mt-6 space-y-3">
          {spot.tier === "A" && (
            <>
              {spot.date && <InfoRow label={t("observationDate")} value={spot.date} />}
              {spot.normalDate && <InfoRow label={t("normalDate")} value={spot.normalDate} />}
            </>
          )}
          {spot.season && <InfoRow label={t("bestSeason")} value={spot.season} />}
          {spot.tags && spot.tags.length > 0 && (
            <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">
              <span className="text-xs font-medium text-gray-500">{t("tags")}</span>
              <div className="flex flex-wrap gap-1.5">
                {spot.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-white px-2.5 py-0.5 text-xs text-gray-600 shadow-sm">{tag}</span>
                ))}
              </div>
            </div>
          )}
          {spot.lat && spot.lng && (
            <InfoRow label={t("coordinates")} value={`${spot.lat.toFixed(4)}, ${spot.lng.toFixed(4)}`} />
          )}
        </div>

        <div className="mt-6 space-y-2">
          {spot.detailUrl && (
            <a href={spot.detailUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full border border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
              {t("walkerLink")}
            </a>
          )}
          {spot.lat && spot.lng && (
            <a href={`https://www.google.com/maps/search/?api=1&query=${spot.lat},${spot.lng}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full border border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
              {t("googleMapsLink")}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  );
}

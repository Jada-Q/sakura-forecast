"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import FilterChips from "@/components/FilterChips";
import StatusBadge from "@/components/StatusBadge";
import LangSwitcher from "@/components/LangSwitcher";
import { DATA_URL, type SakuraSpot, type BloomStatus, type SakuraData } from "@/lib/data";
import { toggleFavorite, isFavorite } from "@/lib/favorites";
import { useLocale } from "@/lib/locale-context";

const SakuraMap = dynamic(() => import("@/components/SakuraMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-gray-50">
      <span className="animate-pulse text-2xl">🌸</span>
    </div>
  ),
});

export default function MapPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [spots, setSpots] = useState<SakuraSpot[]>([]);
  const [meta, setMeta] = useState<{
    updatedAt: string;
    counts: SakuraData["counts"];
  } | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Set<BloomStatus>>(
    new Set()
  );
  const [selectedSpot, setSelectedSpot] = useState<SakuraSpot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(DATA_URL)
      .then((r) => r.json())
      .then((data: SakuraData) => {
        const indexed = data.spots
          .map((s, i) => ({ ...s, id: i }) as SakuraSpot)
          .filter((s) => s.lat != null && s.lng != null);
        setSpots(indexed);
        setMeta({ updatedAt: data.updatedAt, counts: data.counts });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load data:", err);
        setLoading(false);
      });
  }, []);

  const filteredSpots = useMemo(() => {
    let result = spots;
    if (statusFilter.size > 0) {
      result = result.filter((s) => statusFilter.has(s.status));
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.region.toLowerCase().includes(q)
      );
    }
    return result;
  }, [spots, statusFilter, search]);

  const toggleStatus = useCallback((status: BloomStatus) => {
    setStatusFilter((prev) => {
      const next = new Set(prev);
      if (next.has(status)) {
        next.delete(status);
      } else {
        next.add(status);
      }
      return next;
    });
  }, []);

  const handleSpotClick = useCallback((spot: SakuraSpot) => {
    setSelectedSpot(spot);
  }, []);

  return (
    <div className="relative flex h-dvh flex-col pb-nav">
      {/* Header */}
      <div className="relative z-10 space-y-2 bg-white/95 px-4 pb-2 pt-3 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">
            🌸 {t("appTitle")}
          </h1>
          <div className="flex items-center gap-2">
            <LangSwitcher />
            {meta && (
              <span className="text-[10px] text-gray-400">
                {meta.updatedAt}
              </span>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm outline-none transition-colors focus:border-pink-300 focus:bg-white"
          />
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>

        {/* Filters */}
        <FilterChips selected={statusFilter} onToggle={toggleStatus} />

        {/* Count */}
        <p className="text-[11px] text-gray-400">
          {filteredSpots.length} / {spots.length} {t("spotsShowing")}
        </p>
      </div>

      {/* Map */}
      <div className="relative flex-1">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <span className="animate-pulse text-3xl">🌸</span>
          </div>
        ) : (
          <SakuraMap spots={filteredSpots} onSpotClick={handleSpotClick} />
        )}
      </div>

      {/* Spot preview sheet */}
      {selectedSpot && (
        <div className="fixed inset-x-0 bottom-[60px] z-[1000] mx-auto max-w-lg px-4 pb-2">
          <div className="relative rounded-2xl border border-gray-100 bg-white p-4 shadow-lg">
            <div className="absolute right-3 top-3 flex gap-2">
              <FavButton spotId={selectedSpot.id} />
              <button
                onClick={() => setSelectedSpot(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="flex items-start gap-3">
              {selectedSpot.imageUrl ? (
                <img
                  src={selectedSpot.imageUrl}
                  alt={selectedSpot.name}
                  className="h-20 w-20 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-pink-50 text-3xl">
                  🌸
                </div>
              )}
              <div className="flex-1 pr-16">
                <h3 className="text-base font-bold text-gray-900">
                  {selectedSpot.name}
                </h3>
                <p className="text-xs text-gray-500">{selectedSpot.region}</p>
                <div className="mt-1">
                  <StatusBadge status={selectedSpot.status} size="md" />
                </div>
                {selectedSpot.season && (
                  <p className="mt-1 text-xs text-gray-400">
                    {t("bestSeason")}: {selectedSpot.season}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => {
                  router.push(`/spot?id=${selectedSpot.id}`);
                  setSelectedSpot(null);
                }}
                className="flex-1 rounded-full bg-pink-500 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-pink-600"
              >
                {t("viewDetails")}
              </button>
              {selectedSpot.lat && selectedSpot.lng && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedSpot.lat},${selectedSpot.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  {t("mapLink")}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FavButton({ spotId }: { spotId: number }) {
  const [fav, setFav] = useState(() => isFavorite(spotId));

  useEffect(() => {
    setFav(isFavorite(spotId));
  }, [spotId]);

  return (
    <button
      onClick={() => {
        toggleFavorite(spotId);
        setFav(!fav);
      }}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100"
    >
      <svg
        className={`h-4 w-4 ${fav ? "fill-pink-500 text-pink-500" : "text-gray-400"}`}
        fill={fav ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
    </button>
  );
}

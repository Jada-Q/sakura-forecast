"use client";

import { useState, useEffect } from "react";
import SpotCard from "@/components/SpotCard";
import { getFavorites } from "@/lib/favorites";
import { DATA_URL, type SakuraSpot, type SakuraData } from "@/lib/data";
import { useLocale } from "@/lib/locale-context";

export default function FavoritesPage() {
  const { t } = useLocale();
  const [spots, setSpots] = useState<SakuraSpot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const favIds = getFavorites();
    if (favIds.length === 0) {
      setLoading(false);
      return;
    }

    fetch(DATA_URL)
      .then((r) => r.json())
      .then((data: SakuraData) => {
        const indexed = data.spots.map((s, i) => ({ ...s, id: i }) as SakuraSpot);
        const favSpots = favIds
          .map((id) => indexed[id])
          .filter(Boolean);
        setSpots(favSpots);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-dvh bg-warm-bg pb-nav">
      <div className="bg-warm-card px-4 pb-3 pt-4 shadow-sm">
        <h1 className="text-lg font-bold text-warm-text">{t("favoritesTitle")}</h1>
        <p className="text-xs text-warm-muted">
          {spots.length} {t("spots")}
        </p>
      </div>

      <div className="space-y-2 px-4 pt-3">
        {loading ? (
          <div className="flex justify-center py-12">
            <span className="animate-pulse text-2xl">🌸</span>
          </div>
        ) : spots.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <span className="text-4xl opacity-30">🌸</span>
            <p className="text-sm text-warm-muted">
              {t("noFavorites")}
            </p>
            <p className="text-xs text-warm-muted/60">
              {t("addFavHint")}
            </p>
          </div>
        ) : (
          spots.map((spot) => <SpotCard key={spot.id} spot={spot} />)
        )}
      </div>
    </div>
  );
}

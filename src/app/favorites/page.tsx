"use client";

import { useState, useEffect } from "react";
import SpotCard from "@/components/SpotCard";
import { getFavorites } from "@/lib/favorites";
import { DATA_URL, type SakuraSpot, type SakuraData } from "@/lib/data";

export default function FavoritesPage() {
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
    <div className="min-h-dvh bg-gray-50 pb-nav">
      <div className="bg-white px-4 pb-3 pt-4 shadow-sm">
        <h1 className="text-lg font-bold text-gray-900">お気に入り</h1>
        <p className="text-xs text-gray-400">
          {spots.length} スポット
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
            <p className="text-sm text-gray-400">
              お気に入りのスポットがありません
            </p>
            <p className="text-xs text-gray-300">
              地図やスポット詳細からハートをタップして追加
            </p>
          </div>
        ) : (
          spots.map((spot) => <SpotCard key={spot.id} spot={spot} />)
        )}
      </div>
    </div>
  );
}

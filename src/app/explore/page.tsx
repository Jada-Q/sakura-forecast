"use client";

import { useState, useEffect, useMemo } from "react";
import SpotCard from "@/components/SpotCard";
import FilterChips from "@/components/FilterChips";
import { DATA_URL, type SakuraSpot, type BloomStatus, type SakuraData } from "@/lib/data";

const REGION_GROUPS = [
  { label: "すべて", value: "" },
  { label: "北海道", value: "北海道" },
  { label: "東北", value: "東北" },
  { label: "関東", value: "関東" },
  { label: "北陸", value: "北陸" },
  { label: "甲信", value: "甲信" },
  { label: "東海", value: "東海" },
  { label: "近畿", value: "近畿" },
  { label: "中国", value: "中国" },
  { label: "四国", value: "四国" },
  { label: "九州", value: "九州" },
  { label: "沖縄", value: "沖縄" },
];

export default function ExplorePage() {
  const [spots, setSpots] = useState<SakuraSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Set<BloomStatus>>(new Set());
  const [regionFilter, setRegionFilter] = useState("");

  useEffect(() => {
    fetch(DATA_URL)
      .then((r) => r.json())
      .then((data: SakuraData) => {
        const indexed = data.spots.map((s, i) => ({ ...s, id: i }) as SakuraSpot);
        setSpots(indexed);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = spots;
    if (statusFilter.size > 0) {
      result = result.filter((s) => statusFilter.has(s.status));
    }
    if (regionFilter) {
      result = result.filter((s) => s.region.includes(regionFilter));
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
  }, [spots, statusFilter, regionFilter, search]);

  return (
    <div className="min-h-dvh bg-gray-50 pb-nav">
      <div className="sticky top-0 z-10 space-y-2 bg-white px-4 pb-3 pt-4 shadow-sm">
        <h1 className="text-lg font-bold text-gray-900">探索</h1>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="地名を検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm outline-none focus:border-pink-300 focus:bg-white"
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

        {/* Region chips */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
          {REGION_GROUPS.map((r) => (
            <button
              key={r.value}
              onClick={() => setRegionFilter(r.value)}
              className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                regionFilter === r.value
                  ? "bg-pink-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <FilterChips
          selected={statusFilter}
          onToggle={(status) =>
            setStatusFilter((prev) => {
              const next = new Set(prev);
              next.has(status) ? next.delete(status) : next.add(status);
              return next;
            })
          }
        />

        <p className="text-[11px] text-gray-400">
          {filtered.length} スポット
        </p>
      </div>

      {/* List */}
      <div className="space-y-2 px-4 pt-3">
        {loading ? (
          <div className="flex justify-center py-12">
            <span className="animate-pulse text-2xl">🌸</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-400">
            条件に一致するスポットがありません
          </div>
        ) : (
          filtered.slice(0, 100).map((spot) => (
            <SpotCard key={spot.id} spot={spot} />
          ))
        )}
        {filtered.length > 100 && (
          <p className="py-4 text-center text-xs text-gray-400">
            上位 100 件を表示中（全 {filtered.length} 件）
          </p>
        )}
      </div>
    </div>
  );
}

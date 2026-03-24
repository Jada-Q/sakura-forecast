export interface SakuraSpot {
  id: number;
  tier: "A" | "B" | "C";
  name: string;
  region: string;
  status: BloomStatus;
  lat: number | null;
  lng: number | null;
  // A tier
  date?: string | null;
  normalDate?: string | null;
  // B/C tier
  season?: string | null;
  tags?: string[];
  imageUrl?: string | null;
  detailUrl?: string | null;
}

export type BloomStatus =
  | "つぼみ"
  | "咲き始め"
  | "5分咲き"
  | "7分咲き"
  | "満開"
  | "散り始め"
  | "青葉";

export interface SakuraData {
  updatedAt: string;
  counts: { A: number; B: number; C: number };
  spots: Omit<SakuraSpot, "id">[];
}

export const STATUS_CONFIG: Record<
  BloomStatus,
  { color: string; emoji: string; label: string }
> = {
  つぼみ: { color: "#E8F5E9", emoji: "", label: "つぼみ" },
  咲き始め: { color: "#FFE4E8", emoji: "🌱", label: "咲き始め" },
  "5分咲き": { color: "#FFD1DB", emoji: "🌷", label: "5分咲き" },
  "7分咲き": { color: "#FFC2D1", emoji: "🌸", label: "7分咲き" },
  満開: { color: "#FFB7C5", emoji: "🌸", label: "満開" },
  散り始め: { color: "#F5F5F5", emoji: "🍃", label: "散り始め" },
  青葉: { color: "#D9EBD9", emoji: "🌿", label: "青葉" },
};

export const REGIONS = [
  "北海道",
  "東北",
  "関東",
  "北陸",
  "甲信越",
  "東海",
  "近畿",
  "中国",
  "四国",
  "九州",
  "沖縄",
] as const;

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const DATA_URL = `${basePath}/data.json`;

let cachedData: SakuraSpot[] | null = null;
let cachedMeta: { updatedAt: string; counts: SakuraData["counts"] } | null =
  null;

export async function fetchSakuraData(): Promise<SakuraSpot[]> {
  if (cachedData) return cachedData;

  const res = await fetch(DATA_URL, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Failed to fetch data: ${res.status}`);

  const data: SakuraData = await res.json();
  cachedMeta = { updatedAt: data.updatedAt, counts: data.counts };

  cachedData = data.spots
    .map((spot, i) => ({ ...spot, id: i } as SakuraSpot))
    .filter((s) => s.lat != null && s.lng != null);

  return cachedData;
}

export async function fetchSakuraMeta() {
  if (!cachedMeta) await fetchSakuraData();
  return cachedMeta!;
}

export function getRegionFromName(region: string): string {
  for (const r of REGIONS) {
    if (region.includes(r)) return r;
  }
  return "その他";
}

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

// Display groups: 7 raw statuses → 4 display statuses
export type DisplayStatus = "つぼみ" | "開花中" | "満開" | "葉桜";

const BLOOM_TO_DISPLAY: Record<BloomStatus, DisplayStatus> = {
  つぼみ: "つぼみ",
  咲き始め: "開花中",
  "5分咲き": "開花中",
  "7分咲き": "開花中",
  満開: "満開",
  散り始め: "葉桜",
  青葉: "葉桜",
};

export function getDisplayStatus(status: BloomStatus): DisplayStatus {
  return BLOOM_TO_DISPLAY[status] ?? "つぼみ";
}

// Reverse mapping: display status → all raw statuses it includes
export const DISPLAY_TO_BLOOM: Record<DisplayStatus, BloomStatus[]> = {
  つぼみ: ["つぼみ"],
  開花中: ["咲き始め", "5分咲き", "7分咲き"],
  満開: ["満開"],
  葉桜: ["散り始め", "青葉"],
};

export const DISPLAY_STATUS_CONFIG: Record<
  DisplayStatus,
  { color: string; borderColor: string; emoji: string }
> = {
  つぼみ: { color: "#B5C9A8", borderColor: "#8FAF7C", emoji: "🌱" },
  開花中: { color: "#E8B89D", borderColor: "#D09070", emoji: "🌷" },
  満開: { color: "#D4848B", borderColor: "#BE6B73", emoji: "🌸" },
  葉桜: { color: "#B5A99A", borderColor: "#958778", emoji: "🍃" },
};

// Keep STATUS_CONFIG for backward compat (maps raw status → display color)
export const STATUS_CONFIG: Record<
  BloomStatus,
  { color: string; borderColor: string; emoji: string; label: string }
> = Object.fromEntries(
  (Object.keys(BLOOM_TO_DISPLAY) as BloomStatus[]).map((status) => {
    const display = BLOOM_TO_DISPLAY[status];
    const config = DISPLAY_STATUS_CONFIG[display];
    return [status, { ...config, label: status }];
  })
) as Record<BloomStatus, { color: string; borderColor: string; emoji: string; label: string }>;

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

// Prefecture → region group mapping
const PREF_TO_REGION: Record<string, string> = {
  北海道: "北海道",
  青森県: "東北", 岩手県: "東北", 宮城県: "東北", 秋田県: "東北", 山形県: "東北", 福島県: "東北",
  茨城県: "関東", 栃木県: "関東", 群馬県: "関東", 埼玉県: "関東", 千葉県: "関東", 東京都: "関東", 神奈川県: "関東",
  新潟県: "甲信", 富山県: "北陸", 石川県: "北陸", 福井県: "北陸",
  山梨県: "甲信", 長野県: "甲信",
  岐阜県: "東海", 静岡県: "東海", 愛知県: "東海", 三重県: "東海",
  滋賀県: "近畿", 京都府: "近畿", 大阪府: "近畿", 兵庫県: "近畿", 奈良県: "近畿", 和歌山県: "近畿",
  鳥取県: "中国", 島根県: "中国", 岡山県: "中国", 広島県: "中国", 山口県: "中国",
  徳島県: "四国", 香川県: "四国", 愛媛県: "四国", 高知県: "四国",
  福岡県: "九州", 佐賀県: "九州", 長崎県: "九州", 熊本県: "九州", 大分県: "九州", 宮崎県: "九州", 鹿児島県: "九州",
  沖縄県: "沖縄",
};

export function getRegionGroup(region: string): string {
  // A-tier: region is like "関東甲信", "九州北部"
  for (const r of REGIONS) {
    if (region.includes(r)) return r;
  }
  // B/C-tier: region is like "東京都文京区", "埼玉県北本市"
  for (const [pref, group] of Object.entries(PREF_TO_REGION)) {
    if (region.startsWith(pref)) return group;
  }
  return "その他";
}

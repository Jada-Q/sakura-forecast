export type Locale = "ja" | "zh" | "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  ja: "日本語",
  zh: "中文",
  en: "EN",
};

const translations = {
  // App
  appTitle: { ja: "Sakura Forecast", zh: "Sakura Forecast", en: "Sakura Forecast" },

  // Bottom nav
  navMap: { ja: "地図", zh: "地图", en: "Map" },
  navExplore: { ja: "探索", zh: "探索", en: "Explore" },
  navFavorites: { ja: "お気に入り", zh: "收藏", en: "Favorites" },

  // Search
  searchPlaceholder: { ja: "地名を検索...", zh: "搜索地名...", en: "Search place..." },

  // Display statuses (4 groups)
  つぼみ: { ja: "つぼみ", zh: "花蕾", en: "Budding" },
  開花中: { ja: "開花中", zh: "开花中", en: "Blooming" },
  満開: { ja: "満開", zh: "满开", en: "Full Bloom" },
  葉桜: { ja: "葉桜", zh: "叶樱", en: "Past Peak" },

  // Raw statuses (for detail display)
  咲き始め: { ja: "咲き始め", zh: "初开", en: "Starting" },
  "5分咲き": { ja: "5分咲き", zh: "半开", en: "50%" },
  "7分咲き": { ja: "7分咲き", zh: "七分开", en: "70%" },
  散り始め: { ja: "散り始め", zh: "开始凋谢", en: "Falling" },
  青葉: { ja: "青葉", zh: "绿叶", en: "Green" },

  // Map page
  spotsShowing: { ja: "スポット表示中", zh: "个景点显示中", en: "spots shown" },
  viewDetails: { ja: "詳細を見る", zh: "查看详情", en: "View Details" },
  mapLink: { ja: "地図", zh: "地图", en: "Map" },
  bestSeason: { ja: "見頃", zh: "最佳观赏期", en: "Best Season" },

  // Spot detail
  observationDate: { ja: "観測日", zh: "观测日", en: "Observed" },
  normalDate: { ja: "平年日", zh: "往年日期", en: "Normal Date" },
  tags: { ja: "タグ", zh: "标签", en: "Tags" },
  coordinates: { ja: "座標", zh: "坐标", en: "Coordinates" },
  walkerLink: { ja: "Walker+ で詳細を見る →", zh: "在 Walker+ 查看详情 →", en: "View on Walker+ →" },
  googleMapsLink: { ja: "Google Maps で開く →", zh: "在 Google Maps 打开 →", en: "Open in Google Maps →" },
  spotNotFound: { ja: "スポットが見つかりません", zh: "未找到景点", en: "Spot not found" },
  backToMap: { ja: "地図に戻る", zh: "返回地图", en: "Back to Map" },

  // Explore
  exploreTitle: { ja: "探索", zh: "探索", en: "Explore" },
  allRegions: { ja: "すべて", zh: "全部", en: "All" },
  spots: { ja: "スポット", zh: "个景点", en: "spots" },
  noResults: { ja: "条件に一致するスポットがありません", zh: "没有符合条件的景点", en: "No spots match your filters" },
  showingTop: { ja: "上位 {n} 件を表示中（全 {total} 件）", zh: "显示前 {n} 个（共 {total} 个）", en: "Showing top {n} of {total}" },

  // Favorites
  favoritesTitle: { ja: "お気に入り", zh: "收藏", en: "Favorites" },
  noFavorites: { ja: "お気に入りのスポットがありません", zh: "还没有收藏的景点", en: "No favorite spots yet" },
  addFavHint: { ja: "地図やスポット詳細からハートをタップして追加", zh: "在地图或详情页点击心形按钮添加", en: "Tap the heart icon on map or spot detail to add" },

  // Tier labels
  tierA: { ja: "🅰 気象庁", zh: "🅰 气象厅", en: "🅰 JMA" },
  tierB: { ja: "🅱 実測", zh: "🅱 实测", en: "🅱 Observed" },
  tierC: { ja: "🅲 推定", zh: "🅲 推定", en: "🅲 Estimated" },
  tierShortA: { ja: "気象庁", zh: "气象厅", en: "JMA" },
  tierShortB: { ja: "実測", zh: "实测", en: "Observed" },
  tierShortC: { ja: "推定", zh: "推定", en: "Estimated" },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, locale: Locale): string {
  return translations[key]?.[locale] ?? translations[key]?.["ja"] ?? key;
}

export function tReplace(
  key: TranslationKey,
  locale: Locale,
  replacements: Record<string, string | number>
): string {
  let text = t(key, locale);
  for (const [k, v] of Object.entries(replacements)) {
    text = text.replace(`{${k}}`, String(v));
  }
  return text;
}

const STORAGE_KEY = "sakura-locale";

export function getSavedLocale(): Locale {
  if (typeof window === "undefined") return "ja";
  return (localStorage.getItem(STORAGE_KEY) as Locale) || "ja";
}

export function saveLocale(locale: Locale) {
  localStorage.setItem(STORAGE_KEY, locale);
}

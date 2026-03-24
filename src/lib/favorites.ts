const STORAGE_KEY = "sakura-favorites";

export function getFavorites(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(id: number): number[] {
  const favs = getFavorites();
  const idx = favs.indexOf(id);
  if (idx >= 0) {
    favs.splice(idx, 1);
  } else {
    favs.push(id);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
  return favs;
}

export function isFavorite(id: number): boolean {
  return getFavorites().includes(id);
}

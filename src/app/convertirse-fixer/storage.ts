export const STORAGE_KEYS = {
  userId: "FIXER_USER_ID",
  fixerId: "FIXER_ID",
  ci: "FIXER_CI",
  location: "FIXER_LOCATION",
  categories: "FIXER_CATEGORIES",
  payment: "FIXER_PAYMENT",
} as const;

export function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function removeFromStorage(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}


const TOKEN_KEY = "authToken";
const USER_KEY = "userData";

export const SESSION_EVENTS = {
  login: "login-exitoso",
  logout: "logout-exitoso",
  updated: "session-actualizada",
} as const;

export type StoredUser = {
  id: string;
  nombre?: string;
  apellido?: string;
  correo?: string;
  rol?: string;
  fixerId?: string | null;
  [key: string]: any;
};

function getStorages() {
  if (typeof window === "undefined") return [];
  return [window.localStorage, window.sessionStorage];
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY) ?? window.sessionStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_KEY) ?? window.sessionStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function persistSession(data: { token?: string | null; user?: StoredUser | null }) {
  const storages = getStorages();
  if (!storages.length) return;
  storages.forEach((storage) => {
    if (data.token !== undefined) {
      if (data.token === null) storage.removeItem(TOKEN_KEY);
      else storage.setItem(TOKEN_KEY, data.token);
    }
    if (data.user !== undefined) {
      if (data.user === null) storage.removeItem(USER_KEY);
      else storage.setItem(USER_KEY, JSON.stringify(data.user));
    }
  });
}

export function updateStoredUser(partial: Partial<StoredUser>) {
  const current = getStoredUser();
  if (!current) return;
  const token = getToken();
  persistSession({
    token: token ?? undefined,
    user: { ...current, ...partial },
  });
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(SESSION_EVENTS.updated));
  }
}

export function clearSession() {
  persistSession({ token: null, user: null });
}

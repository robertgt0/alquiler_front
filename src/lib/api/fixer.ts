// src/lib/api/fixer.ts
// URL del backend (p.ej. http://localhost:5000)
const API = process.env.NEXT_PUBLIC_API_URL || "";

// Tipos de respuesta
type ApiOk<T> = { success: true; data: T } & Record<string, any>;
type ApiFail = { success: false; message: string };
type ApiResp<T> = ApiOk<T> | ApiFail;

// ---------------------------------------------------------------------
// Utilidad: fetch con tolerancia a error (para no reventar el flujo)
async function safeFetch(url: string, init?: RequestInit) {
  const res = await fetch(url, init);
  let json: any = null;
  try {
    json = await res.json();
  } catch {
    // sin cuerpo JSON
  }
  if (!res.ok) {
    const msg = json?.message || `Error HTTP ${res.status}`;
    throw new Error(msg);
  }
  return json;
}

// ---------------------------------------------------------------------
// 1) Verificar CI único
export async function checkCI(ci: string, excludeId?: string) {
  const url = new URL(`${API}/api/fixer/check-ci`);
  url.searchParams.set("ci", ci);
  if (excludeId) url.searchParams.set("excludeId", excludeId);

  const json = await safeFetch(url.toString(), { cache: "no-store" });
  return json as { success: true; unique: boolean; message: string };
}

// 2) Crear Fixer (mínimo)
export async function createFixer(data: { userId: string; ci?: string; location?: any }) {
  const json = (await safeFetch(`${API}/api/fixer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })) as ApiResp<any>;
  if ((json as ApiFail).success === false) {
    throw new Error((json as ApiFail).message || "No se pudo crear el Fixer");
  }
  return json as ApiOk<any>;
}

// 3) Actualizar solo CI
export async function updateIdentity(id: string, ci: string) {
  const json = (await safeFetch(`${API}/api/fixer/${id}/identity`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ci }),
  })) as ApiResp<any>;
  if ((json as ApiFail).success === false) {
    throw new Error((json as ApiFail).message || "No se pudo actualizar el C.I.");
  }
  return json as ApiOk<any>;
}

// 4) Guardar categorías del fixer
export async function setFixerCategories(id: string, categories: string[]) {
  const json = (await safeFetch(`${API}/api/fixer/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ categories }),
  })) as ApiResp<any>;
  if ((json as ApiFail).success === false) {
    throw new Error((json as ApiFail).message || "No se pudieron guardar las categorías");
  }
  return json as ApiOk<any>;
}

// ---------------------------------------------------------------------
// 5) Upsert final (HU05): CI + ubicación + categorías + pago + terms
export type FinalFixerPayload = {
  id?: string;
  userId: string;
  ci: string;
  location: { lat: number; lng: number; address?: string } | null;
  categories: string[];
  payment: {
    methods: ("card" | "qr" | "cash")[];
    accountOwner?: string;
    accountNumber?: string;
  };
  termsAcceptedAt: string; // ISO
};

export async function upsertFixerFinal(payload: FinalFixerPayload) {
  // Si no hay API configurada, haz un mock para no romper el flujo:
  if (!API) {
    console.warn("[upsertFixerFinal] NEXT_PUBLIC_API_URL vacío. Mock OK.");
    return { success: true, data: payload };
  }

  // Si tiene 'id', actualiza; si no, crea.
  if (payload.id) {
    const json = (await safeFetch(`${API}/api/fixer/${payload.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })) as ApiResp<any>;
    if ((json as ApiFail).success === false) {
      throw new Error((json as ApiFail).message || "No se pudo actualizar el Fixer");
    }
    return json as ApiOk<any>;
  }

  const json = (await safeFetch(`${API}/api/fixer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })) as ApiResp<any>;
  if ((json as ApiFail).success === false) {
    throw new Error((json as ApiFail).message || "No se pudo crear el Fixer");
  }
  return json as ApiOk<any>;
}

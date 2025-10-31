import type {
  CiudadesResponse,
  ProvinciasResponse,
  EspecialidadesResponse,
  UsuariosResponse,
  Ciudad,
  Provincia,
  Especialidad,
  UsuarioResumen,
} from "../Types/filtroType";

// Normalizar NEXT_PUBLIC_API_URL para evitar duplicar '/api' si el valor ya lo incluye
const rawBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
const normalized = rawBase.replace(/\/+$/, ""); // quitar slashes finales
const apiRoot = normalized.endsWith("/api") ? normalized : `${normalized}/api`;
// Prefijo de rutas para el módulo de borbotones
const FILTROS_BASE = `${apiRoot}/borbotones/filtros`;
type Option = { value: string; label: string };

/* --------- type guards --------- */
const isCiudad = (v: unknown): v is Ciudad => {
  if (typeof v !== "object" || v === null) return false;
  const o = v as Record<string, unknown>;
  return typeof o.id_ciudad === "number" && typeof o.nombre === "string";
};

const isProvincia = (v: unknown): v is Provincia => {
  if (typeof v !== "object" || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.id_provincia === "number" &&
    typeof o.nombre === "string" &&
    typeof o.id_ciudad === "number"
  );
};

const isEspecialidad = (v: unknown): v is Especialidad => {
  if (typeof v !== "object" || v === null) return false;
  const o = v as Record<string, unknown>;
  return typeof o.id_especialidad === "number" && typeof o.nombre === "string";
};

const isUsuario = (v: unknown): v is UsuarioResumen => {
  if (typeof v !== "object" || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o._id === "string" &&
    typeof o.id_usuario === "number" &&
    typeof o.nombre === "string"
  );
};

const isAbortError = (e: unknown): e is DOMException =>
  typeof e === "object" && e !== null && (e as DOMException).name === "AbortError";

// Interface para respuestas de departamentos
interface DepartamentosResponse {
  success: boolean;
  data: string[];
}

// Interface para respuestas de ciudades por departamento
interface CiudadesPorDepartamentoResponse {
  success: boolean;
  data: Array<{
    nombre: string;
    id_ciudad?: number;
  }>;
}

/* --------- ciudades --------- */
export async function getCiudades(
  q?: string,
  page = 1,
  limit = 100,
  soloBolivia?: boolean
): Promise<Option[]> {
  const url = new URL(`${FILTROS_BASE}/ciudades`);
  if (q && q.trim()) url.searchParams.set("q", q.trim());
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));
  if (soloBolivia) url.searchParams.set("soloBolivia", "true");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Error ${res.status} al obtener ciudades`);
  const json: unknown = await res.json();

  const ok =
    typeof json === "object" &&
    json !== null &&
    (json as CiudadesResponse).success === true &&
    Array.isArray((json as CiudadesResponse).data) &&
    ((json as CiudadesResponse).data as unknown[]).every(isCiudad);
  if (!ok) throw new Error("Respuesta inválida (ciudades)");

  return (json as CiudadesResponse).data.map((c) => ({
    value: c.nombre,
    label: c.nombre,
  }));
}

/* --------- departamentos (Bolivia) --------- */
export const getDepartamentos = async (): Promise<Option[]> => {
  try {
    const url = `${FILTROS_BASE}/departamentos`;
    console.log('Fetching departamentos from:', url);
    
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });
    if (!res.ok) {
      let body = '';
      try { body = await res.text(); } catch (e) { body = '<no body>'; }
      console.error(`[filtro.api] getDepartamentos fallo ${res.status} -> ${url}\n${body}`);
      throw new Error(`Error ${res.status} al obtener departamentos`);
    }
    const json: unknown = await res.json();

    const ok =
      typeof json === "object" &&
      json !== null &&
      (json as DepartamentosResponse).success === true &&
      Array.isArray((json as DepartamentosResponse).data) &&
      (json as DepartamentosResponse).data.every((d: unknown) => typeof d === "string");
    if (!ok) throw new Error("Respuesta inválida (departamentos)");

    return (json as DepartamentosResponse).data.map((d: string) => ({ value: d, label: d }));
  } catch (error) {
    console.error('[filtro.api] Error en getDepartamentos:', error);
    throw error;
  }
}

/* --------- ciudades por departamento (frontend helper) --------- */
export const getCiudadesPorDepartamento = async (departamento: string): Promise<Option[]> => {
  const url = new URL(`${FILTROS_BASE}/ciudades/por-departamento`);
  url.searchParams.set("departamento", departamento);
  
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Error ${res.status} al obtener ciudades por departamento`);
  const json: unknown = await res.json();
  
  const ok =
    typeof json === "object" &&
    json !== null &&
    (json as CiudadesPorDepartamentoResponse).success === true &&
    Array.isArray((json as CiudadesPorDepartamentoResponse).data) &&
    (json as CiudadesPorDepartamentoResponse).data.every((c: unknown) => 
      typeof c === "object" && c !== null && typeof (c as { nombre: string }).nombre === "string"
    );
  
  if (!ok) throw new Error("Respuesta inválida (ciudades por departamento)");
  
  return (json as CiudadesPorDepartamentoResponse).data.map((c) => ({ 
    value: c.nombre, 
    label: c.nombre 
  }));
}

/* --------- provincias por ciudad --------- */
export async function getProvinciasPorCiudad(
  ciudad: string,
  signal?: AbortSignal
): Promise<Option[]> {
  if (!ciudad) return [];
  const url = `${FILTROS_BASE}/ciudad/provincias?ciudad=${encodeURIComponent(ciudad)}`;

  try {
    const res = await fetch(url, { signal });
    if (res.status === 404) {
      // Ciudad no encontrada en el backend -> devolver lista vacía (no hacer fallar la UI)
      console.warn(`⚠️ [FILTROS] Ciudad no encontrada al solicitar provincias: ${ciudad}`);
      return [];
    }

    if (!res.ok) throw new Error(`Error ${res.status} al cargar provincias`);
    const json: unknown = await res.json();

    const ok =
      typeof json === "object" &&
      json !== null &&
      (json as ProvinciasResponse).success === true &&
      Array.isArray((json as ProvinciasResponse).provincias) &&
      ((json as ProvinciasResponse).provincias as unknown[]).every(isProvincia);
    if (!ok) throw new Error("Respuesta inválida (provincias)");

    return (json as ProvinciasResponse).provincias.map((p) => ({
      value: String(p.id_provincia),
      label: p.nombre,
    }));
  } catch (e: unknown) {
    if (isAbortError(e)) return [];
    throw e;
  }
}

/* --------- especialidades --------- */
export async function getEspecialidades(): Promise<Option[]> {
  const url = `${FILTROS_BASE}/especialidades`;
  const res = await fetch(url);
  if (!res.ok) {
    let body = '';
    try { body = await res.text(); } catch (e) { body = '<no body>'; }
    console.error(`[filtro.api] getEspecialidades fallo ${res.status} -> ${url}\n${body}`);
    throw new Error(`Error ${res.status} al obtener especialidades`);
  }

  const json: unknown = await res.json();

  const ok =
    typeof json === "object" &&
    json !== null &&
    (json as EspecialidadesResponse).success === true &&
    Array.isArray((json as EspecialidadesResponse).data) &&
    ((json as EspecialidadesResponse).data as unknown[]).every(isEspecialidad);

  if (!ok) throw new Error("Respuesta inválida (especialidades)");

  return (json as EspecialidadesResponse).data.map((e) => ({
    value: String(e.id_especialidad),
    label: e.nombre,
  }));
}

/* --------- usuarios por disponibilidad --------- */
export async function getUsuariosPorDisponibilidad(
  disponible: boolean,
  signal?: AbortSignal
): Promise<UsuarioResumen[]> {
  const url = new URL(`${FILTROS_BASE}/usuarios/disponible`);
  url.searchParams.set("disponible", String(disponible));

  try {
    const res = await fetch(url.toString(), { signal });
    if (!res.ok) throw new Error(`Error ${res.status} al obtener usuarios`);
    const json: unknown = await res.json();

    const ok =
      typeof json === "object" &&
      json !== null &&
      (json as UsuariosResponse).success === true &&
      Array.isArray((json as UsuariosResponse).data) &&
      ((json as UsuariosResponse).data as unknown[]).every(isUsuario);
    if (!ok) throw new Error("Respuesta inválida (usuarios/disponible)");
    
    const data = (json as UsuariosResponse).data as UsuarioResumen[];
    // asegurar calificacion (si no existe, asignar aleatoria)
    const steps = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
    const withRating = data.map((u) => ({
      ...u,
      calificacion: u.calificacion ?? steps[Math.floor(Math.random() * steps.length)],
    }));
    return withRating;
  } catch (e: unknown) {
    if (isAbortError(e)) return [];
    throw e;
  }
}

/* --------- usuarios por especialidad (ID) --------- */
export async function getUsuariosPorEspecialidadId(
  especialidadId: number,
  signal?: AbortSignal
): Promise<UsuarioResumen[]> {
  const url = new URL(`${FILTROS_BASE}/usuarios/especialidad`);
  url.searchParams.set("especialidad_id", String(especialidadId));

  try {
    const res = await fetch(url.toString(), { signal });
    if (!res.ok) throw new Error(`Error ${res.status} al obtener usuarios por especialidad`);
    const json: unknown = await res.json();

    const ok =
      typeof json === "object" &&
      json !== null &&
      (json as UsuariosResponse).success === true &&
      Array.isArray((json as UsuariosResponse).data) &&
      ((json as UsuariosResponse).data as unknown[]).every(isUsuario);
    if (!ok) throw new Error("Respuesta inválida (usuarios/especialidad)");
    
    const data = (json as UsuariosResponse).data as UsuarioResumen[];
    const steps = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
    return data.map((u) => ({
      ...u,
      calificacion: u.calificacion ?? steps[Math.floor(Math.random() * steps.length)],
    }));
  } catch (e: unknown) {
    if (isAbortError(e)) return [];
    throw e;
  }
}

/* --------- usuarios por nombre de servicio --------- */
export async function getUsuariosPorServicioNombre(
  servicio: string,
  opts?: {
    disponible?: boolean;
    ciudad?: string;
    id_ciudad?: number;
    page?: number;
    limit?: number;
    signal?: AbortSignal;
  }
): Promise<UsuarioResumen[]> {
  const url = new URL(`${FILTROS_BASE}/usuarios/servicio`);
  url.searchParams.set("servicio", servicio);
  if (opts?.disponible !== undefined) url.searchParams.set("disponible", String(opts.disponible));
  if (opts?.ciudad) url.searchParams.set("ciudad", opts.ciudad);
  if (opts?.id_ciudad) url.searchParams.set("id_ciudad", String(opts.id_ciudad));
  if (opts?.page) url.searchParams.set("page", String(opts.page));
  if (opts?.limit) url.searchParams.set("limit", String(opts.limit));

  try {
    const res = await fetch(url.toString(), { signal: opts?.signal });
    if (!res.ok) throw new Error(`Error ${res.status} al buscar usuarios por servicio`);
    const json: unknown = await res.json();

    const ok =
      typeof json === "object" &&
      json !== null &&
      (json as UsuariosResponse).success === true &&
      Array.isArray((json as UsuariosResponse).data) &&
      ((json as UsuariosResponse).data as unknown[]).every(isUsuario);
    if (!ok) throw new Error("Respuesta inválida (usuarios/servicio)");
    
    const data = (json as UsuariosResponse).data as UsuarioResumen[];
    const steps = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
    return data.map((u) => ({
      ...u,
      calificacion: u.calificacion ?? steps[Math.floor(Math.random() * steps.length)],
    }));
  } catch (e: unknown) {
    if (isAbortError(e)) return [];
    throw e;
  }
}

/* --------- usuarios por ciudad --------- */
export async function getUsuariosPorCiudad(
  ciudad: string,
  signal?: AbortSignal
): Promise<UsuarioResumen[]> {
  const url = new URL(`${FILTROS_BASE}/usuarios/ciudad`);
  url.searchParams.set("ciudad", ciudad);

  try {
    const res = await fetch(url.toString(), { signal });
    if (!res.ok) throw new Error(`Error ${res.status} al obtener usuarios por ciudad`);
    const json: unknown = await res.json();

    const ok =
      typeof json === "object" &&
      json !== null &&
      (json as UsuariosResponse).success === true &&
      Array.isArray((json as UsuariosResponse).data) &&
      ((json as UsuariosResponse).data as unknown[]).every(isUsuario);
    if (!ok) throw new Error("Respuesta inválida (usuarios/ciudad)");
    
    const data = (json as UsuariosResponse).data as UsuarioResumen[];
    const steps = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
    return data.map((u) => ({
      ...u,
      calificacion: u.calificacion ?? steps[Math.floor(Math.random() * steps.length)],
    }));
  } catch (e: unknown) {
    if (isAbortError(e)) return [];
    throw e;
  }
}
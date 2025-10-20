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

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
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

/* --------- ciudades --------- */
export async function getCiudades(
  q?: string,
  page = 1,
  limit = 100,
  soloBolivia?: boolean
): Promise<Option[]> {
  const url = new URL(`${BASE_URL}/api/filtros/ciudades`);
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
export async function getDepartamentos(): Promise<Option[]> {
  const url = `${BASE_URL}/api/filtros/departamentos`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status} al obtener departamentos`);
  const json: unknown = await res.json();

  const ok =
    typeof json === "object" &&
    json !== null &&
    (json as any).success === true &&
    Array.isArray((json as any).data) &&
    (json as any).data.every((d: unknown) => typeof d === "string");
  if (!ok) throw new Error("Respuesta inválida (departamentos)");

  return (json as any).data.map((d: string) => ({ value: d, label: d }));
}

/* --------- ciudades por departamento (frontend helper) --------- */
export async function getCiudadesPorDepartamento(departamento: string): Promise<Option[]> {
  const url = `${BASE_URL}/api/filtros/ciudades/por-departamento?departamento=${encodeURIComponent(
    departamento
  )}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status} al obtener ciudades por departamento`);
  const json: unknown = await res.json();
  const ok =
    typeof json === "object" &&
    json !== null &&
    (json as any).success === true &&
    Array.isArray((json as any).data) &&
    (json as any).data.every((c: unknown) => typeof c === "object" && typeof (c as any).nombre === "string");
  if (!ok) throw new Error("Respuesta inválida (ciudades por departamento)");
  return (json as any).data.map((c: any) => ({ value: c.nombre, label: c.nombre }));
}

/* --------- provincias por ciudad --------- */
export async function getProvinciasPorCiudad(
  ciudad: string,
  signal?: AbortSignal
): Promise<Option[]> {
  if (!ciudad) return [];
  const url = `${BASE_URL}/api/filtros/ciudad/provincias?ciudad=${encodeURIComponent(
    ciudad
  )}`;

  try {
    const res = await fetch(url, { signal });
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
  const url = `${BASE_URL}/api/filtros/especialidades`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status} al obtener especialidades`);

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
  const url = new URL(`${BASE_URL}/api/filtros/usuarios/disponible`);
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

    return (json as UsuariosResponse).data;
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
  const url = new URL(`${BASE_URL}/api/filtros/usuarios/especialidad`);
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

    return (json as UsuariosResponse).data;
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
  const url = new URL(`${BASE_URL}/api/filtros/usuarios/servicio`);
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

    return (json as UsuariosResponse).data;
  } catch (e: unknown) {
    if (isAbortError(e)) return [];
    throw e;
  }
}



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

// http://localhost:5000
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://alquiler-back.vercel.app";

export type Option = { value: string; label: string };

/* --------- type guards --------- */
const isCiudad = (v: unknown): v is Ciudad =>
  typeof v === "object" &&
  v !== null &&
  typeof (v as Ciudad).id_ciudad === "number" &&
  typeof (v as Ciudad).nombre === "string";

const isProvincia = (v: unknown): v is Provincia =>
  typeof v === "object" &&
  v !== null &&
  typeof (v as Provincia).id_provincia === "number" &&
  typeof (v as Provincia).nombre === "string" &&
  typeof (v as Provincia).id_ciudad === "number";

const isEspecialidad = (v: unknown): v is Especialidad =>
  typeof v === "object" &&
  v !== null &&
  typeof (v as Especialidad).id_especialidad === "number" &&
  typeof (v as Especialidad).nombre === "string";

const isUsuario = (v: unknown): v is UsuarioResumen =>
  typeof v === "object" &&
  v !== null &&
  typeof (v as UsuarioResumen)._id === "string" &&
  typeof (v as UsuarioResumen).id_usuario === "number" &&
  typeof (v as UsuarioResumen).nombre === "string";

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
  if (q?.trim()) url.searchParams.set("q", q.trim());
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));
  if (soloBolivia) url.searchParams.set("soloBolivia", "true");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Error ${res.status} al obtener ciudades`);
  const json: CiudadesResponse = await res.json();

  if (
    !json.success ||
    !Array.isArray(json.data) ||
    !json.data.every(isCiudad)
  ) {
    throw new Error("Respuesta inválida (ciudades)");
  }

  return json.data.map((c) => ({
    value: c.nombre,
    label: c.nombre,
  }));
}

/* --------- departamentos --------- */
interface DepartamentosResponse {
  success: boolean;
  total: number;
  data: string[];
}

export async function getDepartamentos(): Promise<Option[]> {
  const url = `${BASE_URL}/api/filtros/departamentos`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status} al obtener departamentos`);

  const json: DepartamentosResponse = await res.json();

  if (!json.success || !Array.isArray(json.data)) {
    throw new Error("Respuesta inválida (departamentos)");
  }

  return json.data.map((d) => ({ value: d, label: d }));
}

/* --------- ciudades por departamento --------- */
interface CiudadesPorDepartamentoResponse {
  success: boolean;
  data: Ciudad[];
}

export async function getCiudadesPorDepartamento(
  departamento: string
): Promise<Option[]> {
  const url = `${BASE_URL}/api/filtros/ciudades/por-departamento?departamento=${encodeURIComponent(
    departamento
  )}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status} al obtener ciudades por departamento`);

  const json: CiudadesPorDepartamentoResponse = await res.json();

  if (!json.success || !Array.isArray(json.data) || !json.data.every(isCiudad)) {
    throw new Error("Respuesta inválida (ciudades por departamento)");
  }

  return json.data.map((c) => ({ value: c.nombre, label: c.nombre }));
}

/* --------- provincias por ciudad --------- */
export async function getProvinciasPorCiudad(
  ciudad: string,
  signal?: AbortSignal
): Promise<Option[]> {
  if (!ciudad) return [];

  const url = `${BASE_URL}/api/filtros/ciudad/provincias?ciudad=${encodeURIComponent(ciudad)}`;

  try {
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error(`Error ${res.status} al cargar provincias`);

    const json: ProvinciasResponse = await res.json();

    if (
      !json.success ||
      !Array.isArray(json.provincias) ||
      !json.provincias.every(isProvincia)
    ) {
      throw new Error("Respuesta inválida (provincias)");
    }

    return json.provincias.map((p) => ({
      value: String(p.id_provincia),
      label: p.nombre,
    }));
  } catch (e) {
    if (isAbortError(e)) return [];
    throw e;
  }
}

/* --------- especialidades --------- */
export async function getEspecialidades(): Promise<Option[]> {
  const url = `${BASE_URL}/api/filtros/especialidades`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status} al obtener especialidades`);

  const json: EspecialidadesResponse = await res.json();

  if (
    !json.success ||
    !Array.isArray(json.data) ||
    !json.data.every(isEspecialidad)
  ) {
    throw new Error("Respuesta inválida (especialidades)");
  }

  return json.data.map((e) => ({
    value: String(e.id_especialidad),
    label: e.nombre,
  }));
}

/* --------- usuarios --------- */
async function fetchUsuarios(url: URL, signal?: AbortSignal): Promise<UsuarioResumen[]> {
  const res = await fetch(url.toString(), { signal });
  if (!res.ok) throw new Error(`Error ${res.status} al obtener usuarios`);

  const json: UsuariosResponse = await res.json();

  if (
    !json.success ||
    !Array.isArray(json.data) ||
    !json.data.every(isUsuario)
  ) {
    throw new Error("Respuesta inválida (usuarios)");
  }

  return json.data;
}

/* --------- usuarios por disponibilidad --------- */
export async function getUsuariosPorDisponibilidad(
  disponible: boolean,
  signal?: AbortSignal
): Promise<UsuarioResumen[]> {
  const url = new URL(`${BASE_URL}/api/filtros/usuarios/disponible`);
  url.searchParams.set("disponible", String(disponible));
  try {
    return await fetchUsuarios(url, signal);
  } catch (e) {
    if (isAbortError(e)) return [];
    throw e;
  }
}

/* --------- usuarios por especialidad ID --------- */
export async function getUsuariosPorEspecialidadId(
  especialidadId: number,
  signal?: AbortSignal
): Promise<UsuarioResumen[]> {
  const url = new URL(`${BASE_URL}/api/filtros/usuarios/especialidad`);
  url.searchParams.set("especialidad_id", String(especialidadId));
  try {
    return await fetchUsuarios(url, signal);
  } catch (e) {
    if (isAbortError(e)) return [];
    throw e;
  }
}

/* --------- usuarios por nombre de servicio --------- */
interface ServicioOptions {
  disponible?: boolean;
  ciudad?: string;
  id_ciudad?: number;
  page?: number;
  limit?: number;
  signal?: AbortSignal;
}

export async function getUsuariosPorServicioNombre(
  servicio: string,
  opts?: ServicioOptions
): Promise<UsuarioResumen[]> {
  const url = new URL(`${BASE_URL}/api/filtros/usuarios/servicio`);
  url.searchParams.set("servicio", servicio);

  if (opts?.disponible !== undefined)
    url.searchParams.set("disponible", String(opts.disponible));
  if (opts?.ciudad) url.searchParams.set("ciudad", opts.ciudad);
  if (opts?.id_ciudad) url.searchParams.set("id_ciudad", String(opts.id_ciudad));
  if (opts?.page) url.searchParams.set("page", String(opts.page));
  if (opts?.limit) url.searchParams.set("limit", String(opts.limit));

  try {
    return await fetchUsuarios(url, opts?.signal);
  } catch (e) {
    if (isAbortError(e)) return [];
    throw e;
  }
}

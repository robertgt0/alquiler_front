import { useEffect, useRef, useState } from "react";
import {
  getCiudades,
  getProvinciasPorCiudad,
  getUsuariosPorDisponibilidad,
  getEspecialidades,
  getUsuariosPorEspecialidadId,
  getUsuariosPorServicioNombre, // ✅ solo usamos servicio en la barra
} from "app/alquiler/Feature/Services/filtro.api";
import type { UsuarioResumen } from "app/alquiler/Feature/Types/filtroType";

type Option = { value: string; label: string };

export function useFiltros() {
  const [filtro, setFiltro] = useState({
    ciudad: "",
    provincia: "",
    disponibilidad: "",   // "true" | "false" | ""
    tipoEspecialidad: "", // id_especialidad (string)
    busqueda: "",         // texto de la barra (servicio)
  });

  const [ciudades, setCiudades] = useState<Option[]>([]);
  const [provincias, setProvincias] = useState<Option[]>([]);
  const [especialidades, setEspecialidades] = useState<Option[]>([]);

  const [usuarios, setUsuarios] = useState<UsuarioResumen[]>([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [errorUsuarios, setErrorUsuarios] = useState<string | null>(null);

  const [loadingCiudades, setLoadingCiudades] = useState(false);
  const [loadingProvincias, setLoadingProvincias] = useState(false);
  const [loadingEspecialidades, setLoadingEspecialidades] = useState(false);

  const abortProvRef = useRef<AbortController | null>(null);
  const abortUsersRef = useRef<AbortController | null>(null);

  const disponibilidad: Option[] = [
    { value: "true", label: "Disponible" },
    { value: "false", label: "No disponible" },
  ];

  const handleChange = (campo: string, valor: string) =>
    setFiltro((prev) => ({ ...prev, [campo]: valor }));

  /* 🔎 Buscar por nombre de servicio (barra) */
  const buscarPorServicio = async (page = 1, limit = 50) => {
    const servicio = filtro.busqueda.trim();
    if (!servicio) return;

    abortUsersRef.current?.abort();
    const ac = new AbortController();
    abortUsersRef.current = ac;

    setLoadingUsuarios(true);
    setErrorUsuarios(null);

    try {
      const disponible =
        filtro.disponibilidad === "true"
          ? true
          : filtro.disponibilidad === "false"
          ? false
          : undefined;

      const data = await getUsuariosPorServicioNombre(servicio, {
        disponible,
        ciudad: filtro.ciudad || undefined,
        page,
        limit,
        signal: ac.signal,
      });

      setUsuarios(data);
    } catch (e: unknown) {
      setErrorUsuarios(e instanceof Error ? e.message : "Error al buscar usuarios");
      setUsuarios([]);
    } finally {
      setLoadingUsuarios(false);
    }
  };

  // Ciudades + Especialidades al montar
  useEffect(() => {
    setLoadingCiudades(true);
    getCiudades().then(setCiudades).finally(() => setLoadingCiudades(false));

    setLoadingEspecialidades(true);
    getEspecialidades().then(setEspecialidades).finally(() => setLoadingEspecialidades(false));
  }, []);

  // Provincias al cambiar ciudad
  useEffect(() => {
    setProvincias([]);
    setFiltro((prev) => ({ ...prev, provincia: "" }));
    if (!filtro.ciudad) return;

    abortProvRef.current?.abort();
    const ac = new AbortController();
    abortProvRef.current = ac;

    setLoadingProvincias(true);
    getProvinciasPorCiudad(filtro.ciudad, ac.signal)
      .then(setProvincias)
      .finally(() => setLoadingProvincias(false));

    return () => ac.abort();
  }, [filtro.ciudad]);

  // Usuarios por disponibilidad (automático desde el select)
  useEffect(() => {
    if (filtro.disponibilidad !== "true" && filtro.disponibilidad !== "false") return;

    abortUsersRef.current?.abort();
    const ac = new AbortController();
    abortUsersRef.current = ac;

    setLoadingUsuarios(true);
    setErrorUsuarios(null);

    const disponible = filtro.disponibilidad === "true";
    getUsuariosPorDisponibilidad(disponible, ac.signal)
      .then(setUsuarios)
      .catch((e: unknown) =>
        setErrorUsuarios(e instanceof Error ? e.message : "Error al cargar usuarios")
      )
      .finally(() => setLoadingUsuarios(false));

    return () => ac.abort();
  }, [filtro.disponibilidad]);

  // Usuarios por especialidad (automático por ID desde el select)
  useEffect(() => {
    if (!filtro.tipoEspecialidad) return;
    const id = Number(filtro.tipoEspecialidad);
    if (Number.isNaN(id)) return;

    abortUsersRef.current?.abort();
    const ac = new AbortController();
    abortUsersRef.current = ac;

    setLoadingUsuarios(true);
    setErrorUsuarios(null);

    getUsuariosPorEspecialidadId(id, ac.signal)
      .then(setUsuarios)
      .catch((e: unknown) =>
        setErrorUsuarios(e instanceof Error ? e.message : "Error al cargar usuarios por especialidad")
      )
      .finally(() => setLoadingUsuarios(false));

    return () => ac.abort();
  }, [filtro.tipoEspecialidad]);

  return {
    // selects
    ciudades,
    provincias,
    disponibilidad,
    especialidades,

    // filtros
    filtro,
    handleChange,

    // acción del buscador
    buscarPorServicio,

    // resultados
    usuarios,
    loadingUsuarios,
    errorUsuarios,

    // loaders opcionales
    loadingCiudades,
    loadingProvincias,
    loadingEspecialidades,
  };
}


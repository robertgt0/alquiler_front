import { useEffect, useRef, useState } from "react";
import {
  getCiudades,
  getProvinciasPorCiudad,
  getUsuariosPorDisponibilidad,
  getEspecialidades,
  getUsuariosPorEspecialidadId,
  getUsuariosPorServicioNombre,
} from "app/alquiler/Feature/Services/filtro.api";
import type { UsuarioResumen } from "app/alquiler/Feature/Types/filtroType";

type Option = { value: string; label: string };

export function useFiltros() {
  const [filtro, setFiltro] = useState({
    ciudad: "",
    provincia: "",
    disponibilidad: "",
    tipoEspecialidad: "",
    busqueda: "",
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

  const limpiarFiltros = () => {
    abortUsersRef.current?.abort();
    abortProvRef.current?.abort();
    setFiltro({
      ciudad: "",
      provincia: "",
      disponibilidad: "",
      tipoEspecialidad: "",
      busqueda: "",
    });
    setProvincias([]);
    setUsuarios([]);
    setErrorUsuarios(null);
  };

  const normalizarUsuarios = (data: any[]) =>
    data.map((u) => {
      const ciudad =
        (u.ciudad && typeof u.ciudad === "object" && u.ciudad.nombre) ||
        (typeof u.ciudad === "string" && u.ciudad) ||
        "Sin ciudad";

      const ciudadLink =
        u.ciudad && u.ciudad.id
          ? `/ciudad/${u.ciudad.id}`
          : `/ciudad/${encodeURIComponent(ciudad.toLowerCase())}`;

      const especialidad =
        (u.especialidad &&
          typeof u.especialidad === "object" &&
          u.especialidad.nombre) ||
        (typeof u.especialidad === "string" && u.especialidad) ||
        "Sin especialidad";

      return {
        ...u,
        ciudadNombre: ciudad,
        ciudadLink,
        especialidadNombre: especialidad,
      };
    });

  const buscarPorServicio = async (page = 1, limit = 50) => {
    const { ciudad, provincia, disponibilidad, tipoEspecialidad, busqueda } = filtro;

    if (!ciudad || !provincia || !disponibilidad || !tipoEspecialidad || !busqueda.trim()) {
      setErrorUsuarios("Por favor, completa todos los filtros antes de buscar.");
      setUsuarios([]);
      return;
    }

    if (disponibilidad !== "true") {
      setErrorUsuarios("Solo se muestran resultados cuando el usuario está disponible.");
      setUsuarios([]);
      return;
    }

    abortUsersRef.current?.abort();
    const ac = new AbortController();
    abortUsersRef.current = ac;

    setLoadingUsuarios(true);
    setErrorUsuarios(null);

    try {
      const data = await getUsuariosPorServicioNombre(busqueda.trim(), {
        ciudad,
        disponible: true,
        page,
        limit,
        signal: ac.signal,
      });

      const usuariosNormalizados = normalizarUsuarios(data);
      const ciudadSeleccionada = ciudades.find((c) => c.value === ciudad)?.label?.toLowerCase().trim();
      const usuariosFiltrados = usuariosNormalizados.filter(
        (u) => u.ciudadNombre?.toLowerCase().trim() === ciudadSeleccionada
      );

      if (usuariosFiltrados.length === 0) {
        setErrorUsuarios(`No se encontraron usuarios en ${ciudadSeleccionada}.`);
        setUsuarios([]);
        return;
      }

      setUsuarios(usuariosFiltrados);
    } catch (e: unknown) {
      setErrorUsuarios(e instanceof Error ? e.message : "Error al buscar usuarios");
      setUsuarios([]);
    } finally {
      setLoadingUsuarios(false);
    }
  };

  // 🚀 Cargar ciudades y especialidades al montar
  useEffect(() => {
    setLoadingCiudades(true);
    getCiudades()
      .then(setCiudades)
      .finally(() => setLoadingCiudades(false));

    setLoadingEspecialidades(true);
    getEspecialidades()
      .then(setEspecialidades)
      .finally(() => setLoadingEspecialidades(false));
  }, []);

  // 🔁 Cargar provincias y usuarios cuando cambia la ciudad
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

    // 🔄 Cargar usuarios disponibles automáticamente al cambiar ciudad
    if (filtro.disponibilidad === "true") {
      setLoadingUsuarios(true);
      setErrorUsuarios(null);

      getUsuariosPorDisponibilidad(true, ac.signal)
        .then((data) => {
          const usuariosNormalizados = normalizarUsuarios(data);
          const ciudadSeleccionada = ciudades.find((c) => c.value === filtro.ciudad)?.label?.toLowerCase().trim();

          const filtrados = usuariosNormalizados.filter(
            (u) => u.ciudadNombre?.toLowerCase().trim() === ciudadSeleccionada
          );

          setUsuarios(filtrados);
        })
        .catch((e: unknown) =>
          setErrorUsuarios(
            e instanceof Error ? e.message : "Error al cargar usuarios por ciudad"
          )
        )
        .finally(() => setLoadingUsuarios(false));
    }

    return () => ac.abort();
  }, [filtro.ciudad, filtro.disponibilidad, ciudades]);

  // 👨‍⚕️ Buscar usuarios por especialidad (solo si está “Disponible”)
  useEffect(() => {
    if (!filtro.tipoEspecialidad || filtro.disponibilidad !== "true") return;

    const id = Number(filtro.tipoEspecialidad);
    if (Number.isNaN(id)) return;

    abortUsersRef.current?.abort();
    const ac = new AbortController();
    abortUsersRef.current = ac;

    setLoadingUsuarios(true);
    setErrorUsuarios(null);

    getUsuariosPorEspecialidadId(id, ac.signal)
      .then((data) => {
        const usuariosNormalizados = normalizarUsuarios(data);
        setUsuarios(usuariosNormalizados);
      })
      .catch((e: unknown) =>
        setErrorUsuarios(
          e instanceof Error ? e.message : "Error al cargar usuarios por especialidad"
        )
      )
      .finally(() => setLoadingUsuarios(false));

    return () => ac.abort();
  }, [filtro.tipoEspecialidad, filtro.disponibilidad]);

  return {
    ciudades,
    provincias,
    disponibilidad,
    especialidades,
    filtro,
    handleChange,
    limpiarFiltros,
    buscarPorServicio,
    usuarios,
    loadingUsuarios,
    errorUsuarios,
    loadingCiudades,
    loadingProvincias,
    loadingEspecialidades,
  };
}

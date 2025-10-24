import { useEffect, useRef, useState, useCallback } from "react";
import {
  getProvinciasPorCiudad,
  getUsuariosPorDisponibilidad,
  getEspecialidades,
  getDepartamentos,
  getCiudadesPorDepartamento,
  getUsuariosPorEspecialidadId,
  getUsuariosPorCiudad,
} from "app/alquiler/Feature/Services/filtro.api";
import type { UsuarioResumen } from "app/alquiler/Feature/Types/filtroType";

type Option = { value: string; label: string };

export function useFiltros() {
  const [filtro, setFiltro] = useState({
    ciudad: "",
    provincia: "",
    disponibilidad: "",   // "true" | "false" | ""
    tipoEspecialidad: "", // id_especialidad (string)
    // ❌ QUITAR busqueda: "",         
  });

  const [ciudades, setCiudades] = useState<Option[]>([]);
  const [departamentos, setDepartamentos] = useState<Option[]>([]);
  const [provincias, setProvincias] = useState<Option[]>([]);
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState<string>("");
  const [especialidades, setEspecialidades] = useState<Option[]>([]);

  const [usuarios, setUsuarios] = useState<UsuarioResumen[]>([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [errorUsuarios, setErrorUsuarios] = useState<string | null>(null);
  const [sinResultados, setSinResultados] = useState(false);

  const [loadingCiudades, setLoadingCiudades] = useState(false);
  const [loadingProvincias, setLoadingProvincias] = useState(false);
  const [loadingEspecialidades, setLoadingEspecialidades] = useState(false);

  const abortProvRef = useRef<AbortController | null>(null);
  const abortUsersRef = useRef<AbortController | null>(null);

  const disponibilidad: Option[] = [
    { value: "true", label: "Disponible" },
    { value: "false", label: "No disponible" },
  ];

  const handleChange = (campo: string, valor: string) => {
    console.log(`🔄 Cambiando filtro: ${campo} = ${valor}`);
    setFiltro((prev) => ({ ...prev, [campo]: valor }));
  };

  


  // 🔥 FUNCIÓN CORREGIDA SIN BÚSQUEDA
  const buscarUsuarios = useCallback(async () => {
    // Si no hay ningún filtro activo, limpiar resultados
    if (!filtro.ciudad && !filtro.disponibilidad && !filtro.tipoEspecialidad && !departamentoSeleccionado) {
      console.log("🔄 No hay filtros activos, limpiando resultados");
      setUsuarios([]);
      setSinResultados(false);
      return;
    }


    abortUsersRef.current?.abort();
    const ac = new AbortController();
    abortUsersRef.current = ac;

    setLoadingUsuarios(true);
    setErrorUsuarios(null);
    setSinResultados(false);

    try {
      let data: UsuarioResumen[] = [];

      console.log("🔄 Buscando usuarios con filtros:", {
        ciudad: filtro.ciudad,
        disponibilidad: filtro.disponibilidad,
        especialidad: filtro.tipoEspecialidad,
        departamento: departamentoSeleccionado
      });

      // 🔥 ESTRATEGIA SIMPLIFICADA SIN BÚSQUEDA
      let datosBaseObtenidos = false;

      // CASO 1: Solo departamento (necesita lógica especial)
      if (departamentoSeleccionado && !filtro.ciudad && !filtro.disponibilidad && !filtro.tipoEspecialidad) {
        console.log("🔍 Buscando usuarios para departamento:", departamentoSeleccionado);
        
        try {
          // Primero obtener las ciudades del departamento
          const ciudadesDelDepartamento = await getCiudadesPorDepartamento(departamentoSeleccionado);
          console.log("🏙️ Ciudades en el departamento:", ciudadesDelDepartamento.length);

          // Obtener usuarios para cada ciudad
          const usuariosPromises = ciudadesDelDepartamento.map(async (ciudadOption) => {
            try {
              return await getUsuariosPorCiudad(ciudadOption.value, ac.signal);
            } catch (error) {
              console.warn(`⚠️ Error obteniendo usuarios para ciudad ${ciudadOption.value}:`, error);
              return [];
            }
          });

          const usuariosArrays = await Promise.all(usuariosPromises);
          data = usuariosArrays.flat();
          datosBaseObtenidos = true;

          console.log("👥 Usuarios encontrados en el departamento:", data.length);
        } catch (error) {
          console.error("❌ Error obteniendo datos por departamento:", error);
          // Fallback: obtener todos los usuarios disponibles
          data = await getUsuariosPorDisponibilidad(true, ac.signal);
          datosBaseObtenidos = true;
        }
      }
      // CASO 2: Especialidad
      else if (filtro.tipoEspecialidad) {
        console.log("🔍 Obteniendo datos por especialidad");
        const id = Number(filtro.tipoEspecialidad);
        if (!Number.isNaN(id)) {
          data = await getUsuariosPorEspecialidadId(id, ac.signal);
          datosBaseObtenidos = true;
        }
      }
      // CASO 3: Disponibilidad
      else if (filtro.disponibilidad === "true" || filtro.disponibilidad === "false") {
        console.log("🔍 Obteniendo datos por disponibilidad");
        const disponible = filtro.disponibilidad === "true";
        data = await getUsuariosPorDisponibilidad(disponible, ac.signal);
        datosBaseObtenidos = true;
      }
      // CASO 4: Ciudad
      else if (filtro.ciudad) {
        console.log("🔍 Obteniendo datos por ciudad");
        data = await getUsuariosPorCiudad(filtro.ciudad, ac.signal);
        datosBaseObtenidos = true;
      }

      // Si no se pudieron obtener datos base, salir
      if (!datosBaseObtenidos) {
        console.log("📭 No se pudieron obtener datos base");
        setUsuarios([]);
        setSinResultados(true);
        return;
      }

      console.log("🎯 Datos base obtenidos:", data.length);

      // Si no hay datos después de la obtención base
      if (data.length === 0) {
        console.log("📭 No hay datos después de la obtención base");
        setUsuarios([]);
        setSinResultados(true);
        return;
      }

      // 🔥 APLICAR FILTROS ADICIONALES EN CASCADA
      let datosFiltrados = [...data];

      // Filtro por ciudad (si está activo y no fue el criterio principal)
      if (filtro.ciudad && datosFiltrados.length > 0) {
        console.log("📍 Aplicando filtro por ciudad:", filtro.ciudad);
        datosFiltrados = datosFiltrados.filter(usuario =>
          usuario.ciudad?.nombre.toLowerCase() === filtro.ciudad.toLowerCase()
        );
        console.log("📍 Después de filtrar por ciudad:", datosFiltrados.length);
      }

      // 🔥 FILTRO POR DEPARTAMENTO MEJORADO
      if (departamentoSeleccionado && datosFiltrados.length > 0) {
        console.log("📍 Aplicando filtro por departamento:", departamentoSeleccionado);

        // Obtener las ciudades del departamento para comparar
        try {
          const ciudadesDelDepartamento = await getCiudadesPorDepartamento(departamentoSeleccionado);
          const nombresCiudades = ciudadesDelDepartamento.map(c => c.label.toLowerCase());

          datosFiltrados = datosFiltrados.filter(usuario =>
            usuario.ciudad?.nombre &&
            nombresCiudades.includes(usuario.ciudad.nombre.toLowerCase())
          );
        } catch (error) {
          console.warn("⚠️ Error obteniendo ciudades para filtro de departamento, usando filtro simple");
          // Fallback: filtro simple por nombre
          datosFiltrados = datosFiltrados.filter(usuario =>
            usuario.ciudad?.nombre.toLowerCase().includes(departamentoSeleccionado.toLowerCase())
          );
        }
        console.log("📍 Después de filtrar por departamento:", datosFiltrados.length);
      }

      // Filtro por disponibilidad
      if (filtro.disponibilidad && datosFiltrados.length > 0) {
        console.log("📍 Aplicando filtro por disponibilidad:", filtro.disponibilidad);
        const disponible = filtro.disponibilidad === "true";
        datosFiltrados = datosFiltrados.filter(usuario =>
          disponible ? usuario.activo === true : usuario.activo === false
        );
        console.log("📍 Después de filtrar por disponibilidad:", datosFiltrados.length);
      }

      // Filtro por especialidad
      if (filtro.tipoEspecialidad && datosFiltrados.length > 0) {
        console.log("📍 Aplicando filtro por especialidad:", filtro.tipoEspecialidad);
        const idEspecialidad = Number(filtro.tipoEspecialidad);
        datosFiltrados = datosFiltrados.filter(usuario =>
          usuario.especialidades?.some(esp => esp.id_especialidad === idEspecialidad)
        );
        console.log("📍 Después de filtrar por especialidad:", datosFiltrados.length);
      }

      console.log("✅ Usuarios finales después de aplicar todos los filtros:", datosFiltrados.length);

      // Manejar estado de "sin resultados"
      if (datosFiltrados.length === 0) {
        setSinResultados(true);
        console.log("📭 No se encontraron resultados con los filtros aplicados");
      } else {
        setSinResultados(false);
      }

      setUsuarios(datosFiltrados);
    } catch (e: unknown) {
      if (e instanceof Error && e.name !== 'AbortError') {
        console.error("❌ Error buscando usuarios:", e.message);
        setErrorUsuarios(e.message);
        setUsuarios([]);
        setSinResultados(true);
      }
    } finally {
      setLoadingUsuarios(false);
    }
  }, [
    filtro.ciudad,
    filtro.disponibilidad,
    filtro.tipoEspecialidad,
    departamentoSeleccionado
  ]);


  // 🔥 EFFECT PRINCIPAL
  useEffect(() => {
    console.log("🎯 Effect disparado - Filtros cambiados:", {
      ...filtro,
      departamentoSeleccionado
    });
    buscarUsuarios();
  }, [buscarUsuarios, filtro, departamentoSeleccionado]);

  // Cargar departamentos y especialidades al montar

  useEffect(() => {
    setLoadingCiudades(true);
    getDepartamentos()
      .then((d: Option[]) => {
        console.log("📍 Departamentos cargados:", d.length);
        setDepartamentos(d);
      })
      .finally(() => setLoadingCiudades(false));

    setLoadingEspecialidades(true);
    getEspecialidades()
      .then((esp) => {
        console.log("🎯 Especialidades cargadas:", esp.length);
        setEspecialidades(esp);
      })
      .finally(() => setLoadingEspecialidades(false));
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
      .then((provs) => {
        console.log("🗺️ Provincias cargadas para", filtro.ciudad + ":", provs.length);
        setProvincias(provs);
      })
      .catch(() => {
        setProvincias([]);
      })
      .finally(() => setLoadingProvincias(false));

    return () => ac.abort();
  }, [filtro.ciudad]);

  // Cargar ciudades por departamento
  const loadCiudadesByDepartamento = async (departamento: string) => {
    if (!departamento) {
      setCiudades([]);
      return;
    }
    setLoadingCiudades(true);
    try {
      const data = await getCiudadesPorDepartamento(departamento);
      console.log("🏙️ Ciudades cargadas para", departamento + ":", data.length);
      setCiudades(data);
    } finally {
      setLoadingCiudades(false);
    }
  };

  // Función para limpiar todos los filtros
  const limpiarFiltros = () => {
    setFiltro({
      ciudad: "",
      provincia: "",
      disponibilidad: "",
      tipoEspecialidad: "",
    });
    setDepartamentoSeleccionado("");
    setCiudades([]);
    setProvincias([]);
    setUsuarios([]);
    setSinResultados(false);
    setErrorUsuarios(null);
  };

  return {
    // selects
    departamentos,
    ciudades,
    departamentoSeleccionado,
    setDepartamentoSeleccionado,
    provincias,
    disponibilidad,
    especialidades,

    // filtros
    filtro,
    handleChange,
    limpiarFiltros,

    // resultados
    usuarios,
    loadingUsuarios,
    errorUsuarios,
    sinResultados,

    // loaders opcionales
    loadingCiudades,
    loadingProvincias,
    loadingEspecialidades,
    loadCiudadesByDepartamento,
  };
}
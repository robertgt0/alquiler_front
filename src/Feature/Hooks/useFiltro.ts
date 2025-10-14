import { useEffect, useState } from "react";
import { Opcion, Filtro } from "../Types/filtroType";
import {
  getCiudades,
  getProvincias,
  getDisponibilidad,
  getTiposEspecialidad,
} from "../Services/filtro.api";

export const useFiltros = () => {
  const [ciudades, setCiudades] = useState<Opcion[]>([]);
  const [provincias, setProvincias] = useState<Opcion[]>([]);
  const [disponibilidad, setDisponibilidad] = useState<Opcion[]>([]);
  const [especialidades, setEspecialidades] = useState<Opcion[]>([]);
  const [filtro, setFiltro] = useState<Filtro>({});

  // Cargar datos iniciales
  useEffect(() => {
    (async () => {
      setCiudades(await getCiudades());
      setDisponibilidad(await getDisponibilidad());
      setEspecialidades(await getTiposEspecialidad());
    })();
  }, []);

  // Cuando cambia la ciudad, actualizamos las provincias
  useEffect(() => {
  const fetchProvincias = async () => {
    if (filtro.ciudad) {
      const provincias = await getProvincias(filtro.ciudad);
      setProvincias(provincias);
    } else {
      setProvincias([]);
    }
  };

  fetchProvincias();
}, [filtro.ciudad]);

  // Manejo de cambios de filtros
  const handleChange = (campo: keyof Filtro, valor: string) => {
    setFiltro((prev) => ({
      ...prev,
      [campo]: valor,
      ...(campo === "ciudad" ? { provincia: undefined } : {}), // Resetea provincia si cambia ciudad
    }));
  };

  return {
    ciudades,
    provincias,
    disponibilidad,
    especialidades,
    filtro,
    handleChange,
  };
};

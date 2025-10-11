import { useEffect, useState } from "react";
import { Opcion, Filtro } from "../Types/filtro.types";
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

  useEffect(() => {
    (async () => {
      setCiudades(await getCiudades());
      setProvincias(await getProvincias());
      setDisponibilidad(await getDisponibilidad());
      setEspecialidades(await getTiposEspecialidad());
    })();
  }, []);

  const handleChange = (campo: keyof Filtro, valor: string) => {
    setFiltro((prev) => ({ ...prev, [campo]: valor }));
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

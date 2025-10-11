import { Opcion } from "../Types/filtro.types";

export const getCiudades = async (): Promise<Opcion[]> => {
  return [
    { label: "La Paz", value: "La Paz" },
    { label: "Cochabamba", value: "Cochabamba" },
    { label: "Santa Cruz", value: "Santa Cruz" },
    { label: "Potosí", value: "Potosí" },
    { label: "Tarija", value: "Tarija" },
    { label: "Chuquisaca", value: "Chuquisaca" },
    { label: "Oruro", value: "Oruro" },
  ];
};

export const getProvincias = async (): Promise<Opcion[]> => {
  return [
    { label: "Quillacollo", value: "Quillacollo" },
    { label: "Vinto", value: "Vinto" },
    { label: "Colcapirhua", value: "Colcapirhua" },
    { label: "Tiquipaya", value: "Tiquipaya" },
    { label: "Capinota", value: "Capinota" },
  ];
};

export const getDisponibilidad = async (): Promise<Opcion[]> => {
  return [
    { label: "Disponible", value: "Disponible" },
    { label: "Ocupado", value: "Ocupado" },
  ];
};

export const getTiposEspecialidad = async (): Promise<Opcion[]> => {
  return [
    { label: "Técnico", value: "Técnico" },
    { label: "Ingeniero", value: "Ingeniero" },
    { label: "Albañil", value: "Albañil" },
    { label: "Pintor", value: "Pintor" },
    { label: "Carpintero", value: "Carpintero" },
    { label: "Electricista", value: "Electricista" },
  ];
};

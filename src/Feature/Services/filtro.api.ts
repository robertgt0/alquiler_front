import { Opcion } from "../Types/filtroType";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";


export const getCiudades = async (): Promise<Opcion[]> => {
  const response = await fetch(`${API_URL}/ciudades`);
  if (!response.ok) throw new Error("Error al obtener ciudades");
  return response.json();
};

export const getProvincias = async (ciudad: string): Promise<Opcion[]> => {
  const response = await fetch(`${API_URL}/provincias/${ciudad}`);
  if (!response.ok) throw new Error("Error al obtener provincias");
  return response.json();
};

export const getDisponibilidad = async (): Promise<Opcion[]> => {
  const response = await fetch(`${API_URL}/disponibilidad`);
  if (!response.ok) throw new Error("Error al obtener disponibilidad");
  return response.json();
};

export const getTiposEspecialidad = async (): Promise<Opcion[]> => {
  const response = await fetch(`${API_URL}/especialidades`);
  if (!response.ok) throw new Error("Error al obtener especialidades");
  return response.json();
};

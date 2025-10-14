import { Opcion } from "../Types/filtroType";

export const getCiudades = async (): Promise<Opcion[]> => {
  return [
    { label: "La Paz", value: "La Paz" },
    { label: "Cochabamba", value: "Cochabamba" },
    { label: "Santa Cruz", value: "Santa Cruz" },
    { label: "Potosí", value: "Potosí" },
    { label: "Tarija", value: "Tarija" },
    { label: "Chuquisaca", value: "Chuquisaca" },
    { label: "Oruro", value: "Oruro" },
    { label: "Beni", value: "Beni" },
    { label: "Pando", value: "Pando" },
  ];
};

// Provincias por ciudad (departamento)
const provinciasPorCiudad: Record<string, Opcion[]> = {
  Cochabamba: [
    { label: "Quillacollo", value: "Quillacollo" },
    { label: "Vinto", value: "Vinto" },
    { label: "Colcapirhua", value: "Colcapirhua" },
    { label: "Tiquipaya", value: "Tiquipaya" },
    { label: "Capinota", value: "Capinota" },
  ],
  "La Paz": [
    { label: "Murillo", value: "Murillo" },
    { label: "Los Andes", value: "Los Andes" },
    { label: "Pacajes", value: "Pacajes" },
  ],
  "Santa Cruz": [
    { label: "Andrés Ibáñez", value: "Andrés Ibáñez" },
    { label: "Ichilo", value: "Ichilo" },
    { label: "Chiquitos", value: "Chiquitos" },
  ],
  "Potosí": [
    { label: "Tomás Frías", value: "Tomás Frías" },
    { label: "Nor Chichas", value: "Nor Chichas" },
  ],
  "Tarija": [
    { label: "Cercado", value: "Cercado" },
    { label: "Gran Chaco", value: "Gran Chaco" },
  ],
  "Chuquisaca": [
    { label: "Oropeza", value: "Oropeza" },
    { label: "Zudáñez", value: "Zudáñez" },
  ],
  "Oruro": [
    { label: "Cercado", value: "Cercado" },
    { label: "Sajama", value: "Sajama" },
  ],
  "Beni": [
    { label: "Cercado", value: "Cercado" },
    { label: "Iténez", value: "Iténez" },
  ],
  "Pando": [
    { label: "Nicolás Suárez", value: "Nicolás Suárez" },
    { label: "Manuripi", value: "Manuripi" },
  ],
};

// Provincias según ciudad seleccionada
export const getProvincias = async (ciudad: string): Promise<Opcion[]> => {
  const lista = provinciasPorCiudad[ciudad] || [];
  return lista; // solo las provincias reales, sin opción extra
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

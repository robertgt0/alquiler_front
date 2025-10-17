// src/lib/api.ts

export interface NuevaOfertaData {
  descripcion: string;
  categoria: string;
}

// Definimos la URL base de tu backend
const BASE_URL = "http://localhost:4000/api/ofertas";

export async function crearOferta(oferta: NuevaOfertaData) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(oferta),
  });

  if (!res.ok) {
    throw new Error("Error al crear la oferta");
  }

  return res.json();
}

export async function obtenerOfertas() {
  const res = await fetch(BASE_URL);
  if (!res.ok) {
    throw new Error("Error al obtener las ofertas");
  }
  return res.json();
}

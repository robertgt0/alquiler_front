const BASE_URL = "http://localhost:4000/api/ofertas";

export async function crearOferta(formData: FormData) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    body: formData, // enviamos FormData directamente
  });

  if (!res.ok) throw new Error("Error al crear la oferta");

  return res.json();
}

export async function obtenerOfertas() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Error al obtener las ofertas");
  return res.json();
}


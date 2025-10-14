
import { UsuarioDocument } from "../../registro/interfaces/types";
const API_URL = "http://localhost:5000";

export async function crearUsuario(usuario:UsuarioDocument) {
  const res = await fetch(`${API_URL}/api/teamsys/usuario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario)
  });

  if (!res.ok) throw new Error("datos Incorrectos");
  return res.json();
}
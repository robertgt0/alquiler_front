import { IBilletera, ITransaccionBackend } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const fetchWalletData = async (usuario: string) => {
  const [billeteraRes, historialRes] = await Promise.all([
    fetch(`${API_BASE_URL}/bitCrew/billetera/${usuario}`, { cache: "no-store" }),
    fetch(`${API_BASE_URL}/bitCrew/historial/${usuario}`, { cache: "no-store" }),
  ]);

  if (!billeteraRes.ok) throw new Error(`Error HTTP (Saldo): ${billeteraRes.status}`);
  const dataBilletera = await billeteraRes.json();
  if (!dataBilletera.success) throw new Error(dataBilletera.message || "Error al obtener billetera");

  if (!historialRes.ok) throw new Error(`Error HTTP (Historial): ${historialRes.status}`);
  const dataHistorial = await historialRes.json();
  if (!dataHistorial.success) throw new Error(dataHistorial.message || "Error al obtener historial");

  return {
    billetera: dataBilletera.billetera as IBilletera,
    transacciones: dataHistorial.transacciones as ITransaccionBackend[],
  };
};
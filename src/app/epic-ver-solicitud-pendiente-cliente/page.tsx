"use client";

import { useSearchParams } from "next/navigation";
import DetalleSolicitudCliente from "./modules/DetalleSolicitudCliente";
import { EstadoTrabajo, SolicitudClienteDetalle } from "./interfaces/SolicitudCliente.interface";

export const dynamic = "force-dynamic";

function parseEstado(v: string | null): EstadoTrabajo {
  const ok: EstadoTrabajo[] = ["Pendiente","Confirmado","Cancelado","Terminado"];
  return (v && (ok as string[]).includes(v) ? (v as EstadoTrabajo) : "Pendiente");
}

function buildFromParams(sp: URLSearchParams): SolicitudClienteDetalle | null {
  const id = sp.get("id");
  if (!id) return null;

  return {
    id,
    proveedor: sp.get("proveedor") || "Armando Paredes",
    fechaISO: sp.get("fecha") || "2025-11-25",
    horaInicio: sp.get("inicio") || "10:00",
    horaFin: sp.get("fin") || "11:00",
    descripcion: sp.get("descripcion") || "El trabajo es la construcción de un muro perimetral de 20 metros.",
    costo: Number(sp.get("costo") || 250),
    estado: parseEstado(sp.get("estado")),
  };
}

export default function Page() {
  const sp = useSearchParams();
  const data = buildFromParams(sp);

  const fallback: SolicitudClienteDetalle = {
    id: "sol-1",
    proveedor: "Armando Paredes",
    fechaISO: "2025-11-25",
    horaInicio: "10:00",
    horaFin: "11:00",
    descripcion: "El trabajo es la construcción de un muro perimetral de 20 metros.",
    costo: 250,
    estado: "Pendiente",
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white px-4 py-10">
      <DetalleSolicitudCliente data={data ?? fallback} />
    </div>
  );
}

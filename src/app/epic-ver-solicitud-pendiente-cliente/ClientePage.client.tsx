'use client';

import { useSearchParams } from 'next/navigation';
import DetalleSolicitudCliente from './modules/DetalleSolicitudCliente';
import {
  EstadoTrabajo,
  SolicitudClienteDetalle,
} from './interfaces/SolicitudCliente.interface';

// 🧩 Valida el estado recibido por URL
function parseEstado(v: string | null): EstadoTrabajo {
  const ok: EstadoTrabajo[] = ['Pendiente', 'Confirmado', 'Cancelado', 'Terminado'];
  return v && (ok as string[]).includes(v) ? (v as EstadoTrabajo) : 'Pendiente';
}

// 🧩 Construye los datos desde los parámetros URL
function buildFromParams(sp: URLSearchParams): SolicitudClienteDetalle | null {
  const id = sp.get('id');
  if (!id) return null;

  return {
    id,
    proveedor: sp.get('proveedor') || 'Proveedor no especificado',
    fechaISO: sp.get('date') || sp.get('fecha') || '2025-11-25',
    horaInicio: sp.get('inicio') || '10:00',
    horaFin: sp.get('fin') || '11:00',
    descripcion: sp.get('descripcion') || 'Descripción no disponible.',
    costo: Number(sp.get('costo') || 0),
    estado: parseEstado(sp.get('estado')),
  };
}

// 🔹 Componente principal (versión limpia y responsiva)
export default function ClientePageClient() {
  const sp = useSearchParams();
  const data = buildFromParams(sp);

  // Datos por defecto si faltan parámetros
  const fallback: SolicitudClienteDetalle = {
    id: 'sol-fallback',
    proveedor: 'Armando Paredes',
    fechaISO: '2025-11-25',
    horaInicio: '10:00',
    horaFin: '11:00',
    descripcion:
      'El trabajo es la construcción de un muro perimetral de 20 metros.',
    costo: 250,
    estado: 'Pendiente',
  };

  return (
    <div
      className="
        min-h-screen w-full flex items-center justify-center bg-white 
        px-4 sm:px-6 md:px-10 py-10 sm:py-14
      "
    >
      {/* 📱 Contenedor totalmente limpio, sin bordes ni sombras */}
      <div
        className="
         min-h-screen w-full flex justify-center bg-white 
         px-4 sm:px-6 md:px-8 pt-0
        "
      >
        <DetalleSolicitudCliente data={data ?? fallback} />
      </div>
    </div>
  );
}

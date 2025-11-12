'use client';

import { useSearchParams } from 'next/navigation';
import DetalleSolicitudCliente from './modules/DetalleSolicitudCliente';
import {
  EstadoTrabajo,
  SolicitudClienteDetalle,
} from './interfaces/SolicitudCliente.interface';

function parseEstado(v: string | null): EstadoTrabajo {
  const ok: EstadoTrabajo[] = ['Pendiente', 'Confirmado', 'Cancelado', 'Terminado'];
  return v && (ok as string[]).includes(v) ? (v as EstadoTrabajo) : 'Pendiente';
}

function buildFromParams(sp: URLSearchParams): SolicitudClienteDetalle | null {
  const id = sp.get('id');
  if (!id) return null;

  return {
    id,
    proveedor: sp.get('proveedor') || 'Proveedor no especificado',
    fechaISO: sp.get('date') || sp.get('fecha') || '2025-11-25', // ✅ soporta ambas variantes
    horaInicio: sp.get('inicio') || '10:00',
    horaFin: sp.get('fin') || '11:00',
    descripcion: sp.get('descripcion') || 'Descripción no disponible.',
    costo: Number(sp.get('costo') || 0),
    estado: parseEstado(sp.get('estado')),
  };
}

export default function ClientePageClient() {
  const sp = useSearchParams();
  const data = buildFromParams(sp);

  const fallback: SolicitudClienteDetalle = {
    id: 'sol-fallback',
    proveedor: 'Armando Paredes',
    fechaISO: '2025-11-25',
    horaInicio: '10:00',
    horaFin: '11:00',
    descripcion: 'El trabajo es la construcción de un muro perimetral de 20 metros.',
    costo: 250,
    estado: 'Pendiente',
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white px-4 py-10">
      <DetalleSolicitudCliente data={data ?? fallback} />
    </div>
  );
}

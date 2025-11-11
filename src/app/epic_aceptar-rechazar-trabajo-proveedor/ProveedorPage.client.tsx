'use client';

import { useSearchParams } from 'next/navigation';
import DetalleSolicitudTrabajo from './modules/DetalleSolicitudTrabajo';
import { EstadoTrabajo, SolicitudDetalle } from './interfaces/Trabajo.interface';

function parseEstado(value: string | null): EstadoTrabajo {
  const valid: EstadoTrabajo[] = ['Pendiente', 'Confirmado', 'Cancelado', 'Terminado'];
  return value && (valid as string[]).includes(value) ? (value as EstadoTrabajo) : 'Pendiente';
}

function buildFromParams(sp: URLSearchParams): SolicitudDetalle | null {
  const id = sp.get('id');
  if (!id) return null;

  // ✅ Aceptamos tanto "fecha" como "date" (corrección principal)
  const fechaISO = sp.get('fecha') || sp.get('date') || '2025-11-25';

  return {
    id,
    cliente: sp.get('cliente') || 'Juan Pérez',
    fechaISO, // 🔹 Ahora toma correctamente el valor de la URL
    horaInicio: sp.get('inicio') || '10:00',
    horaFin: sp.get('fin') || '11:00',
    descripcion:
      sp.get('descripcion') ||
      'El trabajo es la construcción de un muro perimetral de 20 metros.',
    costo: Number(sp.get('costo') || 250),
    estado: parseEstado(sp.get('estado')),
  };
}

export default function ProveedorPageClient() {
  const sp = useSearchParams();
  const data = buildFromParams(sp);

  const fallback: SolicitudDetalle = {
    id: 'sol-1',
    cliente: 'Juan Pérez',
    fechaISO: '2025-11-25',
    horaInicio: '10:00',
    horaFin: '11:00',
    descripcion:
      'El trabajo es la construcción de un muro perimetral de 20 metros.',
    costo: 250,
    estado: 'Pendiente',
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white px-4 py-10">
      <DetalleSolicitudTrabajo data={data ?? fallback} />
    </div>
  );
}

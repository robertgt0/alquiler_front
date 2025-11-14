'use client';

import { useSearchParams } from 'next/navigation';
import DetalleCanceladoCliente from './modules/DetalleCanceladoCliente';
import {
  EstadoTrabajo,
  SolicitudClienteDetalle,
} from './interfaces/SolicitudCliente.interface';

// 🧩 Misma función que pendiente
function buildFromParams(sp: URLSearchParams): SolicitudClienteDetalle | null {
  const id = sp.get('id');
  if (!id) return null;

  return {
    id,
    proveedor: sp.get('proveedor') || 'Proveedor no especificado',
    fechaISO: sp.get('date') || '',
    horaInicio: sp.get('inicio') || '',
    horaFin: sp.get('fin') || '',
    descripcion: sp.get('descripcion') || 'Descripción no disponible.',
    costo: Number(sp.get('costo') || 0),
    estado: 'Cancelado' as EstadoTrabajo,

    // 🔴 CAMBIADO: soporta nombres del backend y los viejos
    cancelReason:
      sp.get('justificacion_cancelacion') ??
      sp.get('justificacion') ??
      '',
    cancelledBy:
      sp.get('cancelado_por') ??
      sp.get('canceladoPor') ??
      '',
  };
}
// 🔹 Componente principal (IGUAL que pendiente)
export default function CanceladosPageClient() {
  const sp = useSearchParams();
  const data = buildFromParams(sp);

  // Datos por defecto si faltan parámetros (IGUAL que pendiente)
  const fallback: SolicitudClienteDetalle = {
    id: 'cancel-fallback',
    proveedor: 'Proveedor no especificado',
    fechaISO: '2025-11-25',
    horaInicio: '10:00',
    horaFin: '11:00',
    descripcion: 'Descripción no disponible.',
    costo: 0,
    estado: 'Cancelado',
    cancelReason: 'Sin justificación',
    cancelledBy: 'No especificado',
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white px-4 sm:px-6 md:px-10 py-10 sm:py-14">
      <div className="w-full max-w-3xl flex flex-col items-center justify-center bg-white p-4 sm:p-6 md:p-8">
        <DetalleCanceladoCliente data={data ?? fallback} />
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import DetalleCanceladoCliente from './modules/DetalleCanceladoCliente';
import { SolicitudClienteDetalle } from './interfaces/SolicitudCliente.interface';
// Asegúrate de que la ruta a tu servicio sea correcta
import { fetchTrabajoDetalleReal } from './services/api';

export default function CanceladosPageClient() {
  const sp = useSearchParams();
  const id = sp.get('id'); // Obtenemos el ID de la URL

  const [data, setData] = useState<SolicitudClienteDetalle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Llamada al backend real
      fetchTrabajoDetalleReal(id)
        .then((trabajo) => {
          setData(trabajo);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [id]);

  // Datos por defecto (fallback) para evitar errores si la carga falla
  const fallback: SolicitudClienteDetalle = {
    id: 'cancel-fallback',
    proveedor: 'Cargando...',
    cliente: 'Cargando...',
    fechaISO: '',
    horaInicio: '',
    horaFin: '',
    descripcion: '...',
    costo: 0,
    estado: 'Cancelado',
    cancelReason: '',
    cancelledBy: '',
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white">
        <p className="text-blue-600 font-bold">Cargando detalles del trabajo...</p>
      </div>
    );
  }

  return (
    // ✅ CORRECCIÓN DE DISEÑO:
    // 'items-start': Alinea el contenido arriba en lugar de al centro.
    // 'pt-24': Agrega espacio superior (padding-top) para que no se pegue al borde.
    <div className="min-h-screen w-full flex items-start justify-center bg-white px-4 sm:px-6 md:px-10 pt-4 pb-10">
      
      <div className="w-full max-w-3xl flex flex-col items-center justify-center bg-white p-4 sm:p-6 md:p-8">
        <DetalleCanceladoCliente data={data ?? fallback} />
      </div>
      
    </div>
  );
}
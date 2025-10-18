// src/app/mis-trabajos-proveedor/page.tsx
'use client'; // ¡Importante! Marca este componente para que se ejecute en el navegador

import { useEffect, useState } from 'react';
import { ITrabajo, TrabajoStatus } from './interfaces/types';
import { fetchTrabajosProveedor } from './services/trabajosApi';

export default function TrabajosProveedorPage() {
  const [trabajos, setTrabajos] = useState<ITrabajo[]>([]);
  const [filtro, setFiltro] = useState<TrabajoStatus | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Este hook se ejecuta cuando el componente carga o cuando el filtro cambia
  useEffect(() => {
    const cargarTrabajos = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTrabajosProveedor(filtro);
        setTrabajos(data);
      } catch (err) {
        setError('No se pudieron cargar los trabajos. Asegúrate de que el backend esté funcionando.');
      } finally {
        setLoading(false);
      }
    };

    cargarTrabajos();
  }, [filtro]); // La dependencia [filtro] hace que se vuelva a ejecutar si el filtro cambia

  if (loading) return <main><h1>Cargando trabajos...</h1></main>;
  if (error) return <main><h1 style={{ color: 'red' }}>{error}</h1></main>;

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <h1>Mis Trabajos (Vista Proveedor)</h1>

      <div style={{ marginBottom: '20px' }}>
        <strong>Filtrar por estado:</strong>
        <button onClick={() => setFiltro(undefined)}>Todos</button>
        <button onClick={() => setFiltro('Pendiente')}>Pendientes</button>
        <button onClick={() => setFiltro('Confirmado')}>Confirmados</button>
        <button onClick={() => setFiltro('Cancelado')}>Cancelados</button>
        <button onClick={() => setFiltro('Terminado')}>Terminados</button>
      </div>

      {trabajos.length === 0 ? (
        <p>No tienes trabajos con el filtro seleccionado.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {trabajos.map((trabajo, index) => (
            <div key={index} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
              <p><strong>Cliente:</strong> {trabajo.cliente.nombre}</p>
              <p><strong>Servicio:</strong> {trabajo.servicio}</p>
              <p><strong>Fecha:</strong> {trabajo.fecha} de {trabajo.horaInicio} a {trabajo.horaFin}</p>
              <p><strong>Estado:</strong> {trabajo.estado}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
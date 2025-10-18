// src/app/epic-mis-trabajos-cliente/page.tsx
'use client';

import { useEffect, useState } from 'react';
// Reutilizamos la misma interfaz, solo tenemos que apuntar a la ruta correcta
import { ITrabajo, TrabajoStatus } from '../epic-mis-trabajos-proveedor/interfaces/types';
// Importamos la nueva función del servicio
import { fetchTrabajosCliente } from '../epic-mis-trabajos-proveedor/services/trabajosApi';

export default function TrabajosClientePage() {
  const [trabajos, setTrabajos] = useState<ITrabajo[]>([]);
  const [filtro, setFiltro] = useState<TrabajoStatus | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Usaremos un ID de cliente fijo para la prueba, igual que hicimos en el backend
  const clienteIdDePrueba = 'cliente1';

  useEffect(() => {
    const cargarTrabajos = async () => {
      try {
        setLoading(true);
        setError(null);
        // ¡CAMBIO! Llamamos a la nueva función
        const data = await fetchTrabajosCliente(clienteIdDePrueba, filtro);
        setTrabajos(data);
      } catch (err) {
        setError('No se pudieron cargar los trabajos. Asegúrate de que el backend esté funcionando.');
      } finally {
        setLoading(false);
      }
    };

    cargarTrabajos();
  }, [filtro]);

  if (loading) return <main><h1>Cargando tus trabajos...</h1></main>;
  if (error) return <main><h1 style={{ color: 'red' }}>{error}</h1></main>;

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      {/* ¡CAMBIO! Título actualizado */}
      <h1>Mis Trabajos (Vista Cliente)</h1>

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
              {/* ¡CAMBIO! Mostramos el nombre del proveedor */}
              <p><strong>Proveedor:</strong> {trabajo.proveedor.nombre}</p>
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
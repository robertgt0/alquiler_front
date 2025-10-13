// src/app/proveedor/trabajos/page.tsx
'use client';
import { useEffect, useMemo, useState } from 'react';

type JobStatus = 'confirmed' | 'pending' | 'cancelled' | 'done';
type Job = {
  id: string;
  clientName: string;
  service: string;
  startISO: string; // 2025-09-25T09:00:00-04:00
  endISO: string;
  status: JobStatus;
  cancelReason?: string;
  description?: string;
};

const STATUS_META: Record<JobStatus, { label: string; color: string; bg: string }> = {
  confirmed: { label: 'Confirmado', color: '#155EEF', bg: '#E5F0FF' },
  pending:   { label: 'Pendiente',  color: '#B58500', bg: '#FFF6CC' },
  cancelled: { label: 'Cancelado',  color: '#B42318', bg: '#FFE4E2' },
  done:      { label: 'Terminado',  color: '#067647', bg: '#DFF5E9' },
};

const TABS: Array<{ key: 'all' | JobStatus; title: string }> = [
  { key: 'all', title: 'Todos' },
  { key: 'confirmed', title: 'Confirmados' },
  { key: 'pending', title: 'Pendientes' },
  { key: 'cancelled', title: 'Cancelados' },
  { key: 'done', title: 'Terminados' },
];

// —— util formateo ——
const fmt = (iso: string) => {
  const d = new Date(iso);
  const fecha = d.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: '2-digit' });
  const hora = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  return { fecha, hora };
};

// ——— Mock API ———
// Reemplaza estas funciones por fetch() a tu backend.
async function fetchJobsMock(): Promise<Job[]> {
  await new Promise(r => setTimeout(r, 500)); // simula red
  return [
    { id: '1', clientName: 'Juan Perez',   service: 'Electricista', startISO: '2025-09-25T09:00:00-04:00', endISO: '2025-09-25T11:00:00-04:00', status: 'confirmed', description: 'Cambio de tomas' },
    { id: '2', clientName: 'Carlos Mendez',service: 'Electricista', startISO: '2025-09-26T11:00:00-04:00', endISO: '2025-09-26T13:00:00-04:00', status: 'pending',   description: 'Instalación de foco' },
    { id: '3', clientName: 'Elena Vargas', service: 'Electricista', startISO: '2025-09-27T15:00:00-04:00', endISO: '2025-09-27T17:00:00-04:00', status: 'cancelled', cancelReason: 'Cliente no podrá asistir', description: 'Revisión de corto' },
    { id: '4', clientName: 'Sergio Romero',service: 'Electricista', startISO: '2025-09-28T08:00:00-04:00', endISO: '2025-09-28T10:00:00-04:00', status: 'done',       description: 'Mantenimiento general' },
  ];
}

export default function TrabajosAgendadosPage() {
  const [tab, setTab] = useState<'all' | JobStatus>('all');
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<Job | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchJobsMock().then(data => { if (alive){ setJobs(data); setLoading(false);} });
    // Sugerido: setInterval para refrescar y cumplir “actualiza al cambiar estado”
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(() => {
    if (!jobs) return [];
    if (tab === 'all') return jobs;
    return jobs.filter(j => j.status === tab);
  }, [jobs, tab]);

  // vacio
  if (!loading && (jobs?.length ?? 0) === 0) {
    return (
      <main style={{ padding: 16 }}>
        <h1 style={{ fontSize: 24, marginBottom: 12 }}>Trabajos Agendados</h1>
        <p role="status">No tienes trabajos asignados.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 16, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, marginBottom: 12 }}>Trabajos Agendados</h1>

      {/* Tabs (<=2s respuesta si los datos ya están en memoria) */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }} role="tablist" aria-label="Filtros de estado">
        {TABS.map(t => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid #2563eb',
              background: tab === t.key ? '#2563eb' : 'transparent',
              color: tab === t.key ? 'white' : '#2563eb',
              fontWeight: 600,
            }}
          >
            {t.title}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div style={{ display: 'grid', gap: 12, maxHeight: 520, overflow: 'auto', paddingRight: 4 }}>
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{ height: 96, border: '1px solid #e5e7eb', borderRadius: 12, background: '#f8fafc' }} />
          ))
        ) : (
          filtered.map(job => {
            const s = STATUS_META[job.status];
            const { fecha, hora } = fmt(job.startISO);
            const { hora: horaFin } = fmt(job.endISO);
            const cancelable = job.status === 'pending' || job.status === 'confirmed';

            return (
              <article key={job.id} aria-label={'Trabajo ${job.id}'} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 12 }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 700 }}>Cliente</span>
                    <span>{job.clientName}</span>
                  </div>
                  <span aria-label={'Estado ${s.label}'} style={{ padding: '4px 10px', borderRadius: 999, background: s.bg, color: s.color, fontWeight: 700 }}>
                    {s.label}
                  </span>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 8 }}>
                  <div><strong>Fecha</strong><br />{fecha}</div>
                  <div><strong>Servicio</strong><br />{job.service}</div>
                  <div><strong>Hora Inicio</strong><br />{hora}</div>
                  <div><strong>Hora Fin</strong><br />{horaFin}</div>
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button
                    onClick={() => setDetails(job)}
                    aria-label="Ver detalles del trabajo"
                    style={{ padding: '8px 12px', borderRadius: 8, background: '#2563eb', color: 'white', fontWeight: 700 }}
                  >
                    Ver Detalles
                  </button>
                  <button
                    disabled={!cancelable}
                    title={cancelable ? 'Cancelar trabajo' : 'Solo se puede cancelar si está Pendiente o Confirmado'}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 8,
                      background: cancelable ? '#ef4444' : '#f3f4f6',
                      color: cancelable ? 'white' : '#9ca3af',
                      fontWeight: 700,
                      border: 'none',
                    }}
                    onClick={() => {
                      if (!cancelable) return;
                      const reason = prompt('Motivo de cancelación (se notificará al cliente):');
                      if (!reason) return;
                      // TODO: PATCH /api/jobs/:id
                      setJobs(prev =>
                        (prev ?? []).map(j => j.id === job.id ? { ...j, status: 'cancelled', cancelReason: reason } : j)
                      );
                      alert('Trabajo cancelado (mock). Se notificará al cliente.'); // Cubre 35, 36 a nivel UI
                    }}
                  >
                    Cancelar Trabajo
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Modal Detalles */}
      {details && (
        <div role="dialog" aria-modal="true" style={{
          position: 'fixed', inset: 0, background: 'rgba(252, 249, 249, 1)', display: 'grid', placeItems: 'center', padding: 16
        }}>
          <div style={{ background: 'white', borderRadius: 12, padding: 16, maxWidth: 560, width: '100%' }}>
            <h2 style={{ fontSize: 20, marginBottom: 8 }}>Detalle del trabajo</h2>
            <p><strong>Cliente:</strong> {details.clientName}</p>
            <p><strong>Servicio:</strong> {details.service}</p>
            <p><strong>Descripción:</strong> {details.description ?? '—'}</p>
            <p><strong>Inicio:</strong> {fmt(details.startISO).fecha} {fmt(details.startISO).hora}</p>
            <p><strong>Fin:</strong> {fmt(details.endISO).fecha} {fmt(details.endISO).hora}</p>
            <p><strong>Estado:</strong> {STATUS_META[details.status].label}</p>
            {details.status === 'cancelled' && <p><strong>Motivo:</strong> {details.cancelReason ?? '—'}</p>}
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setDetails(null)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb' }}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
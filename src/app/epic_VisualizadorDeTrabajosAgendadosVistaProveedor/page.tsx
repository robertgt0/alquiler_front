'use client';
import { useEffect, useMemo, useState } from 'react';
import { Job, JobStatus } from './interfaces/types';
import { fetchTrabajosProveedor } from './services/api';
import { fmt } from './utils/helpers';
import { useRouter } from 'next/navigation';

/* Paleta */
const C = {
  title: '#0C4FE9',
  text: '#1140BC',
  borderMain: '#0C4FE9',
  borderBtn: '#1366FD',
  confirmed: '#1366FD',
  pending: '#F0D92B',
  done: '#31C950',
  cancelled: '#E84141',
  white: '#FFFFFF',
  line: '#1140BC',
  active: '#1366FD',
} as const;

type TabKey = 'all' | JobStatus;
const ITEMS_PER_PAGE = 10;

/* Íconos (omito definiciones para mantener el archivo compacto; usa las mismas de antes) */
const IcoUser = ({ size = 24, color = C.text }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21a8 8 0 0 0-16 0" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const IcoCalendar = ({ size = 24, color = C.text }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IcoBrief = ({ size = 24, color = C.text }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);
const IcoClock = ({ size = 24, color = C.text }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

export default function TrabajosAgendadosPage() {
  const [tab, setTab] = useState<TabKey>('all');
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    let alive = true;
    fetchTrabajosProveedor()
      .then((d) => {
        if (!alive) return;
        // Normaliza posibles estados "completed" → "done"
        const normalized = (d ?? []).map((j: Job & { status: string }) => ({
          ...j,
          status: (j.status === 'done' ? 'done' : j.status) as JobStatus,
        }));
        setJobs(normalized);
      })
      .catch((err) => console.error('Error al cargar trabajos:', err));
    return () => { alive = false; };
  }, []);

  const counts = useMemo(() => {
    const c = { confirmed: 0, pending: 0, cancelled: 0, done: 0 } as Record<JobStatus, number>;
    (jobs ?? []).forEach((j) => c[j.status]++);
    return c;
  }, [jobs]);

  const filtered = useMemo(() => {
    if (!jobs) return [];
    return tab === 'all' ? jobs : jobs.filter((j) => j.status === tab);
  }, [jobs, tab]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    if (currentPage > Math.ceil(filtered.length / ITEMS_PER_PAGE) && filtered.length > 0) setCurrentPage(1);
    return filtered.slice(startIndex, endIndex);
  }, [filtered, currentPage]);

  if (!jobs) {
    return (
      <main style={{ padding: 24, maxWidth: 980, margin: '0 auto', fontWeight: 500, color: C.text, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ fontSize: 36, color: C.title, width: '660px' }}>Trabajos Agendados</h1>
        <div style={{ height: 1.5, width: '660px', background: C.line }} />
        <p style={{ textAlign: 'center' }}>Cargando trabajos...</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, maxWidth: 980, margin: '0 auto', fontWeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 10 }}>
      <h1 style={{ fontSize: 36, color: C.title, width: '660px', marginTop: 0 }}>Trabajos Agendados</h1>
      <div style={{ height: 1.5, width: '660px', background: C.line, marginBottom: 10 }} />
      <TabsComponent tab={tab} setTab={setTab} counts={counts} setCurrentPage={setCurrentPage} />

      <div className="scrollwrap" style={{ display: 'grid', gap: 14, maxHeight: 520, overflow: 'auto', width: '660px' }}>
        {paginatedJobs.map((job) => {
          const { fecha, hora } = fmt(job.startISO);
          const { hora: horaFin } = fmt(job.endISO);
          const chipBg =
            job.status === 'confirmed' ? C.confirmed :
            job.status === 'pending'   ? C.pending   :
            job.status === 'done'      ? C.done      : C.cancelled;

          // Extraer HH:MM desde ISO (ej. "2025-11-02T09:00:00" -> "09:00")
          const inicioHHMM = job.startISO ? job.startISO.slice(11, 16) : hora;
          const finHHMM = job.endISO ? job.endISO.slice(11, 16) : horaFin;
          // fechaISO disponible en job.fechaISO (YYYY-MM-DD)
          const fechaISO = job.fechaISO ?? (job.startISO ? job.startISO.slice(0, 10) : '');

          const handleVerDetalles = () => {
            const status = job.status; // ya normalizado
            const from = String(tab);

            switch (status) {
              case 'pending': {
                const params = new URLSearchParams({
                  id: job.id,
                  cliente: job.clientName ?? '',
                  date: fechaISO,            // YYYY-MM-DD
                  inicio: inicioHHMM,        // HH:MM
                  fin: finHHMM,              // HH:MM
                  servicio: job.service ?? '',
                  estado: status,
                  costo: job.costo !== undefined ? String(job.costo) : '',
                  descripcion: job.description ?? '',
                  from,
                });
                router.push(`/epic_aceptar-rechazar-trabajo-proveedor?${params.toString()}`);
                break;
              }
              case 'done': {
                router.push(`/trabajo-terminado/${encodeURIComponent(job.id)}?from=${from}`);
                break;
              }
              case 'confirmed':  {
                const parametro= new URLSearchParams({
                  id: job.id,
                  cliente: job.clientName ?? '',
                  date: fechaISO,
                  inicio: inicioHHMM,
                  fin: finHHMM,
                  servicio: job.service ?? '',
                  estado: status,
                  costo: job.costo !== undefined ? String(job.costo) : '',
                  descripcion: job.description ?? '',
                  from,
                });
                router.push(`/epic_VisualizadorDeTrabajosAgendadosVistaProveedor_CancelarTrabajo?${parametro.toString()}`);
                break;
              }
              //aqui rediriges a tu ventana de cancelado
              case 'cancelled': {
                
               router.push(`/epic_VerDetallesEstadoCancelado-VistaProveedor?id=${encodeURIComponent(job.id)}`);
                      break;
              }
              default: {
                router.push(`/epic_VerDetallesAmbos?id=${encodeURIComponent(job.id)}&from=${from}`);
                break;
              }
            }
          };

          return (
            <article key={job.id} style={{ border: `2.5px solid ${C.borderMain}`, borderRadius: 8, background: C.white, padding: '14px 18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr auto', gridTemplateRows: 'auto auto', columnGap: 16, rowGap: 6 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <IcoUser />
                  <div>
                    <span style={{ color: C.text }}>Cliente</span><br />
                    <span>{job.clientName}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <IcoCalendar />
                  <div>
                    <span style={{ color: C.text }}>Fecha</span><br />
                    <span>{fecha.replaceAll('-', '/')}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <IcoClock />
                  <div>
                    <span style={{ color: C.text }}>Hora Inicio</span><br />
                    <span>{hora.replace(/^0/, '')}</span>
                  </div>
                </div>

                <div style={{ gridColumn: '4', gridRow: '1 / span 2', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={handleVerDetalles}
                    style={{
                      padding: '8px 14px',
                      minWidth: 110,
                      height: 36,
                      borderRadius: 8,
                      background: C.confirmed,
                      color: C.white,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Ver Detalles
                  </button>
                </div>

                <div>
                  <div style={{ display: 'inline-block', padding: '8px 16px', borderRadius: 12, background: chipBg, color: job.status === 'pending' ? '#000' : C.white }}>
                    {job.status === 'confirmed' ? 'Confirmado'
                      : job.status === 'pending' ? 'Pendiente'
                      : job.status === 'done' ? 'Terminado'
                      : 'Cancelado'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <IcoBrief />
                  <div>
                    <span style={{ color: C.text }}>Servicio</span><br />
                    <span>{job.service}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <IcoClock />
                  <div>
                    <span style={{ color: C.text }}>Hora Fin</span><br />
                    <span>{horaFin.replace(/^0/, '')}</span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

       <div className="footer-controls" style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center', 
        marginTop: '20px', 
        width: '660px'
      }}>
        
        <button
          onClick={() => router.push('/')}
          style={{
            padding: '10px 20px',
            height: 40,
            borderRadius: 8,
            background: C.confirmed,
            color: C.white,
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px'
          }}
        >
          Volver
        </button>

        {totalPages > 1 && (
          <div className="pagination" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                padding: '10px 15px',
                borderRadius: 5,
                border: '1px solid #ddd',
                background: C.white,
                color: C.text,
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.6 : 1,
              }}
            >
              Anterior
            </button>
            
            <span style={{ color: C.text, fontSize: '16px', fontWeight: 500 }}>
              Página {currentPage} de {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                padding: '10px 15px',
                borderRadius: 5,
                border: '1px solid #ddd',
                background: C.white,
                color: C.text,
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages ? 0.6 : 1,
              }}
            >
              Siguiente
            </button>
          </div>
        )}

        {totalPages <= 1 && (
          <div /> 
        )}
      </div>
    </main>
  );
}

interface TabsProps {
  tab: TabKey;
  setTab: (tab: TabKey) => void;
  setCurrentPage: (page: number) => void;
  counts: Record<JobStatus, number>;
}

function TabsComponent({ tab, setTab, counts, setCurrentPage }: TabsProps) {
  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 14, width: '660px' }}>
      {(['all', 'confirmed', 'pending', 'cancelled', 'done'] as TabKey[]).map((k) => {
        const active = tab === k;
        const badge = k === 'all' ? (counts.confirmed + counts.pending + counts.cancelled + counts.done) : counts[k];
        const baseBtn: React.CSSProperties = {
          borderRadius: 8,
          border: `2px solid ${C.borderBtn}`,
          background: active ? C.active : C.white,
          color: active ? C.white : C.text,
          fontSize: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          cursor: 'pointer',
          padding: '8px 12px',
        };
        return (
          <button key={k} onClick={() => { setTab(k); setCurrentPage(1); }} style={baseBtn}>
            {k === 'all' ? `Todos (${badge})`
              : k === 'confirmed' ? `Confirmados (${badge})`
              : k === 'pending' ? `Pendientes (${badge})`
              : k === 'cancelled' ? `Cancelados (${badge})`
              : `Terminados (${badge})`}
          </button>
        );
      })}
    </div>
  );
}
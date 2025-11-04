'use client';
import { useEffect, useMemo, useState } from 'react';
import { Job, JobStatus } from './interfaces/types';
import { fetchTrabajosCliente } from './services/api';
import { fmt } from './utils/helpers';
import { useRouter } from 'next/navigation'; // <-- 1. AÑADIDO DE VUELTA

/* Paleta */
const C = {
  title: '#0C4FE9',
  text: '#1140BC', 
  borderMain: '#0C4FE9',
  borderBtn: '#1366FD',
  confirmed: '#1366FD', // <-- Usaremos este azul
  pending: '#F0D92B',
  done: '#31C950',
  cancelled: '#E84141',
  white: '#FFFFFF',
  line: '#1140BC',
  active: '#1366FD',
} as const;

type TabKey = 'all' | JobStatus;

const ITEMS_PER_PAGE = 10; 

/* Íconos */
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
  const router = useRouter(); // <-- 1. AÑADIDO DE VUELTA

  useEffect(() => {
    let alive = true;

    fetchTrabajosCliente('cliente_abc')
      .then((d) => {
        if (alive) setJobs(d);
      })
      .catch((err) => {
        console.error('Error al cargar trabajos (mock):', err);
      });

    return () => {
      alive = false;
    };
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
    return filtered.slice(startIndex, endIndex);
  }, [filtered, currentPage]);

  if (!jobs) {
    return (
      <main style={{ padding: 24, maxWidth: 980, margin: '0 auto', fontWeight: 500, color: C.text, fontSize: '20px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 400, color: C.title, marginTop: 2, marginBottom: 0 }}>Mis Trabajos</h1>
        <div style={{ height: 1.5, width: '660px', background: C.line, marginBottom: 10 }} />
        <p style={{textAlign: 'center'}}>Cargando mis trabajos...</p>
      </main>
    );
  }

  if (tab !== 'all' && counts[tab] === 0) {
    return (
      <main style={{ padding: 24, maxWidth: 980, margin: '0 auto', fontWeight: 500, color: C.text, fontSize: '20px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 400, color: C.title, marginTop: 2, marginBottom: 0 }}>Mis Trabajos</h1>
        <div style={{ height: 1.5, width: '660px', background: C.line, marginBottom: 10 }} />
        <TabsComponent tab={tab} setTab={setTab} counts={counts} setCurrentPage={setCurrentPage} />
        <p style={{ color: 'red', fontSize: '24px', fontWeight: 700, marginTop: 40, textAlign: 'center' }}>DISPONIBLE EN EL SEGUNDO SPRINT</p>
      </main>
    );
  }

  if (tab === 'all' && filtered.length === 0) {
    return (
      <main style={{ padding: 24, maxWidth: 980, margin: '0 auto', fontWeight: 500, color: C.text, fontSize: '20px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 400, color: C.title, marginTop: 2, marginBottom: 0 }}>Mis Trabajos</h1>
        <div style={{ height: 1.5, width: '660px', background: C.line, marginBottom: 10 }} />
        <TabsComponent tab={tab} setTab={setTab} counts={counts} setCurrentPage={setCurrentPage} />
        <p style={{ color: C.text, fontSize: '22px', fontWeight: 500, marginTop: 40, textAlign: 'center' }}>Aún no tienes trabajos agendados.</p>
      </main>
    );
  }

  // Renderizado principal
  return (
    <main style={{ padding: 24, maxWidth: 980, margin: '0 auto', fontWeight: 400 }}>
      {/* Título */}
      <h1 style={{ fontSize: 36, fontWeight: 400, color: C.title, marginTop: 2, marginBottom: 0 }}>Mis Trabajos</h1>

      {/* Línea más delgada */}
      <div
        style={{
          height: 1.5,
          width: '660px',
          background: C.line,
          marginBottom: 10,
        }}
      />

      {/* Tabs */}
      <TabsComponent tab={tab} setTab={setTab} counts={counts} setCurrentPage={setCurrentPage} />

      {/* Lista */}
      <div
        className="scrollwrap"
        style={{
          display: 'grid',
          gap: 14,
          maxHeight: 520,
          overflow: 'auto',
          paddingRight: 8,
          width: '660px',
        }}
      >
        {paginatedJobs.map((job) => {
          const { fecha, hora } = fmt(job.startISO);
          const { hora: horaFin } = fmt(job.endISO);
          const chipBg =
            job.status === 'confirmed'
              ? C.confirmed
              : job.status === 'pending'
              ? C.pending
              : job.status === 'done'
              ? C.done
              : C.cancelled;

          return (
            <article key={job.id} style={{ border: `2.5px solid ${C.borderMain}`, borderRadius: 8, background: C.white, padding: '14px 18px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1fr 1fr auto',
                  gridTemplateRows: 'auto auto',
                  columnGap: 16,
                  rowGap: 6,
                  alignItems: 'center',
                }}
              >
                {/* Proveedor */}
                <div style={{ gridColumn: '1', gridRow: '1', display: 'flex', gap: 8, alignItems: 'center' }}>
                  <IcoUser />
                  <div>
                    <span style={{ color: C.text }}>Proveedor</span>
                    <br />
                    <span style={{ color: '#000' }}>{job.clientName}</span>
                  </div>
                </div>

                {/* Fecha */}
                <div style={{ gridColumn: '2', gridRow: '1', display: 'flex', gap: 8, alignItems: 'center' }}>
                  <IcoCalendar />
                  <div style={{ transform: 'translateY(3px)' }}>
                    <span style={{ color: C.text }}>Fecha</span>
                    <br />
                    <span style={{ color: '#000' }}>{fecha.replaceAll('-', '/')}</span>
                  </div>
                </div>

                {/* Hora inicio */}
                <div style={{ gridColumn: '3', gridRow: '1', display: 'flex', gap: 8, alignItems: 'center' }}>
                  <IcoClock />
                  <div style={{ transform: 'translateY(3px)' }}>
                    <span style={{ color: C.text }}>Hora Inicio</span>
                    <br />
                    <span style={{ color: '#000' }}>{hora.replace(/^0/, '')}</span>
                  </div>
                </div>

                {/* Botón “Ver Detalles” */}
                <div style={{ gridColumn: '4', gridRow: '1 / span 2', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => {
                      router.push('/epic_VerDetallesAmbos'); // Asegúrate de que esta ruta coincida con tu configuración de rutas en Next.js
                    }}
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

                {/* Estado */}
                <div style={{ gridColumn: '1', gridRow: '2' }}>
                  <div
                    style={{
                      display: 'inline-block',
                      padding: '8px 16px',
                      borderRadius: 12,
                      background: chipBg,
                      color: job.status === 'pending' ? '#000000' : C.white, 
                    }}
                  >
                    {job.status === 'confirmed'
                      ? 'Confirmado'
                      : job.status === 'pending'
                      ? 'Pendiente'
                      : job.status === 'done'
                      ? 'Terminado'
                      : 'Cancelado'}
                  </div>
                </div>

                {/* Servicio */}
                <div style={{ gridColumn: '2', gridRow: '2', display: 'flex', gap: 8, alignItems: 'center' }}>
                  <IcoBrief />
                  <div>
                    <span style={{ color: C.text }}>Servicio</span>
                    <br />
                    <span style={{ color: '#000' }}>{job.service}</span>
                  </div>
                </div>

                {/* Hora fin */}
                <div style={{ gridColumn: '3', gridRow: '2', display: 'flex', gap: 8, alignItems: 'center' }}>
                  <IcoClock />
                  <div>
                    <span style={{ color: C.text }}>Hora Fin</span>
                    <br />
                    <span style={{ color: '#000' }}>{horaFin.replace(/^0/, '')}</span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* --- 2. SECCIÓN DE PAGINACIÓN Y VOLVER --- */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', // <-- Alinea los elementos (botón a la izq, paginación a la der)
        alignItems: 'center', 
        marginTop: '20px', 
        width: '660px' // <-- Mismo ancho que la lista
      }}>
        
        {/* Botón Volver (Izquierda) */}
        <button
          onClick={() => router.push('/')} // <-- Navega al Home
          style={{
            padding: '10px 20px',
            height: 40,
            borderRadius: 8,
            background: C.confirmed, // Color azul
            color: C.white,
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px'
          }}
        >
          Volver
        </button>

        {/* Controles de Paginación (Derecha) */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
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

        {/* Relleno (para que 'Volver' se quede a la izquierda si no hay paginación) */}
        {totalPages <= 1 && (
          <div /> 
        )}
      </div>

      {/* Estilos del Scrollbar */}
      <style jsx global>{`
        .scrollwrap::-webkit-scrollbar { width: 10px; }
        .scrollwrap::-webkit-scrollbar-track { background: #cbd9ff; }
        .scrollwrap::-webkit-scrollbar-thumb { background: ${C.text}; border-radius: 0; }
        .scrollwrap { scrollbar-color: ${C.text} #cbd9ff; }

        button:active {
          background: ${C.active} !important;
          border-color: ${C.active} !imporant;
          color: ${C.white} !important;
        }
      `}</style>

    </main>
  );
}


// --- COMPONENTE DE TABS REFACTORIZADO (CON CORRECCIÓN DE ANCHO) ---

interface TabsProps {
  tab: TabKey;
  setTab: (tab: TabKey) => void;
  setCurrentPage: (page: number) => void;
  counts: Record<JobStatus, number>;
}

function TabsComponent({ tab, setTab, counts, setCurrentPage }: TabsProps) {
  return (
    
    <div 
      role="tablist" 
      aria-label="Filtros de estado" 
      style={{ 
        display: 'flex', 
        gap: 12, // Espacio reducido
        marginBottom: 14, 
        width: '660px' 
      }}
    >
      {(['all', 'confirmed', 'pending', 'cancelled', 'done'] as TabKey[]).map((k) => {
        const active = tab === k;
        const badge =
          k === 'all'
            ? (counts.confirmed + counts.pending + counts.cancelled + counts.done) 
            : counts[k];

        const baseBtn: React.CSSProperties = {
          borderRadius: 8,
          border: `2px solid ${C.borderBtn}`, 
          background: active ? C.active : C.white,
          color: active ? C.white : C.text,
          fontWeight: 400,
          fontSize: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          padding: '8px 12px', // Padding reducido
          lineHeight: '22px',
          whiteSpace: 'nowrap', // Para que no se parta el texto
        };

        const isAll = k === 'all';
        const allSize: React.CSSProperties = isAll
          ? {
              padding: '8px 14px', // Padding reducido
              minWidth: 115, // Ancho min reducido
              height: 40,
            }
          : {};

        return (
          <button 
            key={k} 
            onClick={() => {
              setTab(k);
              setCurrentPage(1); 
            }} 
            style={{ ...baseBtn, ...allSize }}
          >
            {k === 'all'
              ? `Todos (${badge})` 
              : k === 'confirmed'
              ? `Confirmados (${badge})` 
              : k === 'pending'
              ? `Pendientes (${badge})` 
              : k === 'cancelled'
              ? `Cancelados (${badge})` 
              : `Terminados (${badge})`}
          </button>
        );
      })}
    </div>
  );
}
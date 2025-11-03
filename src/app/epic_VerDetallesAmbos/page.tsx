'use client';

import { Suspense, useEffect, useState, type ReactNode } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { Job } from '@/app/epic_VisualizadorDeTrabajosAgendadosVistaCliente/interfaces/types';
import { fetchJobByIdRole, type Role } from './services/api';

// Evita prerender estático cuando usamos search params
export const dynamic = 'force-dynamic';

const C = {
  title: '#0C4FE9',
  text: '#1140BC',
  borderMain: '#0C4FE9',
  confirmed: '#1366FD',
  pending: '#F0D92B',
  cancelled: '#E84141',
  white: '#FFFFFF',
} as const;

function formatFechaLarga(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}
function formatHora(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d);
}

// ---- extiende Job con campos opcionales usados en UI
interface JobDetail extends Job {
  price?: number;
  cost?: number;
  cancelledBy?: string;
}

// --------------------
// Lógica del detalle (cliente y proveedor)
// --------------------
function DetailsPage() {
  const sp = useSearchParams();
  const router = useRouter();

  const id = sp.get('id') ?? '';
  const role = (sp.get('role') ?? 'cliente') as Role;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        // 1) Lee primero el cache para asegurar coincidencia exacta con la card
        const cachedRaw =
          typeof window !== 'undefined' ? localStorage.getItem('selectedJob') : null;

        if (cachedRaw) {
          const cached: Job = JSON.parse(cachedRaw);
          if (cached?.id === id) {
            if (alive) setJob(cached);
            return;
          }
        }

        // 2) Si no hay cache (o no coincide ID), busca por servicio/mock
        const found = await fetchJobByIdRole(id, role);
        if (alive) setJob(found);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
      try {
        localStorage.removeItem('selectedJob');
      } catch {}
    };
  }, [id, role]);

  if (loading) {
    return (
      <main style={{ padding: 24, maxWidth: 680, margin: '0 auto', color: C.text }}>
        <h1
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: C.title,
            textAlign: 'center',
            margin: '8px 0 16px',
          }}
        >
          Trabajo
        </h1>
        <p style={{ textAlign: 'center' }}>Cargando detalle...</p>
      </main>
    );
  }

  if (!job) {
    return (
      <main style={{ padding: 24, maxWidth: 680, margin: '0 auto', color: C.text }}>
        <h1
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: C.title,
            textAlign: 'center',
            margin: '8px 0 16px',
          }}
        >
          Trabajo
        </h1>
        <p style={{ textAlign: 'center' }}>No se encontró el trabajo.</p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
          <button
            onClick={() => router.back()}
            style={{
              padding: '10px 22px',
              borderRadius: 8,
              background: C.confirmed,
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Atrás
          </button>
        </div>
      </main>
    );
  }

  // ⚠️ Sólo soportamos CANCELADOS en esta vista (cliente o proveedor)
  if (job.status !== 'cancelled') {
    return (
      <main style={{ padding: 24, maxWidth: 680, margin: '0 auto', color: C.text }}>
        <h1
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: '#000',
            textAlign: 'center',
            margin: '8px 0 16px',
          }}
        >
          Trabajo
        </h1>
        <p
          style={{
            textAlign: 'center',
            marginTop: 12,
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          Disponible para <strong>Cancelados</strong> (la vista de Terminados se omitió).
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
          <button
            onClick={() => router.back()}
            style={{
              padding: '10px 22px',
              borderRadius: 8,
              background: C.confirmed,
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Volver
          </button>
        </div>
      </main>
    );
  }

  // Etiqueta depende del rol:
  // - Si es vista CLIENTE, mostramos "Proveedor"
  // - Si es vista PROVEEDOR, mostramos "Cliente"
const labelPersona = role === 'cliente' ? 'Proveedor' : 'Cliente';
const nombrePersona =
  role === 'cliente'
    ? (job as any).providerName ?? job.clientName   // usa providerName si lo tienes
    : job.clientName;
  const fechaLarga = formatFechaLarga(job.startISO);
  const horaIni = formatHora(job.startISO);
  const horaFin = formatHora(job.endISO);

  const j: JobDetail = job;
  const costoNum = j.price ?? j.cost ?? 250;
  const costo = `${costoNum} Bs`;

  const justificacion =
    job.cancelReason?.trim() ? job.cancelReason : 'Sin justificación';
  const canceladoPor = j.cancelledBy ?? 'Juan Perez';

  return (
    <main style={{ padding: 24, maxWidth: 680, margin: '0 auto' }}>
      <h1
        style={{
          fontSize: 36,
          fontWeight: 700,
          color: C.title,
          textAlign: 'center',
          margin: '8px 0 16px',
        }}
      >
        Trabajo
      </h1>

      <section
        style={{
          border: `2.5px solid ${C.borderMain}`,
          borderRadius: 10,
          background: C.white,
          padding: '18px 20px',
          color: '#111',
          fontSize: 18,
          lineHeight: '28px',
        }}
      >
        <Row label={`${labelPersona}:`} value={nombrePersona} />
        <Row label="Fecha:" value={fechaLarga} />
        <Row label="Horario:" value={`${horaIni} - ${horaFin}`} />
        <Row label="Descripción:" value={job.description ?? '—'} />
        <Row label="Costo:" value={costo} />

        <div
          style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '8px 0' }}
        >
          <span
            style={{
              fontWeight: 700,
              color: '#000',
              minWidth: 140,
              display: 'inline-block',
            }}
          >
            Estado:
          </span>
          <span
            style={{
              background: C.cancelled,
              color: '#000',
              borderRadius: 10,
              padding: '6px 14px',
              fontWeight: 400,
            }}
          >
            Cancelado
          </span>
          <span>Cancelado por {canceladoPor}</span>
        </div>

        <Row label="Justificación:" value={justificacion} />
      </section>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 16,
          marginTop: 24,
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            padding: '12px 28px',
            borderRadius: 12,
            background: '#1E5CF0',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 700,
          }}
        >
          Atrás
        </button>

        <button
          onClick={() => alert('Acción de contacto/reagendado')}
          style={{
            padding: '12px 28px',
            borderRadius: 12,
            background: '#1E5CF0',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 700,
          }}
        >
          Contactar para Reagendar
        </button>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', margin: '6px 0' }}>
      <span style={{ fontWeight: 700, color: '#000', minWidth: 140, display: 'inline-block' }}>
        {label}
      </span>
      <span>{value}</span>
    </div>
  );
}

// --------------------
// Export por defecto envuelto en <Suspense/>
// --------------------
export default function Page() {
  return (
    <Suspense
      fallback={
        <main style={{ padding: 24, maxWidth: 680, margin: '0 auto' }}>
          <h1
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: '#0C4FE9',
              textAlign: 'center',
              margin: '8px 0 16px',
            }}
          >
            Trabajo
          </h1>
          <p style={{ textAlign: 'center' }}>Cargando detalle…</p>
        </main>
      }
    >
      <DetailsPage />

      <style jsx global>{`
  /* ---- Responsividad ---- */
  @media (max-width: 768px) {
    main {
      padding: 12px !important;
    }
    section {
      font-size: 16px !important;
      line-height: 24px !important;
    }
    button {
      width: 100%;
      margin-top: 8px;
    }
  }
`}</style>
    </Suspense>
  );
}

'use client';

import { Suspense, useEffect, useState, type ReactNode } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { Job } from '@/app/epic_VisualizadorDeTrabajosAgendadosVistaCliente/interfaces/types';
import { fetchJobByIdRole, type Role } from './services/api';

export const dynamic = 'force-dynamic';

const C = {
  title: '#0C4FE9',
  text: '#000000',
  borderMain: '#0C4FE9',
  chipDoneBg: '#31C950',
  btnBlue: '#1E5CF0',
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

interface JobDetail extends Job {
  price?: number;
  cost?: number;
}

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
        const cachedRaw =
          typeof window !== 'undefined' ? localStorage.getItem('selectedJob') : null;

        if (cachedRaw) {
          const cached: Job = JSON.parse(cachedRaw);
          if (cached?.id === id) {
            if (alive) setJob(cached);
            return;
          }
        }
        const found = await fetchJobByIdRole(id, role);
        if (alive) setJob(found ?? null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
      try { localStorage.removeItem('selectedJob'); } catch {}
    };
  }, [id, role]);

  if (loading) {
    return (
      <main style={{ padding: 24, maxWidth: 680, margin: '0 auto' }}>
        <h1 style={styles.h1}>Trabajo</h1>
        <p style={{ textAlign: 'center' }}>Cargando...</p>
      </main>
    );
  }

  if (!job) {
    return (
      <main style={{ padding: 24, maxWidth: 680, margin: '0 auto' }}>
        <h1 style={styles.h1}>Trabajo</h1>
        <p style={{ textAlign: 'center' }}>No se encontró el trabajo.</p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
          <button style={styles.btnBlue} onClick={() => router.back()}>Atrás</button>
        </div>
      </main>
    );
  }

  if (job.status !== 'done') {
    return (
      <main style={{ padding: 24, maxWidth: 680, margin: '0 auto' }}>
        <h1 style={styles.h1}>Trabajo</h1>
        <p style={{ textAlign: 'center', fontWeight: 600 }}>Esta vista es para trabajos Terminados.</p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
          <button style={styles.btnBlue} onClick={() => router.back()}>Atrás</button>
        </div>
      </main>
    );
  }

  const labelPersona = role === 'cliente' ? 'Proveedor' : 'Cliente';
  const nombrePersona = job.clientName;
  const fechaLarga = formatFechaLarga(job.startISO);
  const horaIni = formatHora(job.startISO);
  const horaFin = formatHora(job.endISO);

  const j: JobDetail = job;
  const costoNum = j.price ?? j.cost ?? 250;
  const costo = `${costoNum} Bs`;

  return (
    <main style={{ padding: 24, maxWidth: 680, margin: '0 auto' }}>
      <h1 style={styles.h1}>Trabajo</h1>

      <section style={styles.section}>
        <Row label={`${labelPersona}:`} value={nombrePersona} />
        <Row label="Fecha:" value={fechaLarga} />
        <Row label="Horario:" value={`${horaIni} - ${horaFin}`} />
        <Row label="Descripción:" value={job.description ?? '—'} />
        <Row label="Costo:" value={costo} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '8px 0' }}>
          <span style={{ fontWeight: 700, color: '#000', minWidth: 140, display: 'inline-block' }}>
            Estado:
          </span>
          <span
            style={{
              background: C.chipDoneBg,
              color: '#000',
              borderRadius: 10,
              padding: '6px 14px',
              fontWeight: 400,
            }}
          >
            Terminado
          </span>
        </div>
      </section>

      <div style={styles.footer}>
        <button style={styles.btnBlue} onClick={() => router.back()}>Atrás</button>
        <button style={styles.btnBlue} onClick={() => alert('Abrir flujo de calificación')}>
          Calificar Proveedor
        </button>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', margin: '6px 0' }}>
      <span style={styles.label}>{label}</span>
      <span>{value}</span>
    </div>
  );
}

const styles = {
  h1: {
    fontSize: 36,
    fontWeight: 700,
    color: C.title,
    textAlign: 'center' as const,
    margin: '8px 0 16px',
  },
  section: {
    border: `2.5px solid ${C.borderMain}`,
    borderRadius: 10,
    background: C.white,
    padding: '18px 20px',
    color: '#111',
    fontSize: 18,
    lineHeight: '28px',
  },
  label: {
    fontWeight: 700,
    color: '#000',
    minWidth: 140,
    display: 'inline-block',
  },
  btnBlue: {
    padding: '12px 28px',
    borderRadius: 12,
    background: C.btnBlue,
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 700,
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 24,
  },
} as const;

export default function Page() {
  return (
    <Suspense
      fallback={
        <main style={{ padding: 24, maxWidth: 680, margin: '0 auto' }}>
          <h1 style={styles.h1}>Trabajo</h1>
          <p style={{ textAlign: 'center' }}>Cargando detalle…</p>
        </main>
      }
    >
      <DetailsPage />

      <style jsx global>{`
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
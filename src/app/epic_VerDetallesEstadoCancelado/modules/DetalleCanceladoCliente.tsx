'use client';

import { useEffect } from "react";
import { SolicitudClienteDetalle } from "../interfaces/SolicitudCliente.interface";

// 🎨 Paleta de colores igual que el segundo código
const C = {
  title: '#0C4FE9',
  text: '#1140BC',
  borderMain: '#0C4FE9',
  confirmed: '#1366FD',
  pending: '#F0D92B',
  cancelled: '#E84141',
  white: '#FFFFFF',
} as const;

// ✅ Misma función, pero ahora con formato: "25 de noviembre de 2025"
function formatearFecha(fechaISO: string): string {
  if (!fechaISO) return "Fecha no disponible";

  const [year, month, day] = fechaISO.split("-").map(Number);
  const fecha = new Date(year, month - 1, day);

  const meses = [
    "enero", "febrero", "marzo", "abril",
    "mayo", "junio", "julio", "agosto",
    "septiembre", "octubre", "noviembre", "diciembre"
  ];

  return `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
}

// Función para formatear hora "11:00"
function formatHora(horaStr: string): string {
  if (!horaStr) return "--:--";

  const [hours, minutes] = horaStr.split(':');
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
}

// Pequeño componente fila para alinear "Etiqueta: valor"
function Row(props: { label: string; value: any }) {
  const { label, value } = props;
  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        margin: '6px 0',
      }}
    >
      <span
        style={{
          fontWeight: 700,
          color: '#000',
          minWidth: 140,
          display: 'inline-block',
        }}
      >
        {label}
      </span>
      <span>{value}</span>
    </div>
  );
}

export default function DetalleCanceladoCliente({ data }: { data: SolicitudClienteDetalle }) {
  // 🔎 Mantenemos tu métrica de rendimiento
  useEffect(() => {
    const t0 = performance.now();
    const id = requestAnimationFrame(() => {
      const elapsed = Math.round(performance.now() - t0);
      console.log(`[Métrica] Carga de "Trabajo Cancelado": ${elapsed} ms`);
      if (elapsed > 2000) console.warn("⚠️ La vista tardó > 2s en cargar.");
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const volver = () => window.history.back();
  const contactarReagendar = () => {
    alert("Función de contacto para reagendar será implementada");
  };

  const justificacion = data.cancelReason?.trim() ? data.cancelReason : 'Sin justificación';
  const canceladoPor = data.cancelledBy || 'Juan Perez';

  const fechaLarga = formatearFecha(data.fechaISO);
  const horaIni = formatHora(data.horaInicio);
  const horaFin = formatHora(data.horaFin);

  // 👀 Aquí sólo usamos los datos que ya te llegan desde el backend (no tocamos esa parte)
  const nombrePersona = data.proveedor; // cámbialo a data.cliente si tu interfaz lo maneja así
  const costo = `${data.costo}Bs`;

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
        {/* En tu captura dice "Cliente:".
            Si quieres que diga "Proveedor:", cambia el texto de la etiqueta. */}
        <Row label="Cliente:" value={nombrePersona} />
        <Row label="Fecha:" value={fechaLarga} />
        <Row label="Horario:" value={`${horaIni} - ${horaFin}`} />
        <Row label="Descripción:" value={data.descripcion} />
        <Row label="Costo:" value={costo} />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            margin: '8px 0',
          }}
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
          type="button"
          onClick={volver}
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
          type="button"
          onClick={contactarReagendar}
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

      {/* Responsividad similar al segundo código */}
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
    </main>
  );
}

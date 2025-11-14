'use client';

import { useEffect } from "react";
import { SolicitudClienteDetalle } from "../interfaces/SolicitudCliente.interface";

const C = {
  title: '#0C4FE9',
  text: '#1140BC',
  borderMain: '#0C4FE9', 
  confirmed: '#1366FD',
  pending: '#F0D92B',
  cancelled: '#E84141',
  white: '#FFFFFF',
} as const;

function formatearFecha(fechaISO: string): string {
  if (!fechaISO) return "Fecha no disponible";
  const [year, month, day] = fechaISO.split("-").map(Number);
  const fecha = new Date(year, month - 1, day);
  const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  return `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
}

function formatHora(horaStr: string): string {
  if (!horaStr) return "--:--";
  const [hours, minutes] = horaStr.split(':');
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
}

function Row(props: { label: string; value: any }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', margin: '6px 0' }}>
      <span style={{ fontWeight: 700, color: '#000', minWidth: 140, display: 'inline-block' }}>
        {props.label}
      </span>
      <span>{props.value}</span>
    </div>
  );
}

export default function DetalleCanceladoCliente({ data }: { data: SolicitudClienteDetalle }) {
  const volver = () => window.history.back();
  const contactarReagendar = () => {
    alert("Función de contacto para reagendar será implementada");
  };

  const justificacion = data.cancelReason?.trim() ? data.cancelReason : 'Sin justificación';
  // Si no viene el dato de quién canceló, mostramos 'Desconocido'
  const canceladoPor = data.cancelledBy || 'Desconocido';
  const esCancelado = data.estado.toLowerCase() === 'cancelado';

  const fechaLarga = formatearFecha(data.fechaISO);
  const horaIni = formatHora(data.horaInicio);
  const horaFin = formatHora(data.horaFin);
  const costo = `${data.costo} Bs`;

  return (
    <main style={{ padding: 24, maxWidth: 680, margin: '0 auto' }}>
      <h1 style={{ fontSize: 36, fontWeight: 700, color: C.title, textAlign: 'center', margin: '8px 0 16px' }}>
        Trabajo
      </h1>

      {/* Borde blanco */}
      <section style={{ border: `2.5px solid ${C.white}`, borderRadius: 10, background: C.white, padding: '18px 20px', color: '#111', fontSize: 18, lineHeight: '28px' }}>
        
        {/* ✅ VISTA CLIENTE: Mostramos al PROVEEDOR */}
        <Row label="Proveedor:" value={data.proveedor} />
        
        <Row label="Fecha:" value={fechaLarga} />
        <Row label="Horario:" value={`${horaIni} - ${horaFin}`} />
        <Row label="Descripción:" value={data.descripcion} />
        <Row label="Costo:" value={costo} />

        {/* ESTADO */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '8px 0' }}>
          <span style={{ fontWeight: 700, color: '#000', minWidth: 140 }}>Estado:</span>
          
          {esCancelado ? (
            <span style={{ background: C.cancelled, color: '#fff', borderRadius: 10, padding: '6px 14px' }}>
              Cancelado
            </span>
          ) : (
            <span style={{ color: C.text, fontWeight: 'bold' }}>{data.estado}</span>
          )}
          
          {/* Muestra quién canceló */}
          {esCancelado && (
            <span style={{ color: '#666', fontSize: '0.9em' }}>
              {canceladoPor}
            </span>
          )}
        </div>

        {/* CAJA ROJA DE JUSTIFICACIÓN */}
        {esCancelado && (
           <Row label="Justificación:" value={justificacion} />
        )}
      </section>

      {/* BOTONES */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginTop: 24 }}>
        <button onClick={volver} style={{ padding: '12px 28px', borderRadius: 12, background: '#1E5CF0', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
          Atrás
        </button>

        <button onClick={contactarReagendar} style={{ padding: '12px 28px', borderRadius: 12, background: '#1E5CF0', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
          Contactar para Reagendar
        </button>
      </div>
      
      <style jsx global>{`
        @media (max-width: 768px) {
          main { padding: 12px !important; }
          section { font-size: 16px !important; line-height: 24px !important; }
          button { width: 100%; margin-top: 8px; }
        }
      `}</style>
    </main>
  );
}
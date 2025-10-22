"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { upsertFixerFinal } from "@/lib/api/fixer";

const K_ID = "FIXER_ID";                 // string
const K_USER = "FIXER_USER";            // si no tienes auth, usaremos dummy
const K_CI = "FIXER_IDENTITY";          // string (CI)
const K_LOCATION = "FIXER_LOCATION";    // {lat,lng,address?}
const K_CATEGORIES = "FIXER_CATEGORIES";// string[]
const K_PAYMENT = "FIXER_PAYMENT";      // { methods:[], accountOwner?, accountNumber? }

type Props = {
  onBack?: () => void;
  onNext?: () => void; // si manejas navegación externa
};

export default function StepTermsView({ onBack, onNext }: Props) {
  const [open, setOpen] = useState(false);     // modal abierto/cerrado
  const [accept, setAccept] = useState(false); // checkbox
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // (Opcional) exigir scrolleo completo antes de aceptar
  const [scrolledEnd, setScrolledEnd] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const el = boxRef.current;
    if (!el) return;
    const onScroll = () => {
      const end = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight - 2;
      setScrolledEnd(end);
    };
    el.addEventListener("scroll", onScroll);
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [open]);

  const canAccept = accept /* && scrolledEnd */; // activa scrolledEnd si QA lo pide

  // Recolectar datos guardados del wizard
  const payload = useMemo(() => {
    const id = localStorage.getItem(K_ID) || undefined;
    const userId = localStorage.getItem(K_USER) || "dummy-user-123";
    const ci = localStorage.getItem(K_CI) || "";

    let location: any = null;
    try { location = JSON.parse(localStorage.getItem(K_LOCATION) || "null"); } catch {}

    let categories: string[] = [];
    try { categories = JSON.parse(localStorage.getItem(K_CATEGORIES) || "[]"); } catch {}

    let payment: any = { methods: [] as string[] };
    try { payment = JSON.parse(localStorage.getItem(K_PAYMENT) || "{}"); } catch {}

    return {
      id,
      userId,
      ci,
      location,
      categories,
      payment,
      termsAcceptedAt: new Date().toISOString(),
    };
  }, []);

  async function handleAccept() {
    setSaving(true);
    setError(null);
    try {
      await upsertFixerFinal(payload);
      localStorage.setItem("FIXER_DONE", "true");
      // Redirige al perfil de fixer (ajusta a tu ruta real)
      window.location.href = "/perfil/fixer";
      // o usa onNext?.() si prefieres manejarlo fuera
    } catch (e: any) {
      setError("No se pudo registrar en este momento. Inténtalo nuevamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-2">
        Términos y condiciones
      </h2>

      <p className="text-sm text-gray-600 text-center mb-6">
        Antes de finalizar, revisa y acepta nuestros términos.
      </p>

      {/* Tarjeta con botón para abrir modal */}
      <div className="border rounded-lg p-4 bg-white">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-medium">Contrato de Términos y Servicios</p>
            <p className="text-sm text-gray-500">
              Haz clic en “Ver términos y condiciones” para leer el documento.
            </p>
          </div>
          <button
            className="px-4 py-2 rounded border hover:bg-gray-50"
            onClick={() => setOpen(true)}
          >
            Ver términos y condiciones
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <input
            id="accept"
            type="checkbox"
            className="h-4 w-4"
            checked={accept}
            onChange={(e) => setAccept(e.target.checked)}
          />
          <label htmlFor="accept" className="text-sm">
            He leído y acepto los Términos y Condiciones
          </label>
        </div>

        {error && <div className="mt-3 text-sm text-red-600">{error}</div>}

        <div className="mt-6 flex justify-between">
          <button className="px-4 py-2 rounded border" onClick={() => onBack?.()} disabled={saving}>
            Atrás
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
            onClick={handleAccept}
            disabled={!canAccept || saving}
          >
            {saving ? "Guardando..." : "Sí, acepto"}
          </button>
        </div>
      </div>

      {/* Modal simple (overlay + contenido) */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Términos y condiciones</h3>
              <button
                className="text-sm text-gray-600 hover:text-black"
                onClick={() => setOpen(false)}
              >
                Cerrar
              </button>
            </div>

            <div ref={boxRef} className="p-4 max-h-[60vh] overflow-y-auto">
              <ContratoContenido />
            </div>

            <div className="p-4 border-t text-right">
              <button
                className="px-4 py-2 rounded border hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Contenido de relleno del contrato (puedes reemplazar por tu HTML real)
function ContratoContenido() {
  return (
    <div className="prose max-w-none">
      <p className="text-sm text-gray-500 mb-2">
        Última actualización: {new Date().toLocaleDateString()}
      </p>
      <p>
        Este contrato (“Términos”) regula el uso de la plataforma Servineo por
        parte del Fixer. Al aceptar, confirmas que la información que registras
        es verídica y te comprometes a cumplir las políticas de seguridad, ética
        y calidad del servicio.
      </p>
      <ol>
        <li>Respeto a clientes y cumplimiento de normas locales.</li>
        <li>Prohibición de actividades fraudulentas o engañosas.</li>
        <li>Responsabilidad sobre la calidad de los servicios prestados.</li>
        <li>Autorización para tratamiento de datos conforme a ley.</li>
        <li>Posibles actualizaciones de estos Términos.</li>
      </ol>
      <p>
        Para más información, consulta nuestro centro de ayuda o comunícate con soporte.
      </p>
      <h4>Limitación de responsabilidad</h4>
      <p>
        La plataforma no se hace responsable por daños indirectos derivados de la
        ejecución de servicios entre usuarios y Fixers. El Fixer asume la responsabilidad
        de su trabajo y herramientas.
      </p>
      <h4>Privacidad y datos</h4>
      <p>
        Servineo protege tu información de acuerdo con nuestra política de privacidad.
        Puedes solicitar rectificación o eliminación de tus datos conforme a la normativa vigente.
      </p>
      <p>
        Al marcar “He leído y acepto”, confirmas la lectura y aceptación del documento.
      </p>
    </div>
  );
}

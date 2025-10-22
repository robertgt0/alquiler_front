"use client";

import { useEffect, useMemo, useState } from "react";
import type { PaymentState, PaymentMethodKey, PaymentAccount } from "@/types/payment";
import PaymentAccountModal from "@/app/components/payments/PaymentAccountModal";
import { loadLS, saveLS } from "@/lib/api/store";

const LS_KEY = "FIXER_PAYMENT";

const METHODS: { key: PaymentMethodKey; label: string; needsAccount?: boolean }[] = [
  { key: "card", label: "Tarjeta de crédito / débito", needsAccount: true },
  { key: "qr", label: "Código QR", needsAccount: true },
  { key: "cash", label: "Efectivo" },
];

type Props = {
  onNext: () => void;
  onBack?: () => void;
};

export default function StepPayment({ onNext, onBack }: Props) {
  // Estado con persistencia en LS
  const [state, setState] = useState<PaymentState>(() =>
    loadLS<PaymentState>(LS_KEY, { methods: [] })
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PaymentMethodKey | null>(null);

  useEffect(() => {
    saveLS(LS_KEY, state);
  }, [state]);

  // Handlers
  function toggleMethod(key: PaymentMethodKey) {
    setState((prev) => {
      const exists = prev.methods.includes(key);
      const nextMethods = exists ? prev.methods.filter((k) => k !== key) : [...prev.methods, key];

      // Si se desmarca card/qr, limpiamos su cuenta
      const next: PaymentState = { ...prev, methods: nextMethods };
      if (!nextMethods.includes("card")) next.card = null;
      if (!nextMethods.includes("qr")) next.qr = null;
      return next;
    });
  }

  function openAccountModal(key: PaymentMethodKey) {
    setEditing(key);
    setModalOpen(true);
  }

  function closeAccountModal() {
    setModalOpen(false);
    setEditing(null);
  }

  function saveAccount(acc: PaymentAccount) {
    if (!editing) return;
    setState((prev) => ({ ...prev, [editing]: acc }));
    closeAccountModal();
  }

  const canContinue = useMemo(() => {
    // Debe haber al menos un método seleccionado
    if (state.methods.length === 0) return false;

    // Si card o qr están seleccionados, deben tener cuenta válida guardada
    const cardOk =
      !state.methods.includes("card") ||
      (!!state.card?.holder && !!state.card?.accountNumber);
    const qrOk =
      !state.methods.includes("qr") ||
      (!!state.qr?.holder && !!state.qr?.accountNumber);

    return cardOk && qrOk;
  }, [state]);

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-1 text-2xl font-semibold">¿Cómo te gustaría que te paguen?</h2>
      <p className="mb-6 text-gray-600">
        Elige uno o varios métodos. Si seleccionas Tarjeta o Código QR, te pediremos los datos del titular
        y el número de cuenta.
      </p>

      <div className="space-y-3">
        {METHODS.map((m) => {
          const checked = state.methods.includes(m.key);
          const needsAccount = !!m.needsAccount;

          const hasAcc =
            m.key === "card" ? !!state.card?.accountNumber : m.key === "qr" ? !!state.qr?.accountNumber : false;

          const subtitle =
            !needsAccount
              ? ""
              : hasAcc
              ? `Titular: ${(m.key === "card" ? state.card?.holder : state.qr?.holder) ?? ""} — Cuenta: ${
                  (m.key === "card" ? state.card?.accountNumber : state.qr?.accountNumber) ?? ""
                }`
              : "Falta registrar datos de cuenta";

          return (
            <div
              key={m.key}
              className={`flex items-center justify-between rounded-xl border p-4 transition
                ${checked ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"}`}
            >
              <label className="flex flex-1 cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleMethod(m.key)}
                  className="mt-1 h-5 w-5 accent-blue-600"
                />
                <div>
                  <div className="font-medium">{m.label}</div>
                  {needsAccount && (
                    <div className={`text-sm ${hasAcc ? "text-green-700" : "text-amber-700"}`}>{subtitle}</div>
                  )}
                </div>
              </label>

              {needsAccount && checked && (
                <button
                  onClick={() => openAccountModal(m.key)}
                  className="ml-3 rounded-lg border border-blue-200 px-3 py-2 text-sm text-blue-700 hover:bg-blue-50"
                >
                  {hasAcc ? "Editar cuenta" : "Registrar cuenta"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Acciones */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
        >
          Atrás
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          title={!canContinue ? "Selecciona método(s) y completa los datos requeridos" : ""}
        >
          Siguiente
        </button>
      </div>

      {/* Modal */}
      <PaymentAccountModal
        open={modalOpen}
        title={editing === "card" ? "Tarjeta" : "Código QR"}
        initial={editing === "card" ? state.card ?? null : editing === "qr" ? state.qr ?? null : null}
        onClose={closeAccountModal}
        onConfirm={saveAccount}
      />
    </div>
  );
}

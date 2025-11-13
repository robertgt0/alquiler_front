"use client";

import { useMemo, useState } from "react";
import PaymentAccountModal from "@/app/components/payments/PaymentAccountModal";
import type { PaymentAccount, PaymentMethodKey, PaymentState } from "@/types/payment";
import { updatePayments as updatePaymentsApi } from "@/lib/api/fixer";
import StepProgress from "../components/StepProgress";
import { STORAGE_KEYS, saveToStorage } from "../storage";
import type { StepPaymentProps } from "./types";

const METHODS: { key: PaymentMethodKey; label: string; needsAccount?: boolean }[] = [
  { key: "card", label: "Tarjeta de crédito / débito", needsAccount: true },
  { key: "qr", label: "Código QR", needsAccount: true },
  { key: "cash", label: "Efectivo" },
];

export default function StepPayment({ fixerId, state, onBack, onComplete }: StepPaymentProps) {
  const [formState, setFormState] = useState<PaymentState>(state);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PaymentMethodKey | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function toggleMethod(key: PaymentMethodKey) {
    setFormState((prev) => {
      const exists = prev.methods.includes(key);
      const methods = exists ? prev.methods.filter((item) => item !== key) : [...prev.methods, key];
      const next: PaymentState = { ...prev, methods };
      if (!methods.includes("card")) next.card = null;
      if (!methods.includes("qr")) next.qr = null;
      return next;
    });
  }

  function openModal(key: PaymentMethodKey) {
    setEditing(key);
    setModalOpen(true);
  }

  function closeModal() {
    setEditing(null);
    setModalOpen(false);
  }

  function saveAccount(data: PaymentAccount) {
    if (!editing) return;
    setFormState((prev) => ({ ...prev, [editing]: data }));
    closeModal();
  }

  const canContinue = useMemo(() => {
    if (formState.methods.length === 0) return false;
    const cardOk =
      !formState.methods.includes("card") ||
      (!!formState.card?.holder && !!formState.card?.accountNumber);
    const qrOk =
      !formState.methods.includes("qr") ||
      (!!formState.qr?.holder && !!formState.qr?.accountNumber);
    return cardOk && qrOk;
  }, [formState]);

  async function handleNext() {
    if (!canContinue) {
      setError("Selecciona al menos un método de pago válido");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const accounts: Partial<Record<PaymentMethodKey, PaymentAccount>> = {};
      if (formState.methods.includes("card") && formState.card) accounts.card = formState.card;
      if (formState.methods.includes("qr") && formState.qr) accounts.qr = formState.qr;

      await updatePaymentsApi(fixerId, {
        methods: formState.methods,
        accounts,
      });

      saveToStorage(STORAGE_KEYS.payment, formState);
      onComplete(formState);
    } catch (err: any) {
      setError(String(err?.message || "No se pudieron guardar los métodos de pago"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-6">
      <header className="rounded-3xl bg-white p-8 shadow-lg">
        <StepProgress current={4} />
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">¿Cómo te gustaría que te paguen?</h2>
        <p className="mt-2 text-sm text-slate-500">Selecciona los métodos que aceptas. Si eliges Tarjeta o Código QR, registra los datos del titular.</p>
      </header>

      <div className="space-y-4">
        {METHODS.map((method) => {
          const checked = formState.methods.includes(method.key);
          const needsAccount = Boolean(method.needsAccount);
          const account = method.key === "card" ? formState.card : method.key === "qr" ? formState.qr : null;
          const hasAccount = !!account?.accountNumber;

          return (
            <div
              key={method.key}
              className={`flex items-start justify-between rounded-2xl border p-5 transition ${
                checked ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white"
              }`}
            >
              <label className="flex flex-1 cursor-pointer items-start gap-4">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleMethod(method.key)}
                  className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex flex-col gap-1">
                  <span className="text-base font-semibold text-slate-800">{method.label}</span>
                  {needsAccount && (
                    <span className={`text-sm ${hasAccount ? "text-green-600" : "text-amber-600"}`}>
                      {hasAccount
                        ? `Titular: ${account?.holder ?? ""} · Cuenta: ${account?.accountNumber ?? ""}`
                        : "Falta registrar datos de cuenta"}
                    </span>
                  )}
                </div>
              </label>

              {needsAccount && checked && (
                <button
                  type="button"
                  onClick={() => openModal(method.key)}
                  className="rounded-xl border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                >
                  {hasAccount ? "Editar cuenta" : "Registrar cuenta"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <footer className="flex items-center justify-between rounded-3xl bg-white p-6 shadow-lg">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-blue-500 hover:text-blue-600"
        >
          Atrás
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canContinue || loading}
          className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Guardando..." : "Siguiente"}
        </button>
      </footer>

      <PaymentAccountModal
        open={modalOpen}
        title={editing === "card" ? "Tarjeta" : "Código QR"}
        initial={editing === "card" ? formState.card ?? null : editing === "qr" ? formState.qr ?? null : null}
        onClose={closeModal}
        onConfirm={saveAccount}
      />
    </section>
  );
}

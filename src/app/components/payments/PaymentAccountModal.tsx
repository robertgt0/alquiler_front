"use client";

import { useEffect, useMemo, useState } from "react";
import type { PaymentAccount } from "@/types/payment";

type Props = {
  open: boolean;
  title: string; // "Tarjeta" | "Código QR"
  initial?: PaymentAccount | null;
  onClose: () => void;
  onConfirm: (acc: PaymentAccount) => void;
};

export default function PaymentAccountModal({
  open,
  title,
  initial,
  onClose,
  onConfirm,
}: Props) {
  const [holder, setHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [errors, setErrors] = useState<{ holder?: string; accountNumber?: string }>({});

  useEffect(() => {
    if (!open) return;
    setHolder(initial?.holder ?? "");
    setAccountNumber(initial?.accountNumber ?? "");
    setErrors({});
  }, [open, initial]);

  const valid = useMemo(() => {
    const next: typeof errors = {};
    if (!holder.trim()) next.holder = "El nombre del titular es obligatorio.";
    else if (!/^[A-Za-zÁÉÍÓÚÑáéíóúñ ]{3,60}$/.test(holder.trim()))
      next.holder = "Solo letras y espacios (3–60).";

    if (!accountNumber.trim()) next.accountNumber = "El número de cuenta es obligatorio.";
    else if (!/^[0-9]{8,20}$/.test(accountNumber.trim()))
      next.accountNumber = "Solo números (8–20 dígitos).";

    setErrors(next);
    return Object.keys(next).length === 0;
  }, [holder, accountNumber]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold">Datos para {title}</h3>

        <label className="mb-3 block">
          <span className="mb-1 block text-sm text-gray-700">Nombre del titular</span>
          <input
            value={holder}
            onChange={(e) => setHolder(e.target.value)}
            className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring
              ${errors.holder ? "border-red-500" : "border-gray-300"}`}
            placeholder="Ej: Juan Pérez"
          />
          {errors.holder && <p className="mt-1 text-xs text-red-600">{errors.holder}</p>}
        </label>

        <label className="mb-4 block">
          <span className="mb-1 block text-sm text-gray-700">Número de cuenta</span>
          <input
            value={accountNumber}
            inputMode="numeric"
            onChange={(e) => setAccountNumber(e.target.value.replace(/\D+/g, ""))}
            className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring
              ${errors.accountNumber ? "border-red-500" : "border-gray-300"}`}
            placeholder="Solo números (8–20)"
          />
          {errors.accountNumber && (
            <p className="mt-1 text-xs text-red-600">{errors.accountNumber}</p>
          )}
        </label>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={() => valid && onConfirm({ holder: holder.trim(), accountNumber: accountNumber.trim() })}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            disabled={!valid}
          >
            Guardar método de pago
          </button>
        </div>
      </div>
    </div>
  );
}

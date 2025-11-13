import React from "react";
import { BalanceCardProps } from "../types";
import { EyeIcon, EyeSlashIcon, RefreshIcon } from "./WalletIcons";

export default function BalanceCard({ saldo, moneda, showSaldo, onToggleShowSaldo, onRefresh, loading }: BalanceCardProps) {
  const saldoFormateado = (saldo || 0).toLocaleString("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="bg-gradient-to-r from-[#11255A] via-[#5C83BE] to-[#8DC0FF] text-white p-6 rounded-2xl shadow-lg relative">
      <div className="absolute top-4 right-4 flex items-center space-x-3">
        <button onClick={onRefresh} className="text-white/70 hover:text-white transition-opacity disabled:opacity-50" disabled={loading}>
          <RefreshIcon className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
        </button>
        <button onClick={onToggleShowSaldo} className="text-white/70 hover:text-white transition-opacity">
          {showSaldo ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
        </button>
      </div>

      <p className="font-medium text-blue-100">Saldo Total</p>
      <div className="mt-2 text-4xl font-bold">
        {showSaldo ? <span>{moneda} {saldoFormateado}</span> : <span>{moneda} ****.**</span>}
      </div>

      <div className="mt-4 flex items-center space-x-2 text-sm">
        <span className="font-mono text-blue-100">**** 4829</span>
        <span className="bg-green-500/30 text-green-100 text-xs font-semibold px-2 py-0.5 rounded-full">
          Verificado
        </span>
      </div>
    </div>
  );
}
"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useWallet } from "./hooks/useWallet";
import WalletAlert from "./components/walletAlert";
import BalanceCard from "./components/BalanceCard";
import TransactionList from "./components/TransactionList";

function WalletLogic() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const usuario = searchParams.get("usuario");

  const { balanceData, transactions, loading, error, reload } = useWallet(usuario);
  const [showSaldo, setShowSaldo] = useState(true);

  return (
    <div className="bg-gray-50 min-h-screen">
      
      <div className="max-w-4xl mx-auto px-4 pb-4 pt-0 md:px-8 md:pb-8 md:pt-0">

        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-800 p-2" title="Volver">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-[#11255A]">Mi Billetera</h1>
              <p className="text-gray-500">Billetera de: {usuario}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className="flex items-center space-x-2 bg-[#11255A] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:bg-[#0B1A40] transition-colors disabled:opacity-50"
              onClick={() => router.push(`/bitcrew/pagosQR?usuario=${usuario}`)}
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504-1.125-1.125-1.125H6.375c-.621 0-1.125-.504-1.125-1.125V6.375c0-.621.504-1.125 1.125-1.125h9.375m-1.5 6a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
              </svg>
              <span>Recargar Saldo</span>
            </button>
          </div>
        </header>

        <main>
          {/* Mensajes de error */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* Skeleton mientras carga */}
          {loading && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 p-6 rounded-2xl shadow-lg animate-pulse">
                <div className="h-4 bg-gray-400 rounded w-1/4 mb-4"></div>
                <div className="h-10 bg-gray-400 rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-gray-400 rounded w-1/3"></div>
              </div>
              <div className="mt-10">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ✅ SOLUCIÓN BUG 1: Solo mostrar alerta cuando ya cargó Y el saldo es bajo o cuenta restringida */}
          {!loading && balanceData && (balanceData.saldo <= 0 || balanceData.estado === "restringido") && (
            <WalletAlert balance={balanceData.saldo} estado={balanceData.estado} />
          )}

          {/* ✅ Solo mostrar balance card cuando ya cargó Y hay datos */}
          {!loading && balanceData && (
            <BalanceCard
              saldo={balanceData.saldo}
              moneda={balanceData.moneda || "Bs."}
              showSaldo={showSaldo}
              onToggleShowSaldo={() => setShowSaldo(!showSaldo)}
              onRefresh={reload}
              loading={loading}
            />
          )}

          {/* Mensaje cuando no hay datos */}
          {!loading && !balanceData && !error && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
              <p>No se encontraron datos de billetera para este usuario.</p>
            </div>
          )}

          {/* Lista de transacciones */}
          {!loading && <TransactionList transactions={transactions} />}
        </main>
      </div>
    </div>
  );
}

export default function WalletPage() {
  return (
    <Suspense fallback={<div>Cargando billetera...</div>}>
      <WalletLogic />
    </Suspense>
  );
}
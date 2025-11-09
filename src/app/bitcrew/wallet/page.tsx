"use client"; // Necesitamos un componente de cliente para usar hooks

import React, { useState, useEffect, useCallback } from 'react';
import WalletAlert from "./components/walletAlert";

// --- 1. DEFINICIÓN DE INTERFACES ---

// Lo que recibimos del Backend
interface IBilletera {
  _id: string;
  saldo: number;
  moneda: string;
  estado: string;
}

interface ITransaccionBackend {
  _id: string;
  tipo: 'credito' | 'debito';
  monto: number;
  descripcion: string;
  fecha: string;
}

// Lo que los componentes del Frontend esperan
interface IFrontendTransaction {
  id: string;
  type: 'credito' | 'debito';
  date: string;
  amount: number;
  descripcion: string;
}

// Props para los componentes hijos
interface BalanceCardProps {
  saldo: number | undefined;
  moneda: string;
  showSaldo: boolean;
  onToggleShowSaldo: () => void;
  onRefresh: () => void;
  loading: boolean;
}

interface TransactionListProps {
  transactions: IFrontendTransaction[];
}

interface TransactionItemProps {
  transaction: IFrontendTransaction;
}

// --- 2. ICONOS SVG (como componentes) ---

const EyeIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const EyeSlashIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L12 12" />
  </svg>
);

const RefreshIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

const TransactionIcon = ({ className = "w-6 h-6 text-blue-500" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h6m3-3.75l-3.75-3.75M17.25 19.5l-3.75-3.75m-4.5 3.75h6.75c.621 0 1.125-.504 1.125-1.125V11.25c0-.621-.504-1.125-1.125-1.125H8.25c-.621 0-1.125.504-1.125 1.125v6.75c0 .621.504 1.125 1.125 1.125Z" />
  </svg>
);

// --- 3. COMPONENTES HIJOS ---

function BalanceCard({ saldo, moneda, showSaldo, onToggleShowSaldo, onRefresh, loading }: BalanceCardProps) {
  const saldoFormateado = (saldo || 0).toLocaleString('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return (
    <div className="bg-gradient-to-r from-[#11255A] via-[#5C83BE] to-[#8DC0FF] text-white p-6 rounded-2xl shadow-lg relative">
      <div className="absolute top-4 right-4 flex items-center space-x-3">
        <button onClick={onRefresh} className="text-white/70 hover:text-white transition-opacity disabled:opacity-50" disabled={loading}>
          <RefreshIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
        <button onClick={onToggleShowSaldo} className="text-white/70 hover:text-white transition-opacity">
          {showSaldo ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
        </button>
      </div>

      <p className="font-medium text-blue-100">Balance Total</p>
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

function TransactionItem({ transaction }: TransactionItemProps) {
  const { type, descripcion, date, amount } = transaction;
  const esCredito = type === 'credito';

  const fechaFormateada = new Date(date).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });

  const montoFormateado = (amount || 0).toLocaleString('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return (
    <li className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-gray-100 rounded-full text-gray-500">
          <TransactionIcon className="w-6 h-6" />
        </div>
        <div>
          <p className="font-semibold text-[#11255A]">{descripcion || 'Transferencia'}</p>
          <p className="text-sm text-gray-500">{fechaFormateada}</p>
        </div>
      </div>
      <div className={`font-semibold text-lg ${esCredito ? 'text-green-600' : 'text-gray-900'}`}>
        {esCredito ? '+' : ''} Bs. {montoFormateado}
      </div>
    </li>
  );
}

function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#11255A]">Transacciones Recientes</h2>
        <a href="#" className="text-sm font-medium text-blue-600 hover:underline">
          Ver todas
        </a>
      </div>

      {transactions.length > 0 ? (
        <ul className="space-y-3">
          {transactions.map((tx) => (
            <TransactionItem key={tx.id} transaction={tx} />
          ))}
        </ul>
      ) : (
        <div className="text-center py-10 px-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">Sin transacciones registradas</p>
        </div>
      )}
    </div>
  );
}

// --- 4. COMPONENTE PRINCIPAL ---
export default function WalletPage() {
  const [balanceData, setBalanceData] = useState<IBilletera | null>(null);
  const [transactions, setTransactions] = useState<IFrontendTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSaldo, setShowSaldo] = useState(true);

  const usuario = "tmolina";

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    try {
      const [billeteraRes, historialRes] = await Promise.all([
        fetch(`${API_BASE_URL}/bitcrew/billetera/${usuario}`, { cache: "no-store" }),
        fetch(`${API_BASE_URL}/bitcrew/historial/${usuario}`, { cache: "no-store" })
      ]);

      if (!billeteraRes.ok) throw new Error(`Error HTTP (Saldo): ${billeteraRes.status}`);
      const dataBilletera = await billeteraRes.json();
      if (!dataBilletera.success) throw new Error(dataBilletera.message);
      setBalanceData(dataBilletera.billetera);

      if (!historialRes.ok) throw new Error(`Error HTTP (Historial): ${historialRes.status}`);
      const dataHistorial = await historialRes.json();
      if (!dataHistorial.success) throw new Error(dataHistorial.message);

      const frontendTransactions: IFrontendTransaction[] = dataHistorial.transacciones.map((tx: ITransaccionBackend) => ({
        id: tx._id,
        type: tx.tipo,
        date: tx.fecha,
        amount: tx.monto,
        descripcion: tx.descripcion
      }));
      setTransactions(frontendTransactions);

    } catch (err: any) {
      console.error("Error al cargar datos:", err);
      setError(err.message);
      setBalanceData(null);
    } finally {
      setLoading(false);
    }
  }, [usuario]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#11255A]">Mi Billetera</h1>
            <p className="text-gray-500">Gestiona tus finanzas fácilmente</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className="flex items-center space-x-2 bg-[#11255A] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:bg-[#0B1A40] transition-colors disabled:opacity-50"
              onClick={loadData}
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504-1.125-1.125-1.125H6.375c-.621 0-1.125-.504-1.125-1.125V6.375c0-.621.504-1.125 1.125-1.125h9.375m-1.5 6a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
              </svg>
              <span>Recargar Saldo</span>
            </button>
            <img src="https://placehold.co/40x40/blue/white?text=User" alt="Avatar" className="w-10 h-10 rounded-full" />
          </div>
        </header>

        <main>
          {/* 
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          */}

          <WalletAlert balance={balanceData?.saldo ?? 0} estado={balanceData?.estado} />

          <BalanceCard
            saldo={balanceData?.saldo}
            moneda={balanceData?.moneda || "Bs."}
            showSaldo={showSaldo}
            onToggleShowSaldo={() => setShowSaldo(!showSaldo)}
            onRefresh={loadData}
            loading={loading}
          />

          {loading && !error && (
            <p className="text-center py-10 text-gray-500">Cargando transacciones...</p>
          )}

          {!loading && !error && (
            <TransactionList transactions={transactions} />
          )}
        </main>
      </div>
    </div>
  );
}

'use client';

import Wallet from './components/Wallet'; 
import './components/Wallet.css';

import BalanceCard from "./components/BalanceCard/BalanceCard";
import TransactionList from "./components/TransactionList/TransactionList";
//import "./Wallet.css";

/*export default function WalletPage() {
  return (
    <main>
      <Wallet />
    </main>
  );
}*/

// --- 1. FUNCIÓN PARA OBTENER EL SALDO ---
// Esta función llama a tu endpoint: /api/devcode/billetera
async function getBalanceData() {
  // Construye la URL completa usando la variable del .env.local
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/billetera`;

  try {
    // Llama al backend. 'no-store' asegura que siempre pida datos frescos.
    const res = await fetch(apiUrl, { cache: "no-store" });

    if (!res.ok) {
      // Si el backend da un error (404, 500), lo capturamos
      console.error("Error al cargar el saldo:", await res.text());
      return { saldo: 0, moneda: "Bs.", estado: "Error" }; // Datos por defecto
    }
    return res.json();
  } catch (error) {
    console.error("Error de conexión con el backend (saldo):", error);
    return { saldo: 0, moneda: "Bs.", estado: "Sin conexión" };
  }
}

// --- 2. FUNCIÓN PARA OBTENER LAS TRANSACCIONES ---
// Esta función llama a tu endpoint: /api/devcode/historial
async function getTransactionData() {
  // Pide la página 1, con un límite de 10 (como en los ACs)
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/historial?page=1&limit=10`;

  try {
    const res = await fetch(apiUrl, { cache: "no-store" });

    if (!res.ok) {
      console.error("Error al cargar transacciones:", await res.text());
      return { transacciones: [], mensaje: "Error al cargar" }; // Datos por defecto
    }
    return res.json();
  } catch (error) {
    console.error("Error de conexión con el backend (historial):", error);
    return { transacciones: [], mensaje: "Sin conexión" };
  }
}

// --- 3. TU COMPONENTE DE PÁGINA (ahora 'async') ---
export default async function WalletPage() {
  // 1. Llama a las funciones y espera los datos del backend
  const [balanceData, transactionData] = await Promise.all([
    getBalanceData(),
    getTransactionData(),
  ]);

  // 2. Los datos han llegado. (ej. balanceData = { saldo: 12730.50, ... })

  // 3. Renderiza tus componentes y "pasa" los datos como props
  return (
    <div className="wallet-container">
      {/* Título de la página */}
      <h1>Mi Billetera</h1>

      {/* Pasa los datos del balance a la tarjeta */}
      <BalanceCard
        {...({
          saldo: balanceData.saldo,
          moneda: balanceData.moneda,
          estado: balanceData.estado,
        } as any)}
      />

      {/* Pasa la lista de transacciones y el mensaje (si existe) */}
      <TransactionList
        transactions={transactionData.transacciones}
      />
    </div>
  );
}
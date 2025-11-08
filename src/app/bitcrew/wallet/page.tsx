import React from 'react';
// ⚠️ IMPORTANTE: Verifica si Wallet.css está en la misma carpeta que este archivo.
// Si está junto a page.tsx, usa: import './Wallet.css';
// Si lo moviste a components, usa: import './components/Wallet.css';
import './components/Wallet.css'; 

import BalanceCard from "./components/BalanceCard/BalanceCard";
import TransactionList from "./components/TransactionList/TransactionList";

// --- 1. FUNCIÓN PARA OBTENER EL SALD0---
async function getBalanceData() {
  // Asegúrate de que esta variable de entorno esté definida en .env.local
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/billetera`;

  try {
    const res = await fetch(apiUrl, { cache: "no-store" });

    if (!res.ok) {
      console.error("Error al cargar el saldo:", await res.text());
      // Retornamos undefined para que BalanceCard muestre el estado de carga/error (000.00)
      return { saldo: undefined, moneda: "Bs.", estado: "Error" }; 
    }
    return res.json();
  } catch (error) {
    console.error("Error de conexión con el backend (saldo):", error);
    return { saldo: undefined, moneda: "Bs.", estado: "Sin conexión" };
  }
}

// --- 2. FUNCIÓN PARA OBTENER LAS TRANSACCIONES ---
async function getTransactionData() {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/historial?page=1&limit=10`;

  try {
    const res = await fetch(apiUrl, { cache: "no-store" });

    if (!res.ok) {
      console.error("Error al cargar transacciones:", await res.text());
      return { transacciones: [] }; // Retorna array vacío en caso de error
    }
    return res.json();
  } catch (error) {
    console.error("Error de conexión con el backend (historial):", error);
    return { transacciones: [] };
  }
}

// --- 3. COMPONENTE DE PÁGINA PRINCIPAL ---
export default async function WalletPage() {
  // Llamadas paralelas al backend
  const [balanceData, transactionData] = await Promise.all([
    getBalanceData(),
    getTransactionData(),
  ]);

  return (
    // CORRECCIÓN CLAVE 1: Usar la clase correcta 'wallet-app-container'
    <div className="wallet-app-container">
      
      <header className="wallet-header">
        <div className="header-title">
          <h1>Mi Billetera</h1>
          <p>Gestiona tus finanzas fácilmente</p>
        </div>
        
        {/* Botón visible SOLO en Desktop */}
        <div className="header-actions">
          <button className="reload-button desktop-only">
            <span>Recargar Saldo</span>
          </button>
        </div>
      </header>

      {/* CORRECCIÓN CLAVE 2: Restaurar el 'main' con su clase para el layout */}
      <main className="wallet-main-content">
        
        {/* Pasamos el saldo recuperado. Si es undefined, mostrará 000.00 */}
        <BalanceCard
          balance={balanceData.saldo} 
        />

        {/* CORRECCIÓN CLAVE 3: Restaurar el botón visible SOLO en Mobile */}
        <button className="reload-button mobile-only">
          <span>Recargar Saldo</span>
        </button>

        {/* Pasamos la lista de transacciones recuperada */}
        <TransactionList
          transactions={transactionData.transacciones}
        />
      </main>
    </div>
  );
}
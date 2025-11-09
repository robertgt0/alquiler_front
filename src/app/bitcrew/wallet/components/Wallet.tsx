import React, { useState, useEffect } from 'react';
import BalanceCard from './BalanceCard/BalanceCard';
import TransactionList from './TransactionList/TransactionList';
import type { Transaction } from './TransactionList/TransactionList';
import './Wallet.css';
import './walletAlert.css';

// --- Datos Ficticios ---
const mockTransactions: Transaction[] = [
  { id: '1', type: 'Transferencia recibida', date: 'Hoy, 10:15', amount: 698.23 },
  { id: '2', type: 'Transferencia recibida', date: '02, Dic', amount: 118.13 },
  { id: '3', type: 'Transferencia recibida', date: '15, Feb', amount: 800.13 },
];

const mockBalance = -10;

const Wallet: React.FC = () => {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (mockBalance <= 0) {
      setShowAlert(true);
    }
  }, []);

  return (
    <div className="wallet-app-container">
      {/* --- Alerta Modal --- */}
      {showAlert && (
        <div className="alert-overlay">
          <div className="alert-modal">
            <div className="alert-header">
              <span className="alert-icon">⚠️</span>
            </div>
            <h2 className="alert-title">La cuenta ha sido restringida</h2>
            <p className="alert-message">
              Su cuenta ha sido restringida porque su saldo de <strong>{mockBalance}</strong> 
              {' '}es inferior al límite establecido por la plataforma.
            </p>
            <button className="alert-button" onClick={() => setShowAlert(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* --- Encabezado Principal --- */}
      <header className="wallet-header">
        <div className="header-title">
          <h1>Mi Billetera</h1>
          <p>Gestiona tus finanzas fácilmente</p>
        </div>

        <div className="header-actions">
          <button className="reload-button desktop-only">
            <span>Recargar Saldo</span>
          </button>
        </div>
      </header>

      {/* --- Contenido Principal --- */}
      <main className="wallet-main-content">
        <BalanceCard balance={mockBalance} />
        <button className="reload-button mobile-only">
          <span>Recargar Saldo</span>
        </button>
        <TransactionList transactions={mockTransactions} />
      </main>
    </div>
  );
};

export default Wallet;

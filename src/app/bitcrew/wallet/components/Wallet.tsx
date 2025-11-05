import React from 'react';
import BalanceCard from './BalanceCard/BalanceCard';
import TransactionList from './TransactionList/TransactionList';
import type { Transaction } from './TransactionList/TransactionList';
import './Wallet.css';

// Iconos para el header y botón
// import { FiBell, FiSettings, FiUpload } from 'react-icons/fi'; 

// --- Datos Ficticios (Mock Data) ---
// Para probar el estado vacío, simplemente usa: const mockTransactions: Transaction[] = [];
const mockTransactions: Transaction[] = [
  { id: '1', type: 'Transferencia recibida', date: 'Hoy, 10:15', amount: 698.23 },
  { id: '2', type: 'Transferencia recibida', date: '02, Dic', amount: 118.13 },
  { id: '3', type: 'Transferencia recibida', date: '15, Feb', amount: 800.13 },
];

const mockBalance = 12730.50;
// ---------------------------------

const Wallet: React.FC = () => {
  return (
    <div className="wallet-app-container">
      <header className="wallet-header">
        <div className="header-title">
          <h1>Mi Billetera</h1>
          <p>Gestiona tus finanzas fácilmente</p>
        </div>
        <div className="header-actions">
          {/* Botón "Recargar Saldo" - Solo visible en Desktop */}
          <button className="reload-button desktop-only">
            {/* <FiUpload /> */}
            <span>Recargar Saldo</span>
          </button>
          
          {/* Iconos de Notificaciones y Configuración */}
          <div className="icon-action">
            {/* <FiBell size={20} /> */}
          </div>
          <div className="icon-action">
            {/* <FiSettings size={20} /> */}
          </div>
          <img 
            src="https://via.placeholder.com/40" // Reemplazar con tu avatar
            alt="User Avatar" 
            className="user-avatar"
          />
        </div>
      </header>

      <main className="wallet-main-content">
        <BalanceCard balance={mockBalance} />
        
        {/* Botón "Recargar Saldo" - Solo visible en Mobile */}
        <button className="reload-button mobile-only">
          {/* <FiUpload /> */}
          <span>Recargar Saldo</span>
        </button>

        <TransactionList transactions={mockTransactions} />
      </main>
    </div>
  );
};

export default Wallet;
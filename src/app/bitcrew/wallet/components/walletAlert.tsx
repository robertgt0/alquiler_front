// src/app/bitcrew/components/Wallet.tsx
"use client";

import { useState, useEffect } from "react";
import "./WalletAlert.css"; 

interface WalletAlertProps {
  balance: number;
  estado?: string;
}

export default function WalletAlert({ balance, estado }: WalletAlertProps) {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (balance <= 0 || estado === "restringido") {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [balance, estado]);

  if (!showAlert) return null;

  return (
    <div className="alert-overlay">
      <div className="alert-modal">
        <div className="alert-header">
          <span className="alert-icon">⚠️</span>
        </div>
        <h2 className="alert-title">Saldo insuficiente</h2>
        <p className="alert-message">
          Tu saldo actual es{" "}
          <span className="alert-balance">
            Bs. {balance?.toFixed(2) ?? "0.00"}
          </span>
          .
        </p>
        <p className="alert-message">
          Recarga tu billetera para continuar usando los servicios.
        </p>
        <button
          className="alert-button"
          onClick={() => setShowAlert(false)}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

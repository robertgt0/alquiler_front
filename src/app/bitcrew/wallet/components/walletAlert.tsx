// src/app/bitcrew/components/Wallet.tsx
"use client";

import { useState, useEffect } from "react";
import "./Wallet.css";

export default function Wallet() {
  const [saldo, setSaldo] = useState<number | null>(null);
  const [estado, setEstado] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  const usuario = "robertopacheco"; 
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/wallet/${usuario}`);
        const data = await res.json();

        if (data.success && data.billetera) {
          const billetera = data.billetera;
          setSaldo(billetera.saldo);
          setEstado(billetera.estado);


          if (billetera.saldo <= 0 || billetera.estado === "restringido") {
            setShowAlert(true);
          }
        }
      } catch (error) {
        console.error("Error al obtener la billetera:", error);
      }
    };

    fetchWallet();
  }, [usuario]);

  return (
    <div className="wallet-container">
      <h1 className="wallet-title">Mi Billetera</h1>
      {saldo !== null && (
        <p className="wallet-balance">
          Saldo actual: <span>${saldo.toFixed(2)}</span>
        </p>
      )}

      {estado && <p className="wallet-status">Estado: {estado}</p>}

      {showAlert && (
        <div className="wallet-alert-overlay">
          <div className="wallet-alert">
            <h2>Saldo insuficiente</h2>
            <p>
              Tu saldo actual es{" "}
              <span className="alert-balance">${saldo?.toFixed(2)}</span>.
            </p>
            <p>Recarga tu billetera para continuar usando los servicios.</p>
            <button onClick={() => setShowAlert(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

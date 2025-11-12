"use client";
import { useEffect, useState } from "react";
import { getWalletStatus } from "../services/walletService";

export const useWalletAlert = (usuario: string) => {
  const [saldo, setSaldo] = useState<number | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const fetchWallet = async () => {
      const billetera = await getWalletStatus(usuario);
      if (billetera) {
        setSaldo(billetera.saldo);
        if (billetera.saldo <= 0 || billetera.estado === "restringido") {
          setShowAlert(true);
        }
      }
    };
    fetchWallet();
  }, [usuario]);

  return { saldo, showAlert, setShowAlert };
};

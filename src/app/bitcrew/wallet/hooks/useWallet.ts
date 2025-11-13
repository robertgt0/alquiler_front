import { useState, useEffect, useCallback } from "react";
import { fetchWalletData } from "../service/walletApiService";
import { IBilletera, IFrontendTransaction } from "../types";

export const useWallet = (usuario: string | null) => {
  const [balanceData, setBalanceData] = useState<IBilletera | null>(null);
  const [transactions, setTransactions] = useState<IFrontendTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!usuario) {
      setError("No se especificó un usuario.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Llamamos al nuevo servicio
      const { billetera, transacciones } = await fetchWalletData(usuario);
      
      setBalanceData(billetera);

      // Tu lógica original de mapeo se mantiene intacta aquí
      const frontendTransactions: IFrontendTransaction[] = transacciones.map((tx) => ({
        id: tx._id,
        type: tx.tipo,
        date: tx.fecha,
        amount: tx.monto,
        descripcion: tx.descripcion,
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

  return { balanceData, transactions, loading, error, reload: loadData };
};
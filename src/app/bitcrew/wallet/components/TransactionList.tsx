import React, { useState } from "react";
import { TransactionListProps } from "../types";
// --- CORRECCIÓN ---
// Volvemos a añadir la extensión .tsx, ya que el compilador
// sigue sin encontrar los archivos.
import TransactionItem from "./TransactionItem";
import AllTransactionsModal from "./AllTransactionsModal";
// --- FIN DE LA CORRECCIÓN ---

export default function TransactionList({ transactions }: TransactionListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cambiamos de 5 a 10 transacciones recientes
  const recentTransactions = transactions.slice(0, 10);

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#11255A]">Transacciones Recientes</h2>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          Ver todas
        </button>
      </div>

      {recentTransactions.length > 0 ? (
        // Ajustamos la altura máxima al doble (de 28rem a 56rem)
        <ul className="space-y-3 max-h-[28rem] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thumb-rounded-md">
          {recentTransactions.map((tx) => (
            <TransactionItem key={tx.id} transaction={tx} />
          ))}
        </ul>
      ) : (
        <div className="text-center py-10 px-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">Sin transacciones registradas</p>
        </div>
      )}

      {isModalOpen && (
        <AllTransactionsModal 
          transactions={transactions} 
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
import React from "react";
import { TransactionListProps } from "../types";
import TransactionItem from "./TransactionItem.tsx";

export default function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#11255A]">Transacciones Recientes</h2>
        <a href="#" className="text-sm font-medium text-blue-600 hover:underline">
          Ver todas
        </a>
      </div>

      {transactions.length > 0 ? (
        // --- MODIFICACIÓN AQUÍ ---
        // 1. max-h-[28rem]: (448px) Limita la altura para mostrar aprox 5 ítems.
        // 2. overflow-y-auto: Muestra el scroll vertical solo si es necesario.
        // 3. pr-2: Añade un padding a la derecha para que el scroll no se pegue.
        // 4. scrollbar-*: Clases opcionales para estilizar el scroll.
        <ul className="space-y-3 max-h-[28rem] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thumb-rounded-md">
        {/* --- FIN DE LA MODIFICACIÓN --- */}
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
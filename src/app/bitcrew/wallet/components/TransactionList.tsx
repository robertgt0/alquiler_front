import React from "react";
import { TransactionListProps } from "../types";
import TransactionItem from "./TransactionItem";

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
        <ul className="space-y-3">
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
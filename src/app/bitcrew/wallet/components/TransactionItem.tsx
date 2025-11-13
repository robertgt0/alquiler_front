import React from "react";
import { IFrontendTransaction } from "../types";

interface TransactionItemProps {
  transaction: IFrontendTransaction;
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const isCredit = transaction.amount > 0;
  const amountColor = isCredit ? "text-green-600" : "text-gray-900"; // Cantidad verde para abonos, negro para comisiones
  const sign = isCredit ? "+" : ""; // Solo mostramos el + si es abono

  return (
    <li className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center space-x-3">
        {/* Icono de la transacción (puedes personalizarlo más adelante) */}
        <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9.75h19.5M2.25 12h19.5m-16.5 7.5h15c.621 0 1.125-.504 1.125-1.125V8.25c0-.621-.504-1.125-1.125-1.125H3.75c-.621 0-1.125.504-1.125 1.125v8.25c0 .621.504 1.125 1.125 1.125z" />
          </svg>
        </div>
        
        <div className="flex-1">
          {/* --- CAMBIO AQUÍ: color de texto y grosor --- */}
          {/* De 'text-blue-700 font-bold' a 'text-gray-800 font-normal' */}
          <p className="text-gray-800 font-normal text-sm">{transaction.descripcion}</p> 
          <p className="text-gray-500 text-xs">{new Date(transaction.date).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}</p>
        </div>
      </div>

      <div className="text-right">
        <p className={`text-sm font-semibold ${amountColor}`}>
          {sign} {transaction.currency} {Math.abs(transaction.amount).toFixed(2).replace(".", ",")}
        </p>
        {/* Puedes añadir un pequeño icono si es una comisión, etc. */}
      </div>
    </li>
  );
}
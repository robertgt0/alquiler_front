"use client";

import React, { useState } from "react";
import { TransactionItemProps } from "../types";

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const esCredito = transaction.type === "credito";
  const monto = transaction.amount;

  const colorMonto = esCredito ? "text-green-600" : "text-gray-900";
  const signo = esCredito ? "+" : ""; 

  return (

    <li 
      className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-200 ease-in-out cursor-pointer hover:bg-gray-50"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center justify-between">
        {/* --- LADO IZQUIERDO (Icono y Texto) --- */}
        <div className="flex items-center space-x-3 min-w-0"> {/* min-w-0 es clave para que truncate funcione */}
          {/* Icono de la transacción */}
          <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9.75h19.5M2.25 12h19.5m-16.5 7.5h15c.621 0 1.125-.504 1.125-1.125V8.25c0-.621-.504-1.125-1.125-1.125H3.75c-.621 0-1.125.504-1.125 1.125v8.25c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          </div>
          
          {/* Contenedor de Texto (Descripción y Fecha) */}
          <div className="flex-1 min-w-0"> 
            {/* --- 3. LÓGICA DE TEXTO CONDICIONAL --- */}
            {/* Si está cerrado usa 'truncate', si está abierto usa 'whitespace-normal' */}
            <p 
              className={`text-gray-800 font-semibold text-base ${!isOpen ? 'truncate' : 'whitespace-normal'}`}
              // Añadimos 'title' por si acaso, aunque ahora se puede expandir
              title={transaction.descripcion} 
            >
              {transaction.descripcion}
            </p> 
            
            {/* Fecha */}
            <p className="text-gray-500 text-xs">
              {new Date(transaction.date).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
            </p>
          </div>
        </div>

        {/* --- LADO DERECHO (Monto) --- */}
        <div className="text-right flex-shrink-0 pl-3">
          <p className={`text-base font-semibold ${colorMonto}`}>
            {signo} {transaction.currency} {Math.abs(monto).toFixed(2).replace(".", ",")}
          </p>
        </div>
      </div>
    </li>
  );
}
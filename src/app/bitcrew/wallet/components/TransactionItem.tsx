import React from "react";
import { TransactionItemProps } from "../types";
import { TransactionIcon } from "./WalletIcons";

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const { type, descripcion, date, amount } = transaction;
  const esCredito = type === "credito";

  const fechaFormateada = new Date(date).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });

  const montoFormateado = (amount || 0).toLocaleString("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <li className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-gray-100 rounded-full text-gray-500">
          <TransactionIcon className="w-6 h-6" />
        </div>
        <div>
          <p className="font-semibold text-[#11255A]">{descripcion || "Transferencia"}</p>
          <p className="text-sm text-gray-500">{fechaFormateada}</p>
        </div>
      </div>
      <div className={`font-semibold text-lg ${esCredito ? "text-green-600" : "text-gray-900"}`}>
        {esCredito ? "+" : ""} Bs. {montoFormateado}
      </div>
    </li>
  );
}
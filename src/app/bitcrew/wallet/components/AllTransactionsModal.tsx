"use client";

import React from "react";
import { IFrontendTransaction } from "../types";
import TransactionItem from "./TransactionItem";

interface ModalProps {
  transactions: IFrontendTransaction[];
  onClose: () => void;
}

const CloseIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

export default function AllTransactionsModal({ transactions, onClose }: ModalProps) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity"
      onClick={onClose} 
    >
      <div 
        className="relative bg-white w-full max-w-lg md:max-w-3xl mx-4 rounded-xl shadow-2xl flex flex-col" 
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-xl font-bold text-[#11255A]">Todas las Transacciones</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Cerrar"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="p-4 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {transactions.length > 0 ? (
            <ul className="space-y-3">
              {transactions.map((tx) => (
                <TransactionItem key={tx.id} transaction={tx} />
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-10">
              No hay transacciones para mostrar.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
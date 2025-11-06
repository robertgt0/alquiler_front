'use client';
import React from 'react';


export default function StatusPanel({
  ok,
  text,
  onClose,
}: {
  ok: boolean;
  text: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-[2px] flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl border border-gray-300 shadow-xl w-full max-w-md p-6 text-center">
        {/* icono */}
        <div className="flex justify-center mb-4">
          {ok ? (
            // ✔️
            <svg width="72" height="72" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#22C55E" />
              <path d="M8 12.5l3 3 5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            // ❌
            <svg width="72" height="72" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#EF4444" />
              <path d="M9 9l6 6M15 9l-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </div>

        <p className="text-gray-900 font-semibold mb-6">{text}</p>

        <button
          onClick={onClose}
          className="bg-blue-500 text-white py-2 px-6 rounded-2xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}


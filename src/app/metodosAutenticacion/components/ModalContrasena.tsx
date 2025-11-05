import React, { useState } from 'react';
import AuthButton from './AuthButton';

interface ModalContrasenaProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (contrasena: string) => void;
}

export default function ModalContrasena({ isOpen, onClose, onConfirm }: ModalContrasenaProps) {
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contrasena.trim()) {
      onConfirm(contrasena);
      setContrasena('');
      onClose();
    }
  };

  const handleClose = () => {
    setContrasena('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-blue-600 rounded-xl shadow-2xl max-w-md w-full p-6 border border-blue-400">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">
            Ingrese una contraseña
          </h2>
          <button
            onClick={handleClose}
            className="text-blue-200 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <input
                type={mostrarContrasena ? "text" : "password"}
                id="contrasena"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-800 "
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <AuthButton
              texto="Cancelar"
              tipo="secundario"
              onClick={handleClose}
              className="px-4 py-2 border border-white text-white hover:bg-blue-700"
            />
            <AuthButton
              texto="Confirmar"
              tipo="primario"
              onClick={() => handleSubmit}
              deshabilitado={!contrasena.trim() || contrasena.length < 6}
              className="px-4 py-2 border border-white text-white hover:bg-blue-700"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
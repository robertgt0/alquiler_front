import React, { useMemo, useState } from 'react';
import AuthButton from './AuthButton';

interface ModalContrasenaProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (contrasena: string) => void;
}

export default function ModalContrasena({
  isOpen,
  onClose,
  onConfirm,
}: ModalContrasenaProps) {
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  // flags de interacción
  const [touchedPass, setTouchedPass] = useState(false);
  const [touchedConfirm, setTouchedConfirm] = useState(false);
  const [submitTried, setSubmitTried] = useState(false);

  // === validación: devuelve SOLO el primer error en el orden indicado ===
  const primerErrorPass = useMemo(() => {
    const p = contrasena;

    if (/\s/.test(p)) {
      return 'No debe contener espacios';
    }
    if (p.length < 8 || p.length > 16) {
      return 'Debe tener entre 8 y 16 caracteres';
    }
    if (!/[A-Z]/.test(p)) {
      return 'Incluya al menos una mayúscula';
    }
    if (!/[a-z]/.test(p)) {
      return 'Incluya al menos una minúscula';
    }
    if (!/[0-9]/.test(p)) {
      return 'Incluya al menos un número';
    }
    if (!/[!@#$%^&*(),.?":{}|<>_\-+=~]/.test(p)) {
      return 'Incluya al menos un carácter especial';
    }
    return null;
  }, [contrasena]);

  const showPasswordError = (touchedPass || submitTried) && !!primerErrorPass;

  const passwordsDontMatch =
    confirmarContrasena.length > 0 && contrasena !== confirmarContrasena;
  const showConfirmError = (touchedConfirm || submitTried) && passwordsDontMatch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitTried(true);
    if (primerErrorPass) return;
    if (contrasena !== confirmarContrasena) return;

    onConfirm(contrasena);
    // limpiar estado
    setContrasena('');
    setConfirmarContrasena('');
    setTouchedPass(false);
    setTouchedConfirm(false);
    setSubmitTried(false);
    onClose();
  };

  const handleClose = () => {
    setContrasena('');
    setConfirmarContrasena('');
    setTouchedPass(false);
    setTouchedConfirm(false);
    setSubmitTried(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-blue-600 rounded-xl shadow-2xl max-w-md w-full p-6 border border-blue-400">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Configurar contraseña</h2>
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
          {/* Contraseña */}
          <div>
            <label htmlFor="contrasena" className="block text-sm font-medium text-white mb-1">
              Ingrese una contraseña
            </label>
            <div className="relative">
              <input
                type={mostrarContrasena ? 'text' : 'password'}
                id="contrasena"
                value={contrasena}
                onChange={(e) => {
                  // limpiar espacios en vivo
                  const v = e.target.value.replace(/\s/g, '');
                  setContrasena(v);
                }}
                onBlur={() => setTouchedPass(true)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 ${
                  showPasswordError ? 'border-red-500' : 'border-gray-300'
                }`}
                inputMode="text"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {mostrarContrasena ? '🙈' : '👁️'}
              </button>
            </div>
            {showPasswordError && (
              <p className="mt-2 text-red-200 text-sm">{primerErrorPass}</p>
            )}
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label htmlFor="confirmar" className="block text-sm font-medium text-white mb-1">
              Confirmar contraseña
            </label>
            <div className="relative">
              <input
                type={mostrarConfirmar ? 'text' : 'password'}
                id="confirmar"
                value={confirmarContrasena}
                onChange={(e) => {
                  const v = e.target.value.replace(/\s/g, '');
                  setConfirmarContrasena(v);
                }}
                onBlur={() => setTouchedConfirm(true)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 ${
                  showConfirmError ? 'border-red-500' : 'border-gray-300'
                }`}
                inputMode="text"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={mostrarConfirmar ? 'Ocultar confirmación' : 'Mostrar confirmación'}
              >
                {mostrarConfirmar ? '🙈' : '👁️'}
              </button>
            </div>
            {showConfirmError && (
              <p className="mt-2 text-red-200 text-sm">Las contraseñas no coinciden.</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <AuthButton
              texto="Cancelar"
              tipo="secundario"
              onClick={handleClose}
              className="px-4 py-2 border border-white text-white hover:bg-blue-700"
            />
            <button
              type="submit"
              disabled={
                !!primerErrorPass ||
                passwordsDontMatch ||
                contrasena === '' ||
                confirmarContrasena === ''
              }
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-white text-blue-700 hover:bg-blue-100 disabled:opacity-50"
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
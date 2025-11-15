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
  <div
    className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
    onClick={(e) => {
      // Cualquier click en el overlay NO sale hacia afuera
      e.stopPropagation();
    }}
  >
    <div
      className="bg-blue-600 rounded-xl shadow-2xl max-w-md w-full p-6 border border-blue-400"
      onClick={(e) => {
        // Y tampoco los clicks dentro de la tarjeta
        e.stopPropagation();
      }}
    >

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
  onMouseDown={(e) => {
    // Evita que el botón robe el foco o dispare otros handlers
    e.preventDefault();
    e.stopPropagation();
  }}
  onClick={(e) => {
    e.stopPropagation();
    setMostrarContrasena(!mostrarContrasena);
  }}
  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
  aria-label={mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {mostrarContrasena ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
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
  onMouseDown={(e) => {
    e.preventDefault();
    e.stopPropagation();
  }}
  onClick={(e) => {
    e.stopPropagation();
    setMostrarConfirmar(!mostrarConfirmar);
  }}
  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
  aria-label={mostrarConfirmar ? 'Ocultar contraseña' : 'Mostrar contraseña'}
    >
      {mostrarConfirmar ? (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
      ) : (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )}
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
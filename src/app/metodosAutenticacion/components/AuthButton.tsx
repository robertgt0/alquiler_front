import React from 'react';

interface AuthButtonProps {
  texto: string;
  tipo: 'primario' | 'secundario' | 'peligro';
  onClick: () => void;
  deshabilitado?: boolean;
  className?: string;
}

export function AuthButton({ 
  texto, 
  tipo, 
  onClick, 
  deshabilitado = false, 
  className = '' 
}: AuthButtonProps) {
  // Estilos base para todos los botones
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  // Estilos según el tipo
  const tipoStyles = {
    primario: "bg-blue-600 text-white hover:bg-blue-600 focus:ring-blue-600  ",
    secundario: "bg-blue-600 text-white hover:bg-blue-600 focus:ring-blue-600  ",
    peligro: "bg-blue-600 text-white hover:bg-blue-600 focus:ring-blue-600 "
  };

  const styles = `${baseStyles} ${tipoStyles[tipo]} ${className}`;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={deshabilitado}
      className={styles}
    >
      {texto}
    </button>
  );
}

export default AuthButton;
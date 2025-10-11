'use client';

import { useState } from 'react';
import { DatosFormulario , ErroresFormulario } from '../interfaces/types.js';


// Validador integrado
const validarCampo = (nombre: string, valor: string): string => {
  const camposRequeridos = ['nombre', 'apellido','telefono', 'email', 'contraseña'];
  
  if (camposRequeridos.includes(nombre) && !valor?.trim()) {
    return "Este campo es obligatorio";
  }
//condiciones de valores permitidos
  if (valor && valor.trim()) {
    switch (nombre) {
      case 'nombre':
      case 'apellido':
        const longitud = valor.length;
        if (longitud < 2 || longitud > 50) {
          return `${nombre === 'nombre' ? 'El nombre' : 'El apellido'} debe tener entre 2 y 50 caracteres`;
        }
        break;
    }
  }

  return '';
};

export const useRegistrationForm = () => {
  const [datosFormulario, setDatosFormulario] = useState<DatosFormulario>({
    nombre: '',
    apellido: '',
    email: '',
    contraseña: '',
    confirmarContraseña: '',
    telefono: '',
  });

  const [errores, setErrores] = useState<ErroresFormulario>({});
  const [tocados, setTocados] = useState<Record<string, boolean>>({});

  const manejarCambio = (nombre: keyof DatosFormulario, valor: any) => {
    setDatosFormulario(prev => ({ ...prev, [nombre]: valor }));
  };

  const manejarBlur = (nombre: keyof DatosFormulario) => {
    setTocados(prev => ({ ...prev, [nombre]: true }));
    

  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: ErroresFormulario = {};
    const nuevosTocados: Record<string, boolean> = {};

    // Campos requeridos
    const camposAValidar = ['nombre', 'apellido', 'email', 'contraseña', 'confirmarContraseña', 'telefono'] as const;
    
    camposAValidar.forEach(campo => {
      nuevosTocados[campo] = true;
    const error = validarCampo(campo, datosFormulario[campo]);
      if (error) nuevosErrores[campo] = error;
    });

    setTocados(nuevosTocados);
    setErrores(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  };

  return {
    datosFormulario: datosFormulario,
    errores: errores,
    tocados: tocados,
    manejarCambio: manejarCambio,
    manejarBlur: manejarBlur,
    validarFormulario: validarFormulario
  };
};
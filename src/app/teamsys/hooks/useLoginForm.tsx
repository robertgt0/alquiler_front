'use client';

import { useState } from 'react';
import { DatosLogin , ErroresLogin } from '../interfaces/typeslogin';
//import { validatePassword} from '../utils/validation';
//import { validateEmail } from '../utils/validation';
import { useRouter } from 'next/navigation';

const router = useRouter();
// Validador integrado para login
const validarCampo = (nombre: string, valor: string): string => {
  const valorLimpio = valor.trim();

  if (!valorLimpio) {
    return "Este campo es obligatorio";
  }

  switch (nombre) {
    case 'email': {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(valorLimpio)) {
        return "El formato del correo no es valido. Intenta nuevamente.";
      }
      break;
    };
    case 'contraseña': {
      if (valorLimpio.length < 6) {
        return "La contraseña debe tener al menos 6 caracteres";
      }
      break;
    }
  }
  return '';
}

export const useLoginForm = () => {
  const [datosFormulario, setDatosFormulario] = useState<DatosLogin>({
    email: '',
    contraseña: '',
  });

  const [errores, setErrores] = useState<ErroresLogin>({});
   const [tocados, setTocados] = useState<Record<string, boolean>>({
    email: false,
    contraseña: false,
    });


  const manejarCambio = (nombre: keyof DatosLogin, valor: string) => {
    setDatosFormulario(prev => ({ ...prev, [nombre]: valor }));

    if (tocados[nombre]) {
      const error = validarCampo(nombre, valor);
      if (error) {
        setErrores(prev => ({ ...prev, [nombre]: error }));
      } else {
        setErrores(prev => {
          const nuevosErrores = { ...prev };
          delete nuevosErrores[nombre];
          return nuevosErrores;
        });
      }
    }
  };

  const manejarBlur = (nombre: keyof DatosLogin) => {
    setTocados(prev => ({ ...prev, [nombre]: true }));

    const error = validarCampo(nombre, datosFormulario[nombre]);
    if (error) {
      setErrores(prev => ({ ...prev, [nombre]: error }));
    } else {
      setErrores(prev => {
        const nuevosErrores = { ...prev };
        delete nuevosErrores[nombre];
        return nuevosErrores;
      });
    }
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: ErroresLogin = {};
    const nuevosTocados: Record<string, boolean> = {};

    const camposAValidar = ['email', 'contraseña'] as const;

    camposAValidar.forEach(campo => {
      nuevosTocados[campo] = true;
      const error = validarCampo(campo, datosFormulario[campo]);
      if (error) nuevosErrores[campo] = error;
    });

    setTocados({email: true, contraseña: true,});
    setErrores(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  };

  return {
    datosFormulario,
    errores,
    tocados,
    manejarCambio,
    manejarBlur,
    validarFormulario,
  };
};
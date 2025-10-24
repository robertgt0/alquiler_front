'use client';

import { useState } from 'react';
import { DatosLogin, ErroresLogin } from '../interfaces/typeslogin';
//import { useRouter } from 'next/navigation';

// Validador integrado para login
const validarCampo = (nombre: string, valor: string): string => {
  const valorLimpio = valor.trim();

  if (!valorLimpio) {
    return "Este campo es obligatorio";
  }

  switch (nombre) {
    case 'email': {
      // Dividir el email en parte local y dominio
      const partes = valorLimpio.split('@');
      
      // Verificar que tenga el formato correcto y validar longitud de parte local
      if (partes.length !== 2) {
        return "correo electronico no valido";
      }
      const parteLocal = partes[0];
      if (!/^[a-zA-Z0-9._-]+$/.test(parteLocal)) {
        return "correo electronico no valido";
      }
      if (parteLocal.length > 30) {
        return "correo electronico no valido";
      }
      if (parteLocal.startsWith(".") || parteLocal.endsWith(".")) {
        return "correo electronico no valido";
      }
      if (parteLocal.includes("..")) {
        return "correo electronico no valido";
      }

      const allowedDomainsRegex = /@(gmail\.com|hotmail\.com|yahoo\.com|outlook\.com|umss\.edu\.bo|umss\.edu|est\.umss\.edu|ucb\.edu\.bo|univalle\.edu|harvard\.edu|mit\.edu|empresa\.com\.bo|miempresa\.net)$/i;  
      if (!allowedDomainsRegex.test(valorLimpio)) {
        return "correo electronico no valido";
      }

      break;
    };
    case 'contraseña': {
      if (valorLimpio.length < 6) {
        return "contraseña incorrecta";
      }
      if (valorLimpio.length > 25) {
        return "Error, maximo 25 caracteres";
      }
      break;
    }
  }
  return '';
};

export const useLoginForm = () => {
  //const router = useRouter();

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

    setTocados({ email: true, contraseña: true });
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
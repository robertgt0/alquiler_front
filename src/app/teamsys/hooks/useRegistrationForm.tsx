<<<<<<< HEAD
<<<<<<< HEAD
'use client';

import { useState } from 'react';
import { DatosFormulario , ErroresFormulario } from '../interfaces/types';
=======
'use client';

import { useState } from 'react';
import { DatosFormulario , ErroresFormulario } from '../interfaces/types.js';
>>>>>>> a63d1c6 (Validacion _Contraseña)


// Validador integrado
const validarCampo = (nombre: string, valor: string): string => {
  const camposRequeridos = ['nombre', 'apellido','telefono', 'email', 'contraseña'];
<<<<<<< HEAD
  
=======

>>>>>>> a63d1c6 (Validacion _Contraseña)
  if (camposRequeridos.includes(nombre) && !valor?.trim()) {
    return "Este campo es obligatorio";
  }
//condiciones de valores permitidos
  if (valor && valor.trim()) {
    switch (nombre) {
      case 'nombre':
      case 'apellido':
        const longitud = valor.length;
// Validar mínimo
        if (longitud > 0 && longitud < 2) {
          return `${nombre === 'nombre' ? 'El nombre' : 'El apellido'} debe tener al menos 2 caracteres`;
        }
        
        // Validar máximo
        if (longitud > 50) {
          return `${nombre === 'nombre' ? 'El nombre' : 'El apellido'} debe tener máximo 50 caracteres`;
        }
// Validar que solo contenga letras y espacios
        const soloLetrasRegex = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/;
        if (!soloLetrasRegex.test(valor)) {
          return `${nombre === 'nombre' ? 'El nombre' : 'El apellido'} solo puede contener letras y espacios`;
        }

        break;
    }
<<<<<<< HEAD
=======
    
>>>>>>> a63d1c6 (Validacion _Contraseña)
  }

  return '';
};
<<<<<<< HEAD
=======
//Validacion de contraseña
export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("La contraseña debe tener al menos 8 caracteres.");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Debe contener al menos una letra mayúscula.");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Debe contener al menos una letra minúscula.");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Debe contener al menos un número.");
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push("Debe incluir al menos un carácter especial.");
  }

  return errors;
};
>>>>>>> a63d1c6 (Validacion _Contraseña)

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
    
    // Validación EN TIEMPO REAL para nombre y apellido (siempre)
    if (nombre === 'nombre' || nombre === 'apellido') {
      let error = '';
      
      // Validar máximo de caracteres inmediatamente
      if (valor.length > 50) {
        error = `${nombre === 'nombre' ? 'El nombre' : 'El apellido'} debe tener máximo 50 caracteres`;
      } 
      // Si el campo ya fue tocado, validar todo
      else if (tocados[nombre]) {
        error = validarCampo(nombre, valor);
      }
      
      if (error) {
        setErrores(prev => ({ ...prev, [nombre]: error }));
      } else {
        // Limpiar error si ya no existe
        setErrores(prev => {
          const nuevosErrores = { ...prev };
          delete nuevosErrores[nombre];
          return nuevosErrores;
        });
      }
    }
  };

  const manejarBlur = (nombre: keyof DatosFormulario) => {
    setTocados(prev => ({ ...prev, [nombre]: true }));
    
    // Validar el campo cuando pierde el foco
    const error = validarCampo(nombre, datosFormulario[nombre]);
    if (error) {
      setErrores(prev => ({ ...prev, [nombre]: error }));
    } else {
      // Limpiar error si es válido
      setErrores(prev => {
        const nuevosErrores = { ...prev };
        delete nuevosErrores[nombre];
        return nuevosErrores;
      });
    }
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

<<<<<<< HEAD
=======
    //Validar onfirmacion de contraseña
    if (datosFormulario.contraseña !== datosFormulario.confirmarContraseña) {
      nuevosErrores.confirmarContraseña = "Las contraseñas no coinciden.";
    }

>>>>>>> a63d1c6 (Validacion _Contraseña)
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
<<<<<<< HEAD
=======
>>>>>>> 7a568dc (contraseña)
=======
>>>>>>> a63d1c6 (Validacion _Contraseña)

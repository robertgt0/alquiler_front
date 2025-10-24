'use client';
import { useState, useCallback } from 'react';
import { DatosFormulario, ErroresFormulario } from '../interfaces/types';
import { validateEmail, validacionTelf } from '../utils/validationEmailTelefono';
import { validatePassword, validatePasswordConfirmation } from '../utils/validationPassword';
import { validarNombre, validarApellido } from '../utils/validationNombreApellido';

type CampoRequerido = 'nombre' | 'apellido' | 'telefono' | 'email' | 'contraseña';

// Constantes
const CAMPOS_REQUERIDOS = ['nombre', 'apellido', 'telefono', 'email', 'contraseña'] as const;
const REQUERIDOS: ReadonlySet<CampoValido> = new Set(CAMPOS_REQUERIDOS as readonly CampoValido[]);
//const LONGITUD_MAXIMA = 50;
//const LONGITUD_MINIMA = 2;
const SOLO_LETRAS_REGEX = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/;

// Tipo para las claves válidas
type CampoValido = keyof DatosFormulario;



// Hook principal
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
  const [tocados, setTocados] = useState<Record<CampoValido, boolean>>({} as Record<CampoValido, boolean>);

  // Validadores específicos por campo - DENTRO del hook para acceder a datosFormulario
  const validadores = useCallback((): Record<CampoValido, (valor: string) => string> => ({
    nombre: (valor: string) => {
      const resultado =validarNombre( valor);
      return resultado || '';
    },
    apellido: (valor: string) =>{
    const resultado =  validarApellido(valor);
    return resultado || '';
    },
    telefono: (valor: string) => {
      const resultado = validacionTelf(valor);
      return resultado || '';
    },
    email: (valor: string) => {
      const resultado = validateEmail(valor);
      return resultado || '';
    },
    contraseña: (valor: string) => {
      const resultado = validatePassword(valor);
      return resultado || '';
    },
    confirmarContraseña: (valor: string) => {
      // Ahora sí puede acceder a datosFormulario
      const resultado = validatePasswordConfirmation(datosFormulario.contraseña, valor);
      return resultado || '';
    },
  }), [datosFormulario.contraseña]); // Solo depende de la contraseña

  // Validador principal
  const validarCampo = useCallback((nombre: CampoValido, valor: string): string => {
  const v = valor?.trim() ?? '';

  // Requeridos
  if (REQUERIDOS.has(nombre) && v.length === 0) {
    return 'Este campo es obligatorio';
  }

  // Validaciones específicas
  if (v.length > 0) {
    return validadores()[nombre](v);
  }

  return '';
}, [validadores]);


  const actualizarError = useCallback((nombre: CampoValido, error: string) => {
    setErrores(prev => {
      if (error) {
        return { ...prev, [nombre]: error };
      } else {
        const nuevosErrores = { ...prev };
        delete nuevosErrores[nombre];
        return nuevosErrores;
      }
    });
  }, []);

  const manejarCambio = useCallback((nombre: CampoValido, valor: string) => {
    setDatosFormulario(prev => ({ ...prev, [nombre]: valor }));
    
    // Validación en tiempo real para campos específicos
    if (['nombre', 'apellido', 'telefono', 'email', 'contraseña', 'confirmarContraseña'].includes(nombre)) {
      let error = '';
      if (tocados[nombre]) {
        error = validarCampo(nombre, valor);
      }
      
      actualizarError(nombre, error);
    }
  }, [tocados, validarCampo, actualizarError]);

  const manejarBlur = useCallback((nombre: CampoValido) => {
    setTocados(prev => ({ ...prev, [nombre]: true }));
    
    const error = validarCampo(nombre, datosFormulario[nombre]);
    actualizarError(nombre, error);
  }, [datosFormulario, validarCampo, actualizarError]);

  const validarFormulario = useCallback((): boolean => {
    const nuevosErrores: ErroresFormulario = {};
    const nuevosTocados: Record<CampoValido, boolean> = {} as Record<CampoValido, boolean>;

    // Validar todos los campos usando las funciones
    const camposAValidar: CampoValido[] = ['nombre', 'apellido', 'email', 'contraseña', 'confirmarContraseña', 'telefono'];
    
    camposAValidar.forEach(campo => {
      nuevosTocados[campo] = true;
      const error = validarCampo(campo, datosFormulario[campo]);
      if (error) nuevosErrores[campo] = error;
    });

    setTocados(nuevosTocados);
    setErrores(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  }, [datosFormulario, validarCampo]);

  return {
    datosFormulario,
    errores,
    tocados,
    manejarCambio,
    manejarBlur,
    validarFormulario
  };
};
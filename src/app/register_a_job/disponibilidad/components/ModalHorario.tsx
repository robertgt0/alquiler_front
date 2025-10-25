// src/app/register_a_job/disponibilidad/components/ModalHorario.tsx
"use client";
import React, { useState, useEffect } from "react";
import type { Horario } from "../../Constantes";
import TimePicker from "./TimePicker";

// --- Props del Componente ---
interface ModalHorarioProps {
  onClose: () => void;
  onSave: (horario: Horario) => void;
  horarioInicial: Horario | null; // null para nuevo, o un objeto Horario para editar
}

// --- Componente ---
const ModalHorario: React.FC<ModalHorarioProps> = ({ onClose, onSave, horarioInicial }) => {
  // Estado para manejar los datos del formulario
  const [horaInicio, setHoraInicio] = useState("00:00");
  const [horaFin, setHoraFin] = useState("00:00");
  const [costo, setCosto] = useState("");

  // useEffect se ejecuta cuando el componente se monta o cuando `horarioInicial` cambia.
  // Sirve para llenar el formulario con los datos del horario que se quiere editar.
  useEffect(() => {
    if (horarioInicial) {
      setHoraInicio(horarioInicial.horaInicio);
      setHoraFin(horarioInicial.horaFin);
      setCosto(String(horarioInicial.costo));
    }
  }, [horarioInicial]);
  
  const handleCostoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    // Usamos una expresión regular para permitir solo números (enteros).
    // Si necesitas decimales, usa /[^0-9.]/g y lógica adicional.
    const soloNumeros = valor.replace(/[^0-9]/g, '');
    setCosto(soloNumeros);
  };
  
  const handleGuardar = () => {
    // Validamos que el costo no esté vacío
    if (!costo || parseFloat(costo) <= 0) {
        alert("Por favor, ingresa un costo válido.");
        return;
    }
    
    // Creamos el objeto horario para enviarlo al componente padre
    const horarioAGuardar: Horario = {
        id: horarioInicial ? horarioInicial.id : "", // 0 si es nuevo, para que el padre le asigne ID
        horaInicio,
        horaFin,
        costo: parseFloat(costo),
        moneda: "Bs/Hr.",
    };
    onSave(horarioAGuardar);
  };

  return (
    // Fondo oscuro semi-transparente
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {/* Contenedor del Modal */}
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {horarioInicial ? "Editar Horario" : "Crear Nuevo Horario"}
        </h2>
        
        {/* Formulario */}
        <div className="space-y-6">
          <div className="flex gap-4">
            <TimePicker label="Hora Inicio" value={horaInicio} onChange={setHoraInicio} />
            <TimePicker label="Hora Fin" value={horaFin} onChange={setHoraFin} />
          </div>
          <div>
            <label htmlFor="costo" className="block text-sm font-medium text-gray-700 mb-1">
              Costo por Hora (Bs)
            </label>
            <input
              id="costo"
              type="text"
              value={costo}
              onChange={handleCostoChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder=""
            />
          </div>
        </div>
        
        {/* Botones de Acción */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalHorario;
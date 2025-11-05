// src/app/register_a_job/disponibilidad/components/TimePicker.tsx
"use client";
import React from 'react';

// --- Props del Componente ---
interface TimePickerProps {
    label: string;
    value: string; // Formato "HH:mm"
    onChange: (newValue: string) => void;
}

// --- Componente ---
const TimePicker: React.FC<TimePickerProps> = ({ label, value, onChange }) => {
    // Genera opciones para horas (00-23) y minutos (00-59)
    const horas = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
    const minutos = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

    // Separa el valor actual en hora y minuto
    const [currentHora, currentMinuto] = value.split(':');

    // Manejador para cuando cambia la hora
    const handleHoraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(`${e.target.value}:${currentMinuto}`);
    };

    // Manejador para cuando cambia el minuto
    const handleMinutoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(`${currentHora}:${e.target.value}`);
    };

    return (
        <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="flex items-center gap-2">
                <select 
                    value={currentHora} 
                    onChange={handleHoraChange}
                    className="w-full p-3 border border-gray-300 bg-white rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
                >
                    {horas.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
                <span className="font-bold text-lg">:</span>
                <select 
                    value={currentMinuto} 
                    onChange={handleMinutoChange}
                    className="w-full p-3 border border-gray-300 bg-white rounded-lg text-lg text-gray-800 focus:ring-2 focus:ring-blue-500"
                >
                    {minutos.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
            </div>
        </div>
    );
};

export default TimePicker;
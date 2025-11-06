'use client'; // <-- SOLUCIÓN 1: Marca esto como un Client Component

import React, { useState, useCallback } from 'react';
import {
  ScheduleConfig,
  TimeRange,
  DayName,
  DAYS_OF_WEEK,
  ScheduleErrors,
  WeeklyUniformSchedule, 
  DaySchedule
} from '../types'; 
const PROVEEDOR_ID = "690c29d00c736bec44e473e4";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// --- Lógica de Utilidad ---
const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

const validateTimeRange = (start: string, end: string): boolean => {
    return timeToMinutes(end) > timeToMinutes(start);
};

const validateNoOverlap = (ranges: TimeRange[]): boolean => {
    if (ranges.length <= 1) return true;

    const minuteRanges = ranges
        .map(r => ({ start: timeToMinutes(r.start), end: timeToMinutes(r.end) }))
        .sort((a, b) => a.start - b.start);

    for (let i = 0; i < minuteRanges.length - 1; i++) {
        if (minuteRanges[i].end > minuteRanges[i + 1].start) {
            return false;
        }
    }
    return true;
};

// --- Definición del Estado Inicial ---
const initialDayConfig: DaySchedule = { enabled: false, ranges: [{ start: '09:00', end: '18:00' }] };
const initialSchedule: ScheduleConfig = DAYS_OF_WEEK.reduce((acc, day) => {
  acc[day] = initialDayConfig;
  return acc;
}, {} as Record<DayName, DaySchedule>) as ScheduleConfig;

const initialWeeklySchedule: WeeklyUniformSchedule = {
    selectedDays: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'],
    range: { start: '09:00', end: '18:00' },
};

// --- Componente Principal ---

export default function ScheduleConfigurator() {
    const [schedule, setSchedule] = useState<ScheduleConfig>(initialSchedule);
    const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');
    const [errors, setErrors] = useState<ScheduleErrors>({});
    const [hasChanges, setHasChanges] = useState<boolean>(false);
    const [isSuccessVisible, setIsSuccessVisible] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [weeklySchedule, setWeeklySchedule] = useState<WeeklyUniformSchedule>(initialWeeklySchedule);

    // --- Funciones de Manejo de la Configuración Semanal (Sin cambios) ---
    const toggleWeeklyDay = (day: DayName) => {
        setWeeklySchedule(prev => {
            const isSelected = prev.selectedDays.includes(day);
            return {
                ...prev,
                selectedDays: isSelected 
                    ? prev.selectedDays.filter(d => d !== day) 
                    : [...prev.selectedDays, day].sort((a, b) => DAYS_OF_WEEK.indexOf(a as DayName) - DAYS_OF_WEEK.indexOf(b as DayName)),
            };
        });
        setHasChanges(true);
    };

    const handleWeeklyTimeChange = (field: keyof TimeRange, value: string) => {
        setWeeklySchedule(prev => ({
            ...prev,
            range: { ...prev.range, [field]: value },
        }));
        setHasChanges(true);
    };

    // --- Funciones de Manejo de la Configuración Diaria (Sin cambios) ---
    const toggleDay = (day: DayName) => {
        setSchedule(prevSchedule => ({
            ...prevSchedule,
            [day]: {
                ...prevSchedule[day],
                enabled: !prevSchedule[day].enabled,
            },
        }));
        setHasChanges(true);
    };

    const addRange = (day: DayName) => {
        setSchedule(prevSchedule => ({
            ...prevSchedule,
            [day]: {
                ...prevSchedule[day],
                ranges: [...prevSchedule[day].ranges, { start: '09:00', end: '18:00' }],
            },
        }));
        setHasChanges(true);
    };

    const removeRange = (day: DayName, index: number) => {
        setSchedule(prevSchedule => ({
            ...prevSchedule,
            [day]: {
                ...prevSchedule[day],
                ranges: prevSchedule[day].ranges.filter((_, i) => i !== index),
            },
        }));
        setHasChanges(true);
    };

    const handleTimeChange = (
        day: DayName,
        index: number,
        field: keyof TimeRange,
        value: string
    ) => {
        setSchedule(prevSchedule => {
            const newRanges = [...prevSchedule[day].ranges];
            newRanges[index][field] = value;
            return {
                ...prevSchedule,
                [day]: {
                    ...prevSchedule[day],
                    ranges: newRanges,
                },
            };
        });
        setHasChanges(true);
    };

    // --- Validación y Envío (Sin cambios) ---
    const validateAndSetErrors = useCallback((): boolean => {
        // ... (Tu lógica de validación previa) ...
        let isValid = true;
        const newErrors: ScheduleErrors = {};

        if (activeTab === 'daily') {
            DAYS_OF_WEEK.forEach(day => {
                if (schedule[day].enabled) {
                    const ranges = schedule[day].ranges;
                    if (!validateNoOverlap(ranges)) {
                        isValid = false;
                        newErrors[day] = "Error: Rangos de horario se superponen.";
                    }
                    ranges.forEach((range, index) => {
                        if (!validateTimeRange(range.start, range.end)) {
                            isValid = false;
                            newErrors[`${day}-${index}`] = "La hora de fin debe ser posterior a la de inicio.";
                        }
                    });
                }
            });
            
        } else if (activeTab === 'weekly') {
            const { range, selectedDays } = weeklySchedule;

            if (selectedDays.length === 0) {
                isValid = false;
                newErrors['weekly-days'] = "Debes seleccionar al menos un día para aplicar el horario.";
            }

            if (!validateTimeRange(range.start, range.end)) {
                isValid = false;
                newErrors['weekly-range'] = "La hora de fin debe ser posterior a la de inicio.";
            }
        }

        setErrors(newErrors);
        return isValid;
    }, [schedule, weeklySchedule, activeTab]);

    const diasMap: Record<string, number> = {
      Lunes: 1,
      Martes: 2,
      Miercoles: 3,
      Jueves: 4,
      Viernes: 5,
      Sabado: 6,
      Domingo: 7,
    };

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAndSetErrors()) {
      console.error("No se puede guardar: Hay errores de validación.");
      return;
    }

    // Elegir datos según la pestaña activa
    const dataToSave = activeTab === "daily" ? schedule : weeklySchedule;

    // Transformar al formato que espera el backend
    const diasMap: Record<string, number> = {
      Lunes: 1,
      Martes: 2,
      Miercoles: 3,
      Jueves: 4,
      Viernes: 5,
      Sabado: 6,
      Domingo: 7,
    };

    const payload = {
      modo: "semanal",
      dias: Object.entries(dataToSave)
        .filter(([_, data]) => data.enabled && data.ranges.length > 0) // solo días activos con rangos
        .map(([nombreDia, data]) => ({
          dia: diasMap[nombreDia],
          activo: data.enabled,
          rangos: data.ranges.map(r => ({
            inicio: r.start,
            fin: r.end,
          })),
        })),
    };

    console.log("Payload a enviar:", payload);

    const endpoint = `${API_URL}/api/devcode/proveedores/${PROVEEDOR_ID}/horarioLaboral`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // timeout 10s

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status} - ${text || res.statusText}`);
      }

      // Éxito
      setIsSuccessVisible(true);
      setHasChanges(false);
      setTimeout(() => setIsSuccessVisible(false), 3000);
    } catch (error: any) {
      console.error("Error al guardar horarios:", error.message);
      alert(`Error al guardar: ${error.message}`);
    } finally {
      clearTimeout(timeout);
    }
  };

    // postSimple.ts
  

    // SOLUCIÓN 2: Definición de la función handleCancel (Faltaba en el código anterior)
    const handleCancel = () => {
        if (hasChanges) {
            setIsModalOpen(true);
        } else {
            // Acción por defecto si no hay cambios (ej: redirigir o no hacer nada)
            console.log("No hay cambios para cancelar. Proceso terminado.");
        }
    };


    // --- Componente: Sección de Configuración Semanal (Sin cambios) ---
    const WeeklyConfigSection = () => {
        const { range, selectedDays } = weeklySchedule;
        const isDayError = !!errors['weekly-days'];
        const isRangeError = !!errors['weekly-range'];

        return (
            <section className="space-y-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">Horario Uniforme</h2>
                
                {/* Selector de Días */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Selecciona los días para aplicar este horario
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {DAYS_OF_WEEK.map(day => {
                            const isSelected = selectedDays.includes(day);
                            return (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => toggleWeeklyDay(day)}
                                    className={`py-2 px-4 text-sm font-medium rounded-full transition-colors duration-150 ${
                                        isSelected 
                                        ? 'bg-blue-900 text-white shadow-md' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                    {isDayError && <p className="mt-2 text-sm text-red-600 font-medium">{errors['weekly-days']}</p>}
                </div>

                <hr className="my-4" />

                {/* Rango de Horario */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rango de Horario (Se aplica a todos los días seleccionados)
                    </label>
                    <div className="flex items-center space-x-3">
                        <input
                            type="time"
                            value={range.start}
                            onChange={(e) => handleWeeklyTimeChange('start', e.target.value)}
                            className={`form-input w-32 text-center rounded-md border-gray-300 shadow-sm ${isRangeError ? 'border-red-500 bg-red-50' : ''}`}
                        />
                        <span className="text-gray-500 text-lg font-bold">-</span>
                        <input
                            type="time"
                            value={range.end}
                            onChange={(e) => handleWeeklyTimeChange('end', e.target.value)}
                            className={`form-input w-32 text-center rounded-md border-gray-300 shadow-sm ${isRangeError ? 'border-red-500 bg-red-50' : ''}`}
                        />
                        {isRangeError && <p className="text-sm text-red-600 ml-4 font-medium">{errors['weekly-range']}</p>}
                    </div>
                </div>

                {/* Resumen del Horario */}
                <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-900 text-blue-800 rounded">
                    <p className="font-semibold">Horario Aplicado:</p>
                    <p>{selectedDays.length > 0 ? selectedDays.join(', ') : 'Ningún día seleccionado'}</p>
                    <p className="text-lg font-bold">{range.start} - {range.end}</p>
                </div>

            </section>
        );
    };

    // --- JSX Principal (Sin cambios) ---
    return (
        <main className="min-h-full p-6 bg-white font-sans">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-blue-900">Configuración de Horarios Laborales</h1>
                </header>
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        className={`py-2 px-4 text-sm font-medium transition-colors duration-200 ${
                            activeTab === 'daily' 
                            ? 'border-b-2 border-indigo-600 text-indigo-600' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('daily')}
                    >
                        Configuración Diaria (Híbrida)
                    </button>
                    <button
                        className={`py-2 px-4 text-sm font-medium transition-colors duration-200 ${
                            activeTab === 'weekly' 
                            ? 'border-b-2 border-indigo-600 text-indigo-600' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('weekly')}
                    >
                        Configuración Semanal (Uniforme)
                    </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    {activeTab === 'daily' && (
                        <section className="space-y-6">
                            {DAYS_OF_WEEK.map(day => {
                                const daySchedule = schedule[day];
                                const isEnabled = daySchedule.enabled;
                                const isDayError = errors[day];

                                return (
                                    <div key={day} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                            <div className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    id={`${day}-enabled`}
                                                    checked={isEnabled}
                                                    onChange={() => toggleDay(day)}
                                                    className="h-4 w-4 text-blue-900 border-gray-300 rounded focus:ring-blue-900"
                                                />
                                                <label htmlFor={`${day}-enabled`} className="text-lg font-semibold text-gray-700">
                                                    {day}
                                                </label>
                                            </div>
                                        </div>

                                        {isEnabled && (
                                            <div className="pt-4">
                                                {daySchedule.ranges.map((range, index) => {
                                                    const errorKey = `${day}-${index}`;
                                                    const isRangeError = !!errors[errorKey];

                                                    return (
                                                        <div key={index} className={`flex items-center space-x-3 mb-3 ${isDayError || isRangeError ? 'p-2 rounded bg-red-50' : ''}`}>
                                                            <input
                                                                type="time"
                                                                value={range.start}
                                                                onChange={(e) => handleTimeChange(day, index, 'start', e.target.value)}
                                                                className={`form-input w-28 text-center rounded-md border-gray-300 shadow-sm ${isDayError || isRangeError ? 'border-red-500' : ''}`}
                                                            />
                                                            <span className="text-gray-500">-</span>
                                                            <input
                                                                type="time"
                                                                value={range.end}
                                                                onChange={(e) => handleTimeChange(day, index, 'end', e.target.value)}
                                                                className={`form-input w-28 text-center rounded-md border-gray-300 shadow-sm ${isDayError || isRangeError ? 'border-red-500' : ''}`}
                                                            />
                                                            
                                                            {daySchedule.ranges.length > 1 && (
                                                                <button 
                                                                    type="button" 
                                                                    onClick={() => removeRange(day, index)}
                                                                    className="text-red-500 hover:text-red-700 transition duration-150"
                                                                >
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m-5 0h14"></path></svg>
                                                                </button>
                                                            )}

                                                            {isRangeError && (
                                                                <p className="text-sm text-red-600 ml-4">{errors[errorKey]}</p>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                                
                                                {isDayError && <p className="text-sm text-red-600 mb-2 font-medium">{errors[day]}</p>}

                                                <button 
                                                    type="button" 
                                                    onClick={() => addRange(day)}
                                                    className="text-sm text-blue-700 hover:text-blue-900 mt-2 flex items-center transition duration-150"
                                                >
                                                    + Añadir Rango
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </section>
                    )}

                    {activeTab === 'weekly' && <WeeklyConfigSection />}
                    
                    <hr className="my-8" />
                    
                    <div className="flex justify-end space-x-4">
                        <button 
                            type="button" 
                            onClick={handleCancel}
                            className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-150"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit"
                            disabled={!hasChanges}
                            className={`px-6 py-3 text-sm font-semibold text-white rounded-md transition duration-150 
                                ${hasChanges ? 'bg-blue-900 hover:bg-blue-800' : 'bg-gray-400 cursor-not-allowed'}`
                            }
                        >
                            Guardar Horarios
                        </button>
                    </div>
                </form>
                
                {isSuccessVisible && (
                    <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-xl transition-opacity duration-300 z-50">
                        Configuración guardada exitosamente.
                    </div>
                )}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-2xl w-96">
                            <h3 className="text-lg font-bold mb-4">Confirmar Cancelación</h3>
                            <p className="text-gray-700 mb-6">Tienes cambios sin guardar. ¿Estás seguro de que quieres cancelar y descartar los cambios?</p>
                            <div className="flex justify-end space-x-3">
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                                >
                                    No, Seguir Editando
                                </button>
                                <button 
                                    onClick={() => {
                                        setSchedule(initialSchedule); 
                                        setWeeklySchedule(initialWeeklySchedule); 
                                        setErrors({});
                                        setHasChanges(false);
                                        setIsModalOpen(false);
                                    }}
                                    className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
                                >
                                    Sí, Descartar Cambios
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
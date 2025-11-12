'use client';

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

// --- Tipos para el Modal de Resumen ---
interface SummaryData {
    title: string;
    lines: string[];
}
// -------------------------------------

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
    ranges: [{ start: '09:00', end: '18:00' }],
};

export default function ScheduleConfigurator() {
    const [schedule, setSchedule] = useState<ScheduleConfig>(initialSchedule);
    const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');
    const [errors, setErrors] = useState<ScheduleErrors>({});
    const [hasChanges, setHasChanges] = useState<boolean>(false);
    
    // ESTADOS ACTUALIZADOS PARA EL MODAL DE RESUMEN
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState<boolean>(false);
    const [savedScheduleSummary, setSavedScheduleSummary] = useState<SummaryData | null>(null);
    
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [weeklySchedule, setWeeklySchedule] = useState<WeeklyUniformSchedule>(initialWeeklySchedule);

    // --- Funciones de Manejo de Estado ---
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

    const handleWeeklyTimeChange = (
        index: number,
        field: keyof TimeRange,
        value: string
    ) => {
        setWeeklySchedule(prev => {
            const newRanges = [...prev.ranges];
            newRanges[index][field] = value;
            return {
                ...prev,
                ranges: newRanges,
            };
        });
        setHasChanges(true);
    };
    
    const addRangeWeekly = () => {
        setWeeklySchedule(prev => ({
            ...prev,
            ranges: [...prev.ranges, { start: '09:00', end: '18:00' }],
        }));
        setHasChanges(true);
    };

    const removeRangeWeekly = (index: number) => {
        setWeeklySchedule(prev => ({
            ...prev,
            ranges: prev.ranges.filter((_, i) => i !== index),
        }));
        setHasChanges(true);
    };

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
    
    const handleCancel = () => {
        if (hasChanges) {
            setIsModalOpen(true);
        } else {
            console.log("No hay cambios para cancelar. Proceso terminado.");
        }
    };
    
    // --- Lógica de Validación ---
    const validateAndSetErrors = useCallback((): boolean => {
        let isValid = true;
        const newErrors: ScheduleErrors = {};

        if (activeTab === 'daily') {
            const enabledDays = DAYS_OF_WEEK.filter(day => schedule[day].enabled);

            if (enabledDays.length === 0) {
                isValid = false;
                newErrors['daily-general'] = "Debes habilitar al menos un día para guardar el horario."; 
            } else {
                enabledDays.forEach(day => {
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
                });
            }
            
        } else if (activeTab === 'weekly') {
            const { ranges, selectedDays } = weeklySchedule;

            if (selectedDays.length === 0) {
                isValid = false;
                newErrors['weekly-days'] = "Debes seleccionar al menos un día para aplicar el horario.";
            }

            if (!validateNoOverlap(ranges)) {
                isValid = false;
                newErrors['weekly-general-range'] = "Error: Los rangos de horario se superponen o no están ordenados correctamente.";
            }

            ranges.forEach((range, index) => {
                if (!validateTimeRange(range.start, range.end)) {
                    isValid = false;
                    newErrors[`weekly-${index}`] = "La hora de fin debe ser posterior a la de inicio.";
                }
            });
        }

        setErrors(newErrors);
        return isValid;
    }, [schedule, weeklySchedule, activeTab]);

    // --- Lógica de Generación de Resumen ---
    const generateSummary = (data: ScheduleConfig | WeeklyUniformSchedule, type: 'daily' | 'weekly'): SummaryData => {
        if (type === 'daily') {
            const dailyData = data as ScheduleConfig;
            const enabledDays = DAYS_OF_WEEK.filter(day => dailyData[day].enabled);
            const lines: string[] = [];

            if (enabledDays.length === 0) {
                lines.push("No se ha habilitado ningún día, horario laboral es nulo.");
            } else {
                enabledDays.forEach(day => {
                    const ranges = dailyData[day].ranges.map((r: TimeRange) => `${r.start} - ${r.end}`).join(' / ');
                    lines.push(`${day}: ${ranges}`);
                });
            }

            return {
                title: "Configuración Diaria Guardada (Híbrida)",
                lines: lines
            };
        } else { // weekly
            if ('selectedDays' in data && 'ranges' in data) {
                const weeklyData = data as WeeklyUniformSchedule;
                const rangesText = weeklyData.ranges.map((r: TimeRange) => `${r.start} - ${r.end}`).join(' / ');
                
                return {
                    title: "Configuración Semanal Guardada (Uniforme)",
                    lines: [
                        `Días Aplicados: ${weeklyData.selectedDays.length > 0 ? weeklyData.selectedDays.join(', ') : 'Ninguno'}`,
                        `Horario Uniforme: ${rangesText}`
                    ]
                };
            }
            return { title: "Datos Semanales Inválidos", lines: [] };
        }
    };

    // --- FUNCIÓN DE GUARDADO ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!validateAndSetErrors()) {
          console.error("No se puede guardar: Hay errores de validación.");
          return;
        }
    
        const dataToSave = activeTab === "daily" ? schedule : weeklySchedule;
        console.log(`Datos a guardar para la pestaña ${activeTab}:`, dataToSave);

        const diasMap: Record<string, number> = {
          Lunes: 1, Martes: 2, Miercoles: 3, Jueves: 4, Viernes: 5, Sabado: 6, Domingo: 7,
        };

        let payload = {};

        if (activeTab === "weekly" && 'selectedDays' in dataToSave && 'ranges' in dataToSave) {
           payload = {
              modo: "semanal",
              dias: dataToSave.selectedDays.map(nombreDia => ({
                dia: diasMap[nombreDia],
                activo: true,
                rangos: dataToSave.ranges.map((r: TimeRange) => ({
                  inicio: r.start,
                  fin: r.end,
                })),
              })),
            };
        } else { // daily
          payload = {
            modo: "diaria",
            dias: Object.entries(dataToSave)
              .filter(([_, data]) => data.enabled && data.ranges.length > 0)
              .map(([nombreDia, data]) => ({
                dia: diasMap[nombreDia],
                activo: data.enabled,
                rangos: data.ranges.map((r: TimeRange) => ({
                  inicio: r.start,
                  fin: r.end,
                })),
              })),
          };
        }
    
        console.log("Payload a enviar:", payload);
    
        const endpoint = `${API_URL}/api/devcode/proveedores/${PROVEEDOR_ID}/horarioLaboral`;
    
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000); // timeout 10s
    
        try {
            const res = await fetch(endpoint, {
            method: "PUT",
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
          console.log("Respuesta del servidor recibida.");
    
          const result = await res.json();  
          console.log("Respuesta JSON del servidor:", result);

          // Éxito: generar y abrir modal resumen
          const summary = generateSummary(dataToSave, activeTab);
          setSavedScheduleSummary(summary);
          setIsSummaryModalOpen(true);
          setHasChanges(false);
        } catch (error: any) {
          console.error("Error al guardar horarios:", error.message);
          alert(`Error al guardar: ${error.message}`);
        } finally {
          clearTimeout(timeout);
        }
    };

    // --- Resto de componentes (SummaryModal, WeeklyConfigSection, JSX principal) ---
    // Los dejo igual, no generan errores de TS.

    // --- NUEVO COMPONENTE: Modal de Resumen ---
    const SummaryModal = () => {
        if (!savedScheduleSummary) return null;
        const { title, lines } = savedScheduleSummary;

        return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300">
                <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg transform scale-100 transition-transform duration-300">
                    <h3 className="text-xl font-bold text-blue-900 mb-4 border-b pb-2 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        ¡Horario Guardado Exitosamente!
                    </h3>
                    
                    <p className="text-gray-700 font-semibold mb-3">{title}</p>
                    
                    <div className="space-y-2 mb-6 p-4 bg-gray-50 rounded border border-green-200 overflow-y-auto max-h-60">
                        {lines.map((line, index) => (
                            <p key={index} className="text-sm text-gray-800 font-medium">
                                {line}
                            </p>
                        ))}
                    </div>

                    <div className="flex justify-end">
                        <button 
                            onClick={() => setIsSummaryModalOpen(false)}
                            className="px-6 py-2 text-sm font-semibold text-white bg-blue-900 rounded-md hover:bg-blue-800 transition duration-150"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            </div>
        );
    };


    // --- Componente: Sección de Configuración Semanal (sin cambios) ---
    const WeeklyConfigSection = () => {
        const { ranges, selectedDays } = weeklySchedule; 
        const isDayError = !!errors['weekly-days'];
        const isGeneralRangeError = !!errors['weekly-general-range'];

        return (
            <section className="space-y-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">Horario Uniforme</h2>
                
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

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rangos de Horario (Se aplican a todos los días seleccionados)
                    </label>
                    
                    {isGeneralRangeError && <p className="text-sm text-red-600 mb-2 font-medium">{errors['weekly-general-range']}</p>}

                    {ranges.map((range, index) => {
                        const errorKey = `weekly-${index}`;
                        const isRangeError = !!errors[errorKey];

                        return (
                            <div key={index} className={`flex items-center space-x-3 mb-3 ${isRangeError || isGeneralRangeError ? 'p-2 rounded bg-red-50' : ''}`}>
                                <input
                                    type="time"
                                    value={range.start}
                                    onChange={(e) => handleWeeklyTimeChange(index, 'start', e.target.value)}
                                    className={`form-input w-32 text-center rounded-md border-gray-300 shadow-sm ${isRangeError || isGeneralRangeError ? 'border-red-500' : ''}`}
                                />
                                <span className="text-gray-500 text-lg font-bold">-</span>
                                <input
                                    type="time"
                                    value={range.end}
                                    onChange={(e) => handleWeeklyTimeChange(index, 'end', e.target.value)}
                                    className={`form-input w-32 text-center rounded-md border-gray-300 shadow-sm ${isRangeError || isGeneralRangeError ? 'border-red-500' : ''}`}
                                />
                                
                                {ranges.length > 1 && (
                                    <button 
                                        type="button" 
                                        onClick={() => removeRangeWeekly(index)}
                                        className="text-red-500 hover:text-red-700 transition duration-150"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m-5 0h14"></path></svg>
                                    </button>
                                )}

                                {isRangeError && <p className="text-sm text-red-600 ml-4 font-medium">{errors[errorKey]}</p>}
                            </div>
                        );
                    })}

                    <button 
                        type="button" 
                        onClick={addRangeWeekly}
                        className="text-sm text-blue-700 hover:text-blue-900 mt-2 flex items-center transition duration-150"
                    >
                        + Añadir Rango
                    </button>
                </div>
                {/* Removido el resumen estático de aquí, ahora va en el modal */}
            </section>
        );
    };

    // --- JSX Principal ---
    const isDailyGeneralError = !!errors['daily-general'];

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
                        <>
                            {isDailyGeneralError && (
                                <div className="p-4 mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg">
                                    <p className="font-bold">Error en los horarios</p>
                                    <p className="text-sm">{errors['daily-general']}</p>
                                </div>
                            )}

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
                        </>
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
                
                {/* --- NUEVO: Modal de Resumen al Guardar --- */}
                {isSummaryModalOpen && <SummaryModal />}
                
                {/* --- Modal de Cancelación (sin cambios) --- */}
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
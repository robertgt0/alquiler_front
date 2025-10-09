"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface AppointmentModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    patientName?: string
}

const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

// Estados de las citas
const APPOINTMENT_STATES = {
    unavailable: { label: "No disponible", color: "bg-gray-300" },
    holiday: { label: "Festivo", color: "bg-red-300" },
    scheduled: { label: "Programada", color: "bg-blue-300" },
    inProgress: { label: "En proceso", color: "bg-blue-500" },
    completed: { label: "Concluido", color: "bg-blue-600" },
}

export function AppointmentModal({ open, onOpenChange, patientName = "Juan Pérez" }: AppointmentModalProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [dateInput, setDateInput] = useState("")

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date)
        if (date) {
            const formatted = date.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            })
            setDateInput(formatted)
        }
    }

    const handleSearch = () => {
        console.log("Buscando disponibilidad para:", dateInput)
    }

    const handleToday = () => {
        const today = new Date()
        setSelectedDate(today)
        handleDateSelect(today)
    }

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time)
    }

    const handleConfirm = () => {
        if (selectedDate && selectedTime) {
            alert(`Cita confirmada para ${selectedDate.toLocaleDateString("es-ES")} a las ${selectedTime}`)
            onOpenChange(false)
            // Reset selections
            setSelectedTime(null)
        }
    }

    const handleCancel = () => {
        setSelectedTime(null)
    }

    const formatDateForSummary = (date: Date) => {
        return date.toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        })
    }

    return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent     className="!w-[50vw] !max-w-none !sm:max-w-none bg-white rounded-xl shadow-2xl overflow-x-auto max-h-[90vh] overflow-y-auto p-0">
            {/* Header */}
            <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">Agendar Cita - {patientName}</h2>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Navegación del Calendario */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-xl">←</button>
                        <h3 className="text-xl font-semibold text-gray-800 min-w-[140px]">Octubre 2025</h3>
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-xl">→</button>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Input
                            type="text"
                            placeholder="dd/mm/aaaa"
                            value={dateInput}
                            onChange={(e) => setDateInput(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-32"
                        />
                        <Input
                            type="text"
                            placeholder="Ej: 25 diciembre 2024"
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-48"
                        />
                        <Button
                            onClick={handleSearch}
                            className="bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-lg text-sm font-medium text-blue-600"
                        >
                            Buscar
                        </Button>
                        <Button
                            onClick={handleToday}
                            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-800"
                        >
                            Hoy
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Calendario */}
                    <div>
                        <Calendar
                        
                           mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            className="w-full"
                            captionLayout="dropdown-months"
       
                        />



                        {/* Leyenda */}
                        <div className="mt-4 text-xs space-y-2">
                            {Object.entries(APPOINTMENT_STATES).map(([key, state]) => (
                                <div key={key} className="flex items-center space-x-2">
                                    <div className={cn("w-4 h-4 rounded", state.color)} />
                                    <span>{state.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Horarios */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">
                            Horarios disponibles
                            {selectedDate && (
                                <span className="text-sm font-normal text-gray-500 ml-2">
                                    - {formatDateForSummary(selectedDate)}
                                </span>
                            )}
                        </h4>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {TIME_SLOTS.map((time) => (
                                <button
                                    key={time}
                                    onClick={() => handleTimeSelect(time)}
                                    className={cn(
                                        "w-full p-3 text-left rounded-lg border transition-colors",
                                        selectedTime === time
                                            ? "bg-blue-500 text-white border-blue-600"
                                            : "bg-white hover:bg-green-50 text-gray-700 border-gray-300"
                                    )}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Información de la cita seleccionada */}
                {selectedDate && selectedTime && (
                    <div className="mt-6 p-4 rounded-lg border" style={{ backgroundColor: "#f0f4f8", borderColor: "#94B1CC" }}>
                        <h4 className="font-semibold mb-2" style={{ color: "#226CCC" }}>Resumen de la cita</h4>
                        <div className="text-sm space-y-1" style={{ color: "#4289CC" }}>
                            <p><strong>Servicio:</strong> Reparación de Plomería</p>
                            <p><strong>Proveedor:</strong> {patientName}</p>
                            <p><strong>Fecha:</strong> {formatDateForSummary(selectedDate)}</p>
                            <p><strong>Hora:</strong> {selectedTime}</p>
                            <p><strong>Costo:</strong> $50/hora + materiales</p>
                        </div>
                        <div className="mt-4 flex space-x-3">
                            <Button
                                onClick={handleConfirm}
                                className="text-white px-6 py-2 rounded-lg font-medium flex-1"
                                style={{ backgroundColor: "#226CCC" }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#4289CC"}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#226CCC"}
                            >
                                Confirmar Cita
                            </Button>
                            <Button
                                onClick={handleCancel}
                                className="px-6 py-2 rounded-lg font-medium flex-1"
                                style={{ backgroundColor: "#94B1CC", color: "#374151" }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = "#4289CC"
                                    e.currentTarget.style.color = "white"
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = "#94B1CC"
                                    e.currentTarget.style.color = "#374151"
                                }}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </DialogContent>
    </Dialog>
)
}
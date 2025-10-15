"use client"

import { useState, useRef } from "react"
import { Calendar } from "../components/ui/calendar"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Dialog, DialogContent } from "../components/ui/dialog"
import { cn } from "@/lib/utils"
import LocationForm from "../components/LocationForms"
import ModalConfirmacion from "../components/ModalConfirmacion"


interface AppointmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientName?: string
}

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00"
]

const APPOINTMENT_STATES = {
  unavailable: { label: "No disponible", color: "bg-gray-300" },
  holiday: { label: "Festivo", color: "bg-red-300" },
  scheduled: { label: "Programada", color: "bg-blue-300" },
  inProgress: { label: "En proceso", color: "bg-blue-500" },
  completed: { label: "Concluido", color: "bg-blue-600" },
}

export function AppointmentModal({
  open,
  onOpenChange,
  patientName = "Juan Pérez",
}: AppointmentModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined) // ✅ cambiado a undefined
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [dateInput, setDateInput] = useState("")
  const [formSubmitted, setFormSubmitted] = useState(false)
  const locationFormRef = useRef<HTMLDivElement | null>(null)

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
    setTimeout(() => {
      locationFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleConfirm = () => {
  if (selectedDate && selectedTime) {
    setShowConfirmationModal(true)
    onOpenChange(false)
  }
}


  const handleCancel = () => {
    setSelectedTime(null)
  }

  const handleFormSubmit = (location: any) => {
    console.log("Datos de ubicación:", location)
    setFormSubmitted(true)
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
      <DialogContent className="!w-[50vw] !max-w-none !sm:max-w-none bg-white rounded-xl shadow-2xl overflow-x-auto max-h-[90vh] overflow-y-auto p-0">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            Agendar Cita - {patientName}
          </h2>
        </div>
        <div className="p-6">
          {/* --- BARRA SUPERIOR --- */}
          <div className="flex items-center justify-between mb-6">
            <Input
              type="text"
              placeholder="dd/mm/aaaa"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-32"
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

          {/* --- CALENDARIO Y HORARIOS --- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Calendar
                mode="single"
                selected={selectedDate ?? undefined} 
                onSelect={handleDateSelect}
                className="w-full"
                captionLayout="dropdown-months"
              />
              <div className="mt-4 text-xs space-y-2">
                {Object.entries(APPOINTMENT_STATES).map(([key, state]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <div className={cn("w-4 h-4 rounded", state.color)} />
                    <span>{state.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Horarios disponibles
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

          {/* --- FORMULARIO UBICACIÓN --- */}
          {!formSubmitted && selectedDate && selectedTime && (
            <div ref={locationFormRef} className="mt-6">
              <LocationForm onSubmit={handleFormSubmit} />
            </div>
          )}

          {/* --- RESUMEN DE CITA --- */}
          {formSubmitted && (
            <div
              className="mt-6 p-4 rounded-lg border"
              style={{ backgroundColor: "#f0f4f8", borderColor: "#94B1CC" }}
            >
              <h4
                className="font-semibold mb-2"
                style={{ color: "#226CCC" }}
              >
                Resumen de la cita
              </h4>
              <div
                className="text-sm space-y-1"
                style={{ color: "#4289CC" }}
              >
                <p><strong>Servicio:</strong> Reparación de Plomería</p>
                <p><strong>Proveedor:</strong> {patientName}</p>
                <p><strong>Fecha:</strong> {selectedDate ? formatDateForSummary(selectedDate) : ""}</p>
                <p><strong>Hora:</strong> {selectedTime}</p>
                <p><strong>Costo:</strong> $50/hora + materiales</p>
              </div>
              <div className="mt-4 flex space-x-3">
                <Button
                  onClick={handleConfirm}
                  className="text-white px-6 py-2 rounded-lg font-medium flex-1"
                  style={{ backgroundColor: "#226CCC" }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#4289CC")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "#226CCC")
                  }
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
        <ModalConfirmacion
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
      />        
    </Dialog>
  )
}

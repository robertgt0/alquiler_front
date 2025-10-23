//Componente del botón agendar cita + estado de abrir/cerrar el modal
"use client";
import { useState } from "react";
import { AppointmentModal } from "./appointment-modal";

export default function AgendarCitaButton() {
  const [open, setOpen] = useState(false);

  const providerId = "68e867119573cfe163a27fb3"; // id proveedor 
  const clienteId  = "68e867119573cfe163a27fb1"; // id cliente

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-5 py-2 bg-[#4289CC] text-white rounded-lg hover:bg-blue-700 transition transform hover:scale-105 duration-300 font-medium"
      >
        Agendar Cita
      </button>

      {/* Modal */}
       <AppointmentModal
        open={open}
        onOpenChange={setOpen}
        patientName="Juan Pérez"
        providerId={providerId}
        clienteId={clienteId}        
        slotMinutes={30}
        hours="08:00-12:00,14:00-18:00"
      />
    </>
  );
}

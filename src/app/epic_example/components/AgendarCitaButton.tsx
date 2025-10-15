"use client";

import { useState } from "react";
import { Button } from "@/app/epic_example/components/ui/button";
import { AppointmentModal } from "@/app/epic_example/components/appointment-modal";

export default function AppointmentButton() {
  const [open, setOpen] = useState(false);

  const providerId = "68e867119573cfe163a27fb3"; // tu proveedor real
  const clienteId  = "68e867119573cfe163a27fb1"; // tu cliente real

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-2 transition"
      >
        Agendar Cita
      </Button>

      <AppointmentModal
        open={open}
        onOpenChange={setOpen}
        patientName="Juan Pérez"
        providerId={providerId}
        clienteId={clienteId}        // 👈 nuevo
        slotMinutes={30}
        hours="08:00-12:00,14:00-18:00"
      />
    </>
  );
}

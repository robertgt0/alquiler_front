"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface ModalConfirmacionProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalConfirmacion({
  isOpen,
  onClose,
}: ModalConfirmacionProps) {
  const router = useRouter();

  const handleAgendarNueva = () => {
    onClose();
    router.push("/agenda"); // mejor ruta relativa
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md text-center p-8 rounded-xl shadow-lg">
        {/* Título accesible para Radix */}
        <DialogTitle className="sr-only">Confirmación de cita</DialogTitle>

        <div className="flex justify-center mb-4">
          <div className="bg-green-100 rounded-full p-4">
            <CheckCircle className="text-green-600 w-10 h-10" />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-2">¡Cita Agendada!</h2>
        <p className="text-gray-600 mb-6">
          Tu cita ha sido confirmada exitosamente. Recibirás un correo de
          confirmación con los detalles.
        </p>

        <Button
          className="bg-blue-600 hover:bg-blue-700 w-full"
          onClick={handleAgendarNueva}
        >
          Volver al inicio
        </Button>
      </DialogContent>
    </Dialog>
  );
}

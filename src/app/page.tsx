"use client";
import { Dialog } from "@/app/agenda/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message
}: ConfirmationModalProps) {

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (e) {
      console.error("Error en confirmación:", e);
    } finally {
      onClose(); // cerrar modal después de que termine onConfirm
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Fondo oscuro */}
      <div className="fixed inset-0 z-50 bg-black/50" />

      {/* Contenedor del modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
          
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>
          
          {/* Mensaje */}
          <p className="text-gray-600 mb-6">{message}</p>
          
          {/* Botones */}
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Confirmar
            </button>
          </div>

        </div>
      </div>
    </Dialog>
  );
}

"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

interface ModalConfirmacionProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void | Promise<void>; // opcional, para confirmaciones tipo "cancelar"
  title?: string;   // título del modal
  message?: string; // mensaje del modal
  success?: boolean; // si es true, usamos estilo de éxito; si false, estilo de alerta
}

export default function ModalConfirmacion({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  success = true,
}: ModalConfirmacionProps) {
  const router = useRouter();

  const handleConfirm = async () => {
    if (onConfirm) {
      try {
        await onConfirm();
      } catch (e) {
        console.error("Error en confirmación:", e);
      } finally {
        onClose();
      }
    } else {
      onClose();
      router.push("/agenda");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md text-center p-8 rounded-xl shadow-lg">
        <DialogTitle className="sr-only">{title || (success ? "Confirmación" : "Atención")}</DialogTitle>

        <div className="flex justify-center mb-4">
          <div className={`rounded-full p-4 ${success ? "bg-green-100" : "bg-red-100"}`}>
            {success ? (
              <CheckCircle className="text-green-600 w-10 h-10" />
            ) : (
              <AlertTriangle className="text-red-600 w-10 h-10" />
            )}
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>

        <Button
          className={`${success ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"} w-full`}
          onClick={handleConfirm}
        >
          {success ? "Volver al inicio" : "Confirmar"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

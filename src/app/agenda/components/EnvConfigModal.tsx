"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";

interface UserData {
  request: {
    nombre: string;
    correo: string;
    numero: string;
  };
  fixer: {
    nombre: string;
    correo: string;
    numero: string;
  };
}

export default function VentanaPrueba() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<UserData>({
    request: { nombre: "", correo: "", numero: "" },
    fixer: { nombre: "", correo: "", numero: "" },
  });

  // 🔄 Cargar datos previos desde localStorage al montar
  useEffect(() => {
    const stored = localStorage.getItem("env_prueba");
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (err) {
        console.error("Error al leer env_prueba:", err);
      }
    }
  }, []);

  // 💾 Guardar en localStorage
  const handleSave = () => {
    localStorage.setItem("env_prueba", JSON.stringify(data, null, 2));
    alert("✅ Datos guardados/actualizados en env_prueba (localStorage)");
    setOpen(false);
  };

  // ✍️ Manejar cambios en los inputs
  const handleChange = (section: "request" | "fixer", field: keyof UserData["request"], value: string) => {
    setData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  return (
    <>
      {/* Botón flotante */}
      <Button
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg"
        onClick={() => setOpen(true)}
      >
        ⚙️
      </Button>

      {/* Ventana modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg rounded-xl">
          <DialogHeader>
            <DialogTitle>Configuración de entorno (env_prueba)</DialogTitle>
            <DialogDescription>Guarda información local del Request y del Fixer.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* 🟣 Request */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="text-md font-semibold mb-2 text-blue-600">Datos del Request</h3>
              <Input
                placeholder="Nombre"
                value={data.request.nombre}
                onChange={(e) => handleChange("request", "nombre", e.target.value)}
                className="mb-2"
              />
              <Input
                placeholder="Correo"
                value={data.request.correo}
                onChange={(e) => handleChange("request", "correo", e.target.value)}
                className="mb-2"
              />
              <Input
                placeholder="Número"
                value={data.request.numero}
                onChange={(e) => handleChange("request", "numero", e.target.value)}
              />
            </div>

            {/* 🟡 Fixer */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="text-md font-semibold mb-2 text-green-600">Datos del Fixer</h3>
              <Input
                placeholder="Nombre"
                value={data.fixer.nombre}
                onChange={(e) => handleChange("fixer", "nombre", e.target.value)}
                className="mb-2"
              />
              <Input
                placeholder="Correo"
                value={data.fixer.correo}
                onChange={(e) => handleChange("fixer", "correo", e.target.value)}
                className="mb-2"
              />
              <Input
                placeholder="Número"
                value={data.fixer.numero}
                onChange={(e) => handleChange("fixer", "numero", e.target.value)}
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
                Guardar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

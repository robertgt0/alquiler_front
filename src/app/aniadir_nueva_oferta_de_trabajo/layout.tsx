// src/app/aniadir_nueva_oferta_de_trabajo/layout.tsx
import type { ReactNode } from "react";

export const metadata = {
  title: "Añadir nueva oferta",
  description: "Crear nueva oferta de trabajo",
};

export default function NuevaOfertaLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  );
}

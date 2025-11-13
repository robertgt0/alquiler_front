import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "./Navbar"; // asegúrate que exista este componente

// Fuente Google
const inter = Inter({ subsets: ["latin"] });

// Datos opcionales de SEO
export const metadata: Metadata = {
  title: "Servineo - Perfil Fixer",
  description: "Plataforma de fixers - perfil de usuario",
};

// Layout principal de la app
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen`}
      >
        {/* Navbar global */}
        <Navbar />

        {/* Contenido de cada página */}
        <main className="pt-10">{children}</main>
      </body>
    </html>
  );
}

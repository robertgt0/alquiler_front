import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
// IMPORTACIÓN ÚNICA: Aseguramos que solo importamos el archivo que mantuvimos (globals.css)
import "./globals.css"; 
import "maplibre-gl/dist/maplibre-gl.css";

// Fuentes principales (estándares institucionales)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FixerApp",
  description: "Gestión de citas y notificaciones",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} ${robotoMono.variable}`}>
      <head>
        {/* Carga optimizada de fuentes */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      {/* 🟢 ESTILO COMBINADO: Mantenemos la clase que introdujo la HU5/HU6, asumiendo que es el nuevo look. */}
      <body className="bg-blue-50 text-gray-900 antialiased min-h-screen">{children}</body>
    </html>
  );
}
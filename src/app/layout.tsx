import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import "maplibre-gl/dist/maplibre-gl.css";

// 🟢 Importamos la campanita global
import NotificationBell from "@/components/NotificationBell";

// Fuentes principales
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

      <body className="bg-blue-50 text-gray-900 antialiased min-h-screen">
        {/* 🟣 Header global con campanita */}
        <header className="flex items-center justify-between px-6 py-3 bg-white border-b shadow-sm">
          <h1 className="text-lg font-semibold text-gray-800">FixerApp</h1>

          {/* 🔔 Campanita de notificaciones */}
          <NotificationBell />
        </header>

        {/* Contenido dinámico de cada página */}
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}

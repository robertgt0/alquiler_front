"use client";

import { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
// ✅ CORRECCIÓN: Agregar declaración para CSS
import "./globals.css";

import Header from "./components/Header/Header";
import { useUsuarioNuevo } from "./hooks/useUsuarioNuevo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOnline, setIsOnline] = useState(true);
  const { modalAbierto, cerrarModal } = useUsuarioNuevo();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ✅ CORRECCIÓN: Importar CSS de Leaflet aquí */}
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {/* Banner de "Sin Conexión" */}
        {!isOnline && (
          <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-center p-2 z-50 shadow-lg animate-pulse">
            <p className="font-semibold">
              Estás sin conexión
            </p>
            <p className="text-sm">
              Comprueba tu conexión a internet.
            </p>
          </div>
        )}

        <Header />

        {/* ✅ CORRECCIÓN: Ajustar el padding según el dispositivo */}
        <div className="min-h-screen flex flex-col">
          <main className="flex-1 pb-16 sm:pb-0 pt-16 sm:pt-20">
            {children}
          </main>
        </div>

      </body>
    </html>
  );
}
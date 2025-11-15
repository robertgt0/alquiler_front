// Archivo: layout.tsx (Corregido)

"use client";

import { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "./components/Header/Header"; // Ajusta tu ruta si es necesario

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {/* Banner de "Sin Conexión" */}
        {!isOnline && (
          // Este banner mide aprox. 52px de alto
          <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-center p-2 z-[60] shadow-lg animate-pulse">
            <p className="font-semibold">
              Estás sin conexión
            </p>
            <p className="text-sm">
              Comprueba tu conexión a internet.
            </p>
          </div>
        )}

        {/* Pasamos 'isOnline' para que el Header se mueva */}
        <Header isOnline={isOnline} />

        {/* AQUÍ ESTÁ LA CORRECCIÓN FINAL:
          pt-[44px] -> 44px exactos para el header móvil
          sm:pt-[72px] -> 72px exactos para el header desktop
          pb-[70px] -> Espacio para el footer móvil (ajusta si es necesario)
        */}
        <main className="pt-[44px] pb-[70px] sm:pt-[72px] sm:pb-0">
          {children}
        </main>
        
      </body>
    </html>
  );
}
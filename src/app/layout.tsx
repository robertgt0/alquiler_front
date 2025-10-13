import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // Asumo que son las fuentes de tu proyecto
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alquiler App", // Cambié el título a algo más descriptivo
  description: "Plataforma de alquiler de servicios",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // La clase se aplica aquí, en la etiqueta <html>
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body>
        {children}
      </body>
    </html>
  );
}
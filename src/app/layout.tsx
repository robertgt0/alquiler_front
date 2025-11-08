import "./global.css"; 

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-blue-50 text-gray-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}

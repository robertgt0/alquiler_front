import './global.css';

export const metadata = {
  title: 'Convertirse en Fixer',
  description: 'Registro para convertirse en fixer',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/convertirse-en-fixer/assets/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}

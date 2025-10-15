import './globals.css';
import '../styles/theme.css';
import { Inter, Poppins } from 'next/font/google';
import type { ReactNode } from 'react';
import Header from '../components/Header';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${poppins.variable}`}
        style={{ background: 'var(--color-bg)' }}
      >
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}

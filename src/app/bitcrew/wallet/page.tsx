// src/app/bitcrew/wallet/page.tsx
'use client'; // Necesario si tus componentes usan hooks o estado

import Wallet from './components/Wallet'; // Importamos el componente que hicimos
import './Wallet.css';     // Importamos los estilos globales

export default function WalletPage() {
  // Esta es la página real que Next.js mostrará
  return (
    <main>
      <Wallet />
    </main>
  );
}
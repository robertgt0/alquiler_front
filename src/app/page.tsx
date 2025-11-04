// src/app/page.tsx

// 1. Importa la función 'redirect' de next/navigation
import { redirect } from 'next/navigation';

export default function Home() {
  
  // 2. Llama a la redirección inmediatamente
  // Esto le dice a Next.js que envíe al usuario a "/Homepage"
  redirect('/Homepage');

  /* No es necesario retornar nada de HTML (como <main>, <h1>, etc.)
     porque la redirección detendrá la renderización de esta página
     y enviará al usuario a la nueva ruta.
     Puedes retornar null si lo prefieres.
  */
  return null;
}
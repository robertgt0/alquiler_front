// src/app/page.tsx

// 1. Importa la función 'redirect' de next/navigation
import { redirect } from 'next/navigation';

export default function Home() {
  
  redirect('/Homepage');

  return null;
}
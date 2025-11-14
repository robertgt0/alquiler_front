import { Suspense } from 'react';
import CanceladosPageClient from './CanceladosPage.client';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <CanceladosPageClient />
    </Suspense>
  );
}
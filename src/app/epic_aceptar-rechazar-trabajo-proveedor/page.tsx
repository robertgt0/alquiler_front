import { Suspense } from 'react';
import ProveedorPageClient from './ProveedorPage.client';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <ProveedorPageClient />
    </Suspense>
  );
}

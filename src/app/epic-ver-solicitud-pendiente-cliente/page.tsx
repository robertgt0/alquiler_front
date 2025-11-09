import { Suspense } from 'react';
import ClientePageClient from './ClientePage.client';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <ClientePageClient />
    </Suspense>
  );
}

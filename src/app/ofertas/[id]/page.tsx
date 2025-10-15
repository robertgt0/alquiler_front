'use client';
import { useParams, useRouter } from 'next/navigation';
import OfferDetailModal from '@/Features/detalleOferta/components/OfferDetailModal';
import { useOfferDetail } from '@/Features/detalleOferta/hooks/useOfferDetail';

export default function OfferDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { data, status } = useOfferDetail(id);

  const close = () => router.back(); // o router.push('/ofertas')

  if (status === 'loading')
    return <p style={{ padding: 16 }}>Cargando oferta…</p>;
  if (status === 'error')
    return (
      <p style={{ padding: 16 }}>
        No se pudo cargar la oferta. Intente nuevamente.
      </p>
    );

  return (
    <OfferDetailModal offer={data} onClose={close} currentUserId="fixer-123" />
  );
}

'use client';
import { useParams } from 'next/navigation';
import OfferDetailView from '../../../Features/detalleOferta/components/OfferDetailView';
import { useOfferDetail } from '../../../Features/detalleOferta/hooks/useOfferDetail';

export default function OfferDetailPage() {
  const params = useParams<{ id: string | string[] }>();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const { data, status } = useOfferDetail(id);

  if (status === 'idle' || status === 'loading')
    return <p className="p-4">Cargando oferta…</p>;
  if (status === 'error')
    return (
      <p className="p-4">No se pudo cargar la oferta. Intente nuevamente.</p>
    );
  if (!data) return <p className="p-4">No se encontró la oferta.</p>;

  return (
    <OfferDetailView
      offer={data}
      currentUserId="fixer-123"
      onEdit={() => console.log('Editar', data.id)}
      onDelete={() => console.log('Eliminar', data.id)}
    />
  );
}

'use client';

import React from 'react';
import { getOfferById, canEditOffer, deleteOffer, type Offer } from '../services/offersService';
import { useParams, useRouter } from 'next/navigation';

const CURRENT_USER_ID = 'fixer-1';

export default function OfferDetail() {
  const { offerId } = useParams<{ offerId: string }>();
  const router = useRouter();

  const [offer, setOffer] = React.useState<Offer | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isOwner, setIsOwner] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getOfferById(String(offerId));
        if (!mounted) return;
        if (!data) { setError('No se pudo cargar la oferta. Intente nuevamente.'); setLoading(false); return; }
        setOffer(data);
        setIsOwner(await canEditOffer(data, CURRENT_USER_ID));
        setLoading(false);
      } catch {
        if (!mounted) return;
        setError('No se pudo cargar la oferta. Intente nuevamente.');
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [offerId]);

  if (loading) return <p style={{ color: '#616E8A' }}>Cargando detalle…</p>;
  if (error) return <div role="alert" style={{ color: '#E55451' }}>{error}</div>;
  if (!offer) return null;

  const images = offer.images ?? [];
  const hasImages = images.length > 0;
  const prev = () => setIndex(i => (i - 1 + images.length) % images.length);
  const next = () => setIndex(i => (i + 1) % images.length);

  const doDelete = async () => {
    if (!offer) return;
    if (!confirm('¿Eliminar esta oferta?')) return;
    await deleteOffer(offer.id);
    router.push('/offers');
  };

  return (
    <section style={{ display: 'grid', gap: 16 }}>
      <h2 style={{ margin: 0, color: '#0c4fe9', fontWeight: 700, fontSize: 22 }}>Detalles de la Oferta</h2>

      <div style={{ borderRadius: 12, border: '1px solid #F0F2F5', padding: 12, background: '#fff' }}>
        {hasImages ? (
          <div style={{ position: 'relative' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[index]} alt={`Imagen ${index + 1} de ${images.length}`}
                 style={{ width: '100%', height: 360, objectFit: 'cover', borderRadius: 8 }} />
            {images.length > 1 && (
              <>
                <button onClick={prev} aria-label="Imagen anterior" style={navBtn({ left: 8 })}>‹</button>
                <button onClick={next} aria-label="Imagen siguiente" style={navBtn({ right: 8 })}>›</button>
              </>
            )}
          </div>
        ) : (
          <div style={{ height: 360, display: 'grid', placeItems: 'center', background: '#F8FAFC', borderRadius: 8, color: '#616E8A' }}>
            Esta oferta no tiene imágenes
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gap: 8 }}>
        <h3 style={{ margin: 0, color: '#11255a', fontWeight: 700 }}>{offer.title}</h3>
        <p style={{ margin: 0, color: '#2a87ff', lineHeight: 1.45 }}>{offer.description}</p>

        <div style={{ color: '#616E8A', display: 'grid', gap: 4 }}>
          <div><strong style={{ color: '#1366fd' }}>Categoría de servicio: </strong>{offer.category}</div>
          <div><strong style={{ color: '#1366fd' }}>Fecha de publicación: </strong>{new Date(offer.createdAt).toLocaleDateString()}</div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            {offer.contact?.whatsapp && (<span><strong style={{ color: '#1366fd' }}>WhatsApp: </strong>{offer.contact.whatsapp}</span>)}
            {offer.contact?.phone && (<span><strong style={{ color: '#1366fd' }}>Teléfono: </strong>{offer.contact.phone}</span>)}
            {offer.contact?.email && (<span><strong style={{ color: '#1366fd' }}>Email: </strong>{offer.contact.email}</span>)}
          </div>
        </div>

        {offer.status === 'inactive' && (
          <span style={{ alignSelf: 'start', marginTop: 8, padding: '2px 8px', borderRadius: 999, background: '#FFE7D6', color: '#B45309' }}>
            Caducada
          </span>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <button type="button" onClick={() => router.push('/offers')} style={btnGhost}>← Volver</button>
        <div style={{ display: 'flex', gap: 12 }}>
          <button type="button" disabled={!isOwner} style={btnPrimary(!isOwner)}
                  onClick={() => isOwner && router.push(`/addNewJobOffer?edit=${offer.id}`)}>
            Editar Oferta
          </button>
          <button type="button" disabled={!isOwner} style={btnDanger(!isOwner)} onClick={doDelete}>
            Eliminar Oferta
          </button>
        </div>
      </div>
    </section>
  );
}

function navBtn(side: { left?: number; right?: number }): React.CSSProperties {
  return {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    ...side, padding: '6px 10px', borderRadius: 8, border: '1px solid #DBDEE5',
    background: '#ffffff', cursor: 'pointer', opacity: 0.9
  };
}
const btnGhost: React.CSSProperties = { padding: '8px 12px', borderRadius: 8, border: '1px solid #DBDEE5', background: '#fff', color: '#0c4fe9', cursor: 'pointer' };
const btnPrimary = (disabled: boolean): React.CSSProperties => ({ padding: '8px 12px', borderRadius: 8, border: '1px solid #DBDEE5', background: disabled ? '#F0F2F5' : '#0c4fe9', color: disabled ? '#9AA4B2' : '#fff', cursor: disabled ? 'not-allowed' : 'pointer', fontWeight: 600 });
const btnDanger  = (disabled: boolean): React.CSSProperties => ({ padding: '8px 12px', borderRadius: 8, border: '1px solid #F2B0A8', background: disabled ? '#FCE8E6' : '#E55451', color: disabled ? '#B36B66' : '#fff', cursor: disabled ? 'not-allowed' : 'pointer', fontWeight: 600 });

'use client';

import React from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { getOfferById, canEditOffer, deleteOffer, type Offer } from '../services/offersService';
import { useClientSession } from '@/lib/auth/useSession';

const shellStyles: React.CSSProperties = {
  maxWidth: 960,
  margin: '0 auto',
  padding: '32px 16px 64px',
  display: 'grid',
  gap: 32,
};

const sectionCard: React.CSSProperties = {
  borderRadius: 24,
  border: '1px solid #E5E7EB',
  background: '#FFFFFF',
  padding: 24,
  boxShadow: '0 24px 48px rgba(15, 23, 42, 0.08)',
  display: 'grid',
  gap: 28,
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 14,
  color: '#6B7280',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: 0.4,
};

const valueStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 16,
  color: '#111827',
  fontWeight: 500,
};

export default function OfferDetail() {
  const { offerId } = useParams<{ offerId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [offer, setOffer] = React.useState<Offer | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [index, setIndex] = React.useState(0);
  const [banner, setBanner] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const statusParam = searchParams.get('status');
  const { user } = useClientSession();
  const currentFixerId = user?.fixerId ?? null;

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getOfferById(String(offerId));
        if (!mounted) return;
        if (!data) {
          setError('No se pudo cargar la oferta. Intente nuevamente');
          setLoading(false);
          return;
        }
        setOffer(data);
        setLoading(false);
      } catch {
        if (!mounted) return;
        setError('No se pudo cargar la oferta. Intente nuevamente');
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [offerId]);

  React.useEffect(() => {
    if (!statusParam) return;
    if (statusParam === 'edited') {
      setBanner({ type: 'success', message: 'Edicion realizada con exito' });
    } else if (statusParam === 'created') {
      setBanner({ type: 'success', message: 'Oferta registrada con exito' });
    } else if (statusParam === 'deleted') {
      setBanner({ type: 'success', message: 'Oferta eliminada con exito' });
    }
    const params = new URLSearchParams(window.location.search);
    params.delete('status');
    const nextUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
    router.replace(nextUrl, { scroll: false });
  }, [statusParam, router]);

  if (loading) {
    return <p style={{ color: '#616E8A', textAlign: 'center', marginTop: 64 }}>Cargando detalle...</p>;
  }

  if (error) {
    return (
      <div
        role="alert"
        style={{
          maxWidth: 480,
          margin: '40px auto',
          color: '#B91C1C',
          background: '#FEE2E2',
          padding: '12px 16px',
          borderRadius: 12,
          textAlign: 'center',
        }}
      >
        {error}
      </div>
    );
  }

  if (!offer) return null;

  const isOwner = canEditOffer(offer, currentFixerId);

  const images = offer.images ?? [];
  const hasImages = images.length > 0;
  const isInactive = offer.status === 'inactive';
  const goPrev = () => setIndex((value) => (value - 1 + images.length) % images.length);
  const goNext = () => setIndex((value) => (value + 1) % images.length);

  const handleDelete = () => {
    if (!offer) return;
    if (!isOwner) {
      setBanner({ type: 'error', message: 'Solo el fixer propietario puede eliminar esta oferta.' });
      return;
    }
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!offer || !isOwner || !currentFixerId) return;
    try {
      setDeleteLoading(true);
      await deleteOffer(offer.id, currentFixerId);
      setDeleteModalOpen(false);
      setBanner({ type: 'success', message: 'Oferta eliminada con exito' });
      setTimeout(() => {
        router.push('/offers?status=deleted');
      }, 2000);
    } catch (err) {
      console.error(err);
      setDeleteLoading(false);
      setBanner({ type: 'error', message: 'Error al eliminar la oferta. Intente de nuevo' });
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setDeleteLoading(false);
  };

  const paragraphs = (offer.description ?? '').split(/\n+/).filter(Boolean);

  return (
    <section style={shellStyles}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 16, height: 16, borderRadius: 4, background: '#111827' }} />
            <span style={{ fontSize: 18, fontWeight: 500, color: '#111827' }}>Servineo</span>
          </div>
          <h1 style={{ margin: 0, fontSize: 28, color: '#111827', fontWeight: 600 }}>Detalles de la oferta</h1>
          <p style={{ margin: '8px 0 0', color: '#6B7280', fontSize: 14 }}>
            Revisa la información completa de la publicación.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push('/offers')}
          style={{
            border: '1px solid #D1D5DB',
            background: '#FFFFFF',
            color: '#1F2937',
            fontWeight: 600,
            padding: '8px 14px',
            borderRadius: 12,
            cursor: 'pointer',
          }}
        >
          Cerrar
        </button>
      </header>

      {banner && (
        <div
          role="status"
          style={{
            borderRadius: 16,
            padding: '12px 18px',
            fontSize: 14,
            fontWeight: 500,
            color: banner.type === 'success' ? '#065F46' : '#B91C1C',
            background: banner.type === 'success' ? '#D1FAE5' : '#FEE2E2',
          }}
        >
          {banner.message}
        </div>
      )}

      <div style={sectionCard}>
        <figure style={{ display: 'grid', gap: 16, margin: 0 }}>
          <div
            style={{
              position: 'relative',
              borderRadius: 20,
              overflow: 'hidden',
              background: '#F3F4F6',
              aspectRatio: '16 / 9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {hasImages ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[index]}
                  alt={`Imagen ${index + 1} de ${images.length}`}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#111827' }}
                />
                {images.length > 1 && (
              <>
                    <button type="button" onClick={goPrev} aria-label="Imagen anterior" style={sliderButton({ left: 12 })}>
                      {'<'}
                    </button>
                    <button type="button" onClick={goNext} aria-label="Imagen siguiente" style={sliderButton({ right: 12 })}>
                      {'>'}
                    </button>
                <div style={dotWrapper}>
                  {images.map((_, dotIndex) => (
                    <span
                          key={String(dotIndex)}
                          style={{
                            width: dotIndex === index ? 10 : 8,
                            height: dotIndex === index ? 10 : 8,
                            borderRadius: '50%',
                            background: dotIndex === index ? '#2563EB' : '#CBD5F5',
                            transition: 'all .2s ease',
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', color: '#6B7280', fontSize: 15 }}>Esta oferta no tiene imagenes</div>
            )}
          </div>
        </figure>

        <article style={{ display: 'grid', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0, fontSize: 22, color: '#111827', fontWeight: 600 }}>{offer.title}</h2>
            {isInactive && (
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: 999,
                  background: '#FDE68A',
                  color: '#92400E',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Caducada
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gap: 12, color: '#374151', lineHeight: 1.6 }}>
            {paragraphs.length
              ? paragraphs.map((paragraph, idx) => (
                  <p key={String(idx)} style={{ margin: 0 }}>
                    {paragraph}
                  </p>
                ))
              : (
                <p style={{ margin: 0 }}>Sin descripcion detallada.</p>
              )}
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            <div>
              <span style={labelStyle}>Categoria de servicio</span>
              <p style={valueStyle}>{offer.category ?? 'Sin categoria'}</p>
            </div>
            <div>
              <span style={labelStyle}>Fecha de publicacion</span>
              <p style={valueStyle}>{new Date(offer.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 10 }}>
            <span style={labelStyle}>Información de contacto</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 15, color: '#1F2937' }}>
              {offer.contact?.whatsapp && (
                <span>
                  <strong style={{ color: '#2563EB' }}>WhatsApp:</strong> {offer.contact.whatsapp}
                </span>
              )}
              {offer.contact?.phone && (
                <span>
                  <strong style={{ color: '#2563EB' }}>Telefono:</strong> {offer.contact.phone}
                </span>
              )}
              {offer.contact?.email && (
                <span>
                  <strong style={{ color: '#2563EB' }}>Email:</strong> {offer.contact.email}
                </span>
              )}
            </div>
          </div>
        </article>

        <footer
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 8,
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <button
            type="button"
            onClick={() => router.push('/offers')}
            style={{
              border: '1px solid #D1D5DB',
              background: '#FFFFFF',
              color: '#2563EB',
              fontWeight: 600,
              padding: '10px 16px',
              borderRadius: 12,
              cursor: 'pointer',
            }}
          >
            Volver
          </button>

          {isOwner && (
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => router.push(`/addNewJobOffer?edit=${offer.id}`)}
                style={{
                 border: '1px solid #2563EB',
                  background: '#2563EB',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  padding: '10px 18px',
                  borderRadius: 12,
                  cursor: 'pointer',
                }}
              >
                Editar oferta
              </button>
              <button
                type="button"
                onClick={handleDelete}
                style={{
                  border: '1px solid #F87171',
                  background: '#F87171',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  padding: '10px 18px',
                  borderRadius: 12,
                  cursor: 'pointer',
                }}
              >
                Eliminar oferta
              </button>
            </div>
          )}
        </footer>
      </div>

      {deleteModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            zIndex: 50,
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-offer-title"
            style={{
              maxWidth: 460,
              width: '100%',
              background: '#FFFFFF',
              borderRadius: 24,
              padding: 32,
              display: 'grid',
              gap: 24,
              textAlign: 'center',
              boxShadow: '0 24px 40px rgba(15,23,42,0.24)',
            }}
          >
            <header>
              <h2 id="delete-offer-title" style={{ margin: 0, fontSize: 22, color: '#111827', fontWeight: 600 }}>
                Estas seguro de eliminar esta oferta de trabajo?
              </h2>
              <p style={{ margin: '12px 0 0', fontSize: 14, color: '#6B7280' }}>
                Esta accion no se puede deshacer. Eliminar esta oferta de trabajo la removera de la lista de ofertas disponibles.
              </p>
            </header>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteLoading}
                style={{
                  minWidth: 120,
                  borderRadius: 12,
                  background: '#2563EB',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  padding: '10px 16px',
                  border: 'none',
                  cursor: deleteLoading ? 'wait' : 'pointer',
                }}
              >
                {deleteLoading ? 'Eliminando...' : 'Eliminar'}
              </button>
              <button
                type="button"
                onClick={cancelDelete}
                disabled={deleteLoading}
                style={{
                  minWidth: 120,
                  borderRadius: 12,
                  background: '#F3F4F6',
                  color: '#1F2937',
                  fontWeight: 600,
                  padding: '10px 16px',
                  border: '1px solid #E5E7EB',
                  cursor: deleteLoading ? 'not-allowed' : 'pointer',
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function sliderButton(position: { left?: number; right?: number }): React.CSSProperties {
  return {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 40,
    height: 40,
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.6)',
    background: 'rgba(17,24,39,0.55)',
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 500,
    lineHeight: '40px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'background .2s ease',
    ...position,
  };
}

const dotWrapper: React.CSSProperties = {
  position: 'absolute',
  bottom: 16,
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: 8,
};

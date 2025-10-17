'use client';

import React from 'react';
import OfferCard from './OfferCard';
import { listOffers } from '../services/offersService';
import type { Offer } from '../services/offersService';
import { useRouter } from 'next/navigation';

const PAGE_SIZE = 10;

export default function OffersList() {
  const [query, setQuery] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [items, setItems] = React.useState<Offer[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [includeInactive] = React.useState(false);

  const router = useRouter();

  const [offline, setOffline] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await listOffers({ query, page, pageSize: PAGE_SIZE, includeInactive });
      setTotal(res.total);
      setItems(res.items);
    } catch {
      setError('Error al cargar ofertas');
    } finally {
      setLoading(false);
    }
  }, [query, page, includeInactive]);

  React.useEffect(() => {
    if (mounted) fetchData();
  }, [fetchData, mounted]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function onOpenOffer(offer: Offer) {
    router.push(`/offers/${offer.id}`);
  }

  return (
    <section style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, color: '#0c4fe9', fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 700, fontSize: 22 }}>
          Ofertas Disponibles
        </h2>
        <span style={{ color: '#616E8A' }}>Total: {total}</span>
      </div>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          aria-label="Buscar mis ofertas"
          placeholder="Buscar mis ofertas"
          value={query}
          onChange={(e) => { setPage(1); setQuery(e.target.value); }}
          style={{ width: '100%', padding: '10px 14px', borderRadius: 999, border: '1px solid #DBDEE5', outline: 'none', color: '#616E8A', background: '#fff' }}
        />
        <button
          type="button"
          onClick={() => fetchData()}
          style={{ marginLeft: 8, padding: '10px 14px', borderRadius: 8, border: '1px solid #DBDEE5', background: '#F0F2F5', color: '#0c4fe9', fontWeight: 600, cursor: 'pointer' }}
          aria-label="Refrescar listado"
          title="Refrescar"
        >
          ↻
        </button>
      </div>

      {mounted && offline && (
        <div role="alert" style={{ border: '1px solid #E55451', background: '#fff', color: '#E55451', padding: '10px 12px', borderRadius: 8 }}>
          Error al cargar ofertas
        </div>
      )}

      {error && !(mounted && offline) && (
        <div role="alert" style={{ color: '#E55451' }}>{error}</div>
      )}

      {loading ? (
        <p style={{ color: '#616E8A' }}>Cargando…</p>
      ) : items.length === 0 ? (
        <p style={{ color: '#616E8A' }}>No tienes ofertas registradas.</p>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {items.map((o) => (
            <OfferCard key={o.id} offer={o} onOpen={onOpenOffer} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav aria-label="Paginación" style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #DBDEE5', background: page === 1 ? '#F0F2F5' : '#fff', color: '#0c4fe9', cursor: page === 1 ? 'not-allowed' : 'pointer' }}>
            Anterior
          </button>
          <span style={{ alignSelf: 'center', color: '#616E8A' }}>{page} / {totalPages}</span>
          <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #DBDEE5', background: page === totalPages ? '#F0F2F5' : '#fff', color: '#0c4fe9', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}>
            Siguiente
          </button>
        </nav>
      )}
    </section>
  );
}

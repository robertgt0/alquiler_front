import { useEffect, useState } from 'react';
import { getOfferById, type Offer } from '../services/offersService';

type Status = 'idle' | 'loading' | 'error' | 'success';

export function useOfferDetail(id: string | undefined) {
  const [data, setData] = useState<Offer | null>(null);
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    let active = true;
    if (!id) {
      console.log('[HU10] no id yet');
      return;
    }

    (async () => {
      try {
        console.log('[HU10] loading id:', id);
        setStatus('loading');
        const res = await getOfferById(id);
        if (active) {
          console.log('[HU10] success offer:', res);
          setData(res);
          setStatus('success');
        }
      } catch (e) {
        console.error('[HU10] error cargando oferta', e);
        if (active) setStatus('error');
      }
    })();

    return () => {
      active = false;
    };
  }, [id]);

  return { data, status };
}

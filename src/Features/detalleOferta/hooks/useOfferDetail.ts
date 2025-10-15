import { useEffect, useState } from 'react';
import { getOfferById, type Offer } from '../services/offersService';

type Status = 'idle' | 'loading' | 'error' | 'success';

export function useOfferDetail(id: string | undefined) {
  const [data, setData] = useState<Offer | null>(null);
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    let active = true;
    if (!id) return;

    (async () => {
      try {
        setStatus('loading');
        const res = await getOfferById(id);
        if (active) {
          setData(res);
          setStatus('success');
        }
      } catch {} {
        if (active) setStatus('error');
      }
    })();

    return () => {
      active = false;
    };
  }, [id]);

  return { data, status };
}

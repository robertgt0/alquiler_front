'use client';

import Link from 'next/link';
import { useClientSession } from '@/lib/auth/useSession';

type OffersToolbarProps = {
  filter: 'all' | 'mine';
  onChangeFilter: (value: 'all' | 'mine') => void;
};

export default function OffersToolbar({ filter, onChangeFilter }: OffersToolbarProps) {
  const { user } = useClientSession();
  const isFixer = Boolean(user?.fixerId);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 12, color: '#616E8A', fontWeight: 500 }}>
        <Link href="/fixers" style={{ textDecoration: 'none', color: '#616E8A' }}>
          Encontrar Fixers
        </Link>
        <Link href="/fixers" style={{ textDecoration: 'none', color: '#616E8A' }}>
          Ver fixers por trabajo
        </Link>
        {isFixer && (
          <button
            type="button"
            onClick={() => onChangeFilter(filter === 'mine' ? 'all' : 'mine')}
            style={{
              border: 'none',
              background: 'transparent',
              color: filter === 'mine' ? '#0c4fe9' : '#616E8A',
              fontWeight: filter === 'mine' ? 600 : 500,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            {filter === 'mine' ? 'Ver todas' : 'Mis ofertas'}
          </button>
        )}
        <a href="#" style={{ textDecoration: 'none', color: '#616E8A' }}>
          Ayuda
        </a>
      </nav>

      {isFixer && (
        <Link
          href="/addNewJobOffer"
          style={{
            padding: '10px 16px',
            borderRadius: 12,
            border: '1px solid #2563eb',
            color: '#2563eb',
            fontWeight: 600,
            textDecoration: 'none',
            background: '#ffffff',
          }}
        >
          Add new offer
        </Link>
      )}
    </div>
  );
}

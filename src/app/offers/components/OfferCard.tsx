'use client';

import React from 'react';
import type { Offer } from '../services/offersService';

type Props = {
  offer: Offer;
  onOpen: (offer: Offer) => void;
};

// Utilidad segura: maneja null/undefined y corta a 100 chars
const clamp = (text: string | undefined | null, max = 100) => {
  const t = (text ?? '').trim();
  return t.length > max ? t.slice(0, max - 1) + '…' : t;
};

export default function OfferCard({ offer, onOpen }: Props) {
  const isInactive = offer.status === 'inactive';

  return (
    <div
      role="article"
      aria-label={offer.title}
      className="offer-card"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 12,
        padding: '14px 16px',
        borderRadius: 12,
        border: '1px solid #F0F2F5',
        background: '#fff',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        opacity: isInactive ? 0.7 : 1,
      }}
    >
      <div style={{ display: 'grid', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span aria-hidden="true" style={{ fontSize: 18 }}>🛠️</span>
          <h3
            title={offer.title}
            style={{
              margin: 0,
              color: '#11255a',
              fontWeight: 600,
              fontSize: 16,
              fontFamily: 'Poppins, system-ui, sans-serif',
            }}
          >
            {offer.title}
          </h3>
          {isInactive && (
            <span
              style={{
                marginLeft: 8,
                fontSize: 12,
                padding: '2px 8px',
                borderRadius: 999,
                background: '#DBDEE5',
                color: '#616E8A',
              }}
            >
              Inactiva
            </span>
          )}
        </div>

        <p
          style={{
            margin: 0,
            color: '#2a87ff',
            fontSize: 14,
            lineHeight: 1.35,
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {clamp(offer.description, 100)}
        </p>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', color: '#616E8A' }}>
          <span>
            <strong style={{ color: '#1366fd' }}>Categoría: </strong>
            {offer.category}
          </span>
          {offer.contact?.whatsapp && (
            <span>
              <strong style={{ color: '#1366fd' }}>WhatsApp: </strong>
              {offer.contact.whatsapp}
            </span>
          )}
          {offer.contact?.phone && (
            <span>
              <strong style={{ color: '#1366fd' }}>Teléfono: </strong>
              {offer.contact.phone}
            </span>
          )}
          {offer.contact?.email && (
            <span>
              <strong style={{ color: '#1366fd' }}>Email: </strong>
              {offer.contact.email}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          type="button"
          onClick={() => onOpen(offer)}
          className="btn-outline"
          style={{
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid #DBDEE5',
            background: '#F0F2F5',
            color: '#0c4fe9',
            fontWeight: 600,
          }}
          aria-label={`Ver oferta ${offer.title}`}
        >
          Ver oferta
        </button>
      </div>
    </div>
  );
}

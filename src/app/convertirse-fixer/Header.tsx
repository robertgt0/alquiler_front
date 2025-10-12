'use client';
import React from 'react';

export default function Header() {
  return (
    <header
      style={{
        backgroundColor: '#92b8ffff',
        color: 'white',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
      }}
    >
      {/* Logo o título */}
      <h1 style={{ margin: 0, fontSize: '1.5rem', cursor: 'pointer' }}>
        Servineo
      </h1>

      {/* Enlaces clicables */}
      <nav style={{ display: 'flex', gap: '1.5rem' }}>
        <a href="#" style={{ color: 'white', textDecoration: 'none' }}>
          Ayuda
        </a>
        <a href="#" style={{ color: 'white', textDecoration: 'none' }}>
          Sobre Nosotros
        </a>
        <a href="#" style={{ color: 'white', textDecoration: 'none' }}>
          Contacto
        </a>
      </nav>
    </header>
  );
}

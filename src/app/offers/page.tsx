import OffersList from './components/OffersList';

export default function OffersPage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100dvh', padding: '24px 20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#0c4fe9', display: 'inline-block' }} aria-hidden="true" />
          <strong style={{ color: '#11255a' }}>Servineo</strong>
        </div>
        <nav style={{ display: 'flex', gap: 16, color: '#616E8A' }}>
          <a href="/offers" style={{ textDecoration: 'none', color: '#616E8A' }}>Encontrar Fixers</a>
          <a href="#" style={{ textDecoration: 'none', color: '#616E8A' }}>Fixer</a>
          <a href="#" style={{ textDecoration: 'none', color: '#616E8A' }}>Mis Ofertas</a>
          <a href="#" style={{ textDecoration: 'none', color: '#616E8A' }}>Ayuda</a>
        </nav>
      </header>

      <OffersList />
    </main>
  );
}

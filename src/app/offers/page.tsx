import OffersList from './components/OffersList';

export default function OffersPage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100dvh', padding: '24px 20px' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#0c4fe9', display: 'inline-block' }} aria-hidden="true" />
        <strong style={{ color: '#11255a' }}>Servineo</strong>
      </header>

      <OffersList />
    </main>
  );
}

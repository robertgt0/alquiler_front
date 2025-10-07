'use client'

import dynamic from 'next/dynamic'

const Mapa = dynamic(() => import('./mapa'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <p>Cargando mapa...</p>
    </div>
  )
})

export default function MapaWrapper() {
  return <Mapa />
}
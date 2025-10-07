'use client'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix para los iconos
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

export default function Mapa() {
  const position: [number, number] = [-17.3940, -66.1570]

  return ( 
    <div className="w-full max-w-6xl h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px] mx-auto px-4">
      <MapContainer
        center={position}
        zoom={13}
        className="w-full h-full rounded-lg shadow-lg z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            Una propiedad en alquiler
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

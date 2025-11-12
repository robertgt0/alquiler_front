// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { GoogleMap, Marker, useJsApiLoader, Autocomplete } from '@react-google-maps/api';
// import { Search } from 'lucide-react';

// const containerStyle = {
//   width: '100%',
//   height: '400px',
//   borderRadius: '12px',
//   border: '2px solid #E5E7EB',
// };

// const defaultCenter = { lat: -17.3895, lng: -66.1568 }; // Cochabamba

// export default function AgendarCitaModal({ onClose }: { onClose: () => void }) {
//   const [step, setStep] = useState(1);
//   const [data, setData] = useState({
//     fecha: '',
//     hora: '',
//     direccion: '',
//     latitude: defaultCenter.lat,
//     longitude: defaultCenter.lng,
//     details: '',
//     notas: '',
//   });

//   const [map, setMap] = useState<google.maps.Map | null>(null);
//   const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
//   const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number }>(defaultCenter);

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
//     libraries: ['places'],
//   });

//   const handleChange = (field: string, value: string | number) => {
//     setData((prev) => ({ ...prev, [field]: value }));
//   };

//   const canContinue = data.fecha && data.hora;

//   // ✅ Cuando el usuario selecciona una dirección desde el autocompletado
//   const onPlaceChanged = useCallback(() => {
//     if (!autocomplete) return;
//     const place = autocomplete.getPlace();
//     if (!place.geometry || !place.geometry.location) return;

//     const lat = place.geometry.location.lat();
//     const lng = place.geometry.location.lng();

//     setData((prev) => ({
//       ...prev,
//       direccion: place.formatted_address || place.name || '',
//       latitude: lat,
//       longitude: lng,
//     }));

//     setMarkerPosition({ lat, lng });
//     map?.panTo({ lat, lng });
//     map?.setZoom(15);
//   }, [autocomplete, map]);

//   // ✅ Cuando el usuario hace clic en el mapa
//   const handleMapClick = async (e: google.maps.MapMouseEvent) => {
//     if (!e.latLng) return;
//     const lat = e.latLng.lat();
//     const lng = e.latLng.lng();
//     setMarkerPosition({ lat, lng });

//     // Reverse geocoding para obtener dirección
//     const geocoder = new google.maps.Geocoder();
//     geocoder.geocode({ location: { lat, lng } }, (results, status) => {
//       if (status === 'OK' && results && results[0]) {
//         setData((prev) => ({
//           ...prev,
//           direccion: results[0].formatted_address,
//           latitude: lat,
//           longitude: lng,
//         }));
//       } else {
//         console.error('Error en geocodificación inversa:', status);
//       }
//     });
//   };

//   // ✅ Nueva función: cuando el usuario escribe manualmente una dirección
//   const handleDireccionManual = async (e: React.FocusEvent<HTMLInputElement>) => {
//     const value = e.target.value.trim();
//     if (!value) return;

//     const geocoder = new google.maps.Geocoder();
//     geocoder.geocode({ address: value }, (results, status) => {
//       if (status === 'OK' && results && results[0]) {
//         const loc = results[0].geometry.location;
//         const lat = loc.lat();
//         const lng = loc.lng();
//         setMarkerPosition({ lat, lng });
//         map?.panTo({ lat, lng });
//         setData((prev) => ({
//           ...prev,
//           direccion: results[0].formatted_address,
//           latitude: lat,
//           longitude: lng,
//         }));
//       } else {
//         console.error('No se encontró la dirección:', status);
//       }
//     });
//   };

//   if (!isLoaded) return <p className="text-center py-10">Cargando mapa...</p>;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
//       <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-3xl min-h-[70vh] max-h-[90vh] overflow-y-auto">
//         {/* HEADER */}
//         <div className="flex justify-between items-center mb-6 border-b pb-3">
//           <h2 className="text-2xl font-semibold text-gray-800">Agendar Cita</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 text-3xl font-bold leading-none"
//           >
//             ×
//           </button>
//         </div>

//         {/* PASO 1 */}
//         {step === 1 && (
//           <section>
//             <p className="text-gray-600 mb-6">
//               Elige la fecha y hora para tu consultoría (duración: 30 minutos)
//             </p>
//             <div className="grid grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-gray-700 font-medium mb-2">Fecha</label>
//                 <input
//                   type="date"
//                   value={data.fecha}
//                   onChange={(e) => handleChange('fecha', e.target.value)}
//                   className="border border-gray-300 rounded-lg p-3 w-full"
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-700 font-medium mb-2">Hora</label>
//                 <input
//                   type="time"
//                   value={data.hora}
//                   onChange={(e) => handleChange('hora', e.target.value)}
//                   className="border border-gray-300 rounded-lg p-3 w-full"
//                 />
//               </div>
//             </div>
//             {canContinue && (
//               <div className="mt-6 flex justify-end">
//                 <button
//                   onClick={() => setStep(2)}
//                   className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 >
//                   Continuar
//                 </button>
//               </div>
//             )}
//           </section>
//         )}

//         {/* PASO 2 */}
//         {step === 2 && (
//           <section className="space-y-6">
//             <div>
//               <label className="block text-sm font-semibold text-gray-800 mb-2">
//                 📍 Dirección del Servicio
//               </label>
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
//                 <Autocomplete onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged}>
//                   <input
//                     type="text"
//                     placeholder="Escribe o busca tu dirección..."
//                     value={data.direccion}
//                     onChange={(e) => handleChange('direccion', e.target.value)}
//                     onBlur={handleDireccionManual}
//                     className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400"
//                   />
//                 </Autocomplete>
//               </div>
//               <p className="text-sm text-gray-500 mt-1">
//                 ✏️ Puedes escribir la dirección manualmente o seleccionarla del autocompletado.
//               </p>
//             </div>

//             {/* MAPA */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-800 mb-2">
//                 🗺️ Selecciona la ubicación en el mapa
//               </label>
//               <GoogleMap
//                 mapContainerStyle={containerStyle}
//                 center={markerPosition}
//                 zoom={13}
//                 onLoad={setMap}
//                 onClick={handleMapClick}
//               >
//                 <Marker position={markerPosition} />
//               </GoogleMap>
//               <p className="text-sm text-gray-500 mt-2">
//                 💡 Haz clic en el mapa para ajustar la ubicación exacta.
//               </p>
//             </div>

//             {/* Detalles */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-800 mb-2">
//                 🏠 Detalles de ubicación
//               </label>
//               <textarea
//                 value={data.details}
//                 onChange={(e) => handleChange('details', e.target.value)}
//                 rows={3}
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400"
//                 placeholder="Ej: Edificio azul, piso 3, apartamento B"
//               />
//             </div>

//             {/* Notas */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-800 mb-2">
//                 📝 Notas adicionales
//               </label>
//               <textarea
//                 value={data.notas}
//                 onChange={(e) => handleChange('notas', e.target.value)}
//                 rows={3}
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400"
//                 placeholder="Instrucciones especiales..."
//               />
//             </div>

//             <div className="flex justify-between border-t pt-4">
//               <button
//                 onClick={() => setStep(1)}
//                 className="text-gray-600 hover:text-blue-600 font-medium"
//               >
//                 Volver
//               </button>
//               <button
//                 onClick={() => setStep(3)}
//                 className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//               >
//                 Continuar
//               </button>
//             </div>
//           </section>
//         )}

//         {/* PASO 3 */}
//         {step === 3 && (
//           <section className="mt-8 border-t border-gray-200 pt-6">
//             <h2 className="text-xl font-semibold mb-4">Resumen de la cita</h2>
//             <ul className="space-y-2 text-gray-700">
//               <li>📅 Fecha: {data.fecha}</li>
//               <li>⏰ Hora: {data.hora}</li>
//               <li>📍 Dirección: {data.direccion}</li>
//               <li>🏠 Detalles: {data.details || 'N/A'}</li>
//               <li>📝 Notas: {data.notas || 'N/A'}</li>
//             </ul>

//             <div className="flex justify-between border-t mt-4 pt-4">
//               <button
//                 onClick={() => setStep(2)}
//                 className="text-gray-600 hover:text-blue-600 font-medium"
//               >
//                 Volver
//               </button>
//               <button
//                 onClick={() => alert('✅ Cita confirmada')}
//                 className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//               >
//                 Confirmar Cita
//               </button>
//             </div>
//           </section>
//         )}
//       </div>
//     </div>
//   );
// }

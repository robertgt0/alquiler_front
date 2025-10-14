'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from "leaflet";
import Modal from "react-modal";
import { UsuarioDocument } from "@/app/registro/interfaces/types";
import { crearUsuario } from "@/app/teamsys/services/UserService";
// Leaflet icon fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Location {
  lat: number;
  lng: number;
}

interface SelectableMapProps {
  ubicacion: Location | null;
  setUbicacion: (loc: Location) => void;
  zoom?: number;
  height?: string;
  width?: string;
}

const SelectableMap: React.FC<SelectableMapProps> = ({ ubicacion, setUbicacion, zoom = 15, height = "200px", width = "200px" }) => {
  const ClickHandler = () => {
    useMapEvents({
      click(e) {
        setUbicacion({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={ubicacion || { lat: -17.3939, lng: -66.1568 }}
      zoom={zoom}
      style={{ width, height, borderRadius: "0.5rem" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ClickHandler />
      {ubicacion && (
        <>
          <Marker position={ubicacion} />
          <Circle center={ubicacion} radius={1000} pathOptions={{ color: 'blue', fillOpacity: 0.2 }} />
        </>
      )}
    </MapContainer>
  );
};

export default function RegistroImagen() {
  const searchParams = useSearchParams();
  const [datosFormulario, setDatosFormulario] = useState<any>(null); // datos del formulario anterior
  const [file, setFile] = useState<File | null>(null);
  const [ubicacion, setUbicacion] = useState<Location | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");

  const maxSize = 2 * 1024 * 1024;
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  // Recuperar datosFormulario desde query string
  useEffect(() => {
  const datos = searchParams.get('datos');
  if (datos) {
    try {
      const decoded = decodeURIComponent(datos);
      const parsed = JSON.parse(decoded);
      console.log("Datos parseados desde URL:", parsed);
      setDatosFormulario(parsed);
    } catch (err) {
      console.error(" Error al parsear datosFormulario:", err);
    }
  }
}, [searchParams]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!allowedTypes.includes(selected.type)) {
      setError("Formato no permitido. Usa JPG o PNG.");
      setFile(null);
      return;
    }
    if (selected.size > maxSize) {
      setError("Archivo demasiado grande. Máx 2MB.");
      setFile(null);
      return;
    }
    setError("");
    setFile(selected);
  };

  const handleContinuar = async () => {
    if (!file) {
      setError("Selecciona una imagen antes de continuar.");
      return;
    }
    if (!accepted) {
      setError("Debes aceptar los términos y condiciones.");
      return;
    }
    if (!ubicacion) {
      setError("Selecciona tu ubicación en el mapa.");
      return;
    }

    // Aquí tienes todos los datos juntos
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const usuario: UsuarioDocument = {
  nombre: datosFormulario?.nombre || "",
  apellido: datosFormulario?.apellido || "",
  telefono: datosFormulario?.telefono || "",
  correoElectronico: datosFormulario?.email || "", // 👈 CAMBIO
  password: datosFormulario?.["contraseña"] || "", // 👈 CAMBIO
  fotoPerfil: buffer,
  ubicacion: {
    type: "Point",
    coordinates: [ubicacion.lng, ubicacion.lat],
  },
  terminosYCondiciones: accepted,
  createdAt: new Date(),
  updatedAt: new Date(),
};


    console.log("Datos completos a enviar:", usuario);
    crearUsuario(usuario)
      .then((response) => {
        console.log("Usuario creado exitosamente:", response);
      })
      .catch((error) => {
        console.error("Error al crear usuario:", error);
      });

    // Llama aquí a tu función para enviar al backend o API
    // sendToAPI(datosCompletos);
    alert("Formulario listo para enviar. Revisa la consola.");
  };

  return (
    <form className="flex flex-col gap-4 items-center border p-6 rounded shadow-md w-full max-w-md bg-white mx-auto">
      <h2 className="text-xl font-bold text-center">Subir Imagen</h2>

      <div className="flex gap-4 items-start">
        {/* Foto */}
        <div className="w-32 h-32 border rounded overflow-hidden">
          {file ? (
            <img src={URL.createObjectURL(file)} alt="preview" className="w-32 h-32 object-cover" />
          ) : (
            <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="persona ejemplo" className="w-32 h-32 object-contain" />
          )}
        </div>

        {/* Mini mapa emergente */}
        <div onClick={() => setModalOpen(true)} className="cursor-pointer border w-32 h-32 rounded overflow-hidden relative">
          <SelectableMap ubicacion={ubicacion} setUbicacion={setUbicacion} zoom={15} height="128px" width="128px" />
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center text-white font-bold">
            📍
          </div>
        </div>
      </div>

      {/* Modal mapa grande */}
      <Modal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)} className="mx-auto mt-20 bg-white rounded shadow-lg p-4 max-w-lg" overlayClassName="fixed inset-0 bg-black bg-opacity-50">
        <h3 className="text-center mb-2 font-bold">Selecciona tu ubicación</h3>
        <SelectableMap ubicacion={ubicacion} setUbicacion={setUbicacion} zoom={15} height="400px" width="100%" />
        <button onClick={() => setModalOpen(false)} className="mt-4 bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 mx-auto block">
          Confirmar
        </button>
      </Modal>

      {/* Archivo */}
      <input type="file" accept=".jpg,.jpeg,.png" onChange={handleFileChange} id="fileInput" className="hidden" />
      <label htmlFor="fileInput" className="bg-blue-600 text-white py-1 px-4 rounded cursor-pointer hover:bg-blue-700">
        Insertar Foto
      </label>

      {/* Checkbox */}
      <div className="flex items-start space-x-2 w-full">
        <input type="checkbox" checked={accepted} onChange={() => setAccepted(!accepted)} className="mt-1" />
        <span className="text-sm text-gray-700">
          Acepto los <Link href="/terminos" className="text-blue-600 underline">Términos y Condiciones</Link> y la <Link href="/privacidad" className="text-blue-600 underline">Política de Privacidad</Link>.
        </span>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button type="button" onClick={handleContinuar} className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 w-full">
        Continuar
      </button>
    </form>
  );
}

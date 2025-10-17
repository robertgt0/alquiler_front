'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import 'leaflet/dist/leaflet.css';
import Modal from "react-modal";
import { UsuarioDocument } from "@/app/registro/interfaces/types";
import { crearUsuario } from "@/app/teamsys/services/UserService";

// 👇 Importa react-leaflet solo en cliente
const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer     = dynamic(() => import("react-leaflet").then(m => m.TileLayer),     { ssr: false });
const Marker        = dynamic(() => import("react-leaflet").then(m => m.Marker),        { ssr: false });
const Circle        = dynamic(() => import("react-leaflet").then(m => m.Circle),        { ssr: false });

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
  // Cargamos useMapEvents solo en cliente
  const ClickHandler = ({ onPick }: { onPick: (lat: number, lng: number) => void }) => {
    const { useMapEvents } = require("react-leaflet");
    useMapEvents({
      click(e: any) {
        onPick(e.latlng.lat, e.latlng.lng);
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
      <ClickHandler onPick={(lat, lng) => setUbicacion({ lat, lng })} />
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
  const router = useRouter();
  const [datosFormulario, setDatosFormulario] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [ubicacion, setUbicacion] = useState<Location | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null); // URL (Google o blob)
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  const [ready, setReady] = useState(false);

  // Setup de Modal y Leaflet SOLO en cliente
  useEffect(() => {
    Modal.setAppElement('body');
    (async () => {
      const L = await import('leaflet');
      // @ts-ignore
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      setReady(true);
    })();
  }, []);

  const isHttpUrl = (v: any) =>
    typeof v === "string" && /^https?:\/\//i.test(v);

  const maxSize = 2 * 1024 * 1024;
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  // 🧠 Recuperar datos del sessionStorage (Google o formulario manual)
  useEffect(() => {
    const datosGuardados = sessionStorage.getItem("datosUsuarioParcial");
    if (!datosGuardados) {
      console.warn("⚠️ No hay datos en sessionStorage.");
      return;
    }

    try {
      const datos = JSON.parse(datosGuardados);
      console.log("🔍 Datos en sessionStorage:", datos);

      let datosAdaptados: any = {};

      // ✅ Caso 1: formulario tradicional
      if (datos.contraseña && datos.email) {
        datosAdaptados = {
          nombre: datos.nombre,
          apellido: datos.apellido,
          telefono: datos.telefono,
          correo: datos.email,
          password: datos.contraseña,
          terminosYCondiciones: datos.terminosYCondiciones,
        };
      }
      // ✅ Caso 2: viene de Google
      else if (datos.correo) {
        datosAdaptados = {
          nombre: datos.nombre,
          correo: datos.correo,
          fotoPerfil: datos.fotoPerfil,
          terminosYCondiciones: false,
        };
      }

      setDatosFormulario(datosAdaptados);
      console.log("✅ Datos adaptados para envío:", datosAdaptados);

      // 🖼️ Si hay una foto de Google, mostrarla
      if (isHttpUrl(datos.fotoPerfil)) {
        setPreviewImage(datos.fotoPerfil);
      }

    } catch (err) {
      console.error("❌ Error al parsear sessionStorage:", err);
    }
  }, []);

  // 📸 Manejar imagen
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!allowedTypes.includes(selected.type)) {
      setError("Formato no permitido. Usa JPG o PNG.");
      setFile(null);
      setFilePreview(null);
      return;
    }
    if (selected.size > maxSize) {
      setError("Archivo demasiado grande. Máx 2MB.");
      setFile(null);
      setFilePreview(null);
      return;
    }

    setError("");
    setFile(selected);

    // crea una URL local para previsualizar el file
    const url = URL.createObjectURL(selected);
    setFilePreview(url);
  };

  // Limpia la objectURL cuando cambie el archivo o se desmonte
  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  const handleContinuar = async () => {
  if (!accepted) return setError("Debes aceptar los términos y condiciones.");
  if (!ubicacion) return setError("Selecciona tu ubicación en el mapa.");

  try {
    const CLOUD_NAME = 'ddjrzszrw';
    const UPLOAD_PRESET = 'servineo_unsigned';

    async function uploadToCloudinary(fileOrUrl: File | string): Promise<string> {
      const fd = new FormData();
      fd.append('file', fileOrUrl);
      fd.append('upload_preset', UPLOAD_PRESET);

      const resp = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: fd
      });

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        const msg = (data?.error?.message) || resp.statusText;
        throw new Error(`Cloudinary ${resp.status}: ${msg}`);
      }
      if (!data?.secure_url) throw new Error('Cloudinary no devolvió secure_url');
      return String(data.secure_url);
    }

    // 1) Resolver fotoPerfil a URL (NUNCA binario)
    let fotoUrl: string | undefined;
    if (file instanceof File) {
      fotoUrl = await uploadToCloudinary(file);
    } else if (isHttpUrl(previewImage)) {
      fotoUrl = String(previewImage);
    } else {
      setError('Selecciona una imagen o usa tu foto de Google.');
      return;
    }

    // 2) Payload alineado con el back
    const payload: any = {
      nombre: (datosFormulario?.nombre ?? "").trim(),
      correo: (datosFormulario?.correoElectronico ?? datosFormulario?.correo ?? "").trim(),
      terminosYCondiciones: !!accepted,
      fotoPerfil: fotoUrl,
      ubicacion: {
        type: "Point",
        coordinates: [Number(ubicacion.lng), Number(ubicacion.lat)],
      },
      // ⬇️ agrega estos si tu schema los marca required
      authProvider: 'local',
      rol: 'requester',

      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (typeof payload.fotoPerfil !== 'string' || !/^https?:\/\//.test(payload.fotoPerfil)) {
    setError('fotoPerfil debe ser una URL pública. Vuelve a seleccionar/subir la imagen.');
    console.warn('fotoPerfil inválido en payload:', payload.fotoPerfil);
    return;
  }

    if (datosFormulario?.apellido) payload.apellido = datosFormulario.apellido;
    if (datosFormulario?.telefono) payload.telefono = datosFormulario.telefono;
    if (datosFormulario?.password) payload.password = datosFormulario.password;
    console.log(payload)
    console.log("📤 Usuario listo para crear (payload final):", payload);

    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';
    const resp = await fetch(`${baseUrl}/api/teamsys/usuario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    // 3) Mostrar motivos exactos del 400
    const text = await resp.text();
    let body: any = null;
    try { body = text ? JSON.parse(text) : null; } catch { /* deja text tal cual */ }

    if (!resp.ok) {
      const detalle = body?.error || body?.message || text || `HTTP ${resp.status}`;
      console.error(' Respuesta del servidor:', body ?? text);
      throw new Error(detalle);
    }

    alert("Usuario registrado exitosamente 🎉");
    sessionStorage.removeItem("datosUsuarioParcial");
    router.push("/");
  } catch (err: any) {
    console.error(" Error al crear usuario:", err);
    setError(err?.message || "Hubo un error al registrar el usuario.");
  }
};



  // Evita renderizar mapa/modal hasta que Leaflet esté listo en cliente
  if (!ready) return null;

  // 🧩 Render
  return (
    <form className="flex flex-col gap-4 items-center border p-6 rounded shadow-md w-full max-w-md bg-white mx-auto">
      <h2 className="text-xl font-bold text-center">Subir Imagen y añadir una Ubicación</h2>

      <div className="flex gap-4 items-start">
        <div className="w-32 h-32 border rounded overflow-hidden">
          <img
            src={filePreview ?? previewImage ?? DEFAULT_AVATAR}
            alt="preview"
            className="w-32 h-32 object-cover"
          />
        </div>

        {/* Mapa mini */}
        <div onClick={() => setModalOpen(true)} className="cursor-pointer border w-32 h-32 rounded overflow-hidden relative">
          <SelectableMap ubicacion={ubicacion} setUbicacion={setUbicacion} height="128px" width="128px" />
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center text-white font-bold">
            📍
          </div>
        </div>
      </div>

      {/* Modal mapa grande */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="mx-auto mt-20 bg-white rounded shadow-lg p-4 max-w-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <h3 className="text-center mb-2 font-bold">Selecciona tu ubicación</h3>
        <SelectableMap ubicacion={ubicacion} setUbicacion={setUbicacion} zoom={15} height="400px" width="100%" />
        <button onClick={() => setModalOpen(false)} className="mt-4 bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 mx-auto block">
          Confirmar
        </button>
      </Modal>

      {/* Subir archivo */}
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

      <button
        type="button"
        onClick={handleContinuar}
        className="bg-blue-600 text-white py-2 px-6 rounded-xl hover:bg-red-600 w-full"
      >
        Terminar Registro
      </button>
    </form>
  );
}

'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import 'leaflet/dist/leaflet.css';
import Modal from "react-modal";

// ⚠️ Importar react-leaflet sólo en cliente (evita problemas de SSR)
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

// Mapa clickeable (carga useMapEvents en cliente)
const SelectableMap: React.FC<SelectableMapProps> = ({ ubicacion, setUbicacion, zoom = 15, height = "200px", width = "200px" }) => {
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
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const isHttpUrl = (v: any) => typeof v === "string" && /^https?:\/\//i.test(v);

  // Límites y tipos (de la variante funcional)
  const maxSize = 2 * 1024 * 1024; // 2 MB
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  // Setup Modal + Leaflet icons sólo en cliente
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

  // Recuperar datos del sessionStorage (Google o formulario manual)
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

      // Caso 1: formulario tradicional
      if (datos.contraseña && datos.email) {
        datosAdaptados = {
          nombre: datos.nombre ?? "",
          apellido: datos.apellido ?? "",
          telefono: datos.telefono ?? "",
          correo: datos.email ?? "", // normalizamos a 'correo'
          password: datos.contraseña ?? "",
          terminosYCondiciones: !!datos.terminosYCondiciones,
        };
      }
      // Caso 2: viene de Google
      else if (datos.correo || datos.correoElectronico) {
        const correoGoogle = datos.correo ?? datos.correoElectronico;
        datosAdaptados = {
          nombre: datos.nombre ?? "",
          correo: correoGoogle ?? "",
          fotoPerfil: datos.fotoPerfil,
          terminosYCondiciones: false,
        };
      }

      setDatosFormulario(datosAdaptados);
      console.log("✅ Datos adaptados para envío:", datosAdaptados);

      // Si hay una foto de Google, mostrarla
      if (isHttpUrl(datos.fotoPerfil)) {
        setPreviewImage(datos.fotoPerfil);
      }
    } catch (err) {
      console.error("❌ Error al parsear sessionStorage:", err);
    }
  }, []);

  // Manejar imagen local (preview + validación)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!allowedTypes.includes(selected.type)) {
      setError("Formato no permitido. Usa JPG o PNG.");
      setFile(null);
      if (filePreview) URL.revokeObjectURL(filePreview);
      setFilePreview(null);
      return;
    }
    if (selected.size > maxSize) {
      setError("Archivo demasiado grande. Máx 2MB.");
      setFile(null);
      if (filePreview) URL.revokeObjectURL(filePreview);
      setFilePreview(null);
      return;
    }

    if (filePreview) URL.revokeObjectURL(filePreview);
    setFile(selected);

    const url = URL.createObjectURL(selected);
    setFilePreview(url);
  };

  // Limpieza de objectURL al desmontar/cambiar
  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  // Subida a Cloudinary (unsigned) y registro en backend
  const handleContinuar = async () => {
    if (!accepted) return setError("Debes aceptar los términos y condiciones.");
    if (!ubicacion) return setError("Selecciona tu ubicación en el mapa.");

    // correo requerido
    if (!datosFormulario?.correo || !String(datosFormulario.correo).trim()) {
      return setError("Falta el correo electrónico.");
    }

    setLoading(true);
    setError("");

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

      // Resolver fotoPerfil a URL (no binario)
      let fotoUrl: string | undefined;
      if (file instanceof File) {
        // validaciones extra por si acaso
        if (!allowedTypes.includes(file.type)) throw new Error('Formato no permitido');
        if (file.size > maxSize) throw new Error('Archivo demasiado grande');
        fotoUrl = await uploadToCloudinary(file);
      } else if (isHttpUrl(previewImage)) {
        fotoUrl = String(previewImage);
      } else {
        setError('Selecciona una imagen o usa tu foto de Google.');
        return;
      }

      const payload: any = {
        nombre: (datosFormulario?.nombre ?? "").trim(),
        correo: (datosFormulario?.correo ?? "").trim(),
        terminosYCondiciones: !!accepted,
        fotoPerfil: fotoUrl,
        ubicacion: {
          type: "Point",
          coordinates: [Number(ubicacion.lng), Number(ubicacion.lat)],
        },
        authProvider: 'local',
        rol: 'requester',
      };

      if (typeof payload.fotoPerfil !== 'string' || !/^https?:\/\//.test(payload.fotoPerfil)) {
        setError('fotoPerfil debe ser una URL pública. Vuelve a seleccionar/subir la imagen.');
        return;
      }

      if (datosFormulario?.apellido) payload.apellido = datosFormulario.apellido;
      if (datosFormulario?.telefono) payload.telefono = datosFormulario.telefono;
      if (datosFormulario?.password) payload.password = datosFormulario.password;

      console.log("📤 Usuario listo para crear (payload final):", payload);

      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';
      const resp = await fetch(`${baseUrl}/api/teamsys/usuario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const text = await resp.text();
      let body: any = null;
      try { body = text ? JSON.parse(text) : null; } catch {}

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
    } finally {
      setLoading(false);
    }
  };

  // Evitar render del mapa/modal hasta que Leaflet esté listo
  if (!ready) return null;

  // 📐 UI: Mantiene el layout visual del segundo componente
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-600">
      <form className="flex flex-col gap-4 items-center border p-6 rounded-xl shadow-md w-11/12 sm:w-full max-w-md bg-white">
        <h2 className="text-lg sm:text-xl font-bold text-center">
          Subir Imagen y añadir una Ubicación
        </h2>

        {/* Imagen + Mapa responsivo */}
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start w-full">
          {/* Bloque: Foto */}
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 sm:w-32 sm:h-32 border rounded overflow-hidden">
              <img
                src={filePreview ?? previewImage ?? DEFAULT_AVATAR}
                alt="preview"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Botón debajo de la imagen */}
            <label
              htmlFor="fileInput"
              className="mt-3 inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-gray-300 bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 cursor-pointer w-full sm:w-auto"
            >
              Insertar Foto de perfil
            </label>

            {/* input de archivo (único) */}
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
              id="fileInput"
              className="hidden"
            />
          </div>

          {/* Bloque: Mapa */}
          <div className="flex flex-col items-center">
            <div
              onClick={() => setModalOpen(true)}
              className="cursor-pointer border rounded overflow-hidden relative w-28 h-28 sm:w-32 sm:h-32"
            >
              <SelectableMap
                ubicacion={ubicacion}
                setUbicacion={setUbicacion}
                height="100%"
                width="100%"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center text-white font-bold">
                📍
              </div>
            </div>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="mt-3 inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-gray-300 bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 w-full sm:w-auto"
            >
              Insertar tu ubicación
            </button>
          </div>
        </div>

        {/* Modal mapa grande */}
        <Modal
          isOpen={modalOpen}
          onRequestClose={() => setModalOpen(false)}
          className="mx-auto mt-10 bg-white rounded shadow-lg p-4 w-[90vw] max-w-lg"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <h3 className="text-center mb-2 font-bold">Selecciona tu ubicación</h3>
          <SelectableMap
            ubicacion={ubicacion}
            setUbicacion={setUbicacion}
            zoom={15}
            height="400px"
            width="100%"
          />
          <button
            onClick={() => setModalOpen(false)}
            className="mt-4 bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 mx-auto block"
          >
            Confirmar
          </button>
        </Modal>

        {/* Checkbox */}
        <div className="flex items-start space-x-2 w-full">
          <input
            type="checkbox"
            checked={accepted}
            onChange={() => setAccepted(!accepted)}
            className="mt-1"
          />
          <span className="text-sm text-gray-700">
            Acepto los{" "}
            <Link href="/terminos" className="text-blue-600 underline">
              Términos y Condiciones
            </Link>{" "}
            y la{" "}
            <Link href="/privacidad" className="text-blue-600 underline">
              Política de Privacidad
            </Link>
            .
          </span>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="button"
          onClick={handleContinuar}
          disabled={loading}
          className={`bg-blue-600 text-white py-2 px-6 rounded-xl w-full ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-red-600'}`}
        >
          {loading ? 'Registrando…' : 'Terminar Registro'}
        </button>
      </form>
    </div>
  );
}

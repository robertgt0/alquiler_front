// components/ImageUploader.tsx
"use client";
import { FC, useState } from "react";
import Image from "next/image";

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  currentImage?: string;
  fixerName: string;
}

const ImageUploader: FC<ImageUploaderProps> = ({ 
  onImageUpload, 
  currentImage, 
  fixerName 
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>(currentImage || "");
  const backupImage = "/imagenes_respaldo/perfil-default.jpg";

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecciona un archivo de imagen válido');
        return;
      }

      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen debe ser menor a 5MB');
        return;
      }

      onImageUpload(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageError = () => {
    setPreviewUrl(backupImage);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-blue-300">
        <Image
          src={previewUrl || backupImage}
          alt={`Perfil de ${fixerName}`}
          fill
          className="object-cover"
          onError={handleImageError}
          sizes="96px"
        />
      </div>
      
      <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors">
        📸 Cambiar imagen
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </label>
      
      <p className="text-xs text-gray-500 text-center">
        Formatos: JPG, PNG, WEBP<br />
        Máx: 5MB
      </p>
    </div>
  );
};

export default ImageUploader;
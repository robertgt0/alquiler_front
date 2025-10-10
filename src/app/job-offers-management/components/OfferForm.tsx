'use client';

import React, { useState } from 'react';
import styles from './OfferForm.module.css';

interface OfferFormData {
  title: string;
  description: string;
  category: string;
  price: number | '';
  location: string;
  city: string;
  images: File[];
}

interface OfferFormProps {
  onSubmit: (data: OfferFormData) => Promise<void>;
  isLoading?: boolean;
}

export const OfferForm: React.FC<OfferFormProps> = ({ 
  onSubmit, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState<OfferFormData>({
    title: '',
    description: '',
    category: 'otro',
    price: '',
    location: '',
    city: '',
    images: [],
  });

  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const categories = [
    { value: 'limpieza', label: '🧹 Limpieza' },
    { value: 'reparacion', label: '🔧 Reparación' },
    { value: 'transporte', label: '🚗 Transporte' },
    { value: 'cuidado', label: '❤️ Cuidado' },
    { value: 'educacion', label: '📚 Educación' },
    { value: 'otro', label: '📌 Otro' },
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    } else if (formData.title.length < 5) {
      newErrors.title = 'El título debe tener al menos 5 caracteres';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    } else if (formData.description.length < 20) {
      newErrors.description = 'La descripción debe tener al menos 20 caracteres';
    }

    if (!formData.category) {
      newErrors.category = 'Selecciona una categoría';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'La dirección es requerida';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'La ciudad es requerida';
    }

    if (formData.images.length === 0) {
      newErrors.images = 'Debes subir al menos una imagen';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? (value === '' ? '' : Number(value)) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files);
    const maxImages = 5;

    if (newImages.length + formData.images.length > maxImages) {
      setErrors((prev) => ({
        ...prev,
        images: `Máximo ${maxImages} imágenes permitidas`,
      }));
      return;
    }

    const validImages = newImages.filter((file) =>
      file.type.startsWith('image/')
    );

    if (validImages.length !== newImages.length) {
      setErrors((prev) => ({
        ...prev,
        images: 'Solo se permiten archivos de imagen',
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...validImages],
    }));

    validImages.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview((prev) => [...prev, event.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      setSubmitSuccess(true);
      setFormData({
        title: '',
        description: '',
        category: 'otro',
        price: '',
        location: '',
        city: '',
        images: [],
      });
      setImagePreview([]);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Error al crear oferta',
      });
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Crear Nueva Oferta</h2>

      {submitSuccess && (
        <div className={styles.successMessage}>
          ✓ Oferta creada exitosamente
        </div>
      )}

      {errors.submit && (
        <div className={styles.errorMessage}>
          ✕ {errors.submit}
        </div>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>
          Título de la Oferta *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Ej: Limpieza de casa profesional"
          className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
        />
        {errors.title && (
          <span className={styles.errorText}>{errors.title}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>
          Descripción *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Describe los detalles de tu oferta..."
          rows={5}
          className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
        />
        <span className={styles.charCount}>
          {formData.description.length}/500
        </span>
        {errors.description && (
          <span className={styles.errorText}>{errors.description}</span>
        )}
      </div>

      <div className={styles.twoColumns}>
        <div className={styles.formGroup}>
          <label htmlFor="category" className={styles.label}>
            Categoría *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className={`${styles.select} ${errors.category ? styles.inputError : ''}`}
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className={styles.errorText}>{errors.category}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="price" className={styles.label}>
            Precio (BOB) *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="150"
            min="0"
            step="0.01"
            className={`${styles.input} ${errors.price ? styles.inputError : ''}`}
          />
          {errors.price && (
            <span className={styles.errorText}>{errors.price}</span>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="location" className={styles.label}>
          Dirección *
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          placeholder="Ej: Calle Principal 123"
          className={`${styles.input} ${errors.location ? styles.inputError : ''}`}
        />
        {errors.location && (
          <span className={styles.errorText}>{errors.location}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="city" className={styles.label}>
          Ciudad *
        </label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          placeholder="Ej: Cochabamba"
          className={`${styles.input} ${errors.city ? styles.inputError : ''}`}
        />
        {errors.city && (
          <span className={styles.errorText}>{errors.city}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="images" className={styles.label}>
          Imágenes de tu Oferta * (Máximo 5)
        </label>
        <div className={styles.imageUploadArea}>
          <input
            type="file"
            id="images"
            name="images"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className={styles.fileInput}
          />
          <label htmlFor="images" className={styles.uploadLabel}>
            <div className={styles.uploadIcon}>📷</div>
            <p>Haz clic para subir o arrastra imágenes aquí</p>
            <p className={styles.uploadHint}>PNG, JPG, GIF hasta 5MB</p>
          </label>
        </div>

        {errors.images && (
          <span className={styles.errorText}>{errors.images}</span>
        )}

        {imagePreview.length > 0 && (
          <div className={styles.imageGrid}>
            {imagePreview.map((preview, index) => (
              <div key={index} className={styles.imagePreviewItem}>
                <img src={preview} alt={`Preview ${index + 1}`} />
                <button
                  type="button"
                  className={styles.removeImageBtn}
                  onClick={() => handleRemoveImage(index)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.formActions}>
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isLoading}
        >
          {isLoading ? '⏳ Creando oferta...' : '✓ Crear Oferta'}
        </button>
        <button
          type="reset"
          className={styles.resetBtn}
          onClick={() => {
            setImagePreview([]);
            setErrors({});
          }}
        >
          Limpiar
        </button>
      </div>
    </form>
  );
};
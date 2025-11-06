# API Documentation - Fixer Jobs with Custom Descriptions

## Descripción General

Esta documentación describe los endpoints implementados para permitir que los fixers agreguen descripciones personalizadas a sus trabajos/habilidades.

**Fecha de implementación:** Noviembre 2025  
**Sprint:** Sprint 2  
**Historia de Usuario:** HU03 - Custom Job Description by Fixer  
**Implementado por:** Nicolás Zapata (Backend) y Daniel Iriarte (Frontend)

---

## Endpoints Disponibles

### 1. GET /api/fixers/:fixerId/jobs

Obtiene todos los trabajos de un fixer con sus descripciones personalizadas.

**Parámetros de URL:**
- `fixerId` (string): ID del fixer

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "jobId": "cat_123",
      "jobName": "Electricista",
      "generalDescription": "Instalación y reparación de sistemas eléctricos",
      "customDescription": "Especializado en instalaciones industriales con 10 años de experiencia"
    }
  ]
}
```

**Ejemplo de uso (Frontend):**
```typescript
import { getFixerJobs } from '@/lib/api/fixer';

const response = await getFixerJobs(fixerId);
const jobs = response.data;
```

---

### 2. GET /api/fixers/:fixerId/jobs/:jobId

Obtiene la descripción de un trabajo específico de un fixer.

**Parámetros de URL:**
- `fixerId` (string): ID del fixer
- `jobId` (string): ID del trabajo/categoría

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "jobId": "cat_123",
    "jobName": "Electricista",
    "generalDescription": "Instalación y reparación de sistemas eléctricos",
    "customDescription": "Especializado en instalaciones industriales"
  }
}
```

**Ejemplo de uso (Frontend):**
```typescript
import { getFixerJobDescription } from '@/lib/api/fixer';

const response = await getFixerJobDescription(fixerId, jobId);
const description = response.data.customDescription || response.data.generalDescription;
```

---

### 3. PUT /api/fixers/:fixerId/jobs

Actualiza la lista completa de trabajos del fixer (reemplaza todos).

**Parámetros de URL:**
- `fixerId` (string): ID del fixer

**Body:**
```json
{
  "jobs": [
    {
      "jobId": "cat_123",
      "customDescription": "Mi descripción personalizada para este trabajo"
    },
    {
      "jobId": "cat_456",
      "customDescription": "Otra descripción personalizada"
    }
  ]
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    // FixerDTO completo actualizado
    "id": "fixer_123",
    "userId": "user_456",
    "fixerJobs": [
      {
        "jobId": "cat_123",
        "customDescription": "Mi descripción personalizada"
      }
    ],
    // ... otros campos
  }
}
```

**Ejemplo de uso (Frontend):**
```typescript
import { updateFixerJobs } from '@/lib/api/fixer';

const jobs = [
  { jobId: 'cat_123', customDescription: 'Especializado en...' },
  { jobId: 'cat_456', customDescription: 'Experto en...' }
];

await updateFixerJobs(fixerId, jobs);
```

---

### 4. POST /api/fixers/:fixerId/jobs

Agrega un nuevo trabajo a la lista del fixer.

**Parámetros de URL:**
- `fixerId` (string): ID del fixer

**Body:**
```json
{
  "jobId": "cat_123",
  "jobName": "Electricista",
  "generalDescription": "Descripción general del trabajo",
  "customDescription": "Mi experiencia específica en este trabajo"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    // FixerDTO completo actualizado
  }
}
```

**Ejemplo de uso (Frontend):**
```typescript
import { addFixerJob } from '@/lib/api/fixer';

await addFixerJob(fixerId, {
  jobId: 'cat_123',
  jobName: 'Electricista',
  customDescription: 'Especializado en instalaciones industriales'
});
```

---

## Modelo de Datos

### FixerDTO (Actualizado)
```typescript
export type FixerDTO = {
  id: string;
  userId: string;
  ci?: string;
  location?: { lat: number; lng: number; address?: string };
  categories?: string[];           // Retrocompatibilidad (deprecated)
  fixerJobs?: Array<{              // NUEVO: Trabajos con descripciones
    jobId: string;
    customDescription?: string;
  }>;
  paymentMethods?: ("card" | "qr" | "cash")[];
  paymentAccounts?: Record<string, { holder: string; accountNumber: string }>;
  termsAccepted?: boolean;
  createdAt: string;
  updatedAt: string;
};
```

**Nota:** El campo `categories` se mantiene por retrocompatibilidad pero se recomienda usar `fixerJobs` para nuevas implementaciones.

---

## Flujo de Uso

### Escenario 1: Fixer agrega trabajos con descripciones personalizadas

1. Usuario va a "Convertirse en Fixer" → Paso de Categorías
2. Selecciona trabajos del modal `CategoriesSelector`
3. Para cada trabajo puede hacer clic en "Agregar descripción personalizada"
4. Escribe su descripción en el `CustomDescriptionTextarea` (max 500 caracteres)
5. Al guardar, el sistema llama a `addFixerJob` para cada trabajo con descripción

### Escenario 2: Usuario ve perfil de un fixer (About Fixer)

1. Usuario navega a `/about_fixer?id=<fixerId>`
2. La página llama a `getFixerJobs(fixerId)`
3. El componente `JobsList` recibe los trabajos con descripciones
4. Para cada trabajo muestra:
   - Nombre del trabajo
   - Descripción personalizada (si existe) con indicador visual ✓
   - Descripción general (si no hay personalizada)

---

## Componentes Frontend

### Páginas
- **`src/app/about_fixer/page.tsx`**: Página principal del perfil del fixer

### Componentes
- **`src/app/about_fixer/components/JobsList.tsx`**: Lista de trabajos con descripciones
- **`src/app/components/categories/CategoriesSelector.tsx`**: Modal para seleccionar trabajos
- **`src/app/components/categories/CustomDescriptionTextarea.tsx`**: Campo de texto estilizado

### API
- **`src/lib/api/fixer.ts`**: Funciones para consumir los endpoints

---

## Validaciones

### Frontend
- Máximo 500 caracteres por descripción personalizada
- Contador visual de caracteres con código de colores
- Campo opcional (puede quedar vacío)

### Backend (a implementar si no existe)
- Validar longitud máxima de descripción
- Validar que jobId existe
- Validar que fixerId existe y pertenece al usuario autenticado

---

## Mejoras Futuras

1. **Editor de texto enriquecido**: Permitir formato (negritas, listas)
2. **Plantillas de descripciones**: Sugerencias predefinidas por tipo de trabajo
3. **Traducción automática**: Descripciones en múltiples idiomas
4. **Análisis de texto**: Detectar palabras clave y sugerir mejoras
5. **Versionado**: Historial de cambios en descripciones

---

## Soporte

Para preguntas o issues relacionados con esta funcionalidad:
- **Backend**: Nicolás Zapata
- **Frontend**: Daniel Iriarte
- **Historia de Usuario**: HU03 (Sprint 2)
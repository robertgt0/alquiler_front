# 📁 Estructura del Proyecto

Este proyecto sigue una estructura organizada por **Epics** (historias de usuario), donde cada epic contiene su propia carpeta con todos los recursos necesarios.

## 🗂️ Organización de Carpetas

```
app/
├── epic_example/           # 📦 Nombre de la Epic (Historia de Usuario)
│   ├── assets/            # 🖼️ Recursos visuales
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/        # 🧩 Componentes UI
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   └── Form.tsx
│   │
│   ├── hooks/             # 🪝 Custom Hooks
│   │   └── useLocalState.ts
│   │
│   ├── interfaces/        # 📝 Tipos TypeScript
│   │   └── types.ts
│   │
│   ├── services/          # 🔌 Llamadas al Backend
│   │   └── api.ts
│   │
│   ├── utils/             # 🛠️ Helpers y Utilidades
│   │   └── helpers.ts
│   │
│   ├── modules/           # 📄 Sub-páginas o Módulos
│   │   └── HomeSection.tsx
│   │
│   └── page.tsx           # 🚪 Punto de entrada de la ruta
```

## 📋 Descripción de Carpetas

| Carpeta | Descripción |
|---------|-------------|
| `assets/` | Imágenes, iconos y recursos estáticos de la epic |
| `components/` | Componentes reutilizables (botones, modales, formularios) |
| `hooks/` | Custom hooks para manejo de estado y lógica local |
| `interfaces/` | Definiciones de tipos e interfaces TypeScript |
| `services/` | Funciones para llamadas al backend/API |
| `utils/` | Funciones helper específicas de la epic |
| `modules/` | Sub-módulos o secciones cuando una página se deriva en otras |
| `page.tsx` | **Punto de entrada principal** de la ruta de la epic |

## 💡 Ejemplo de Uso

Para crear una nueva epic llamada `user-profile`:

```
app/
└── user-profile/
    ├── assets/
    ├── components/
    ├── hooks/
    ├── interfaces/
    ├── services/
    ├── utils/
    ├── modules/
    └── page.tsx
```

## 🎯 Convenciones

- Cada epic debe ser **autocontenida** con sus propios recursos
- Los componentes compartidos entre epics van en `/app/components` (global)
- Los hooks compartidos van en `/app/hooks` (global)
- Mantener nomenclatura consistente en **camelCase** o **kebab-case**
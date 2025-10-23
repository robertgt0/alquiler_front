#  IU de Notificaciones (Next.js + TypeScript)

##  Descripción del servicio

Este proyecto corresponde a un **módulo de notificaciones** desarrollado con Next.js y TypeScript.  
Su propósito es ofrecer una interfaz gráfica sencilla y moderna que permite enviar notificaciones o correos electrónicos mediante un formulario integrado.

El usuario puede redactar un mensaje, elegir un destinatario y enviarlo a través de una API de GMAIL.  
El sistema fue diseñado para facilitar pruebas, automatizaciones y envío de mensajes dentro del entorno del sistema principal.

La aplicación sigue la estructura estándar de un proyecto Next.js, con componentes organizados en `/app/notifications` y funciones auxiliares en `/lib/`.


##  Dependencias instaladas

El proyecto utiliza las siguientes dependencias principales:

Dependencia y Descripción 
**next** Framework React para renderizado híbrido (SSR/SSG).
**react** Librería base para la construcción de interfaces.
**react-dom** Motor de renderizado del cliente React.
**typescript** Tipado estático para mejorar la mantenibilidad del código.
**tailwindcss** Framework CSS para diseño responsivo y utilitario.
**postcss** Procesador de estilos CSS.
**autoprefixer** Añade compatibilidad CSS entre navegadores.
**eslint** Analizador de código y reglas de estilo.

## Instrucciones de instalación

Instalar dependendecias
    Todas las dependencias se instalan automáticamente con el comando `npm install`.

    npm install next react react-dom

    npm install -D tailwindcss postcss autoprefixer

    npx tailwindcss init -p

## Instrucciones de ejecucion
     Tener instalado Node.js 20+
     Estar en la direccion de la carpeta del proyecto
     ejecutar
        npm run dev

**modo produccion**
Compila el proyecto con:

    npm run build

Inicia el servidor optimizado con:

    npm start
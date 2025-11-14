// utils/normalizacion.ts

type ModoNormalizacion = "busqueda" | "sugerencias" | "solo-espacios";

/**
 * FUNCIÓN UNIFICADA DE NORMALIZACIÓN GOOGLE COMPLETA
 * - Normaliza espacios, mayúsculas, tildes, caracteres separadores
 * - Modo "busqueda": normaliza + verifica caracteres problema
 * - Modo "sugerencias": solo normalización básica (sin errores)
 * - Modo "solo-espacios": solo normalización de espacios (más rápido)
 */
export const normalizarGoogle = (
    texto: string,
    modo: ModoNormalizacion = "busqueda"
): string => {
    if (!texto) return "";

    console.log(`🔍 [GOOGLE-${modo.toUpperCase()}] Entrada:`, JSON.stringify(texto));

    // 🔥 PASO 1: NORMALIZACIÓN BÁSICA DE ESPACIOS (siempre se hace)
    const textoSinEspaciosInicioFin = texto.trim();
    const textoEspaciosUnificados = textoSinEspaciosInicioFin.replace(/\s+/g, ' ');

    if (!textoEspaciosUnificados) {
        return "";
    }

    // 🔥 MODO "SOLO-ESPACIOS": Retorna aquí (más rápido)
    if (modo === "solo-espacios") {
        console.log(`✅ [GOOGLE-SOLO-ESPACIOS] Resultado:`, JSON.stringify(textoEspaciosUnificados));
        return textoEspaciosUnificados;
    }

    // 🔥 PASO 2 CORREGIDO: VERIFICAR CARACTERES PROBLEMA PRIMERO (solo en modo "busqueda")
    if (modo === "busqueda") {
        // ✅ CARACTERES PROBLEMA: Solo @ # $ % & * etc. (EXCLUYENDO , - ( ) .)
        const caracteresProblema = /[@#$%^&*_+=[\]{}|\\<>]/g;
        const tieneCaracteresProblema = caracteresProblema.test(textoEspaciosUnificados);

        if (tieneCaracteresProblema) {
            console.log('❌ [GOOGLE-BUSQUEDA] Caracteres problemáticos detectados');
            // 🔥 CAMBIAR: En lugar de lanzar error, devolver cadena vacía
            return '[INVALID]'; // 🔥 Texto constante que rompe el ciclo
        }
    }

    // 🔥 PASO 3: Convertir separadores VÁLIDOS en espacios (, - ( ) . etc.)
    const separadoresAConvertir = /[.,\-–—()]/g; // ✅ SOLO estos separadores
    const textoSinSeparadores = textoEspaciosUnificados.replace(separadoresAConvertir, ' ');

    // 🔥 UNIFICAR ESPACIOS NUEVAMENTE
    const textoEspaciosLimpios = textoSinSeparadores.replace(/\s+/g, ' ').trim();

    console.log(`🔄 [GOOGLE-${modo.toUpperCase()}] Después de separadores:`, JSON.stringify(textoEspaciosLimpios));

    if (!textoEspaciosLimpios) {
        return "";
    }

    // 🔥 PASO 4: NORMALIZACIÓN COMPLETA GOOGLE (tildes, diacríticos, mayúsculas)
    const textoNormalizadoCompleto = textoEspaciosLimpios
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[´`¨]/g, '')
        .toLowerCase()
        .trim();

    console.log(`✅ [GOOGLE-${modo.toUpperCase()}] Resultado final:`, JSON.stringify(textoNormalizadoCompleto));

    return textoNormalizadoCompleto;
};

/**
 * Detectar tipo de caracteres especiales para mostrar mensajes específicos
 * CONSISTENTE con normalizarGoogle
 */
export const analizarCaracteresQuery = (texto: string): {
    tieneProblema: boolean;
    tieneSeparadores: boolean;
    mensaje?: string;
} => {
    // ✅ CONSISTENTE con normalizarGoogle
    const caracteresProblema = /[@#$%^&*_+=[\]{}|\\<>]/g;
    const caracteresSeparadores = /[.,\-–—()]/g;

    // Misma normalización inicial que normalizarGoogle
    const textoSinEspaciosInicioFin = texto.trim();
    const textoEspaciosUnificados = textoSinEspaciosInicioFin.replace(/\s+/g, ' ');
    const textoParaAnalizar = textoEspaciosUnificados;

    const tieneProblema = caracteresProblema.test(textoParaAnalizar);
    const tieneSeparadores = caracteresSeparadores.test(textoParaAnalizar);

    let mensaje = "";

    if (tieneProblema) {
        mensaje = "Caracteres especiales como @ # $ % & * no están permitidos";
    } else if (tieneSeparadores) {
        mensaje = "Caracteres como , - ( ) . se convertirán en espacios para la búsqueda";
    }

    return {
        tieneProblema,
        tieneSeparadores,
        mensaje: mensaje || undefined
    };
};

/**
 * Detectar si hay caracteres problemáticos (solo para UI)
 */
export const tieneCaracteresProblema = (texto: string): boolean => {
    return /[@#$%^&*_+=[\]{}|\\<>]/.test(texto);
};

// ... (el resto de las funciones se mantienen igual)
export const normalizarQueryBusqueda = (texto: string): string => {
    return normalizarGoogle(texto, "busqueda");
};

export const normalizarParaSugerencias = (texto: string): string => {
    return normalizarGoogle(texto, "sugerencias");
};

export const normalizarSoloEspacios = (texto: string): string => {
    return normalizarGoogle(texto, "solo-espacios");
};

export const normalizarTexto = (texto: string): string => {
    if (!texto) return "";
    const textoLimpio = texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[´'"]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
    return textoLimpio;
};

export const capitalizarPrimera = (texto: string): string => {
    const t = texto ? String(texto).trim() : "";
    if (!t) return "";
    return t.charAt(0).toUpperCase() + t.slice(1);
};

export const debugNormalizacion = (texto: string): void => {
    console.log('=== DEBUG NORMALIZACIÓN ===');
    console.log('Texto original:', JSON.stringify(texto));
    try {
        const busqueda = normalizarGoogle(texto, "busqueda");
        console.log('Modo búsqueda:', JSON.stringify(busqueda));
    } catch (error) {
        console.log('Modo búsqueda: ERROR - Caracteres problema');
    }
    const sugerencias = normalizarGoogle(texto, "sugerencias");
    console.log('Modo sugerencias:', JSON.stringify(sugerencias));
    const soloEspacios = normalizarGoogle(texto, "solo-espacios");
    console.log('Modo solo-espacios:', JSON.stringify(soloEspacios));
    const analisis = analizarCaracteresQuery(texto);
    console.log('Análisis caracteres:', analisis);
    console.log('=== FIN DEBUG ===');
}; 
/**
 * Hash simple para detectar cambios reales (sin normalizar)
 * Detecta cambios de letras, pero ignora cambios de normalización
 */
export const generarHashTexto = (texto: string): string => {
    if (!texto) return "";

    // Solo caracteres alfanuméricos en minúsculas para comparación
    return texto
        .toLowerCase()
        .replace(/[^a-z0-9áéíóúñ\s]/g, '') // Solo letras, números y espacios
        .replace(/\s+/g, ' ')              // Espacios unificados
        .trim();
};

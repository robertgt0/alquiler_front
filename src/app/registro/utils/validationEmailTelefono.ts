
export function validateEmail(email: string): string | null {
    if (!email.trim()) {
      return "Por favor, escribe tu correo.";
    }

    // Dividimos el correo en la parte antes y después del @
    const partes = email.split("@");

    if (partes.length !== 2) {
      return "correo electronico no valido";
    }

    const local = partes[0];
    const dominio = partes[1];

    // Parte local (antes del @)
    if (!/^[a-zA-Z0-9._-]+$/.test(local)) {
      return "correo electronico no valido";
    }
    if (local.length > 30 ) {
      return "correo electronico no valido";
    }
    if (local.startsWith(".") || local.endsWith(".")) {
      return "correo electronico no valido";
    }
    if (local.includes("..")) {
      return "correo electronico no valido";
    }

    // Parte del dominio (después del @)
      const allowedDomainsRegex = /@(gmail\.com|hotmail\.com|yahoo\.com|outlook\.com|umss\.edu\.bo|umss\.edu|est\.umss\.edu|ucb\.edu\.bo|univalle\.edu|harvard\.edu|mit\.edu|empresa\.com\.bo|miempresa\.net)$/i;   
          if (!allowedDomainsRegex.test(email)) {
        return "correo electronico no valido";
      }

    return null; // El correo está bien :)

    }

    // Valida un número de teléfono
    export function validacionTelf(telf: string): string | null {
      // Verifica que no esté vacío
      if (!telf.trim()) {
        return "numero incorrecto";
      }

      // Verifica que tenga exactamente 8 dígitos
      if (telf.length !== 8) {
        return "numero incorrecto";
      }

      // Verifica que comience con 6 o 7
      if (telf[0] !== '6' && telf[0] !== '7') {
        return "numero incorrecto";
      }

      return null; //  Teléfono válido
    }


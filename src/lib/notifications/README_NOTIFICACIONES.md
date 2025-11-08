# 🔔 Sistema de Notificaciones de Saldo Negativo

**Historia:** HU06 - Notificación automática cuando la billetera del Fixer está en saldo negativo  
**Responsable:** Equipo de Notificaciones  
**Estado:** Listo para integración ✅

---

## 📋 ¿Qué hace este sistema?

Envía automáticamente un **correo electrónico (Gmail)** cuando el saldo de la billetera de un Fixer se vuelve negativo.

### ✨ Características implementadas:

- ✅ Envío automático de notificaciones por Gmail
- ✅ Prevención de notificaciones duplicadas
- ✅ Sistema de reintentos automáticos (en caso de fallo)
- ✅ Reenvío después de 24 horas si el saldo sigue negativo
- ✅ Registro completo de historial de notificaciones
- ✅ Logs detallados para debugging

---

## 🚀 Cómo Integrar (Para el Equipo de Pagos)

### 1️⃣ Importar la función

```typescript
import { sendNegativeBalanceNotification } from '@/lib/notifications/sendNegativeBalanceNotification';
```

### 2️⃣ Llamar cuando detecten saldo negativo

```typescript
// En su código, después de actualizar el saldo:
const nuevoSaldo = saldoActual - montoPagado;

// Actualizar en su BD
await actualizarSaldo(fixerId, nuevoSaldo);

// 🔔 AGREGAR ESTA VALIDACIÓN:
if (nuevoSaldo < 0) {
  await sendNegativeBalanceNotification({
    fixer_id: fixer.id,
    name: fixer.name,
    email: fixer.email,
    balance: nuevoSaldo
  });
}
```

### ¡Eso es todo! 🎉

---

## 📁 Estructura de Archivos

```
src/lib/notifications/
├── sendNegativeBalanceNotification.ts  ← 👈 ÚNICA función que necesitan
├── NegativeBalanceNotification.ts      ← Lógica interna (no tocar)
└── README_NOTIFICACIONES.md            ← Esta documentación
```

---

## 🔍 Dónde Integrar en su Código

Busquen en su módulo de pagos los archivos/funciones que:

### 🎯 Actualizan el saldo de la billetera:
- `updateWalletBalance()`
- `processPayment()`
- `debitAccount()`
- `wallet.balance = newBalance`

### 📂 Archivos probables:
- `src/services/wallet.service.ts`
- `src/services/payment.service.ts`
- `src/app/api/payments/route.ts`
- `src/app/api/wallet/[id]/route.ts`

### 🔎 Buscar en el código:
```
Ctrl+F: "balance -"
Ctrl+F: "wallet.balance"
Ctrl+F: "saldo"
```

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Básico

```typescript
async function procesarPago(fixerId: number, monto: number) {
  const fixer = await obtenerFixer(fixerId);
  const nuevoSaldo = fixer.balance - monto;
  
  await actualizarSaldo(fixerId, nuevoSaldo);

  // 🔔 Notificar si es negativo
  if (nuevoSaldo < 0) {
    await sendNegativeBalanceNotification({
      fixer_id: fixer.id,
      name: fixer.name,
      email: fixer.email,
      balance: nuevoSaldo
    });
  }

  return nuevoSaldo;
}
```

### Ejemplo 2: Con validación previa

```typescript
import { shouldNotifyNegativeBalance, sendNegativeBalanceNotification } from '@/lib/notifications/sendNegativeBalanceNotification';

async function procesarPago(fixerId: number, monto: number) {
  const nuevoSaldo = await calcularYActualizarSaldo(fixerId, monto);

  // 🔔 Validar primero, luego notificar
  if (shouldNotifyNegativeBalance(fixerId, nuevoSaldo)) {
    await sendNegativeBalanceNotification({
      fixer_id: fixerId,
      name: fixer.name,
      email: fixer.email,
      balance: nuevoSaldo
    });
  }
}
```

### Ejemplo 3: Sin bloquear la respuesta

```typescript
// Si no quieren esperar a que se envíe el correo:
if (nuevoSaldo < 0) {
  sendNegativeBalanceNotification({
    fixer_id: fixer.id,
    name: fixer.name,
    email: fixer.email,
    balance: nuevoSaldo
  }).catch(error => {
    console.error('Error al enviar notificación:', error);
  });
}
```

---

## 📝 Interface de Datos

```typescript
interface NegativeBalanceData {
  fixer_id: number;   // ID del fixer
  name: string;       // Nombre completo del fixer
  email: string;      // Email donde se enviará la notificación
  balance: number;    // Saldo negativo actual (ej: -25.50)
}
```

---

## 🎨 Formato del Correo

El correo que se envía tiene este formato:

**Asunto:** ⚠️ Alerta: Saldo Negativo en tu Billetera Fixer

**Cuerpo:**
```
⚠️ Alerta de Saldo Negativo

Hola [Nombre del Fixer],

Tu billetera Fixer ha llegado a Bs. [Balance]

✗ No tienes fondos disponibles en este momento.

Por favor, recarga tu billetera para continuar usando los servicios.

ID Fixer: [ID]
Fecha: [Fecha actual]
```

---

## 🛡️ Manejo de Errores

La función **NUNCA lanza errores** que puedan romper su flujo de pagos.

```typescript
const resultado = await sendNegativeBalanceNotification({...});

if (resultado.success) {
  console.log('✅ Notificación enviada:', resultado.notificationId);
} else {
  console.error('❌ Error (no crítico):', resultado.message);
  // Su flujo de pagos CONTINÚA normalmente
}
```

---

## 🔄 Funcionalidades Automáticas

### 1. Prevención de Duplicados
Si el saldo no cambia, **NO se reenvía** la notificación:
- Primera vez: Bs. -25.50 → ✅ Se envía
- Segunda vez: Bs. -25.50 → ❌ No se envía (duplicado)
- Tercera vez: Bs. -50.00 → ✅ Se envía (monto diferente)

### 2. Sistema de Reintentos
Si falla el envío (por ejemplo, error de Gmail):
- Se guarda la notificación como "fallida"
- Se reintenta automáticamente cada 5 minutos
- Máximo 3 intentos

### 3. Reenvío después de 24 horas
Si el saldo sigue negativo después de 24 horas:
- Se reenvía automáticamente la notificación
- Útil para recordar al Fixer que regularice

---

## 🧪 Testing

### Variables de Entorno (`.env.local`)

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_API_KEY=mi_clave_secreta_definida_para_el_modulo_notificaciones_XD
NEXT_PUBLIC_TEST_EMAIL=cynthiachambibaltazar55@gmail.com
NODE_ENV=development
```

### Página de Prueba

Acceder a: `http://localhost:3000/test-notification`

---

## 📞 Contacto

**Equipo de Notificaciones:**
- Cynthia Chambi Baltazar

**Para dudas o problemas:**
- Crear un issue en el repo
- Contactar al equipo de notificaciones

---

## ✅ Checklist de Integración

- [ ] Identificar dónde se actualiza el saldo en su código
- [ ] Importar `sendNegativeBalanceNotification`
- [ ] Agregar validación `if (nuevoSaldo < 0)`
- [ ] Llamar a la función con los datos del fixer
- [ ] Probar con saldo negativo
- [ ] Verificar que llegue el correo
- [ ] ✨ ¡Listo!

---

## 🐛 Troubleshooting

### No llega el correo
1. Verificar que el backend esté corriendo en puerto 5000
2. Verificar credenciales de Gmail en el backend
3. Revisar logs del backend
4. Verificar carpeta de SPAM

### Error "Notificación duplicada"
- Es normal, el sistema previene duplicados
- Cambia el monto del saldo para probar de nuevo
- O usa la función `shouldNotifyNegativeBalance()` antes

### Error de API Key
- Verificar que `NEXT_PUBLIC_API_KEY` en frontend coincida con `API_KEY` en backend

---

**Última actualización:** Noviembre 2024  
**Versión:** 1.0.0
// src/lib/notifications/sendNegativeBalanceNotification.ts

/**
 * ============================================
 * FUNCIÓN DE INTEGRACIÓN - NOTIFICACIÓN DE SALDO NEGATIVO
 * ============================================
 * 
 * Este archivo contiene LA ÚNICA FUNCIÓN que el equipo de pagos necesita llamar.
 * 
 * ✅ Completamente aislada
 * ✅ Fácil de integrar
 * ✅ No requiere conocer la implementación interna
 * 
 * CÓMO USAR DESDE EL MÓDULO DE PAGOS:
 * 
 * import { sendNegativeBalanceNotification } from '@/lib/notifications/sendNegativeBalanceNotification';
 * 
 * // Cuando detecten saldo negativo, simplemente llamen:
 * await sendNegativeBalanceNotification({
 *   fixer_id: 1012,
 *   name: 'Jhonny Herrera',
 *   email: 'jhonny@example.com',
 *   balance: -25.50
 * });
 * 
 * ============================================
 */

import { negativeBalanceService } from './NegativeBalanceNotification';

// ============================================
// INTERFACE SIMPLE PARA EL EQUIPO DE PAGOS
// ============================================

export interface NegativeBalanceData {
  fixer_id: number;
  name: string;
  email: string;
  balance: number;
}

// ============================================
// FUNCIÓN PRINCIPAL DE INTEGRACIÓN
// ============================================

/**
 * Envía una notificación cuando se detecta saldo negativo
 * 
 * @param data - Datos del fixer con saldo negativo
 * @returns Promise con el resultado del envío
 * 
 * @example
 * ```typescript
 * // En el módulo de pagos, después de actualizar el saldo:
 * if (newBalance < 0) {
 *   await sendNegativeBalanceNotification({
 *     fixer_id: user.id,
 *     name: user.name,
 *     email: user.email,
 *     balance: newBalance
 *   });
 * }
 * ```
 */
export async function sendNegativeBalanceNotification(
  data: NegativeBalanceData
): Promise<{
  success: boolean;
  message: string;
  notificationId?: string;
}> {
  
  // Log para debugging
  console.log('📧 [Notificaciones] Procesando saldo negativo para Fixer:', data.fixer_id);

  try {
    // Validar datos básicos
    if (!data.fixer_id || !data.email || data.balance === undefined) {
      console.error('❌ [Notificaciones] Datos incompletos:', data);
      return {
        success: false,
        message: 'Datos incompletos para enviar notificación',
      };
    }

    // Validar que realmente sea negativo
    if (data.balance >= 0) {
      console.warn('⚠️ [Notificaciones] El balance no es negativo:', data.balance);
      return {
        success: false,
        message: 'El balance no es negativo, no se envía notificación',
      };
    }

    // Llamar al servicio de notificaciones
    const result = await negativeBalanceService.processNegativeBalanceNotification(
      {
        fixer_id: data.fixer_id,
        message: `Tu billetera ha llegado a Bs. ${data.balance.toFixed(2)}`,
        balance: data.balance,
      },
      {
        fixer_id: data.fixer_id,
        name: data.name,
        email: data.email,
        balance: data.balance,
      }
    );

    // Log del resultado
    if (result.success) {
      console.log('✅ [Notificaciones] Enviada correctamente:', result.notificationId);
    } else {
      console.error('❌ [Notificaciones] Error al enviar:', result.message);
    }

    return result;

  } catch (error: any) {
    console.error('❌ [Notificaciones] Error crítico:', error);
    return {
      success: false,
      message: error.message || 'Error al procesar notificación',
    };
  }
}

// ============================================
// FUNCIÓN AUXILIAR PARA VERIFICAR SI DEBE NOTIFICAR
// ============================================

/**
 * Verifica si debe enviar notificación o no
 * (útil para que el equipo de pagos valide antes de llamar)
 * 
 * @param fixer_id - ID del fixer
 * @param currentBalance - Balance actual
 * @returns true si debe notificar, false si no
 * 
 * @example
 * ```typescript
 * if (shouldNotifyNegativeBalance(user.id, newBalance)) {
 *   await sendNegativeBalanceNotification({...});
 * }
 * ```
 */
export function shouldNotifyNegativeBalance(
  fixer_id: number,
  currentBalance: number
): boolean {
  
  // No notificar si no es negativo
  if (currentBalance >= 0) {
    return false;
  }

  // Verificar si ya tiene notificación activa con el mismo balance
  const hasActive = negativeBalanceService.hasActiveNegativeBalance(fixer_id);
  
  if (hasActive) {
    const history = negativeBalanceService.getNotificationHistory(fixer_id);
    const lastNotification = history[0];
    
    // No notificar si el balance no ha cambiado
    if (lastNotification && lastNotification.balance === currentBalance) {
      console.log('⚠️ [Notificaciones] Ya existe notificación con este balance');
      return false;
    }
  }

  return true;
}

// ============================================
// FUNCIONES ADICIONALES PARA EL EQUIPO DE PAGOS
// ============================================

/**
 * Obtiene el historial de notificaciones de un fixer
 * (útil para mostrar en el perfil del usuario)
 */
export function getFixerNotificationHistory(fixer_id: number) {
  return negativeBalanceService.getNotificationHistory(fixer_id);
}

/**
 * Verifica si un fixer tiene saldo negativo activo
 * (útil para mostrar alertas en la UI)
 */
export function hasActiveNegativeBalance(fixer_id: number): boolean {
  return negativeBalanceService.hasActiveNegativeBalance(fixer_id);
}
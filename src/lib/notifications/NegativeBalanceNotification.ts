// src/lib/notifications/NegativeBalanceNotification.ts

/**
 * ============================================
 * SISTEMA DE NOTIFICACIÓN DE SALDO NEGATIVO (GMAIL)
 * Historia: HU06 - Notificación automática cuando la billetera del Fixer está en saldo negativo
 * Canal: Gmail únicamente
 * ============================================
 * 
 * ⚠️ IMPORTANTE: Este archivo contiene la LÓGICA INTERNA del sistema.
 * El equipo de pagos NO debe llamar estas funciones directamente.
 * 
 * Usar en su lugar: sendNegativeBalanceNotification() del archivo sendNegativeBalanceNotification.ts
 * 
 * ============================================
 */

// ============================================
// TIPOS Y INTERFACES
// ============================================

interface FixerData {
  fixer_id: number;
  name: string;
  email: string;
  balance: number;
}

interface NotificationPayload {
  subject: string;
  message: string;
  destinations: Array<{
    email: string;
    name: string;
  }>;
  fromName: string;
}

interface NotificationRecord {
  id: string;
  fixer_id: number;
  message: string;
  balance: number;
  status: 'pending' | 'sent' | 'failed' | 'retry';
  timestamp: string;
  lastAttempt?: string;
  attempts: number;
  error?: string;
}

interface NegativeBalanceRequest {
  fixer_id: number;
  message: string;
  balance: number;
}

// ============================================
// CONFIGURACIÓN
// ============================================

const CONFIG = {
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000',
  API_KEY: process.env.NEXT_PUBLIC_API_KEY || 'mi_clave_secreta_definida_para_el_modulo_notificaciones_XD',
  TEST_EMAIL: process.env.NEXT_PUBLIC_TEST_EMAIL || 'cynthiachambibaltazar55@gmail.com',
  IS_QA: process.env.NODE_ENV !== 'production',
  RETRY_INTERVAL: 5 * 60 * 1000, // 5 minutos
  RESEND_AFTER_24H: 24 * 60 * 60 * 1000, // 24 horas
  MAX_RETRIES: 3,
};

// ============================================
// ALMACENAMIENTO LOCAL (Simulación de BD)
// ============================================

class NotificationStorage {
  private storageKey = 'negative_balance_notifications';

  // Obtener todas las notificaciones
  getAll(): NotificationRecord[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('❌ Error al leer notificaciones:', error);
      return [];
    }
  }

  // Obtener notificaciones por fixer_id
  getByFixerId(fixer_id: number): NotificationRecord[] {
    return this.getAll().filter(n => n.fixer_id === fixer_id);
  }

  // Guardar notificación
  save(record: NotificationRecord): void {
    try {
      const all = this.getAll();
      const index = all.findIndex(n => n.id === record.id);
      
      if (index >= 0) {
        all[index] = record;
      } else {
        all.push(record);
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(all));
      console.log('✅ Notificación guardada:', record.id);
    } catch (error) {
      console.error('❌ Error al guardar notificación:', error);
    }
  }

  // Verificar si ya existe una notificación similar (evitar duplicados)
  isDuplicate(fixer_id: number, balance: number): boolean {
    const notifications = this.getByFixerId(fixer_id);
    const lastNotification = notifications
      .filter(n => n.status === 'sent')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    
    if (!lastNotification) return false;
    
    // Es duplicado si el balance no ha cambiado
    return lastNotification.balance === balance;
  }

  // Obtener notificaciones que necesitan reintento
  getForRetry(): NotificationRecord[] {
    const now = Date.now();
    return this.getAll().filter(n => {
      if (n.status !== 'failed' && n.status !== 'retry') return false;
      if (n.attempts >= CONFIG.MAX_RETRIES) return false;
      
      const lastAttempt = n.lastAttempt ? new Date(n.lastAttempt).getTime() : 0;
      return (now - lastAttempt) >= CONFIG.RETRY_INTERVAL;
    });
  }

  // Obtener notificaciones que necesitan reenvío (24 horas)
  getForResend(): NotificationRecord[] {
    const now = Date.now();
    return this.getAll().filter(n => {
      if (n.status !== 'sent') return false;
      
      const sentTime = new Date(n.timestamp).getTime();
      return (now - sentTime) >= CONFIG.RESEND_AFTER_24H;
    });
  }
}

// ============================================
// SERVICIO DE NOTIFICACIÓN
// ============================================

class NegativeBalanceNotificationService {
  private storage = new NotificationStorage();

  /**
   * Genera el mensaje formateado para Gmail
   */
  private formatGmailMessage(fixer: FixerData): string {
    const now = new Date();
    const date = now.toLocaleDateString('es-BO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const time = now.toLocaleTimeString('es-BO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    return `
<div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
  
  <!-- Header con ícono -->
  <div style="margin-bottom: 20px;">
    <h2 style="font-family: Poppins, sans-serif; color: #11255a; font-size: 18px; font-weight: 600; margin: 0; display: flex; align-items: center;">
      <span style="margin-right: 8px;">⚠️</span> Alerta de Saldo Negativo
    </h2>
  </div>
  
  <!-- Saludo -->
  <p style="font-family: Inter, sans-serif; color: #11255a; font-size: 14px; margin: 0 0 16px 0;">
    Hola <strong>${fixer.name}</strong>,
  </p>
  
  <!-- Mensaje principal -->
  <p style="font-family: Inter, sans-serif; color: #616E8A; font-size: 14px; margin: 0 0 16px 0; line-height: 1.5;">
    Tu billetera Fixer ha llegado a <strong style="color: #E91923;">Bs. ${fixer.balance.toFixed(2)}</strong>.
  </p>
  
  <!-- Mensaje de alerta -->
  <p style="font-family: Inter, sans-serif; color: #E91923; font-size: 14px; margin: 0 0 16px 0; font-weight: 600;">
    ✗ No tienes fondos disponibles en este momento.
  </p>
  
  <!-- Mensaje de acción -->
  <p style="font-family: Inter, sans-serif; color: #616E8A; font-size: 14px; margin: 0 0 24px 0; line-height: 1.5;">
    Por favor, recarga tu billetera para continuar usando los servicios.
  </p>
  
  <!-- Separador -->
  <div style="border-top: 1px solid #DBDEE5; margin: 24px 0 16px 0;"></div>
  
  <!-- Información adicional -->
  <p style="font-family: Inter, sans-serif; color: #616E8A; font-size: 13px; margin: 0 0 4px 0;">
    <strong style="color: #11255a;">ID Fixer:</strong> ${fixer.fixer_id}
  </p>
  <p style="font-family: Inter, sans-serif; color: #616E8A; font-size: 13px; margin: 0;">
    <strong style="color: #11255a;">Fecha:</strong> ${date}, ${time}
  </p>
  
</div>
    `.trim();
  }

  /**
   * Envía notificación por Gmail
   */
  private async sendGmailNotification(
    fixer: FixerData,
    isTest: boolean = false
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('📧 Enviando notificación por Gmail...');
      
      const payload: NotificationPayload = {
        subject: '⚠️ Alerta: Saldo Negativo en tu Billetera Fixer',
        message: this.formatGmailMessage(fixer),
        destinations: [
          {
            email: isTest ? CONFIG.TEST_EMAIL : fixer.email,
            name: fixer.name,
          },
        ],
        fromName: 'Sistema de Notificaciones Fixer',
      };

      const response = await fetch(`${CONFIG.BACKEND_URL}/api/gmail-notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CONFIG.API_KEY,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al enviar notificación');
      }

      console.log('✅ Gmail enviado correctamente:', data);
      return { success: true };
      
    } catch (error: any) {
      console.error('❌ Error al enviar Gmail:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Procesa notificación de saldo negativo
   * Esta es la función principal que el módulo de pagos debe llamar
   */
  async processNegativeBalanceNotification(
    request: NegativeBalanceRequest,
    fixerData: FixerData
  ): Promise<{ success: boolean; message: string; notificationId?: string }> {
    
    console.log('🔔 Procesando notificación de saldo negativo:', request);

    try {
      // 1. Verificar si es duplicado
      if (this.storage.isDuplicate(request.fixer_id, request.balance)) {
        console.log('⚠️ Notificación duplicada, no se enviará');
        return {
          success: false,
          message: 'Notificación duplicada. El saldo no ha cambiado.',
        };
      }

      // 2. Crear registro de notificación
      const notificationRecord: NotificationRecord = {
        id: `not_${Date.now()}_${request.fixer_id}`,
        fixer_id: request.fixer_id,
        message: request.message,
        balance: request.balance,
        status: 'pending',
        timestamp: new Date().toISOString(),
        attempts: 0,
      };

      // 3. Guardar notificación como pendiente
      this.storage.save(notificationRecord);

      // 4. Enviar notificación por Gmail
      const isTest = CONFIG.IS_QA;
      const result = await this.sendGmailNotification(fixerData, isTest);

      // 5. Actualizar registro según resultado
      notificationRecord.attempts++;
      notificationRecord.lastAttempt = new Date().toISOString();

      if (result.success) {
        notificationRecord.status = 'sent';
        this.storage.save(notificationRecord);

        console.log('✅ Notificación enviada y registrada exitosamente');
        return {
          success: true,
          message: 'Notificación enviada correctamente',
          notificationId: notificationRecord.id,
        };
      } else {
        notificationRecord.status = 'failed';
        notificationRecord.error = result.error;
        this.storage.save(notificationRecord);

        console.error('❌ Fallo al enviar notificación, se reintentará más tarde');
        return {
          success: false,
          message: `Error al enviar notificación: ${result.error}`,
          notificationId: notificationRecord.id,
        };
      }
      
    } catch (error: any) {
      console.error('❌ Error general al procesar notificación:', error);
      return {
        success: false,
        message: error.message || 'Error desconocido',
      };
    }
  }

  /**
   * Sistema de reintento automático para notificaciones fallidas
   */
  async retryFailedNotifications(): Promise<void> {
    console.log('🔄 Verificando notificaciones fallidas para reintentar...');
    
    const toRetry = this.storage.getForRetry();
    
    if (toRetry.length === 0) {
      console.log('✅ No hay notificaciones para reintentar');
      return;
    }

    console.log(`📤 Reintentando ${toRetry.length} notificaciones...`);

    for (const notification of toRetry) {
      // Simular datos del fixer (en producción vendría de la BD)
      const fixerData: FixerData = {
        fixer_id: notification.fixer_id,
        name: 'Fixer Usuario', // Obtener de BD
        email: CONFIG.IS_QA ? CONFIG.TEST_EMAIL : 'fixer@example.com',
        balance: notification.balance,
      };

      const result = await this.sendGmailNotification(fixerData, CONFIG.IS_QA);

      notification.attempts++;
      notification.lastAttempt = new Date().toISOString();

      if (result.success) {
        notification.status = 'sent';
        console.log(`✅ Notificación ${notification.id} reenviada exitosamente`);
      } else {
        notification.status = notification.attempts >= CONFIG.MAX_RETRIES ? 'failed' : 'retry';
        notification.error = result.error;
        console.log(`❌ Fallo reintento ${notification.attempts}/${CONFIG.MAX_RETRIES}`);
      }

      this.storage.save(notification);
    }
  }

  /**
   * Reenvío automático después de 24 horas si el saldo sigue negativo
   */
  async resendAfter24Hours(currentFixerBalances: Map<number, number>): Promise<void> {
    console.log('⏰ Verificando notificaciones de 24+ horas...');
    
    const toResend = this.storage.getForResend();
    
    if (toResend.length === 0) {
      console.log('✅ No hay notificaciones para reenviar');
      return;
    }

    console.log(`📤 Verificando ${toResend.length} notificaciones antiguas...`);

    for (const notification of toResend) {
      // Verificar si el saldo sigue siendo negativo
      const currentBalance = currentFixerBalances.get(notification.fixer_id);
      
      if (currentBalance === undefined || currentBalance >= 0) {
        console.log(`✅ Fixer ${notification.fixer_id} ya regularizó su cuenta`);
        continue;
      }

      // El saldo sigue negativo, reenviar notificación
      console.log(`📧 Reenviando notificación a Fixer ${notification.fixer_id}`);
      
      const fixerData: FixerData = {
        fixer_id: notification.fixer_id,
        name: 'Fixer Usuario',
        email: CONFIG.IS_QA ? CONFIG.TEST_EMAIL : 'fixer@example.com',
        balance: currentBalance,
      };

      await this.processNegativeBalanceNotification(
        {
          fixer_id: notification.fixer_id,
          message: notification.message,
          balance: currentBalance,
        },
        fixerData
      );
    }
  }

  /**
   * Obtiene el historial de notificaciones de un fixer
   */
  getNotificationHistory(fixer_id: number): NotificationRecord[] {
    return this.storage.getByFixerId(fixer_id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  /**
   * Verifica si un fixer tiene saldo negativo activo
   */
  hasActiveNegativeBalance(fixer_id: number): boolean {
    const notifications = this.storage.getByFixerId(fixer_id);
    const lastNotification = notifications
      .filter(n => n.status === 'sent')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    
    return lastNotification?.balance < 0;
  }
}

// ============================================
// INSTANCIA SINGLETON
// ============================================

const negativeBalanceService = new NegativeBalanceNotificationService();

// ============================================
// EXPORTACIONES
// ============================================

export {
  negativeBalanceService,
  NegativeBalanceNotificationService,
  type NegativeBalanceRequest,
  type NotificationRecord,
  type FixerData,
};
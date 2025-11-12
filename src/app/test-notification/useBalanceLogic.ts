import { useState, useCallback, useRef } from 'react';

export interface BalanceLogic {
  balance: number;
  logs: string[];
  isLoading: boolean;
  userEmail: string;
  updateBalance: (amount: number) => void;
  clearLogs: () => void;
  resetBalance: () => void;
  setUserEmail: (email: string) => void;
}

// Servicio de notificaciones integrado - CON LOGS MEJORADOS
const sendEmailNotification = async (type: 'HU5' | 'HU6', balance: number, userEmail: string): Promise<boolean> => {
  // Definir subject fuera del try para que esté disponible en el catch
  let subject = '';
  
  try {
    const userData = {
      name: 'Usuario Fixer',
      email: userEmail
    };

    const date = new Date().toLocaleDateString("es-BO", {
      weekday: "long",
      day: "numeric",
      month: "long", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    let htmlMessage = '';

    if (type === 'HU5') {
      subject = '⚠️ Alerta de Saldo - Billetera en Cero';
      htmlMessage = `
<div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #ddd; border-radius: 6px; padding: 16px;">
  <p style="font-weight: bold; color: #222; margin-bottom: 8px; font-size: 16px;">
    ⚠️ Alerta de Saldo en Cero
  </p>
  <p style="color: #222; margin: 0 0 8px 0;">
    Hola <strong>${userData.name}</strong>,
  </p>
  <p style="color: #222; margin: 0 0 8px 0;">
    Tu billetera ha llegado a <strong style="color: #f80909e2;">Bs. 0.00</strong>.
  </p>
  <p style="color: #ff0000ff; font-weight: bold; margin: 12px 0;">
    ❌ No tienes fondos disponibles en este momento.
  </p>
  <p style="color: #444; margin: 0 0 16px 0;">
    Por favor, recarga tu billetera para continuar usando los servicios.
  </p>
  <div style="font-size: 13px; color: #333; border-top: 1px solid #ccc; padding-top: 8px;">
    <p style="margin: 4px 0;"><strong>Fecha:</strong> ${date}</p>
    <p style="margin: 4px 0;"><strong>Tipo:</strong> HU5 - Saldo en Cero</p>
  </div>
</div>
      `.trim();
    } else {
      subject = `⚠️ URGENTE: Saldo Negativo (Bs. ${balance.toFixed(2)}) en tu Billetera`;
      htmlMessage = `
<div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #ddd; border-radius: 6px; padding: 16px;">
  <p style="font-weight: bold; color: #E91923; margin-bottom: 8px; font-size: 16px;">
    ⚠️ Alerta de Saldo Negativo
  </p>
  <p style="color: #222; margin: 0 0 8px 0;">
    Hola <strong>${userData.name}</strong>,
  </p>
  <p style="color: #222; margin: 0 0 8px 0;">
    Tu billetera Fixer ha llegado a <strong style="color: #E91923;">Bs. ${balance.toFixed(2)}</strong>.
  </p>
  <p style="color: #E91923; font-weight: bold; margin: 12px 0;">
    ⚠️ Tu saldo está en negativo!
  </p>
  <p style="color: #444; margin: 0 0 16px 0;">
    Por favor, recarga tu billetera lo antes posible para evitar la suspensión de servicios.
  </p>
  <div style="font-size: 13px; color: #333; border-top: 1px solid #ccc; padding-top: 8px;">
    <p style="margin: 4px 0;"><strong>Fecha:</strong> ${date}</p>
    <p style="margin: 4px 0;"><strong>Tipo:</strong> HU6 - Saldo Negativo</p>
  </div>
</div>
      `.trim();
    }

    const gmailPayload = {
      subject,
      message: htmlMessage,
      destinations: [{ 
        email: userData.email, 
        name: userData.name
      }],
      fromName: 'Sistema de Billetera Fixer'
    };

    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    
    //  LOG COMPLETO DE LO QUE SE ENVÍA
    console.group('📤 DATOS ENVIADOS AL BACKEND');
    console.log('🔗 Endpoint:', `${backendUrl}/api/gmail-notifications`);
    console.log('📨 Payload completo:', JSON.stringify(gmailPayload, null, 2));
    console.log('📧 Email destino:', userEmail);
    console.log('🎯 Tipo notificación:', type);
    console.log('💰 Balance:', balance);
    console.groupEnd();
    
    const response = await fetch(`${backendUrl}/api/gmail-notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'mi_clave_secreta_definida_para_el_modulo_notificaciones_XD',
      },
      body: JSON.stringify(gmailPayload)
    });

    // 🎯 LOG COMPLETO DE LO QUE SE RECIBE
    console.group('📥 RESPUESTA DEL BACKEND');
    console.log('🟢 Status:', response.status);
    console.log('🔗 URL:', response.url);
    
    const responseText = await response.text();
    let responseData;
    
    try {
      responseData = JSON.parse(responseText);
      console.log('✅ Datos recibidos:', JSON.stringify(responseData, null, 2));
    } catch {
      console.log('📝 Respuesta (texto):', responseText);
      responseData = { raw: responseText };
    }
    
    console.groupEnd();

    if (!response.ok) {
      console.error('❌ ERROR - Datos que NO se pudieron enviar:');
      console.error('📤 Payload fallido:', JSON.stringify(gmailPayload, null, 2));
      console.error('📧 Email destino:', userEmail);
      console.error('🔍 Error:', responseText);
      
      // 🎯 ESTOS SON LOS DATOS QUE SE GUARDARÍAN EN BD CUANDO FALLA
      const failedNotificationData = {
        channel: "Gmail",
        type: type,
        balance: balance,
        destination: userEmail,
        subject: subject,
        message: "Tu billetera ha llegado a Bs. " + balance.toFixed(2) + ". No tienes fondos disponibles en este momento.",
        error: responseText,
        timestamp: new Date().toISOString()
      };
      
      console.log('💾 DATOS PARA GUARDAR EN BD (fallo):', JSON.stringify(failedNotificationData, null, 2));
      
      throw new Error(`HTTP ${response.status}: ${responseText}`);
    }

    // Verificar éxito
    if (responseData.success === true || responseData.status === 'success' || responseData.message?.includes('enviado') || response.status === 200) {
      console.log('🎉 NOTIFICACIÓN EXITOSA');
      console.log('📩 Message ID:', responseData.messageId);
      console.log('👤 Destinatario:', userEmail);
      console.log('⏰ Timestamp:', new Date().toISOString());
      return true;
    } else {
      console.warn('⚠️ Respuesta ambigua del backend:', responseData);
      return false;
    }
    
  } catch (error) {
    console.error('💥 ERROR CRÍTICO EN NOTIFICACIÓN:');
    console.error('🔍 Detalles:', error);
    
    // 🎯 DATOS QUE SE GUARDARÍAN EN BD POR ERROR
    const errorNotificationData = {
      channel: "Gmail",
      type: type,
      balance: balance,
      destination: userEmail,
      subject: subject, // ✅ Ahora subject está disponible
      message: "Tu billetera ha llegado a Bs. " + balance.toFixed(2) + ". No tienes fondos disponibles en este momento.",
      error: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString()
    };
    
    console.log('💾 DATOS PARA GUARDAR EN BD (error):', JSON.stringify(errorNotificationData, null, 2));
    
    throw error;
  }
};

export const useBalanceLogic = (): BalanceLogic => {
  const [balance, setBalance] = useState<number>(100);
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  
  const lastNotifiedRef = useRef<{ type: 'HU5' | 'HU6' | null; balance: number }>({ 
    type: null, 
    balance: 100 
  });

  const addLog = useCallback((message: string): void => {
    const timestamp = new Date().toLocaleTimeString('es-BO');
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 50)]);
  }, []);

  const sendNotification = useCallback(async (type: 'HU5' | 'HU6', currentBalance: number): Promise<void> => {
    // Verificar que el usuario haya ingresado un email
    if (!userEmail) {
      addLog('❌ Error: No se ha configurado un email destino');
      return;
    }

    const notificationKey = `${type}_${currentBalance}`;
    
    if (lastNotifiedRef.current.type === type && lastNotifiedRef.current.balance === currentBalance) {
      console.log(`🛑 Notificación ${notificationKey} ya enviada, ignorando...`);
      return;
    }
    
    lastNotifiedRef.current = { type, balance: currentBalance };
    setIsLoading(true);

    try {
      addLog(`📧 Enviando ${type} a ${userEmail}...`);
      
      const success = await sendEmailNotification(type, currentBalance, userEmail);
      
      if (success) {
        addLog(`✅ ${type} ENVIADO CORRECTAMENTE a ${userEmail}`);
        addLog(`📨 Revisa tu bandeja de entrada (y spam)`);
      } else {
        addLog(`⚠️ ${type}: Backend respondió pero sin confirmación clara de éxito`);
        lastNotifiedRef.current = { type: null, balance: 100 };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      addLog(`❌ FALLO ENVÍO ${type}: ${errorMessage}`);
      lastNotifiedRef.current = { type: null, balance: 100 };
      
      if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
        addLog('🔌 Verifica que el backend esté corriendo en puerto 5000');
      }
    } finally {
      setIsLoading(false);
    }
  }, [addLog, userEmail]);

  const updateBalance = useCallback((amount: number): void => {
    setBalance(prev => {
      const newBalance = prev + amount;
      
      addLog(`Balance actualizado: ${prev.toFixed(2)} → ${newBalance.toFixed(2)}`);
      
      const shouldNotifyHU5 = newBalance === 0 && 
        !(lastNotifiedRef.current.type === 'HU5' && lastNotifiedRef.current.balance === 0);
        
      const shouldNotifyHU6 = newBalance < 0 && 
        !(lastNotifiedRef.current.type === 'HU6' && lastNotifiedRef.current.balance === newBalance);
      
      if (shouldNotifyHU5) {
        addLog('🎯 HU5 DETECTADO: Saldo en cero - Enviando notificación...');
        sendNotification('HU5', newBalance);
      } else if (shouldNotifyHU6) {
        addLog(`⚠️ HU6 DETECTADO: Saldo negativo (Bs. ${newBalance.toFixed(2)}) - Enviando notificación...`);
        sendNotification('HU6', newBalance);
      } else if (newBalance === 0 || newBalance < 0) {
        const alertType = newBalance === 0 ? 'HU5' : 'HU6';
        addLog(`ℹ️ ${alertType} ya fue notificado para este balance, evitando duplicado`);
      }
      
      return newBalance;
    });
  }, [addLog, sendNotification]);

  const clearLogs = useCallback((): void => {
    setLogs([]);
    addLog('🗑️ Logs limpiados');
  }, [addLog]);

  const resetBalance = useCallback((): void => {
    setBalance(100);
    lastNotifiedRef.current = { type: null, balance: 100 };
    addLog('🔄 Balance reiniciado a Bs. 100.00 - Notificaciones reseteadas');
  }, [addLog]);

  return {
    balance,
    logs,
    isLoading,
    userEmail,
    updateBalance,
    clearLogs,
    resetBalance,
    setUserEmail
  };
};
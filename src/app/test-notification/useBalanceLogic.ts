import { useState, useCallback, useRef } from 'react';

export interface BalanceLogic {
  balance: number;
  logs: string[];
  isLoading: boolean;
  updateBalance: (amount: number) => void;
  clearLogs: () => void;
  resetBalance: () => void;
}

// Servicio de notificaciones integrado
const sendEmailNotification = async (type: 'HU5' | 'HU6', balance: number): Promise<boolean> => {
  try {
    const userData = {
      name: 'Cristhian Calizaya',
      email: 'cristhiancalizaya165@gmail.com'
    };

    const date = new Date().toLocaleDateString("es-BO", {
      weekday: "long",
      day: "numeric",
      month: "long", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    let subject = '';
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
    <p style="margin: 4px 0;"><strong>ID Fixer:</strong> 1012</p>
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
    <p style="margin: 4px 0;"><strong>ID Fixer:</strong> 1012</p>
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
    
    console.log('📤 Enviando petición al backend:', `${backendUrl}/api/gmail-notifications`);
    
    const response = await fetch(`${backendUrl}/api/gmail-notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'mi_clave_secreta_definida_para_el_modulo_notificaciones_XD',
      },
      body: JSON.stringify(gmailPayload)
    });

    console.log('📥 Respuesta del backend - Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error del backend:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Respuesta del backend:', data);
    
    // CORRECCIÓN: El backend puede estar retornando éxito de diferentes formas
    // Verificamos varias formas posibles de éxito
    if (data.success === true || data.status === 'success' || data.message?.includes('enviado') || response.status === 200) {
      return true;
    } else {
      console.warn('⚠️ Backend respondió pero sin éxito claro:', data);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error enviando notificación:', error);
    throw error;
  }
};

export const useBalanceLogic = (): BalanceLogic => {
  const [balance, setBalance] = useState<number>(100);
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Usar useRef para evitar duplicados - más confiable que useState
  const lastNotifiedRef = useRef<{ type: 'HU5' | 'HU6' | null; balance: number }>({ 
    type: null, 
    balance: 100 
  });

  const addLog = useCallback((message: string): void => {
    const timestamp = new Date().toLocaleTimeString('es-BO');
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 50)]);
  }, []);

  const sendNotification = useCallback(async (type: 'HU5' | 'HU6', currentBalance: number): Promise<void> => {
    // ✅ CORRECCIÓN: Prevención robusta de duplicados
    const notificationKey = `${type}_${currentBalance}`;
    
    // Si ya estamos enviando una notificación para este tipo y balance, ignorar
    if (lastNotifiedRef.current.type === type && lastNotifiedRef.current.balance === currentBalance) {
      console.log(`🛑 Notificación ${notificationKey} ya enviada, ignorando...`);
      return;
    }
    
    // Marcar como enviando inmediatamente
    lastNotifiedRef.current = { type, balance: currentBalance };
    setIsLoading(true);

    try {
      addLog(`📧 Enviando ${type} a cristhiancalizaya165@gmail.com...`);
      
      const success = await sendEmailNotification(type, currentBalance);
      
      if (success) {
        addLog(`✅ ${type} ENVIADO CORRECTAMENTE a cristhiancalizaya165@gmail.com`);
        addLog(`📨 Revisa tu bandeja de entrada (y spam)`);
      } else {
        addLog(`⚠️ ${type}: Backend respondió pero sin confirmación clara de éxito`);
        // Si falla, permitir reintento resetando la referencia
        lastNotifiedRef.current = { type: null, balance: 100 };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      addLog(`❌ FALLO ENVÍO ${type}: ${errorMessage}`);
      
      // Si falla, permitir reintento resetando la referencia
      lastNotifiedRef.current = { type: null, balance: 100 };
      
      // Si es error de red, sugerir verificar backend
      if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
        addLog('🔌 Verifica que el backend esté corriendo en puerto 5000');
      }
    } finally {
      setIsLoading(false);
    }
  }, [addLog]);

  const updateBalance = useCallback((amount: number): void => {
    setBalance(prev => {
      const newBalance = prev + amount;
      
      // Log del cambio
      addLog(`Balance actualizado: ${prev.toFixed(2)} → ${newBalance.toFixed(2)}`);
      
      // ✅ CORRECCIÓN: Lógica mejorada de detección sin duplicados
      const shouldNotifyHU5 = newBalance === 0 && 
        !(lastNotifiedRef.current.type === 'HU5' && lastNotifiedRef.current.balance === 0);
        
      const shouldNotifyHU6 = newBalance < 0 && 
        !(lastNotifiedRef.current.type === 'HU6' && lastNotifiedRef.current.balance === newBalance);
      
      // Detección automática de HU5 y HU6
      if (shouldNotifyHU5) {
        addLog('🎯 HU5 DETECTADO: Saldo en cero - Enviando notificación...');
        sendNotification('HU5', newBalance);
      } else if (shouldNotifyHU6) {
        addLog(`⚠️ HU6 DETECTADO: Saldo negativo (Bs. ${newBalance.toFixed(2)}) - Enviando notificación...`);
        sendNotification('HU6', newBalance);
      } else if (newBalance === 0 || newBalance < 0) {
        // Solo log si ya fue notificado
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
    // Resetear la referencia de notificaciones también
    lastNotifiedRef.current = { type: null, balance: 100 };
    addLog('🔄 Balance reiniciado a Bs. 100.00 - Notificaciones reseteadas');
  }, [addLog]);

  return {
    balance,
    logs,
    isLoading,
    updateBalance,
    clearLogs,
    resetBalance
  };
};
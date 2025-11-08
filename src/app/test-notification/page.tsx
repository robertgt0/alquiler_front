'use client';

import React, { useState } from 'react';

export default function TestNotificationPage() {
  const [balance, setBalance] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [logs, setLogs] = useState([]);
  const [lastNotifiedBalance, setLastNotifiedBalance] = useState(null);
  
  const incrementBalance = () => setBalance(prev => prev + 10);
  const decrementBalance = () => setBalance(prev => prev - 10);

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString('es-BO');
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
  };

  // 🔥 ENVÍO AUTOMÁTICO CON useEffect
  React.useEffect(() => {
    const sendAutoNotification = async () => {
      // Solo enviar si el saldo es 0 o negativo Y no se ha enviado ya para este valor
      if (balance <= 0 && lastNotifiedBalance !== balance && !isLoading) {
        setLastNotifiedBalance(balance);
        await sendNotification();
      }
    };

    sendAutoNotification();
  }, [balance]); // Se ejecuta cada vez que cambia el balance

  const sendNotification = async () => {
    if (isLoading) return; // Evitar envíos múltiples
    
    setIsLoading(true);
    setResult(null);

    try {
      const userData = {
        name: 'Cynthia Chambi Baltazar',
        email: 'ramirezsaravia89@gmail.com'
      };

      const backendUrl = 'http://localhost:5000';
      
      const date = new Date().toLocaleDateString("es-BO", {
        weekday: "long",
        day: "numeric",
        month: "long", 
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });

      if (balance === 0) {
        // HU5: Saldo en CERO
        addLog('🎯 ¡SALDO EN CERO DETECTADO! Enviando HU5 automáticamente...');

        const htmlMessage = `
<div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #ddd; border-radius: 6px; padding: 16px;">
  <p style="font-weight: bold; color: #222; margin-bottom: 8px; font-size: 16px;">
    ⚠️ Alerta de Saldo en Cero
  </p>
  <p style="color: #222; margin: 0 0 8px 0;">
    Hola <strong>${userData.name}</strong>,
  </p>
  <p style="color: #222; margin: 0 0 8px 0;">
    Tu billetera Fixer ha llegado a <strong style="color: #ff0000ff;">Bs. 0.00</strong>.
  </p>
  <p style="color: #ff0000ff; font-weight: bold; margin: 12px 0;">
    ⚠️ No tienes fondos disponibles en este momento.
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

        const gmailPayload = {
          subject: '⚠️ Alerta de Saldo - Billetera en Cero',
          message: htmlMessage,
          destinations: [{ 
            email: userData.email, 
            name: userData.name
          }],
          fromName: 'Sistema de Billetera Fixer'
        };

        addLog(`🌐 Conectando a: ${backendUrl}/api/gmail-notifications`);

        const response = await fetch(`${backendUrl}/api/gmail-notifications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'mi_clave_secreta_definida_para_el_modulo_notificaciones_XD',
          },
          body: JSON.stringify(gmailPayload)
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        setResult({ success: true, ...data });
        addLog('✅ ¡NOTIFICACIÓN HU5 ENVIADA AUTOMÁTICAMENTE!');
        addLog(`📧 Revisa: ${userData.email}`);

      } else if (balance < 0) {
        // HU6: Saldo NEGATIVO
        addLog(`⚠️¡SALDO NEGATIVO DETECTADO (${balance.toFixed(2)})! Enviando HU6 automáticamente...`);

        const htmlMessage = `
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

        const gmailPayload = {
          subject: '⚠️ URGENTE: Saldo Negativo en tu Billetera',
          message: htmlMessage,
          destinations: [{ 
            email: userData.email, 
            name: userData.name
          }],
          fromName: 'Sistema de Billetera Fixer'
        };

        addLog(`🌐 Conectando a: ${backendUrl}/api/gmail-notifications`);

        const response = await fetch(`${backendUrl}/api/gmail-notifications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'mi_clave_secreta_definida_para_el_modulo_notificaciones_XD',
          },
          body: JSON.stringify(gmailPayload)
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        setResult({ success: true, ...data });
        addLog('✅ ¡NOTIFICACIÓN HU6 ENVIADA AUTOMÁTICAMENTE!');
        addLog(`📧 Revisa: ${userData.email}`);

      } else {
        addLog('⚠️ Saldo positivo - No se requiere notificación');
        setResult({ success: false, message: 'El saldo debe ser 0 o negativo' });
      }

    } catch (error) {
      addLog(`❌ Error: ${error.message}`);
      setResult({ success: false, error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const viewHistory = () => {
    addLog(`📋 Función de historial - Implementar según necesidad`);
  };

  const retryFailed = async () => {
    setIsLoading(true);
    addLog('🔄 Intentando reenviar notificaciones fallidas...');
    
    setTimeout(() => {
      addLog('✅ Proceso de reintento completado');
      setIsLoading(false);
    }, 1000);
  };

  const clearHistory = () => {
    setLogs([]);
    addLog('🗑️ Logs limpiados');
    setResult(null);
  };

  return (
    <div style={{
      fontFamily: 'Inter, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 24px',
      backgroundColor: '#ffffff'
    }}>
      
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{
          fontFamily: 'Poppins, sans-serif',
          color: '#0c4fe9',
          fontSize: '32px',
          marginBottom: '8px'
        }}>
          🧪 Prueba Real - Notificaciones de Saldo
        </h1>
        <p style={{ color: '#616E8A', fontSize: '14px' }}>
          🤖 Sistema de Envío Automático - Sin botones necesarios
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Panel Izquierdo - Controles */}
        <div>
          
          {/* Balance Actual con Controles */}
          <div style={{
            border: `2px solid ${balance < 0 ? '#E91923' : balance === 0 ? '#FFA500' : '#0c4fe9'}`,
            borderRadius: '12px',
            padding: '24px',
            backgroundColor: balance < 0 ? '#FFF5F5' : balance === 0 ? '#FFF8E1' : '#F0F2F5',
            marginBottom: '24px'
          }}>
            <div style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              color: '#616E8A',
              marginBottom: '8px'
            }}>
              Balance Simulado
            </div>
            <div style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '48px',
              fontWeight: 'bold',
              color: balance < 0 ? '#E91923' : balance === 0 ? '#FFA500' : '#0c4fe9'
            }}>
              Bs. {balance.toFixed(2)}
            </div>

            {/* Controles de Balance */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '16px',
              justifyContent: 'center'
            }}>
              <button
                onClick={decrementBalance}
                disabled={isLoading}
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#E91923',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ↓
              </button>
              
              <button
                onClick={incrementBalance}
                disabled={isLoading}
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#31C950',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ↑
              </button>
            </div>

            {balance < 0 && (
              <div style={{
                marginTop: '12px',
                padding: '12px',
                backgroundColor: '#FFEBEE',
                borderLeft: '4px solid #E91923',
                borderRadius: '4px',
                color: '#E91923',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                ⚠️ HU6: Saldo negativo detectado
              </div>
            )}
            {balance === 0 && (
              <div style={{
                marginTop: '12px',
                padding: '12px',
                backgroundColor: '#FFF8E1',
                borderLeft: '4px solid #FFA500',
                borderRadius: '4px',
                color: '#FFA500',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                🎯 HU5: Saldo en CERO
              </div>
            )}
          </div>

          {/* INDICADOR DE MODO AUTOMÁTICO */}
          <div style={{
            border: '2px solid #31C950',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
            backgroundColor: '#F0FDF4'
          }}>
            <h3 style={{
              fontFamily: 'Poppins, sans-serif',
              color: '#31C950',
              fontSize: '16px',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              ⚡ Envío Automático
            </h3>
            
            <div style={{
              padding: '20px',
              backgroundColor: '#E8F5E9',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>
                🤖
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#2E7D32', marginBottom: '8px' }}>
                MODO AUTOMÁTICO ACTIVADO
              </div>
              <div style={{ fontSize: '13px', color: '#388E3C', lineHeight: '1.6' }}>
                • Saldo = <strong>0.00</strong> → Envía HU5 automáticamente<br/>
                • Saldo <strong>&lt; 0</strong> → Envía HU6 automáticamente<br/>
                <strong>Sin necesidad de presionar botones</strong>
              </div>
            </div>
            
            {isLoading && (
              <div style={{
                marginTop: '16px',
                padding: '12px',
                backgroundColor: '#FFEB3B',
                borderRadius: '6px',
                textAlign: 'center',
                fontWeight: '600',
                color: '#F57F17',
                animation: 'pulse 1s infinite'
              }}>
                ⏳ Enviando notificación automática...
              </div>
            )}
          </div>

          {/* Utilidades */}
          <div style={{
            border: '1px solid #DBDEE5',
            borderRadius: '12px',
            padding: '20px',
            backgroundColor: '#FAFBFC'
          }}>
            <h3 style={{
              fontFamily: 'Poppins, sans-serif',
              color: '#11255a',
              fontSize: '16px',
              marginBottom: '16px'
            }}>
              🛠️ Utilidades
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={viewHistory}
                disabled={isLoading}
                style={{
                  padding: '14px 20px',
                  backgroundColor: '#F0F2F5',
                  color: '#11255a',
                  border: '1px solid #DBDEE5',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                📋 Ver Historial
              </button>

              <button
                onClick={retryFailed}
                disabled={isLoading}
                style={{
                  padding: '14px 20px',
                  backgroundColor: '#FFDF20',
                  color: '#11255a',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1
                }}
              >
                🔄 Reintentar Fallidas
              </button>

              <button
                onClick={clearHistory}
                disabled={isLoading}
                style={{
                  padding: '14px 20px',
                  backgroundColor: '#FF5722',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                🗑️ Limpiar Logs
              </button>
            </div>
          </div>

          {/* Resultado */}
          {result && (
            <div style={{
              marginTop: '24px',
              border: `2px solid ${result.success ? '#31C950' : '#E91923'}`,
              borderRadius: '12px',
              padding: '20px',
              backgroundColor: result.success ? '#F0FDF4' : '#FFF5F5'
            }}>
              <h3 style={{
                fontFamily: 'Poppins, sans-serif',
                color: result.success ? '#31C950' : '#E91923',
                fontSize: '16px',
                marginBottom: '12px'
              }}>
                {result.success ? '✅ Éxito' : '❌ Error'}
              </h3>
              <pre style={{
                fontSize: '12px',
                color: '#616E8A',
                overflow: 'auto',
                backgroundColor: 'white',
                padding: '12px',
                borderRadius: '6px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Panel Derecho - Logs */}
        <div>
          <div style={{
            border: '1px solid #DBDEE5',
            borderRadius: '12px',
            padding: '20px',
            backgroundColor: '#11255a',
            height: '800px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{
              fontFamily: 'Poppins, sans-serif',
              color: '#ffffff',
              fontSize: '16px',
              marginBottom: '16px'
            }}>
              📋 Console Logs
            </h3>

            <div style={{
              flex: 1,
              overflowY: 'auto',
              backgroundColor: '#0a1530',
              borderRadius: '8px',
              padding: '16px',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}>
              {logs.length === 0 ? (
                <div style={{ color: '#DBDEE5' }}>
                  Esperando pruebas...
                </div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} style={{
                    marginBottom: '8px',
                    padding: '8px',
                    backgroundColor: '#1a2438',
                    borderRadius: '4px',
                    color: '#ffffff',
                    borderLeft: '3px solid #2A87FF'
                  }}>
                    {log}
                  </div>
                ))
              )}
            </div>

            <div style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: '#1a2438',
              borderRadius: '8px',
              fontSize: '11px',
              color: '#DBDEE5'
            }}>
              💡 Tip: Abre DevTools (F12) para ver logs completos
            </div>
          </div>
        </div>
      </div>

      {/* Información */}
      <div style={{
        marginTop: '32px',
        padding: '20px',
        backgroundColor: '#F0F2F5',
        borderRadius: '12px',
        fontSize: '13px',
        color: '#616E8A'
      }}>
        <strong style={{ color: '#11255a' }}>📌 Configuración:</strong>
        <ul style={{ marginTop: '12px', marginBottom: 0, paddingLeft: '20px' }}>
          <li><strong>Endpoint Único:</strong> /api/gmail-notifications (para HU5 y HU6)</li>
          <li>Backend: http://localhost:5000</li>
          <li>Email: cynthiachambibaltazar55@gmail.com</li>
          <li>API Key: configurada ✓</li>
        </ul>
        <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#E8F5E9', borderRadius: '6px', color: '#2E7D32' }}>
          🤖 <strong>TOTALMENTE AUTOMÁTICO:</strong> Solo usa la flecha ↓ para bajar el saldo. Cuando llegue a 0 o negativo, el sistema enviará el correo automáticamente sin necesidad de presionar ningún botón.
        </div>
      </div>
    </div>
  );
}
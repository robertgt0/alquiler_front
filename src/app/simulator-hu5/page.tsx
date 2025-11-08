'use client';

import React, { useState } from 'react';
import { negativeBalanceService } from '@/lib/notifications/NegativeBalanceNotification';

export default function TestNotificationPage() {
  const [balance, setBalance] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('es-BO');
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
  };

  // Función para saldos negativos (HU6)
  const testNegativeBalance = async (testBalance: number) => {
    setIsLoading(true);
    setResult(null);
    addLog(`🚀 Iniciando prueba HU6 con balance: Bs. ${testBalance}`);

    try {
      const fixerData = {
        fixer_id: 1012,
        name: 'Cynthia Chambi Baltazar',
        email: 'cynthiachambibaltazar55@gmail.com',
        balance: testBalance
      };

      addLog('📤 Enviando notificación de saldo negativo...');

      const response = await negativeBalanceService.processNegativeBalanceNotification(
        {
          fixer_id: 1012,
          channel: 'gmail',
          message: `Tu billetera ha llegado a Bs. ${testBalance.toFixed(2)}`,
          balance: testBalance
        },
        fixerData
      );

      addLog(`📥 Respuesta recibida: ${JSON.stringify(response)}`);
      
      setResult(response);
      setBalance(testBalance);

      if (response.success) {
        addLog('✅ ¡Notificación HU6 enviada exitosamente!');
        addLog(`📧 Revisa el correo: cynthiachambibaltazar55@gmail.com`);
      } else {
        addLog(`❌ Error: ${response.message}`);
      }

    } catch (error: any) {
      addLog(`❌ Error en la prueba: ${error.message}`);
      setResult({ success: false, error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Función para saldo CERO (HU5) - INLINE SIN IMPORT
  const testZeroBalance = async () => {
    setIsLoading(true);
    setResult(null);
    addLog('🎯 Iniciando prueba HU5 - Saldo en CERO (0.00)');

    try {
      const userData = {
        name: 'Cynthia Chambi Baltazar',
        email: 'cynthiachambibaltazar55@gmail.com'
      };

      addLog('📤 Enviando notificación HU5 directamente al backend...');

      const date = new Date().toLocaleDateString("es-BO", {
        weekday: "long",
        day: "numeric",
        month: "long", 
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });

      const htmlMessage = `
<div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #ddd; border-radius: 6px; padding: 16px;">
  <p style="font-weight: bold; color: #222; margin-bottom: 8px; font-size: 16px;">
    ⚠️ Alerta de Saldo en Cero
  </p>
  <p style="color: #222; margin: 0 0 8px 0;">
    Hola <strong>${userData.name}</strong>,
  </p>
  <p style="color: #222; margin: 0 0 8px 0;">
    Tu billetera Fixer ha llegado a <strong style="color: #E91923;">Bs. 0.00</strong>.
  </p>
  <p style="color: #E91923; font-weight: bold; margin: 12px 0;">
    ❌ No tienes fondos disponibles en este momento.
  </p>
  <p style="color: #444; margin: 0 0 16px 0;">
    Por favor, recarga tu billetera para continuar usando los servicios.
  </p>
  <div style="font-size: 13px; color: #333; border-top: 1px solid #ccc; padding-top: 8px;">
    <p style="margin: 4px 0;"><strong>Fecha:</strong> ${date}</p>
    <p style="margin: 4px 0;"><strong>Tipo:</strong> Notificación Automática HU5</p>
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
        fromName: 'Sistema de Billetera AlquilerApp'
      };

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      
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

      addLog('📥 Respuesta recibida de HU5');
      setResult({ success: true, ...data });
      setBalance(0);

      addLog('✅ ¡NOTIFICACIÓN HU5 ENVIADA EXITOSAMENTE!');
      addLog(`📧 Revisa el correo: ${userData.email}`);
      addLog(`📋 Detalles: ${JSON.stringify(data)}`);

    } catch (error: any) {
      addLog(`❌ Error en prueba HU5: ${error.message}`);
      setResult({ success: false, error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const viewHistory = () => {
    const history = negativeBalanceService.getNotificationHistory(1012);
    addLog(`📋 Historial: ${history.length} notificaciones encontradas`);
    console.log('📋 Historial completo:', history);
    setResult({ history });
  };

  const retryFailed = async () => {
    setIsLoading(true);
    addLog('🔄 Intentando reenviar notificaciones fallidas...');
    
    try {
      await negativeBalanceService.retryFailedNotifications();
      addLog('✅ Proceso de reintento completado');
    } catch (error: any) {
      addLog(`❌ Error en reintentos: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    localStorage.removeItem('negative_balance_notifications');
    addLog('🗑️ Historial de notificaciones limpiado');
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
          HU6 (Saldos Negativos) + HU5 (Saldo en Cero)
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Panel Izquierdo - Controles */}
        <div>
          
          {/* Balance Actual */}
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

          {/* Botones de Prueba - HU6 (Negativos) */}
          <div style={{
            border: '1px solid #DBDEE5',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
            backgroundColor: '#FFF5F5'
          }}>
            <h3 style={{
              fontFamily: 'Poppins, sans-serif',
              color: '#E91923',
              fontSize: '16px',
              marginBottom: '16px'
            }}>
              🔴 HU6 - Saldos Negativos
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => testNegativeBalance(-25.50)}
                disabled={isLoading}
                style={{
                  padding: '14px 20px',
                  backgroundColor: '#E91923',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1
                }}
              >
                📧 Enviar: Saldo -25.50
              </button>

              <button
                onClick={() => testNegativeBalance(-100)}
                disabled={isLoading}
                style={{
                  padding: '14px 20px',
                  backgroundColor: '#C62828',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1
                }}
              >
                📧 Enviar: Saldo -100.00
              </button>

              <button
                onClick={() => testNegativeBalance(-50)}
                disabled={isLoading}
                style={{
                  padding: '14px 20px',
                  backgroundColor: '#B71C1C',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1
                }}
              >
                📧 Enviar: Saldo -50.00
              </button>
            </div>
          </div>

          {/* Botón de Prueba - HU5 (Cero) */}
          <div style={{
            border: '2px solid #FFA500',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
            backgroundColor: '#FFF8E1'
          }}>
            <h3 style={{
              fontFamily: 'Poppins, sans-serif',
              color: '#FF6F00',
              fontSize: '16px',
              marginBottom: '16px'
            }}>
              🎯 HU5 - Saldo en Cero
            </h3>
            
            <button
              onClick={() => testZeroBalance()}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '16px 20px',
                backgroundColor: '#FFA500',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1,
                boxShadow: '0 4px 12px rgba(255, 165, 0, 0.3)'
              }}
            >
              🎯 Enviar: Saldo 0.00 (HU5)
            </button>
            <div style={{
              marginTop: '12px',
              fontSize: '12px',
              color: '#FF6F00',
              textAlign: 'center'
            }}>
              ⚠️ Llamada directa al backend (inline)
            </div>
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
                🗑️ Limpiar Historial
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
          <li><strong>HU6:</strong> Usa negativeBalanceService</li>
          <li><strong>HU5:</strong> Llamada directa inline (sin import)</li>
          <li>Backend: {process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}</li>
          <li>Email: cynthiachambibaltazar55@gmail.com</li>
        </ul>
      </div>
    </div>
  );
}
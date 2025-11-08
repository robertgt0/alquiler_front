'use client';

import React, { useState } from 'react';
import { sendNegativeBalanceNotification, getFixerNotificationHistory, shouldNotifyNegativeBalance } from '@/lib/notifications/sendNegativeBalanceNotification';

export default function TestNotificationPage() {
  const [balance, setBalance] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('es-BO');
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
  };

  const testNegativeBalance = async (testBalance: number) => {
    setIsLoading(true);
    setResult(null);
    addLog(`🚀 Iniciando prueba con balance: Bs. ${testBalance}`);

    try {
      addLog(`🔍 Backend URL: ${process.env.NEXT_PUBLIC_BACKEND_URL}`);
      addLog(`🔍 API Key configurada: ${process.env.NEXT_PUBLIC_API_KEY ? 'SÍ' : 'NO'}`);
      
      // Verificar si debe notificar
      if (shouldNotifyNegativeBalance(1012, testBalance)) {
        addLog('✅ Validación previa: Se debe enviar notificación');
      } else {
        addLog('⚠️ Validación previa: Puede ser duplicada');
      }

      addLog(`📤 Enviando notificación al backend...`);

      // ⭐ USANDO LA NUEVA FUNCIÓN SIMPLIFICADA
      const response = await sendNegativeBalanceNotification({
        fixer_id: 1012,
        name: 'Cynthia Chambi Baltazar',
        email: 'cynthiachambibaltazar55@gmail.com',
        balance: testBalance
      });

      addLog(`📥 Respuesta recibida: ${JSON.stringify(response)}`);
      
      setResult(response);
      setBalance(testBalance);

      if (response.success) {
        addLog('✅ ¡Notificación enviada exitosamente!');
        addLog(`📧 Revisa el correo: ${process.env.NEXT_PUBLIC_TEST_EMAIL || 'cynthiachambibaltazar55@gmail.com'}`);
        addLog(`⏰ Puede tardar 1-2 minutos en llegar`);
      } else {
        addLog(`❌ Error: ${response.message}`);
      }

    } catch (error: any) {
      addLog(`❌ Error en la prueba: ${error.message}`);
      addLog(`📋 Stack: ${error.stack}`);
      setResult({ success: false, error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const viewHistory = () => {
    const history = getFixerNotificationHistory(1012);
    addLog(`📋 Historial: ${history.length} notificaciones encontradas`);
    console.log('📋 Historial completo:', history);
    setResult({ history });
  };

  const clearHistory = () => {
    localStorage.removeItem('negative_balance_notifications');
    addLog('🗑️ Historial de notificaciones limpiado');
    addLog('✅ Ahora puedes enviar notificaciones sin restricción de duplicados');
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
          🧪 Prueba Real - Notificaciones de Saldo Negativo
        </h1>
        <p style={{ color: '#616E8A', fontSize: '14px' }}>
          Probando conexión Frontend → Backend → Gmail
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Panel Izquierdo - Controles */}
        <div>
          
          {/* Balance Actual */}
          <div style={{
            border: `2px solid ${balance < 0 ? '#E91923' : '#0c4fe9'}`,
            borderRadius: '12px',
            padding: '24px',
            backgroundColor: balance < 0 ? '#FFF5F5' : '#F0F2F5',
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
              color: balance < 0 ? '#E91923' : '#0c4fe9'
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
                ⚠️ Saldo negativo detectado
              </div>
            )}
          </div>

          {/* Botones de Prueba - Gmail */}
          <div style={{
            border: '1px solid #DBDEE5',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
            backgroundColor: '#FAFBFC'
          }}>
            <h3 style={{
              fontFamily: 'Poppins, sans-serif',
              color: '#11255a',
              fontSize: '16px',
              marginBottom: '16px'
            }}>
              📧 Pruebas Gmail
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
                🔴 Enviar Gmail - Saldo Negativo (-25.50)
              </button>

              <button
                onClick={() => testNegativeBalance(-100)}
                disabled={isLoading}
                style={{
                  padding: '14px 20px',
                  backgroundColor: '#0c4fe9',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1
                }}
              >
                📧 Enviar Gmail - Balance Custom (-100)
              </button>

              <button
                onClick={() => testNegativeBalance(-50.75)}
                disabled={isLoading}
                style={{
                  padding: '14px 20px',
                  backgroundColor: '#1366fd',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1
                }}
              >
                💳 Enviar Gmail - Otro Monto (-50.75)
              </button>
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
                📋 Ver Historial (Console)
              </button>

              <button
                onClick={clearHistory}
                style={{
                  padding: '14px 20px',
                  backgroundColor: '#E91923',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
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
              💡 Tip: Abre DevTools (F12) para ver logs completos del sistema
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
        <strong style={{ color: '#11255a' }}>📌 Configuración de Prueba:</strong>
        <ul style={{ marginTop: '12px', marginBottom: 0, paddingLeft: '20px' }}>
          <li>Backend URL: {process.env.NEXT_PUBLIC_BACKEND_URL || 'No configurado'}</li>
          <li>Email de prueba: {process.env.NEXT_PUBLIC_TEST_EMAIL || 'cynthiachambibaltazar55@gmail.com'}</li>
          <li>Fixer ID: 1012</li>
          <li>Canal: Gmail únicamente (HU06)</li>
          <li>⭐ Usando función simplificada: sendNegativeBalanceNotification()</li>
        </ul>
        <div style={{ marginTop: '12px', color: '#E91923' }}>
          ⚠️ Asegúrate de tener el backend corriendo en el puerto 5000
        </div>
      </div>
    </div>
  );
}
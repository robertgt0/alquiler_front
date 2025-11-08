'use client';
import React from 'react';
import { useBalanceLogic } from './useBalanceLogic';

export default function TestNotificationPage() {
  const {
    balance,
    logs,
    isLoading,
    updateBalance,
    clearLogs,
    resetBalance
  } = useBalanceLogic();

  return (
    <div style={{
      fontFamily: 'Inter, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 24px',
      backgroundColor: '#ffffff',
      minHeight: '100vh'
    }}>
      
      {/* Header */}
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{
          color: '#0c4fe9',
          fontSize: '32px',
          marginBottom: '8px',
          fontWeight: 'bold'
        }}>
          🚀 Simulador de Notificaciones HU5 & HU6
        </h1>
        <p style={{ color: '#616E8A', fontSize: '16px' }}>
          Sistema automático de detección y envío de notificaciones por correo
        </p>
        
        {/* Indicador de Estado */}
        {isLoading && (
          <div style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#FFEB3B',
            borderRadius: '8px',
            color: '#F57F17',
            fontWeight: '600',
            display: 'inline-block'
          }}>
            ⏳ Enviando notificación por correo...
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Panel Izquierdo - Controles */}
        <div>
          
          {/* Balance Display */}
          <div style={{
            border: `3px solid ${balance < 0 ? '#E91923' : balance === 0 ? '#FFA500' : '#0c4fe9'}`,
            borderRadius: '16px',
            padding: '32px',
            backgroundColor: balance < 0 ? '#FFF5F5' : balance === 0 ? '#FFF8E1' : '#F0F2F5',
            marginBottom: '24px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#616E8A',
              marginBottom: '12px',
              fontWeight: '600'
            }}>
              BALANCE ACTUAL
            </div>
            <div style={{
              fontSize: '56px',
              fontWeight: 'bold',
              color: balance < 0 ? '#E91923' : balance === 0 ? '#FFA500' : '#0c4fe9',
              marginBottom: '24px'
            }}>
              Bs. {balance.toFixed(2)}
            </div>

            {/* Controles de Balance */}
            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <button
                onClick={() => updateBalance(-10)}
                disabled={isLoading}
                style={{
                  width: '70px',
                  height: '70px',
                  backgroundColor: isLoading ? '#CCCCCC' : '#E91923',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  fontSize: '36px',
                  fontWeight: 'bold',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 8px rgba(233, 25, 35, 0.3)',
                  opacity: isLoading ? 0.6 : 1
                }}
                onMouseOver={(e) => !isLoading && (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseOut={(e) => !isLoading && (e.currentTarget.style.transform = 'scale(1)')}
              >
                ↓
              </button>
              
              <button
                onClick={() => updateBalance(10)}
                disabled={isLoading}
                style={{
                  width: '70px',
                  height: '70px',
                  backgroundColor: isLoading ? '#CCCCCC' : '#31C950',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  fontSize: '36px',
                  fontWeight: 'bold',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 8px rgba(49, 201, 80, 0.3)',
                  opacity: isLoading ? 0.6 : 1
                }}
                onMouseOver={(e) => !isLoading && (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseOut={(e) => !isLoading && (e.currentTarget.style.transform = 'scale(1)')}
              >
                ↑
              </button>
            </div>

            {/* Indicadores de Estado */}
            {balance < 0 && (
              <div style={{
                padding: '16px',
                backgroundColor: '#FFEBEE',
                border: '2px solid #E91923',
                borderRadius: '8px',
                color: '#E91923',
                fontSize: '16px',
                fontWeight: '700',
                textAlign: 'center'
              }}>
                ⚠️ HU6 ACTIVO - SALDO NEGATIVO
                <div style={{ fontSize: '12px', marginTop: '4px', fontWeight: 'normal' }}>
                  Notificación enviada a cristhiancalizaya165@gmail.com
                </div>
              </div>
            )}
            {balance === 0 && (
              <div style={{
                padding: '16px',
                backgroundColor: '#FFF8E1',
                border: '2px solid #FFA500',
                borderRadius: '8px',
                color: '#FFA500',
                fontSize: '16px',
                fontWeight: '700',
                textAlign: 'center'
              }}>
                🎯 HU5 ACTIVO - SALDO EN CERO
                <div style={{ fontSize: '12px', marginTop: '4px', fontWeight: 'normal' }}>
                  Notificación enviada a cristhiancalizaya165@gmail.com
                </div>
              </div>
            )}
          </div>

          {/* Panel de Control */}
          <div style={{
            border: '2px solid #DBDEE5',
            borderRadius: '12px',
            padding: '24px',
            backgroundColor: '#FAFBFC',
            marginBottom: '24px'
          }}>
            <h3 style={{
              color: '#11255a',
              fontSize: '18px',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              🛠️ Panel de Control
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={resetBalance}
                disabled={isLoading}
                style={{
                  padding: '16px 24px',
                  backgroundColor: isLoading ? '#CCCCCC' : '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s',
                  opacity: isLoading ? 0.6 : 1
                }}
                onMouseOver={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#1976D2')}
                onMouseOut={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#2196F3')}
              >
                🔄 Reiniciar Balance a Bs. 100
              </button>

              <button
                onClick={clearLogs}
                disabled={isLoading}
                style={{
                  padding: '16px 24px',
                  backgroundColor: isLoading ? '#CCCCCC' : '#FF5722',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s',
                  opacity: isLoading ? 0.6 : 1
                }}
                onMouseOver={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#E64A19')}
                onMouseOut={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#FF5722')}
              >
                🗑️ Limpiar Todos los Logs
              </button>
            </div>
          </div>

          {/* Información del Sistema */}
          <div style={{
            border: '2px solid #E8F5E9',
            borderRadius: '12px',
            padding: '20px',
            backgroundColor: '#F1F8E9'
          }}>
            <h3 style={{
              color: '#2E7D32',
              fontSize: '16px',
              marginBottom: '12px'
            }}>
              💡 Configuración Actual:
            </h3>
            <ul style={{ 
              color: '#388E3C', 
              fontSize: '14px', 
              lineHeight: '1.6',
              margin: 0,
              paddingLeft: '20px'
            }}>
              <li><strong>Email destino:</strong> cristhiancalizaya165@gmail.com</li>
              <li><strong>Backend:</strong> http://localhost:5000</li>
              <li><strong>HU5:</strong> Se envía automáticamente cuando balance = 0</li>
              <li><strong>HU6:</strong> Se envía automáticamente cuando balance &lt; 0</li>
              <li><strong>Protección:</strong> No envía notificaciones duplicadas</li>
            </ul>
          </div>
        </div>

        {/* Panel Derecho - Logs */}
        <div>
          <div style={{
            border: '2px solid #11255a',
            borderRadius: '12px',
            padding: '24px',
            backgroundColor: '#11255a',
            height: '600px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{
                color: '#ffffff',
                fontSize: '18px',
                fontWeight: 'bold',
                margin: 0
              }}>
                📋 Registro de Eventos
              </h3>
              <div style={{
                color: '#DBDEE5',
                fontSize: '12px',
                backgroundColor: '#1a2438',
                padding: '4px 8px',
                borderRadius: '4px'
              }}>
                {logs.length} eventos
              </div>
            </div>

            <div style={{
              flex: 1,
              overflowY: 'auto',
              backgroundColor: '#0a1530',
              borderRadius: '8px',
              padding: '16px',
              fontFamily: 'Monaco, Consolas, monospace',
              fontSize: '13px'
            }}>
              {logs.length === 0 ? (
                <div style={{ 
                  color: '#DBDEE5', 
                  textAlign: 'center',
                  padding: '40px 20px',
                  fontStyle: 'italic'
                }}>
                  Los eventos aparecerán aquí cuando interactúes con el balance...
                </div>
              ) : (
                logs.map((log, index) => (
                  <div 
                    key={index} 
                    style={{
                      marginBottom: '8px',
                      padding: '12px',
                      backgroundColor: '#1a2438',
                      borderRadius: '6px',
                      color: '#ffffff',
                      borderLeft: log.includes('✅') ? '4px solid #31C950' : 
                                 log.includes('❌') ? '4px solid #E91923' : 
                                 log.includes('📧') ? '4px solid #FFA500' : '4px solid #2A87FF',
                      wordBreak: 'break-word'
                    }}
                  >
                    {log}
                  </div>
                ))
              )}
            </div>

            <div style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: '#1a2438',
              borderRadius: '6px',
              fontSize: '11px',
              color: '#DBDEE5',
              textAlign: 'center'
            }}>
              💡 Sistema conectado a backend local:5000 - Envío real de correos activado
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
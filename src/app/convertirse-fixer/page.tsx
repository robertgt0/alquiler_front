'use client';

import { useState } from 'react';
import RegisterForm from './components/RegisterForm';
import RegisterFormPrefPago from './components/registerform_prefpago';
import Header from './Header';

type Step = 0 | 1;

export default function RegisterPage() {
  const [step, setStep] = useState<Step>(0);
  const [shared, setShared] = useState<{ ci: string; email: string } | null>(
    null,
  );

  const steps = ['Datos', 'Pref. & Pago'];
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <>
      <Header />

      <div style={{ maxWidth: 860, margin: '2rem auto', padding: '1rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            {steps.map((label, i) => (
              <span
                key={label}
                style={{
                  fontWeight: i === step ? 700 : 500,
                  opacity: i <= step ? 1 : 0.6,
                }}
              >
                {label}
              </span>
            ))}
          </div>
          <div style={{ height: 10, background: '#e6e9ef', borderRadius: 999 }}>
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                borderRadius: 999,
                background: '#0e418d',
                transition: 'width 250ms ease',
              }}
            />
          </div>
        </div>

        {/* Paso 1 */}
        {step === 0 && (
          <RegisterForm
            onSuccess={(data: { ci: string; email: string }) => {
              setShared(data);
              setStep(1);
            }}
          />
        )}

        {step === 1 && (
          <RegisterFormPrefPago
            onBack={() => setStep(0)}
            onFinish={async (prefPago: Record<string, unknown>) => {
              const payload = { ...(shared ?? {}), ...prefPago };
              console.log('DATA FINAL >>>', payload);

              alert('✅ ¡Registro completado!');
            }}
          />
        )}
      </div>
    </>
  );
}

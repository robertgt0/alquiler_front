'use client';
import { useState } from 'react';
import Header from './Header';
import RegisterForm from './RegisterForm';
import RegisterForm_Prefpago from './registerform_prefpago';

export default function Page() {
  const [step, setStep] = useState(1); // Paso actual

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div>
      <Header />
      <h1 style={{ textAlign: 'center', marginTop: '2rem' }}>
        CONVERTIRSE EN FIXER
      </h1>

      {step === 1 && <RegisterForm onNext={nextStep} />}
      {step === 2 && <RegisterForm_Prefpago onBack={prevStep} />}
    </div>
  );
}

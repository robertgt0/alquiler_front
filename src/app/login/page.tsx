import { Suspense } from 'react';
import { LoginForm } from './components/loginForm';

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

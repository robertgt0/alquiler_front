import Header from './Header'; 
import RegisterForm from './RegisterForm';


export default function Page() {
  return (
    <div>
      
      <Header />
      <h1 style={{ textAlign: 'center', marginTop: '2rem' }}>
        CONVERTIRSE EN FIXER
      </h1>
      <RegisterForm />
    </div>
  );
}

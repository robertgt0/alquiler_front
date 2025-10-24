import PaymentForm from "./PaymentForm";
import FooterLinks from "./FooterLinks";

export default function RightSection() {
  return (
    <div className="lg:w-3/5 bg-white flex flex-col h-screen">
      <div className="flex-1 p-10 lg:p-16 overflow-y-auto">
        <h2 className="mb-4 text-gray-800 text-2xl font-semibold">Información de Pago</h2>
        <PaymentForm />
      </div>

      <div className="flex justify-center border-t border-gray-200 p-4 text-sm text-gray-500 bg-white">
        <FooterLinks />
      </div>
    </div>
  );
}

export default function PaymentForm() {
  return (
    <form className="flex flex-col">
      {/* DATOS PERSONALES */}
      <div className="mt-5 mb-2 font-semibold text-gray-900 border-b-2 border-white inline-block pb-1">
        Datos personales
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-3">
        <div className="flex-1 flex flex-col">
          <label className="text-sm text-[#11255A] mb-1">Nombre completo</label>
          <input type="text" placeholder="Ej. Juan Pérez" required className="mb-3 p-2 border border-gray-300 rounded-lg text-sm w-full" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-3">
        <div className="flex-1 flex flex-col">
          <label className="text-sm text-[#11255A] mb-1">Línea de dirección</label>
          <input type="text" placeholder="Av. Blanco Galindo #123" required className="mb-3 p-2 border border-gray-300 rounded-lg text-sm w-full" />
        </div>
        <div className="flex-1 flex flex-col">
          <label className="text-sm text-[#11255A] mb-1">Ciudad</label>
          <input type="text" placeholder="Cochabamba" required className="mb-3 p-2 border border-gray-300 rounded-lg text-sm w-full" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-3">
        <div className="flex-1 flex flex-col">
          <label className="text-sm text-[#11255A] mb-1">Estado</label>
          <input type="text" placeholder="Cochabamba" required className="mb-3 p-2 border border-gray-300 rounded-lg text-sm w-full" />
        </div>
        <div className="flex-1 flex flex-col">
          <label className="text-sm text-[#11255A] mb-1">Código postal</label>
          <input type="text" placeholder="0000" required className="mb-3 p-2 border border-gray-300 rounded-lg text-sm w-full" />
        </div>
      </div>

      {/* MÉTODOS DE PAGO */}
      <div className="mt-5 mb-2 font-semibold text-gray-900 border-b-2 border-white inline-block pb-1">
        Métodos de pago
      </div>
      <div className="flex flex-wrap gap-3 mb-4">
        <img src="https://cdn-icons-png.flaticon.com/128/16183/16183667.png" alt="Visa" className="w-12 hover:scale-110 transition" />
        <img src="https://cdn-icons-png.flaticon.com/128/196/196566.png" alt="PayPal" className="w-12 hover:scale-110 transition" />
        <img src="https://cdn-icons-png.flaticon.com/128/14082/14082959.png" alt="Mastercard" className="w-12 hover:scale-110 transition" />
        <img src="https://cdn-icons-png.flaticon.com/128/6124/6124998.png" alt="Google Pay" className="w-12 hover:scale-110 transition" />
        <img src="https://cdn-icons-png.flaticon.com/128/5968/5968382.png" alt="Stripe" className="w-12 hover:scale-110 transition" />
      </div>

      {/* DETALLES TARJETA */}
      <div className="mt-5 mb-2 font-semibold text-gray-900 border-b-2 border-white inline-block pb-1">
        Detalles de la tarjeta
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-3">
        <div className="flex-1 flex flex-col">
          <label className="text-sm text-[#11255A] mb-1">Nombre en la tarjeta</label>
          <input type="text" placeholder="Ej. Juan Pérez" required className="mb-3 p-2 border border-gray-300 rounded-lg text-sm w-full" />
        </div>
        <div className="flex-1 flex flex-col">
          <label className="text-sm text-[#11255A] mb-1">Número de tarjeta</label>
          <input type="text" placeholder="XXXX XXXX XXXX XXXX" required className="mb-3 p-2 border border-gray-300 rounded-lg text-sm w-full" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-3">
        <div className="flex-1 flex flex-col">
          <label className="text-sm text-[#11255A] mb-1">Caducidad</label>
          <input type="month" required className="mb-3 p-2 border border-gray-300 rounded-lg text-sm w-full" />
        </div>
        <div className="flex-1 flex flex-col">
          <label className="text-sm text-[#11255A] mb-1">CVC</label>
          <input type="text" placeholder="123" required className="mb-3 p-2 border border-gray-300 rounded-lg text-sm w-full" />
        </div>
      </div>

      <button type="submit" className="mt-5 p-3 bg-[#11255A] text-white font-semibold rounded-lg hover:bg-[#0f1f3a] transition">
        Aceptar
      </button>
    </form>
  );
}

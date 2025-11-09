import Image from "next/image";
import Logo from "../assets/logo.png";

export default function LeftSection() {
  return (
    <div className="lg:w-2/5 bg-white text-[#11255A] flex flex-col justify-between relative h-screen">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-10 rounded-full backdrop-blur-sm">
        <Image
          src={Logo}
          alt="Pago Icono"
          width={80}
          height={80}
          className="rounded-full"
        />
      </div>
      <div className="absolute bottom-2 w-full text-center py-2 bg-white text-sm">
        © Todos los derechos reservados — Creados por servicios
      </div>
    </div>
  );
}

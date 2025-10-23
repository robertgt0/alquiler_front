// components/Header/Icono.tsx
import React from "react";

const Icono: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    width={size}
    height={size}
    fill="none"
  >
    <circle cx="256" cy="256" r="256" fill="#5EC6FF" />
    <path
      d="M128 384V224l128-96 128 96v160h-64V272h-64v112h-64z"
      fill="white"
    />
    <path
      d="M240 320h32v-48l16 8v-24l-24-12h-40v24l16 8v44z"
      fill="white"
    />
  </svg>
);

export default Icono;

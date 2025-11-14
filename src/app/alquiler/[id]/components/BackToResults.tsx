"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface Props {
  children?: React.ReactNode;
  className?: string;
}

export default function BackToResults({ children, className }: Props) {
  const router = useRouter();

  const handleClick = () => {
    try {
      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back();
      } else {
        router.push("/alquiler");
      }
    } catch (e) {
      router.push("/alquiler");
    }
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children ?? "Volver"}
    </button>
  );
}

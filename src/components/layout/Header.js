'use client';
import Link from 'next/link';

export default function Header({ title, showBack = true, backUrl = "/" }) {
  return (
    <div>
      {showBack && (
        <Link href={backUrl} className="backButton">
          ← Volver
        </Link>
      )}
      <h1 className="header">{title}</h1>
    </div>
  );
}
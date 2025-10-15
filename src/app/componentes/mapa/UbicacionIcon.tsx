// components/UbicacionIcon.tsx

export default function UbicacionIcon({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Ubicación"
      className="bg-[#1366fd] border-[3px] border-white rounded-full w-[30px] h-[30px] flex items-center justify-center shadow-md hover:scale-110 transition-transform"
    >
      <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M12 7C14.21 7 16 8.79 16 11C16 14 12 19 12 19S8 14 8 11C8 8.79 9.79 7 12 7Z" />
      </svg>
    </button>
  );
}
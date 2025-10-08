'use client';
export default function Button({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary',
  style = {}
}) {
  const buttonClass = variant === 'secondary' ? 'button button-secondary' : 'button';
  
  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
}
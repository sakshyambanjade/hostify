interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  type = 'button',
  className = '',
}: ButtonProps) {
  const baseStyles =
    'px-6 py-3 rounded-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500 disabled:bg-gray-400',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-100',
    outline:
      'border-2 border-orange-500 text-orange-500 hover:bg-orange-50 focus:ring-orange-500 disabled:border-gray-400 disabled:text-gray-400',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
    >
      {children}
    </button>
  );
}
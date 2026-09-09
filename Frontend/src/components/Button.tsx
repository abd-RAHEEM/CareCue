import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary', size = 'md', icon, iconRight, loading, fullWidth,
  children, className = '', disabled, ...props
}) => {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95';
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:outline-indigo-600 shadow-lg shadow-indigo-200',
    secondary: 'bg-white text-indigo-700 border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 focus-visible:outline-indigo-400',
    ghost: 'text-indigo-600 hover:bg-indigo-50 focus-visible:outline-indigo-400',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus-visible:outline-red-500 shadow-lg shadow-red-100',
    success: 'bg-emerald-500 text-white hover:bg-emerald-600 focus-visible:outline-emerald-500 shadow-lg shadow-emerald-100',
  };
  const sizes = {
    sm: 'px-4 py-2 text-sm min-h-[36px]',
    md: 'px-5 py-2.5 text-base min-h-[44px]',
    lg: 'px-7 py-4 text-lg min-h-[56px]',
    xl: 'px-8 py-5 text-xl min-h-[68px]',
  };
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      style={{ transition: 'all 0.2s cubic-bezier(0.32,0.72,0,1)', ...props.style }}
    >
      {loading ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : icon}
      {children}
      {iconRight && !loading && iconRight}
    </button>
  );
};

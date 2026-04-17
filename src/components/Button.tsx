import React, { memo } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  primary: 'bg-[#022c22] text-white hover:bg-[#064e40] shadow-soft',
  secondary: 'bg-white text-[#022c22] border border-[#dcfce7] hover:bg-[#f0fdf4]',
  success: 'bg-[#bef264] text-[#022c22] hover:brightness-105',
  danger: 'bg-rose-500 text-white hover:bg-rose-600',
  ghost: 'bg-transparent text-[#022c22] hover:bg-[#dcfce7]',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

export const Button = memo(function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-premium font-bold tracking-tight transition-all duration-300 active:scale-[0.98] inline-flex items-center justify-center gap-2 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        'glass glass-hover font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50',
        {
          'bg-gradient-to-r from-purple-500 to-pink-500 text-white': variant === 'primary',
          'bg-white/5 text-white border border-white/20': variant === 'secondary',
          'bg-transparent border-none text-white hover:bg-white/10': variant === 'ghost',
        'px-3 py-2 text-xs sm:px-4 sm:text-sm': size === 'sm',
        'px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base': size === 'md',
        'px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

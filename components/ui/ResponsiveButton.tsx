import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'gradient';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export function ResponsiveButton({ 
  children, 
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = 'left',
  disabled,
  ...props 
}: ResponsiveButtonProps) {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600',
    secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20',
    ghost: 'bg-transparent text-white hover:bg-white/10',
    outline: 'border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white',
    gradient: 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600'
  };

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm',
    sm: 'px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base',
    md: 'px-4 py-2 text-base sm:px-6 sm:py-3 sm:text-lg',
    lg: 'px-6 py-3 text-lg sm:px-8 sm:py-4 sm:text-xl',
    xl: 'px-8 py-4 text-xl sm:px-12 sm:py-6 sm:text-2xl'
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg sm:rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      
      {children}
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
}

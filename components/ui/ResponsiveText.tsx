import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveTextProps {
  children: React.ReactNode;
  className?: string;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'muted' | 'accent';
  align?: 'left' | 'center' | 'right';
  responsive?: boolean;
}

export function ResponsiveText({ 
  children, 
  className,
  size = 'base',
  weight = 'normal',
  color = 'primary',
  align = 'left',
  responsive = true
}: ResponsiveTextProps) {
  const sizeClasses = {
    xs: responsive ? 'text-xs sm:text-sm' : 'text-xs',
    sm: responsive ? 'text-sm sm:text-base' : 'text-sm',
    base: responsive ? 'text-base sm:text-lg' : 'text-base',
    lg: responsive ? 'text-lg sm:text-xl' : 'text-lg',
    xl: responsive ? 'text-xl sm:text-2xl' : 'text-xl',
    '2xl': responsive ? 'text-2xl sm:text-3xl' : 'text-2xl',
    '3xl': responsive ? 'text-3xl sm:text-4xl' : 'text-3xl',
    '4xl': responsive ? 'text-4xl sm:text-5xl' : 'text-4xl',
    '5xl': responsive ? 'text-5xl sm:text-6xl' : 'text-5xl',
    '6xl': responsive ? 'text-6xl sm:text-7xl' : 'text-6xl'
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  const colorClasses = {
    primary: 'text-white',
    secondary: 'text-gray-300',
    muted: 'text-gray-400',
    accent: 'gradient-text'
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  return (
    <span className={cn(
      sizeClasses[size],
      weightClasses[weight],
      colorClasses[color],
      alignClasses[align],
      className
    )}>
      {children}
    </span>
  );
}

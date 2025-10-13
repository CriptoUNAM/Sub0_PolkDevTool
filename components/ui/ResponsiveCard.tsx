import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'gradient' | 'outline';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  interactive?: boolean;
}

export function ResponsiveCard({ 
  children, 
  className,
  variant = 'default',
  padding = 'md',
  hover = false,
  interactive = false,
  ...props 
}: ResponsiveCardProps) {
  const variantClasses = {
    default: 'bg-slate-800/50 border border-white/10',
    glass: 'glass',
    gradient: 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20',
    outline: 'border-2 border-white/20 bg-transparent'
  };

  const paddingClasses = {
    none: '',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
    xl: 'p-8 sm:p-12'
  };

  return (
    <div
      className={cn(
        'rounded-xl sm:rounded-2xl transition-all duration-300',
        variantClasses[variant],
        paddingClasses[padding],
        hover && 'hover:scale-105 hover:shadow-2xl',
        interactive && 'cursor-pointer hover:bg-white/5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

import React from 'react';
import { cn } from '@/lib/utils';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  background?: 'none' | 'gradient' | 'glass' | 'neural';
}

export function ResponsiveLayout({ 
  children, 
  className,
  maxWidth = '7xl',
  padding = 'md',
  background = 'none'
}: ResponsiveLayoutProps) {
  const backgroundClasses = {
    none: '',
    gradient: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
    glass: 'glass',
    neural: 'relative overflow-hidden'
  };

  return (
    <div className={cn(
      'min-h-screen',
      backgroundClasses[background],
      className
    )}>
      {background === 'neural' && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900" />
      )}
      
      <ResponsiveContainer 
        maxWidth={maxWidth} 
        padding={padding}
        className={background === 'neural' ? 'relative z-10' : ''}
      >
        {children}
      </ResponsiveContainer>
    </div>
  );
}

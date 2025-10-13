import React from 'react';
import { cn } from '@/lib/utils';
import { ResponsiveSpacing } from '@/components/ui/ResponsiveSpacing';

interface ResponsiveSectionProps {
  children: React.ReactNode;
  className?: string;
  padding?: {
    all?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    x?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    y?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  };
  background?: 'none' | 'glass' | 'gradient';
  fullHeight?: boolean;
}

export function ResponsiveSection({ 
  children, 
  className,
  padding = { y: 'lg' },
  background = 'none',
  fullHeight = false
}: ResponsiveSectionProps) {
  const backgroundClasses = {
    none: '',
    glass: 'glass',
    gradient: 'bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-cyan-500/10'
  };

  return (
    <ResponsiveSpacing
      padding={padding}
      className={cn(
        'w-full',
        fullHeight && 'min-h-screen',
        backgroundClasses[background],
        className
      )}
    >
      {children}
    </ResponsiveSpacing>
  );
}

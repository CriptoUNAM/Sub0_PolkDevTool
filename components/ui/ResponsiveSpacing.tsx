import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveSpacingProps {
  children: React.ReactNode;
  className?: string;
  padding?: {
    all?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    x?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    y?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    top?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    bottom?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    left?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    right?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  };
  margin?: {
    all?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    x?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    y?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    top?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    bottom?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    left?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    right?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  };
  responsive?: boolean;
}

export function ResponsiveSpacing({ 
  children, 
  className,
  padding,
  margin,
  responsive = true
}: ResponsiveSpacingProps) {
  const spacingClasses = {
    none: '0',
    sm: responsive ? '2 sm:4' : '2',
    md: responsive ? '4 sm:6' : '4',
    lg: responsive ? '6 sm:8' : '6',
    xl: responsive ? '8 sm:12' : '8'
  };

  const getPaddingClasses = () => {
    if (!padding) return '';
    
    const classes: string[] = [];
    
    if (padding.all) {
      const value = spacingClasses[padding.all];
      classes.push(`p-${value}`);
    } else {
      if (padding.x) {
        const value = spacingClasses[padding.x];
        classes.push(`px-${value}`);
      }
      if (padding.y) {
        const value = spacingClasses[padding.y];
        classes.push(`py-${value}`);
      }
      if (padding.top) {
        const value = spacingClasses[padding.top];
        classes.push(`pt-${value}`);
      }
      if (padding.bottom) {
        const value = spacingClasses[padding.bottom];
        classes.push(`pb-${value}`);
      }
      if (padding.left) {
        const value = spacingClasses[padding.left];
        classes.push(`pl-${value}`);
      }
      if (padding.right) {
        const value = spacingClasses[padding.right];
        classes.push(`pr-${value}`);
      }
    }
    
    return classes.join(' ');
  };

  const getMarginClasses = () => {
    if (!margin) return '';
    
    const classes: string[] = [];
    
    if (margin.all) {
      const value = spacingClasses[margin.all];
      classes.push(`m-${value}`);
    } else {
      if (margin.x) {
        const value = spacingClasses[margin.x];
        classes.push(`mx-${value}`);
      }
      if (margin.y) {
        const value = spacingClasses[margin.y];
        classes.push(`my-${value}`);
      }
      if (margin.top) {
        const value = spacingClasses[margin.top];
        classes.push(`mt-${value}`);
      }
      if (margin.bottom) {
        const value = spacingClasses[margin.bottom];
        classes.push(`mb-${value}`);
      }
      if (margin.left) {
        const value = spacingClasses[margin.left];
        classes.push(`ml-${value}`);
      }
      if (margin.right) {
        const value = spacingClasses[margin.right];
        classes.push(`mr-${value}`);
      }
    }
    
    return classes.join(' ');
  };

  return (
    <div className={cn(
      getPaddingClasses(),
      getMarginClasses(),
      className
    )}>
      {children}
    </div>
  );
}

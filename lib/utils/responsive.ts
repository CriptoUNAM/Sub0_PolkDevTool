import { RESPONSIVE_CONFIG } from '@/lib/config/responsive';

/**
 * Get responsive class names based on breakpoints
 */
export function getResponsiveClasses(
  base: string,
  responsive: Partial<Record<keyof typeof RESPONSIVE_CONFIG.breakpoints, string>> = {}
): string {
  const classes = [base];
  
  Object.entries(responsive).forEach(([breakpoint, className]) => {
    if (className) {
      classes.push(`${breakpoint}:${className}`);
    }
  });
  
  return classes.join(' ');
}

/**
 * Get responsive spacing classes
 */
export function getSpacingClasses(
  spacing: keyof typeof RESPONSIVE_CONFIG.spacing,
  direction: 'all' | 'x' | 'y' | 'top' | 'bottom' | 'left' | 'right' = 'all'
): string {
  const value = RESPONSIVE_CONFIG.spacing[spacing];
  
  switch (direction) {
    case 'all':
      return `p-${value}`;
    case 'x':
      return `px-${value}`;
    case 'y':
      return `py-${value}`;
    case 'top':
      return `pt-${value}`;
    case 'bottom':
      return `pb-${value}`;
    case 'left':
      return `pl-${value}`;
    case 'right':
      return `pr-${value}`;
    default:
      return `p-${value}`;
  }
}

/**
 * Get responsive margin classes
 */
export function getMarginClasses(
  spacing: keyof typeof RESPONSIVE_CONFIG.spacing,
  direction: 'all' | 'x' | 'y' | 'top' | 'bottom' | 'left' | 'right' = 'all'
): string {
  const value = RESPONSIVE_CONFIG.spacing[spacing];
  
  switch (direction) {
    case 'all':
      return `m-${value}`;
    case 'x':
      return `mx-${value}`;
    case 'y':
      return `my-${value}`;
    case 'top':
      return `mt-${value}`;
    case 'bottom':
      return `mb-${value}`;
    case 'left':
      return `ml-${value}`;
    case 'right':
      return `mr-${value}`;
    default:
      return `m-${value}`;
  }
}

/**
 * Get responsive typography classes
 */
export function getTypographyClasses(
  size: keyof typeof RESPONSIVE_CONFIG.typography.sizes,
  weight: keyof typeof RESPONSIVE_CONFIG.typography.weights = 'normal'
): string {
  return `text-${size} font-${weight}`;
}

/**
 * Get responsive grid classes
 */
export function getGridClasses(
  cols: Partial<Record<keyof typeof RESPONSIVE_CONFIG.breakpoints, number>> = {}
): string {
  const classes: string[] = [];
  
  Object.entries(cols).forEach(([breakpoint, colCount]) => {
    if (colCount) {
      classes.push(`${breakpoint}:grid-cols-${colCount}`);
    }
  });
  
  return classes.join(' ');
}

/**
 * Get responsive flex classes
 */
export function getFlexClasses(
  direction: 'row' | 'col' = 'row',
  justify: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly' = 'start',
  align: 'start' | 'center' | 'end' | 'stretch' | 'baseline' = 'start',
  wrap: boolean = false
): string {
  const classes = [
    'flex',
    `flex-${direction}`,
    `justify-${justify}`,
    `items-${align}`,
  ];
  
  if (wrap) {
    classes.push('flex-wrap');
  }
  
  return classes.join(' ');
}

/**
 * Get responsive visibility classes
 */
export function getVisibilityClasses(
  visible: Partial<Record<keyof typeof RESPONSIVE_CONFIG.breakpoints, boolean>> = {}
): string {
  const classes: string[] = [];
  
  Object.entries(visible).forEach(([breakpoint, isVisible]) => {
    if (isVisible !== undefined) {
      classes.push(isVisible ? `${breakpoint}:block` : `${breakpoint}:hidden`);
    }
  });
  
  return classes.join(' ');
}

/**
 * Get responsive width classes
 */
export function getWidthClasses(
  width: Partial<Record<keyof typeof RESPONSIVE_CONFIG.breakpoints, string>> = {}
): string {
  const classes: string[] = [];
  
  Object.entries(width).forEach(([breakpoint, widthValue]) => {
    if (widthValue) {
      classes.push(`${breakpoint}:w-${widthValue}`);
    }
  });
  
  return classes.join(' ');
}

/**
 * Get responsive height classes
 */
export function getHeightClasses(
  height: Partial<Record<keyof typeof RESPONSIVE_CONFIG.breakpoints, string>> = {}
): string {
  const classes: string[] = [];
  
  Object.entries(height).forEach(([breakpoint, heightValue]) => {
    if (heightValue) {
      classes.push(`${breakpoint}:h-${heightValue}`);
    }
  });
  
  return classes.join(' ');
}

/**
 * Check if current screen size matches breakpoint
 */
export function matchesBreakpoint(
  breakpoint: keyof typeof RESPONSIVE_CONFIG.breakpoints,
  width: number
): boolean {
  const breakpointValue = RESPONSIVE_CONFIG.breakpoints[breakpoint];
  const numericValue = parseInt(breakpointValue);
  
  switch (breakpoint) {
    case 'xs':
      return width >= numericValue;
    case 'sm':
      return width >= numericValue;
    case 'md':
      return width >= numericValue;
    case 'lg':
      return width >= numericValue;
    case 'xl':
      return width >= numericValue;
    case '2xl':
      return width >= numericValue;
    case '3xl':
      return width >= numericValue;
    case '4xl':
      return width >= numericValue;
    default:
      return false;
  }
}

/**
 * Get responsive container classes
 */
export function getContainerClasses(
  maxWidth: keyof typeof RESPONSIVE_CONFIG.breakpoints = 'xl',
  padding: keyof typeof RESPONSIVE_CONFIG.spacing = 'md'
): string {
  return `max-w-${maxWidth} mx-auto ${getSpacingClasses(padding, 'x')}`;
}

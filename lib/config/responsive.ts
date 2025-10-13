export const RESPONSIVE_CONFIG = {
  breakpoints: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    '3xl': '1600px',
    '4xl': '1920px',
  },
  
  spacing: {
    none: '0',
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
    '3xl': '6rem',
  },
  
  typography: {
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
    },
    
    weights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  
  components: {
    button: {
      sizes: {
        xs: { padding: '0.5rem 0.75rem', fontSize: '0.75rem' },
        sm: { padding: '0.75rem 1rem', fontSize: '0.875rem' },
        md: { padding: '1rem 1.5rem', fontSize: '1rem' },
        lg: { padding: '1.25rem 2rem', fontSize: '1.125rem' },
        xl: { padding: '1.5rem 2.5rem', fontSize: '1.25rem' },
      },
    },
    
    input: {
      sizes: {
        sm: { padding: '0.5rem 0.75rem', fontSize: '0.875rem' },
        md: { padding: '0.75rem 1rem', fontSize: '1rem' },
        lg: { padding: '1rem 1.25rem', fontSize: '1.125rem' },
      },
    },
    
    card: {
      sizes: {
        sm: { padding: '1rem' },
        md: { padding: '1.5rem' },
        lg: { padding: '2rem' },
        xl: { padding: '3rem' },
      },
    },
  },
  
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    
    easing: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },
  
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
} as const;

export type ResponsiveBreakpoint = keyof typeof RESPONSIVE_CONFIG.breakpoints;
export type ResponsiveSpacing = keyof typeof RESPONSIVE_CONFIG.spacing;
export type ResponsiveTypographySize = keyof typeof RESPONSIVE_CONFIG.typography.sizes;
export type ResponsiveTypographyWeight = keyof typeof RESPONSIVE_CONFIG.typography.weights;

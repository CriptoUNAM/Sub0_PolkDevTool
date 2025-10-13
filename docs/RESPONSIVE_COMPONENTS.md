# Componentes Responsivos

Esta documentación describe los componentes responsivos disponibles en Polkadot DevKit.

## Componentes de Layout

### ResponsiveLayout
Componente principal de layout que proporciona un contenedor responsivo con diferentes opciones de fondo.

```tsx
import { ResponsiveLayout } from '@/components/responsive';

<ResponsiveLayout 
  maxWidth="7xl" 
  padding="lg" 
  background="neural"
>
  {/* Contenido */}
</ResponsiveLayout>
```

**Props:**
- `maxWidth`: Tamaño máximo del contenedor ('sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl' | 'full')
- `padding`: Espaciado interno ('none' | 'sm' | 'md' | 'lg')
- `background`: Tipo de fondo ('none' | 'gradient' | 'glass' | 'neural')

### ResponsiveSection
Sección responsiva con espaciado configurable.

```tsx
import { ResponsiveSection } from '@/components/responsive';

<ResponsiveSection 
  padding={{ y: 'lg' }} 
  background="glass"
  fullHeight
>
  {/* Contenido */}
</ResponsiveSection>
```

## Componentes UI

### ResponsiveContainer
Contenedor responsivo con padding y max-width configurables.

```tsx
import { ResponsiveContainer } from '@/components/responsive';

<ResponsiveContainer maxWidth="4xl" padding="md">
  {/* Contenido */}
</ResponsiveContainer>
```

### ResponsiveGrid
Grid responsivo con columnas configurables por breakpoint.

```tsx
import { ResponsiveGrid } from '@/components/responsive';

<ResponsiveGrid 
  cols={{ default: 1, sm: 2, lg: 3 }} 
  gap="md"
>
  {/* Elementos del grid */}
</ResponsiveGrid>
```

### ResponsiveText
Texto responsivo con tamaños y pesos configurables.

```tsx
import { ResponsiveText } from '@/components/responsive';

<ResponsiveText 
  size="xl" 
  weight="bold" 
  color="accent"
  responsive
>
  Texto responsivo
</ResponsiveText>
```

### ResponsiveCard
Card responsiva con diferentes variantes y padding.

```tsx
import { ResponsiveCard } from '@/components/responsive';

<ResponsiveCard 
  variant="glass" 
  padding="lg" 
  hover 
  interactive
>
  {/* Contenido de la card */}
</ResponsiveCard>
```

### ResponsiveButton
Botón responsivo con diferentes variantes y tamaños.

```tsx
import { ResponsiveButton } from '@/components/responsive';

<ResponsiveButton 
  variant="primary" 
  size="lg" 
  fullWidth 
  loading
  icon={<Icon />}
  iconPosition="left"
>
  Botón responsivo
</ResponsiveButton>
```

### ResponsiveInput
Input responsivo con iconos y validación.

```tsx
import { ResponsiveInput } from '@/components/responsive';

<ResponsiveInput 
  label="Email" 
  placeholder="Ingresa tu email"
  size="md"
  icon={<MailIcon />}
  iconPosition="left"
  error="Email requerido"
  helperText="Ingresa un email válido"
/>
```

### ResponsiveModal
Modal responsivo con diferentes tamaños.

```tsx
import { ResponsiveModal } from '@/components/responsive';

<ResponsiveModal 
  isOpen={isOpen} 
  onClose={onClose} 
  title="Título del modal"
  size="lg"
  closable
>
  {/* Contenido del modal */}
</ResponsiveModal>
```

## Componentes de Navegación

### ResponsiveNav
Navegación responsiva con menú móvil.

```tsx
import { ResponsiveNav } from '@/components/responsive';

<ResponsiveNav />
```

### ResponsiveFooter
Footer responsivo con enlaces y redes sociales.

```tsx
import { ResponsiveFooter } from '@/components/responsive';

<ResponsiveFooter />
```

### MobileNav
Navegación móvil con animaciones.

```tsx
import { MobileNav } from '@/components/responsive';

<MobileNav isOpen={isOpen} onClose={onClose} />
```

## Hooks

### useResponsive
Hook para obtener información sobre el tamaño de pantalla.

```tsx
import { useResponsive } from '@/components/responsive';

function MyComponent() {
  const { width, height, isMobile, isTablet, isDesktop } = useResponsive();
  
  return (
    <div>
      {isMobile ? 'Vista móvil' : 'Vista desktop'}
    </div>
  );
}
```

### useBreakpoint
Hook para verificar breakpoints específicos.

```tsx
import { useBreakpoint } from '@/components/responsive';

function MyComponent() {
  const { isSmallScreen, isMediumScreen, isLargeScreen } = useBreakpoint();
  
  return (
    <div>
      {isSmallScreen && 'Contenido para pantallas pequeñas'}
    </div>
  );
}
```

## Utilidades

### getResponsiveClasses
Función para generar clases responsivas.

```tsx
import { getResponsiveClasses } from '@/lib/utils/responsive';

const classes = getResponsiveClasses('text-lg', {
  sm: 'text-xl',
  lg: 'text-2xl'
});
```

### getSpacingClasses
Función para generar clases de espaciado.

```tsx
import { getSpacingClasses } from '@/lib/utils/responsive';

const paddingClasses = getSpacingClasses('lg', 'all');
const marginClasses = getMarginClasses('md', 'y');
```

### getGridClasses
Función para generar clases de grid.

```tsx
import { getGridClasses } from '@/lib/utils/responsive';

const gridClasses = getGridClasses({
  default: 1,
  sm: 2,
  lg: 3
});
```

## Configuración

Los componentes responsivos utilizan la configuración definida en `lib/config/responsive.ts`:

```tsx
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
  // ... más configuración
};
```

## Mejores Prácticas

1. **Usa componentes responsivos**: Prefiere los componentes responsivos sobre los componentes estándar.

2. **Configura breakpoints**: Ajusta los breakpoints según las necesidades del proyecto.

3. **Optimiza para móvil**: Siempre considera la experiencia móvil primero.

4. **Usa hooks responsivos**: Utiliza los hooks para lógica condicional basada en el tamaño de pantalla.

5. **Mantén consistencia**: Usa el mismo sistema de espaciado y tipografía en toda la aplicación.

## Ejemplos de Uso

### Página responsiva completa

```tsx
import { 
  ResponsiveLayout, 
  ResponsiveSection, 
  ResponsiveGrid, 
  ResponsiveCard,
  ResponsiveText,
  ResponsiveButton 
} from '@/components/responsive';

export default function HomePage() {
  return (
    <ResponsiveLayout background="neural" maxWidth="7xl">
      <ResponsiveSection padding={{ y: 'xl' }}>
        <ResponsiveText size="4xl" weight="bold" color="accent" align="center">
          Título Principal
        </ResponsiveText>
        
        <ResponsiveGrid cols={{ default: 1, sm: 2, lg: 3 }} gap="lg">
          <ResponsiveCard variant="glass" padding="lg" hover interactive>
            <ResponsiveText size="lg" weight="semibold">
              Card 1
            </ResponsiveText>
          </ResponsiveCard>
          
          <ResponsiveCard variant="glass" padding="lg" hover interactive>
            <ResponsiveText size="lg" weight="semibold">
              Card 2
            </ResponsiveText>
          </ResponsiveCard>
          
          <ResponsiveCard variant="glass" padding="lg" hover interactive>
            <ResponsiveText size="lg" weight="semibold">
              Card 3
            </ResponsiveText>
          </ResponsiveCard>
        </ResponsiveGrid>
        
        <ResponsiveButton 
          variant="primary" 
          size="lg" 
          fullWidth 
          className="mt-8"
        >
          Call to Action
        </ResponsiveButton>
      </ResponsiveSection>
    </ResponsiveLayout>
  );
}
```

Este sistema de componentes responsivos proporciona una base sólida para crear interfaces que se adapten perfectamente a todos los tamaños de pantalla.

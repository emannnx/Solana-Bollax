import React from 'react';
import { cn } from '@/lib/utils';

// Modern Layout Components with Enhanced Design System

// Main Container
interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Container: React.FC<ContainerProps> = ({ 
  className, 
  size = 'lg',
  children, 
  ...props 
}) => {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl', 
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  };

  return (
    <div 
      className={cn('mx-auto px-4 sm:px-6 lg:px-8', sizeClasses[size], className)}
      {...props}
    >
      {children}
    </div>
  );
};

// Section Wrapper
interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'glass' | 'gradient' | 'hero';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Section: React.FC<SectionProps> = ({
  className,
  variant = 'default',
  padding = 'lg',
  children,
  ...props
}) => {
  const variantClasses = {
    default: '',
    glass: 'glass',
    gradient: 'gradient-surface',
    hero: 'gradient-hero relative overflow-hidden'
  };

  const paddingClasses = {
    none: '',
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-24'
  };

  return (
    <section 
      className={cn(
        'relative',
        variantClasses[variant],
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
};

// Grid System
interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
}

export const Grid: React.FC<GridProps> = ({
  className,
  cols = 1,
  gap = 'md',
  responsive = true,
  children,
  ...props
}) => {
  const colsClasses = {
    1: 'grid-cols-1',
    2: responsive ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2',
    3: responsive ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-3',
    4: responsive ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-4',
    5: responsive ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5' : 'grid-cols-5',
    6: responsive ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6' : 'grid-cols-6',
  };

  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12'
  };

  return (
    <div 
      className={cn('grid', colsClasses[cols], gapClasses[gap], className)}
      {...props}
    >
      {children}
    </div>
  );
};

// Stack (Vertical Layout)
interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
}

export const Stack: React.FC<StackProps> = ({
  className,
  gap = 'md',
  align = 'stretch',
  children,
  ...props
}) => {
  const gapClasses = {
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
    xl: 'space-y-8'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };

  return (
    <div 
      className={cn('flex flex-col', gapClasses[gap], alignClasses[align], className)}
      {...props}
    >
      {children}
    </div>
  );
};

// Flex Layout
interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'col';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Flex: React.FC<FlexProps> = ({
  className,
  direction = 'row',
  align = 'center',
  justify = 'start',
  wrap = false,
  gap = 'md',
  children,
  ...props
}) => {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };

  return (
    <div 
      className={cn(
        'flex',
        directionClasses[direction],
        alignClasses[align],
        justifyClasses[justify],
        wrap && 'flex-wrap',
        gapClasses[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Background Effects
export const BackgroundEffects: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {/* Animated Orbs */}
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-success/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
    
    {/* Grid Pattern */}
    <div 
      className="absolute inset-0 opacity-5"
      style={{
        backgroundImage: `
          linear-gradient(hsl(var(--border)) 1px, transparent 1px),
          linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }}
    />
  </div>
);
import React from 'react';

export default function Card({
  children,
  className = '',
  hover = false,
  padding = 'md',
  as: Component = 'div',
  ...props
}) {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-5',
    lg: 'p-6 sm:p-7',
  }[padding] || 'p-4 sm:p-5';

  const hoverClass = hover 
    ? 'transition-all duration-150 hover:shadow-xs hover:border-slate-300' 
    : '';

  return (
    <Component
      className={`bg-white rounded-xl border border-slate-200/90 shadow-2xs ${paddingClasses} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

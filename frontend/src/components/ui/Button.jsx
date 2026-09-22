import React from 'react';

const VARIANTS = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs border border-transparent focus:ring-indigo-500',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 focus:ring-slate-400',
  outline: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 focus:ring-indigo-500 shadow-2xs',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-transparent',
  danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-2xs border border-transparent focus:ring-rose-500',
  pro: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xs focus:ring-amber-400 border border-transparent',
};

const SIZES = {
  xs: 'px-2.5 py-1 text-xs rounded-md gap-1.5',
  sm: 'px-3 py-1.5 text-xs font-semibold rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm font-semibold rounded-lg gap-2',
  lg: 'px-5 py-2.5 text-base font-semibold rounded-xl gap-2.5',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  icon: Icon,
  iconRight: IconRight,
  type = 'button',
  onClick,
  ...props
}) {
  const variantClasses = VARIANTS[variant] || VARIANTS.primary;
  const sizeClasses = SIZES[size] || SIZES.md;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center font-medium transition duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-1 select-none ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 flex-shrink-0" />
      ) : null}
      
      {children && <span>{children}</span>}

      {!loading && IconRight && <IconRight className="w-4 h-4 flex-shrink-0" />}
    </button>
  );
}

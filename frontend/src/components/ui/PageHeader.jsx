import React from 'react';

export default function PageHeader({
  title,
  description,
  breadcrumbs = [],
  action,
  icon: Icon,
  className = '',
}) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 sm:pb-5 border-b border-slate-200 ${className}`}>
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {crumb.to ? (
                  <a href={crumb.to} className="hover:text-indigo-600 transition">
                    {crumb.label}
                  </a>
                ) : (
                  <span className="font-medium text-slate-700">{crumb.label}</span>
                )}
                {idx < breadcrumbs.length - 1 && <span className="text-slate-300">/</span>}
              </React.Fragment>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {title}
          </h1>
        </div>

        {description && (
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}

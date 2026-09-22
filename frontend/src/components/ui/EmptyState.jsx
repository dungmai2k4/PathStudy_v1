import React from 'react';
import { FolderOpen } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  icon: Icon = FolderOpen,
  title = 'Không có dữ liệu',
  description = 'Hiện tại chưa có mục nào để hiển thị trong phần này.',
  actionLabel,
  onAction,
  actionTo,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white rounded-xl border border-dashed border-slate-300 ${className}`}>
      <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-slate-800 mb-1">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-4">
        {description}
      </p>
      {(actionLabel && (onAction || actionTo)) && (
        actionTo ? (
          <a
            href={actionTo}
            className="inline-flex items-center justify-center font-medium transition duration-150 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs"
          >
            {actionLabel}
          </a>
        ) : (
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        )
      )}
    </div>
  );
}

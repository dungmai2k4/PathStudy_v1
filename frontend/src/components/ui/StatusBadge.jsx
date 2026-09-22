import React from 'react';
import { CheckCircle2, AlertTriangle, Lock, Clock, Sparkles, Shield, User, XCircle } from 'lucide-react';

const STATUS_CONFIGS = {
  // Learning states
  COMPLETED: {
    label: 'Đã hoàn thành',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle2,
  },
  PASSED: {
    label: 'Đạt chuẩn',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle2,
  },
  UNLOCKED: {
    label: 'Đang học',
    bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: Sparkles,
  },
  IN_PROGRESS: {
    label: 'Đang làm',
    bg: 'bg-sky-50 text-sky-700 border-sky-200',
    icon: Clock,
  },
  LOCKED: {
    label: 'Chưa mở',
    bg: 'bg-slate-100 text-slate-500 border-slate-200',
    icon: Lock,
  },
  NEEDS_REMEDIATION: {
    label: 'Cần bổ trợ',
    bg: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: AlertTriangle,
  },
  REMEDIATION_ACTIVE: {
    label: 'Đang bổ trợ',
    bg: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: AlertTriangle,
  },

  // Account states
  ACTIVE: {
    label: 'Hoạt động',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle2,
  },
  BLOCKED: {
    label: 'Bị khóa',
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: XCircle,
  },

  // Roles
  STUDENT: {
    label: 'Học sinh',
    bg: 'bg-sky-50 text-sky-700 border-sky-200',
    icon: User,
  },
  MANAGER: {
    label: 'Quản lý',
    bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: Shield,
  },
  ADMIN: {
    label: 'Quản trị viên',
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: Shield,
  },

  // Membership
  PRO: {
    label: 'PRO MEMBER',
    bg: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: Sparkles,
  },
  STANDARD: {
    label: 'STANDARD',
    bg: 'bg-slate-100 text-slate-600 border-slate-200',
    icon: User,
  },
};

export default function StatusBadge({ status, customLabel, size = 'sm', className = '' }) {
  const normStatus = (status || '').toUpperCase();
  const config = STATUS_CONFIGS[normStatus] || {
    label: customLabel || status,
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: null,
  };

  const Icon = config.icon;
  const sizeClasses = size === 'xs' 
    ? 'px-2 py-0.5 text-[11px] gap-1' 
    : 'px-2.5 py-1 text-xs gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-md border tracking-wide uppercase ${config.bg} ${sizeClasses} ${className}`}
    >
      {Icon && <Icon className={size === 'xs' ? 'w-3 h-3 flex-shrink-0' : 'w-3.5 h-3.5 flex-shrink-0'} />}
      <span>{customLabel || config.label}</span>
    </span>
  );
}

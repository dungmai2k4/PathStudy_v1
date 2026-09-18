import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Sparkles, User, LogOut, Award, ShieldCheck, FolderKanban } from 'lucide-react';

export default function Navbar() {
  const { user, isPro, logout } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;

  const userRoles = (user?.roles || []).map((r) => r.replace('ROLE_', '').toUpperCase());
  const isAdmin = userRoles.includes('ADMIN');
  const isManager = userRoles.includes('MANAGER');

  const navLinks = [
    { label: 'Tổng quan', to: '/', isActive: pathname === '/' },
    { label: 'Lộ trình học', to: '/study-path/english', isActive: pathname.startsWith('/study-path') },
    { label: 'Môn học', to: '/subjects', isActive: pathname.startsWith('/subjects') },
    { label: 'Hồ sơ học tập', to: '/profile', isActive: pathname.startsWith('/profile') },
  ];

  if (!isAdmin && !isManager) {
    navLinks.push({
      label: 'Gói Pro',
      to: '/subscription',
      isActive: pathname.startsWith('/subscription'),
      icon: Sparkles,
      iconClass: 'text-amber-500',
    });
  }

  // Manager navigation
  if (isManager || isAdmin) {
    navLinks.push({
      label: 'Quản lý học thuật',
      to: '/manager',
      isActive: pathname.startsWith('/manager'),
      icon: FolderKanban,
      iconClass: 'text-indigo-600',
    });
  }

  // Admin navigation
  if (isAdmin) {
    navLinks.push({
      label: 'Quản trị hệ thống',
      to: '/admin/users',
      isActive: pathname.startsWith('/admin'),
      icon: ShieldCheck,
      iconClass: 'text-rose-600',
    });
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 font-bold text-lg text-indigo-700 tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <BookOpen className="w-4 h-4" />
              </div>
              <span>PathStudy</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`relative px-3.5 py-2 rounded-md text-sm transition flex items-center gap-1.5 ${
                      item.isActive
                        ? 'text-indigo-600 font-semibold bg-indigo-50/70'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
                    }`}
                  >
                    {Icon && <Icon className={`w-4 h-4 ${item.iconClass || ''}`} />}
                    <span>{item.label}</span>
                    {item.isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-indigo-600 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                <span>ADMINISTRATOR</span>
              </div>
            ) : isManager ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <FolderKanban className="w-3.5 h-3.5 text-indigo-600" />
                <span>CONTENT MANAGER</span>
              </div>
            ) : isPro ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>PRO STUDENT</span>
              </div>
            ) : (
              <Link
                to="/subscription"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Nâng cấp Pro
              </Link>
            )}

            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-slate-800 leading-tight">{user?.username}</div>
                  <div className="text-[11px] text-slate-500">
                    {user?.roles?.join(', ')}
                  </div>
                </div>
              </div>

              <button
                onClick={logout}
                title="Đăng xuất"
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

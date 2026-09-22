import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, LogIn, UserPlus, LogOut, Crown, LayoutDashboard, Menu, X, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';

export default function PublicHeader() {
  const { user, isPro, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userRoles = (user?.roles || []).map((r) => r.replace('ROLE_', '').toUpperCase());
  const isAdmin = userRoles.includes('ADMIN');
  const isManager = userRoles.includes('MANAGER');

  let dashboardUrl = '/dashboard';
  let dashboardLabel = 'Vào bàn học';
  if (isAdmin) {
    dashboardUrl = '/admin/users';
    dashboardLabel = 'Quản trị hệ thống';
  } else if (isManager) {
    dashboardUrl = '/manager';
    dashboardLabel = 'Quản lý học thuật';
  }

  const isStudent = user && !isAdmin && !isManager;

  const navLinks = [
    { label: 'Trang chủ', to: '/' },
    { label: 'Danh mục môn', to: '/subjects' },
    { label: 'Gói đăng ký', to: '/subscription' },
  ];

  const studentLinks = isStudent ? [
    { label: 'Bàn học', to: '/dashboard' },
    { label: 'Lộ trình học', to: '/study-path' },
  ] : [];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Link to="/" className="flex items-center gap-2.5 font-bold text-lg text-indigo-700 tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-slate-900">PathStudy</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      isActive
                        ? 'text-indigo-600 bg-indigo-50/70 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {studentLinks.length > 0 && (
                <div className="h-4 w-px bg-slate-200 mx-1" />
              )}

              {studentLinks.map((item) => {
                const isActive = location.pathname === item.to || (item.to.includes('study-path') && location.pathname.startsWith('/study-path'));
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      isActive
                        ? 'text-indigo-600 bg-indigo-50/70 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Desktop Right Side CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {isPro ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    <Crown className="w-3.5 h-3.5 text-amber-600" />
                    <span>PRO</span>
                  </span>
                ) : (
                  <Link
                    to="/subscription"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition"
                  >
                    <span>Nâng cấp Pro</span>
                  </Link>
                )}

                <div className="flex items-center gap-2 pl-3 border-l border-slate-200 text-xs">
                  <Link to={dashboardUrl} className="font-semibold text-slate-800 hover:text-indigo-600 transition">
                    {user.username}
                  </Link>
                  <button
                    onClick={logout}
                    title="Đăng xuất"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link to="/login">
                  <Button variant="ghost" size="sm" icon={LogIn}>
                    Đăng nhập
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" icon={UserPlus}>
                    Bắt đầu học miễn phí
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between ${
                  location.pathname === item.to
                    ? 'text-indigo-600 bg-indigo-50 font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            ))}

            {studentLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between ${
                  location.pathname === item.to
                    ? 'text-indigo-600 bg-indigo-50 font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-100">
            {user ? (
              <div className="space-y-2">
                <Link
                  to={dashboardUrl}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-indigo-600 text-white font-semibold text-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{dashboardLabel}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-slate-600 hover:bg-slate-100 text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng xuất ({user.username})</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Đăng nhập</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-indigo-600 text-white text-sm font-semibold"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Đăng ký</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

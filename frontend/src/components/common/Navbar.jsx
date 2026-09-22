import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, User, LogOut, Award, ShieldCheck, FolderKanban, HelpCircle, Crown } from 'lucide-react';

export default function Navbar() {
  const { user, isPro, logout } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;

  const userRoles = (user?.roles || []).map((r) => r.replace('ROLE_', '').toUpperCase());
  const isAdmin = userRoles.includes('ADMIN');
  const isManager = userRoles.includes('MANAGER');

  // Format role label gọn hơn cho phần hiển thị dưới username
  const roleLabel = isPro ? 'PRO MEMBER' : userRoles.join(', ');

  let navLinks = [];
  let homeUrl = '/';

  if (isAdmin) {
    homeUrl = '/admin/users';
    navLinks = [
      {
        label: 'Quản trị hệ thống',
        to: '/admin/users',
        isActive: pathname.startsWith('/admin'),
        icon: ShieldCheck,
        iconClass: 'text-rose-600',
      },
    ];
  } else if (isManager) {
    homeUrl = '/manager';
    navLinks = [
      {
        label: 'Tổng quan học thuật',
        to: '/manager',
        isActive: pathname === '/manager',
        icon: FolderKanban,
        iconClass: 'text-indigo-600',
      },
      {
        label: 'Nội dung học thuật',
        to: '/manager/content',
        isActive: pathname.startsWith('/manager/content'),
        icon: BookOpen,
        iconClass: 'text-indigo-600',
      },
      {
        label: 'Ngân hàng câu hỏi',
        to: '/manager/questions',
        isActive: pathname.startsWith('/manager/questions'),
        icon: HelpCircle,
        iconClass: 'text-indigo-600',
      },
    ];
  } else {
    homeUrl = '/';
    navLinks = [
      { label: 'Tổng quan', to: '/', isActive: pathname === '/' },
      { label: 'Lộ trình học', to: '/study-path', isActive: pathname.startsWith('/study-path') },
      { label: 'Môn học', to: '/subjects', isActive: pathname.startsWith('/subjects') },
      { label: 'Hồ sơ học tập', to: '/profile', isActive: pathname.startsWith('/profile') },
    ];

    // Luôn hiển thị link subscription cho student; đổi label khi đã Pro
    navLinks.push(
      isPro
        ? {
            label: 'Pro',
            to: '/subscription',
            isActive: pathname.startsWith('/subscription'),
            icon: Crown,
            iconClass: 'text-amber-600',
            isProBadge: true,
          }
        : {
            label: 'Gói Pro',
            to: '/subscription',
            isActive: pathname.startsWith('/subscription'),
            icon: Award,
            iconClass: 'text-slate-500',
          }
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to={homeUrl} className="flex items-center gap-2.5 font-bold text-lg text-indigo-700 tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <BookOpen className="w-4 h-4" />
              </div>
              <span>PathStudy</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                // Nav item "Pro" (khi đã đăng ký) có style amber đặc biệt
                if (item.isProBadge) {
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`relative px-3.5 py-2 rounded-md text-sm font-semibold transition flex items-center gap-1.5 ${
                        item.isActive
                          ? 'text-amber-600 bg-amber-50'
                          : 'text-amber-500 hover:text-amber-600 hover:bg-amber-50/70'
                      }`}
                    >
                      {Icon && <Icon className="w-4 h-4 text-amber-500" />}
                      <span>{item.label}</span>
                      {item.isActive && (
                        <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-amber-500 rounded-full" />
                      )}
                    </Link>
                  );
                }
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
              <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                <span>PRO</span>
              </div>
            ) : (
              <Link
                to="/subscription"
                className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                <span>Nâng cấp Pro</span>
              </Link>
            )}

            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    isPro
                      ? 'bg-amber-50 border border-amber-200 text-amber-700'
                      : 'bg-slate-100 border border-slate-200 text-slate-600'
                  }`}
                >
                  {isPro ? (
                    <Crown className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-slate-800 leading-tight">{user?.username}</div>
                  <div className={`text-[11px] font-medium leading-tight ${isPro ? 'text-amber-700 font-semibold' : 'text-slate-500'}`}>
                    {roleLabel}
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

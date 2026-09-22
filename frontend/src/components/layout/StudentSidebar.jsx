import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  LayoutDashboard,
  Compass,
  GraduationCap,
  Sparkles,
  Award,
  Crown,
  User,
  LogOut,
  ChevronRight,
  ClipboardCheck,
} from 'lucide-react';

export default function StudentSidebar({ isMobile = false, onCloseMobile }) {
  const { user, isPro, logout } = useAuth();

  const navItems = [
    {
      to: '/dashboard',
      label: 'Bàn học tổng quan',
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: '/study-path',
      label: 'Lộ trình học tập',
      icon: Compass,
      end: false,
    },
    {
      to: '/subjects',
      label: 'Danh mục môn học',
      icon: GraduationCap,
      end: false,
    },
    {
      to: '/assessment/placement',
      label: 'Khảo sát năng lực',
      icon: ClipboardCheck,
      end: false,
    },
    {
      to: '/subscription',
      label: isPro ? 'Gói Pro thành viên' : 'Nâng cấp Pro',
      icon: isPro ? Crown : Award,
      end: false,
      isProHighlight: !isPro,
    },
    {
      to: '/profile',
      label: 'Hồ sơ học sinh',
      icon: User,
      end: false,
    },
  ];

  const handleNavClick = () => {
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside className="w-64 h-full bg-white border-r border-slate-200 flex flex-col justify-between select-none">
      {/* Sidebar Header */}
      <div>
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <Link to="/dashboard" onClick={handleNavClick} className="flex items-center gap-2.5 font-bold text-lg text-indigo-700 tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-900 leading-tight">PathStudy</span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">Học sinh THPT</span>
            </div>
          </Link>
        </div>

        {/* Student Profile Snapshot Card */}
        <div className="p-4 mx-3 my-3 bg-slate-50 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${
              isPro ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-indigo-100 text-indigo-700'
            }`}>
              {isPro ? <Crown className="w-4 h-4 text-amber-600" /> : (user?.username?.charAt(0)?.toUpperCase() || 'S')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-800 truncate">{user?.username}</div>
              <div className="flex items-center gap-1 mt-0.5">
                {isPro ? (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">PRO</span>
                ) : (
                  <span className="text-[10px] font-medium text-slate-500">Học viên chuẩn</span>
                )}
                {user?.grade && <span className="text-[10px] text-slate-400">• K{user.grade}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="px-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 shadow-2xs font-bold'
                      : item.isProHighlight
                      ? 'text-amber-800 bg-amber-50/50 hover:bg-amber-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 transition ${
                    item.isProHighlight ? 'text-amber-600' : ''
                  }`} />
                  <span>{item.label}</span>
                </div>
                {item.isProHighlight && (
                  <span className="text-[9px] uppercase px-1.5 py-0.5 font-bold bg-amber-500 text-white rounded">Mới</span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer / Quick Logout */}
      <div className="p-3 border-t border-slate-100">
        <button
          onClick={logout}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    </aside>
  );
}

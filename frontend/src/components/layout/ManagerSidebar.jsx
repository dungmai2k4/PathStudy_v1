import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FolderKanban,
  BookOpen,
  HelpCircle,
  LogOut,
  ChevronRight,
  Shield,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

export default function ManagerSidebar({ isMobile = false, onCloseMobile }) {
  const { user, logout } = useAuth();

  const navItems = [
    {
      to: '/manager',
      label: 'Tổng quan học thuật',
      icon: FolderKanban,
      end: true,
    },
    {
      to: '/manager/content',
      label: 'Cấu trúc môn & Kỹ năng',
      icon: BookOpen,
      end: false,
    },
    {
      to: '/manager/questions',
      label: 'Ngân hàng đề & Câu hỏi',
      icon: HelpCircle,
      end: false,
    },
  ];

  const handleNavClick = () => {
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside className="w-64 h-full bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between select-none">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-5 border-b border-slate-800">
          <Link to="/manager" onClick={handleNavClick} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
              <FolderKanban className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white text-base tracking-tight leading-tight">PathStudy</span>
              <span className="text-[10px] font-semibold text-indigo-400 tracking-wider uppercase">Content Studio</span>
            </div>
          </Link>
        </div>

        {/* Manager User Pill */}
        <div className="p-3 mx-3 my-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs">
              <Shield className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">{user?.username}</div>
              <div className="text-[10px] font-medium text-indigo-300">Quản lý đào tạo</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-3 pt-2">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Phân hệ học thuật
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                      isActive
                        ? 'bg-indigo-600 text-white font-bold shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-slate-800 space-y-1">
        <Link
          to="/"
          className="flex items-center justify-between px-3 py-2 text-xs text-slate-400 hover:text-slate-200 transition rounded-lg hover:bg-slate-800"
        >
          <span className="flex items-center gap-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Trang công khai</span>
          </span>
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        </button>
      </div>
    </aside>
  );
}

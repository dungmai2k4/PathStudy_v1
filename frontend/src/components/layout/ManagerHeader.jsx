import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, FolderKanban, LogOut } from 'lucide-react';

export default function ManagerHeader({ onOpenMobileSidebar }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getTitle = (path) => {
    if (path.startsWith('/manager/content')) return 'Cấu Trúc Môn & Kỹ Năng';
    if (path.startsWith('/manager/questions')) return 'Ngân Hàng Đề Thi & Câu Hỏi';
    return 'Tổng Quan Quản Lý Học Thuật';
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Quản lý nội dung</span>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-800">{getTitle(location.pathname)}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <FolderKanban className="w-3.5 h-3.5 text-indigo-600" />
          <span className="hidden sm:inline">CONTENT MANAGER</span>
        </span>

        <div className="flex items-center gap-2 pl-3 border-l border-slate-200 text-xs">
          <span className="font-semibold text-slate-700">{user?.username}</span>
          <button
            onClick={logout}
            title="Đăng xuất"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Sparkles, User, LogOut, Award } from 'lucide-react';

export default function Navbar() {
  const { user, isPro, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 font-bold text-xl text-indigo-600 tracking-tight">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
                <BookOpen className="w-5 h-5" />
              </div>
              <span>PathStudy</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition"
              >
                Tổng quan
              </Link>
              <Link
                to="/study-path/english"
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition flex items-center gap-1.5"
              >
                <span>Lộ trình học</span>
              </Link>
              <Link
                to="/subjects"
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition flex items-center gap-1.5"
              >
                <span>Môn học</span>
              </Link>
              <Link
                to="/profile"
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition"
              >
                Hồ sơ học tập
              </Link>
              <Link
                to="/subscription"
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                Gói Pro
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isPro ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 shadow-xs">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>PRO STUDENT</span>
              </div>
            ) : (
              <Link
                to="/subscription"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Nâng cấp Pro
              </Link>
            )}

            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-600">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-slate-800">{user?.username}</div>
                  <div className="text-xs text-slate-500">
                    {user?.roles?.join(', ')}
                  </div>
                </div>
              </div>

              <button
                onClick={logout}
                title="Đăng xuất"
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
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

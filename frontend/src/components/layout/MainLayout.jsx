import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../common/Navbar';

export default function MainLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Only study-path detail pages (with sidebar) use a full-width zero-padding layout
  const isStudyPathDetail = location.pathname.startsWith('/study-path/') && location.pathname !== '/study-path';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-slate-600">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      {isStudyPathDetail ? (
        <main className="flex-1 w-full overflow-hidden">
          <Outlet />
        </main>
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <Outlet />
        </main>
      )}
      {!isStudyPathDetail && (
        <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
            © 2026 PathStudy — Nền tảng học tập thích ứng thông minh
          </div>
        </footer>
      )}
    </div>
  );
}

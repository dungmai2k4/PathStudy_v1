import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../common/Navbar';

export default function MainLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // study-path pages use a sidebar layout - remove container padding
  const isStudyPath = location.pathname.startsWith('/study-path');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-slate-600">Dang tai du lieu...</span>
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
      {isStudyPath ? (
        <main className="flex-1 w-full overflow-hidden">
          <Outlet />
        </main>
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      )}
      {!isStudyPath && (
        <footer className="border-t border-slate-200 bg-white py-6">
          <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
            2026 PathStudy - Adaptive Learning Platform.
          </div>
        </footer>
      )}
    </div>
  );
}

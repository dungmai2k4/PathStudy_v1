import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export default function RoleProtectedRoute({ allowedRoles = [] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-slate-600">Đang kiểm tra quyền truy cập...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectUrl}`} replace />;
  }

  const userRoles = (user.roles || []).map((r) => r.replace('ROLE_', '').toUpperCase());
  const hasPermission =
    allowedRoles.length === 0 ||
    allowedRoles.some((role) => userRoles.includes(role.replace('ROLE_', '').toUpperCase()));

  if (!hasPermission) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Truy cập bị từ chối</h2>
        <p className="text-sm text-slate-600 max-w-md mb-6">
          Tài khoản của bạn ({user.username} - vai trò: {userRoles.join(', ')}) không có quyền truy cập vào phân hệ này.
        </p>
        <a
          href="/"
          className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition"
        >
          Quay lại Bảng điều khiển
        </a>
      </div>
    );
  }

  return <Outlet />;
}

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import { User, GraduationCap, CheckCircle2, AlertCircle, Save } from 'lucide-react';

export default function StudentProfilePage() {
  const { user, isPro } = useAuth();
  const [fullName, setFullName] = useState('');
  const [grade, setGrade] = useState('10');
  const [className, setClassName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await authService.getProfile();
        if (data) {
          if (data.fullName) setFullName(data.fullName);
          if (data.grade) setGrade(data.grade.toString());
          if (data.className) setClassName(data.className);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      await authService.updateProfile({ fullName, grade, className });
      setMessage('Cập nhật hồ sơ học tập thành công!');
    } catch (err) {
      setError('Cập nhật thất bại. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-slate-500 text-sm">
        Đang tải thông tin hồ sơ...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Hồ Sơ Học Sinh</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Cập nhật thông tin khối lớp để hệ thống PathStudy tối ưu hóa lộ trình học và nội dung thích ứng phù hợp.
        </p>
      </div>

      {message && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center gap-3.5 pb-5 border-b border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold text-lg">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-800">{user?.username}</div>
              <div className="text-xs text-slate-500 mt-0.5">
                Mã định danh (User ID): <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{user?.userId}</code>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {user?.roles?.join(', ')}
                </span>
                {isPro && (
                  <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    PRO STUDENT
                  </span>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Họ và tên học sinh
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ví dụ: Nguyễn Văn An"
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Khối Lớp (Grade)
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm bg-white"
              >
                <option value="10">Khối 10 (THPT)</option>
                <option value="11">Khối 11 (THPT)</option>
                <option value="12">Khối 12 (THPT)</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Lộ trình học tập và placement test sẽ được tinh chỉnh theo khối lớp này.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Lớp học (Không bắt buộc)
              </label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Ví dụ: 10A1"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                (Tùy chọn) Để kết nối với lớp học tại trường nếu có.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Lưu thay đổi</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

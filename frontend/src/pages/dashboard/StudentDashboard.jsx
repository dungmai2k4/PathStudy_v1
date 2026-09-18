import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import {
  Compass,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  GraduationCap,
  BookOpen,
  BarChart3,
  Award,
} from 'lucide-react';

export default function StudentDashboard() {
  const { user, isPro } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getProfile();
        setProfile(data);
      } catch (err) {
        console.error('Failed to fetch student profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white p-8 shadow-xl shadow-indigo-200">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-indigo-100 mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>
              {profile?.grade ? `Học sinh Khối ${profile.grade} (${profile.className || 'Chưa cập nhật lớp'})` : 'Học sinh PathStudy'}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Xin chào, {user?.username}! 👋
          </h1>
          <p className="mt-2 text-indigo-100 text-base leading-relaxed">
            Hệ thống học tập thích ứng (Adaptive Learning) đang theo dõi và tối ưu hóa lộ trình học riêng biệt cho bạn dựa trên năng lực thực tế.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => alert('Chức năng Placement Test sẽ được kích hoạt khi triển khai Phase 5 (Assessment Service)!')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-700 font-semibold text-sm hover:bg-indigo-50 transition shadow-sm cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Làm bài Placement Test</span>
            </button>

            {!isPro && (
              <Link
                to="/subscription"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Nâng cấp Pro mở rộng kho bài tập</span>
              </Link>
            )}
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">Khởi tạo</div>
            <div className="text-xs text-slate-500 font-medium">Lộ trình học thích ứng</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">0 / 12</div>
            <div className="text-xs text-slate-500 font-medium">Kỹ năng hoàn thành</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">-- %</div>
            <div className="text-xs text-slate-500 font-medium">Tỷ lệ chính xác (Accuracy)</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">
              {isPro ? 'Pro Active' : 'Gói Cơ Bản'}
            </div>
            <div className="text-xs text-slate-500 font-medium">Hạng thành viên</div>
          </div>
        </div>
      </div>

      {/* Adaptive Roadmap Architecture Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Quy trình học tập thích ứng</h2>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-indigo-50 text-indigo-700">
              Rule-based System
            </span>
          </div>

          <div className="space-y-4 text-sm text-slate-600">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                1
              </div>
              <div>
                <span className="font-semibold text-slate-800">Xác thực & Hồ sơ học sinh (Phase 2):</span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tài khoản đăng ký bảo mật bằng JWT và BCrypt, ghi nhận thông tin khối lớp và trạng thái Pro subscription.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                2
              </div>
              <div>
                <span className="font-semibold text-slate-800">Khảo sát năng lực (Placement Test — Phase 5):</span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Đánh giá trình độ ban đầu để xác định điểm xuất phát tối ưu trên cây kỹ năng.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                3
              </div>
              <div>
                <span className="font-semibold text-slate-800">Điều chỉnh lộ trình thích ứng (Adaptive Learning — Phase 6):</span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tự động gợi ý Remedial khi độ chính xác dưới 60%, tăng độ khó khi đạt trên 85%, và kích hoạt bài Retest.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pro Account Status Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-900">Quyền lợi tài khoản Pro</h2>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Không giới hạn số lần làm bài Retest</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Mở khóa toàn bộ ngân hàng câu hỏi nâng cao</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Phân tích năng lực chuyên sâu (Skill Profile)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Nội dung bổ trợ (Remedial) được cá nhân hóa cao</span>
              </li>
            </ul>
          </div>

          <Link
            to="/subscription"
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs text-center transition flex items-center justify-center gap-2"
          >
            <span>{isPro ? 'Quản lý gói Pro' : 'Xem các gói nâng cấp'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

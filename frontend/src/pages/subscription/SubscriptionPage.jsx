import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import { Sparkles, Check, Award, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SubscriptionPage() {
  const { isPro, refreshUser } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const data = await authService.getSubscriptionPlans();
        setPlans(data || []);
      } catch (err) {
        console.error('Failed to load plans:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPlans();
  }, []);

  const handleSubscribe = async (planCode) => {
    setSubscribing(planCode);
    setMessage('');
    setError('');

    try {
      await authService.subscribe(planCode);
      await refreshUser();
      setMessage('Nâng cấp tài khoản Pro thành công! Toàn bộ quyền lợi nâng cao đã được kích hoạt.');
    } catch (err) {
      setError('Kích hoạt gói không thành công. Vui lòng thử lại.');
    } finally {
      setSubscribing(null);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 text-xs font-semibold mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>PathStudy Pro Subscription</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Nâng Cấp Tài Khoản Pro
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
          Mở khóa toàn diện tiềm năng học tập với các tính năng thích ứng chuyên sâu, kho học liệu nâng cao và không giới hạn lượt Retest.
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

      {isPro && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-amber-900">Bạn hiện đang là thành viên PRO!</div>
            <div className="text-xs text-amber-700">
              Bạn có thể gia hạn bất kỳ lúc nào để kéo dài thêm thời hạn gói dịch vụ.
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-slate-500 text-xs sm:text-sm">
          Đang tải danh sách gói Pro...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-indigo-500 p-6 shadow-xs transition duration-150 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-slate-900">{plan.name}</h3>
                  <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {plan.durationDays} Ngày
                  </span>
                </div>

                <div className="mb-5">
                  <span className="text-2xl sm:text-3xl font-bold text-slate-900">
                    {formatCurrency(plan.priceVnd)}
                  </span>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    / {plan.durationDays} ngày truy cập
                  </span>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 mb-6">
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Không giới hạn bài thi Retest & Placement Test</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Toàn bộ lộ trình học thích ứng & bài kiểm tra chuyên sâu</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Tự động kích hoạt bài tập ôn luyện bổ trợ (Remedial)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Phân tích năng lực chuyên sâu (Skill Profile)</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleSubscribe(plan.code)}
                disabled={subscribing === plan.code}
                className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {subscribing === plan.code ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{isPro ? 'Gia hạn gói' : 'Đăng ký ngay'}</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

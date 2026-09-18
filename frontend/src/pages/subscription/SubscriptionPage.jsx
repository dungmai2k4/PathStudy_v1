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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>PathStudy Pro Subscription</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Nâng Cấp Tài Khoản Pro
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Mở khóa toàn diện tiềm năng học tập với các tính năng thích ứng chuyên sâu, ngân hàng câu hỏi nâng cao và không giới hạn Retest.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isPro && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
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
        <div className="py-12 text-center text-slate-500 text-sm">
          Đang tải danh sách gói Pro...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-3xl border-2 border-slate-200 hover:border-indigo-500 p-8 shadow-sm transition duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                    {plan.durationDays} Ngày
                  </span>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-extrabold text-slate-900">
                    {formatCurrency(plan.priceVnd)}
                  </span>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    / {plan.durationDays} ngày truy cập
                  </span>
                </div>

                <ul className="space-y-3 text-sm text-slate-600 mb-8">
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>Không giới hạn bài thi Retest & Placement Test</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>Toàn bộ ngân hàng câu hỏi phân cấp độ khó (1 - 5)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>Tự động tạo bài tập bổ trợ thích ứng (Remedial)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>Hỗ trợ phân tích tiến độ học tập chi tiết theo từng kỹ năng</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleSubscribe(plan.code)}
                disabled={subscribing === plan.code}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-200 transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
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

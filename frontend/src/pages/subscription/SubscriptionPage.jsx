import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import paymentService from '../../services/paymentService';
import VietQRPaymentModal from '../../components/payment/VietQRPaymentModal';
import {
  Sparkles,
  Check,
  Award,
  AlertCircle,
  CheckCircle2,
  QrCode,
  History,
  ShieldCheck,
  RefreshCw,
  Clock,
  XCircle,
  Lock,
} from 'lucide-react';

export default function SubscriptionPage() {
  const { user, isPro, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('plans'); // 'plans' | 'history'
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creatingOrder, setCreatingOrder] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null); // Đơn hàng đang hiển thị trong VietQR Modal
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Transactions History State
  const [orders, setOrders] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const data = await authService.getSubscriptionPlans();
      setPlans(data || []);
    } catch (err) {
      console.error('Failed to load plans:', err);
      setError('Không thể tải danh sách gói Pro.');
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    setLoadingHistory(true);
    try {
      const data = await paymentService.getMyOrders();
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to load order history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'history') {
      loadOrders();
    }
  };

  // Tạo đơn hàng thanh toán VietQR
  const handleCreateOrder = async (planCode) => {
    // Kiểm tra nhanh phía client
    if (user?.activePlanCodes?.includes(planCode)) {
      setError('Bạn hiện đang sử dụng gói này và chưa hết hạn. Không thể mua trùng lặp!');
      return;
    }

    setCreatingOrder(planCode);
    setMessage('');
    setError('');

    try {
      const order = await paymentService.createVietQROrder(planCode);
      if (order && order.orderCode) {
        setActiveOrder(order);
      } else {
        setError('Không tạo được đơn hàng thanh toán VietQR.');
      }
    } catch (err) {
      console.error('Create order error:', err);
      setError(
        err?.response?.data?.message ||
          'Không thể khởi tạo đơn hàng VietQR. Vui lòng thử lại sau.'
      );
    } finally {
      setCreatingOrder(null);
    }
  };

  // Xử lý khi thanh toán thành công từ VietQR Modal
  const handlePaymentSuccess = async (completedOrder) => {
    try {
      await refreshUser();
    } catch (err) {
      console.error('Error refreshing user status:', err);
    }
    setMessage(
      `Thanh toán đơn hàng ${completedOrder?.orderCode || ''} thành công! Quyền lợi thành viên PRO đã được kích hoạt.`
    );
  };

  const formatCurrency = (val) => {
    if (!val && val !== 0) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const formatDate = (isoString) => {
    if (!isoString) return '--';
    const d = new Date(isoString);
    return d.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Kiểm tra xem đơn hàng PENDING đã quá 5 phút chưa
  const isOrderExpired = (ord) => {
    if (ord.status === 'EXPIRED') return true;
    if (ord.status !== 'PENDING') return false;
    const createdMs = new Date(ord.createdAt).getTime();
    return createdMs + 5 * 60 * 1000 <= Date.now();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>PathStudy Pro Subscription</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Nâng Cấp Tài Khoản Pro
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
          Mở khóa toàn diện tiềm năng học tập với các tính năng thích ứng chuyên sâu, kho học liệu
          nâng cao và không giới hạn lượt thi Retest.
        </p>
      </div>

      {/* Thông báo Thành viên PRO Hiện tại */}
      {isPro && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-amber-900">
                Bạn hiện đang là thành viên PRO!
              </div>
              <div className="text-xs text-amber-700">
                Toàn bộ quyền lợi học tập nâng cao và thích ứng đang có hiệu lực. Bạn có thể gia hạn bất kỳ lúc nào để kéo dài thời hạn.
              </div>
            </div>
          </div>
          <span className="hidden sm:inline-flex px-3 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full shadow-xs">
            ACTIVE PRO
          </span>
        </div>
      )}

      {/* Messages */}
      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => handleTabChange('plans')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'plans'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Gói Pro & Thanh Toán VietQR</span>
        </button>
        <button
          onClick={() => handleTabChange('history')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'history'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Lịch Sử Đơn Hàng & Hóa Đơn</span>
        </button>
      </div>

      {/* Tab 1: Danh sách gói dịch vụ & Cổng thanh toán VietQR */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          {/* Thông tin phương thức thanh toán VietQR */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                MB
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-slate-800 block">
                  Thanh toán chuyển khoản quét mã VietQR tự động
                </span>
                <span className="text-xs text-slate-500">
                  MB Bank — Số TK: <strong>18122004210620</strong> — MAI TIEN DUNG
                </span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Đối soát tự động 24/7 (Hiệu lực 5 phút)</span>
            </div>
          </div>

          {/* Cards Danh Sách Gói */}
          {loading ? (
            <div className="py-16 text-center text-slate-500 text-xs sm:text-sm">
              Đang tải thông tin gói Pro...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {plans.map((plan) => {
                // Kiểm tra nếu tài khoản đang kích hoạt gói này
                const isPlanActive = user?.activePlanCodes?.includes(plan.code);

                return (
                  <div
                    key={plan.id}
                    className={`bg-white rounded-2xl border p-6 shadow-xs transition duration-200 flex flex-col justify-between ${
                      isPlanActive
                        ? 'border-emerald-500 ring-1 ring-emerald-500/30'
                        : 'border-slate-200 hover:border-indigo-500 hover:shadow-md'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                        {isPlanActive ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            ĐANG SỬ DỤNG
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {plan.durationDays} Ngày
                          </span>
                        )}
                      </div>

                      <div className="mb-5">
                        <span className="text-3xl font-extrabold text-slate-900">
                          {formatCurrency(plan.priceVnd)}
                        </span>
                        <span className="text-xs text-slate-500 block mt-1">
                          / {plan.durationDays} ngày trải nghiệm học tập thích ứng
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

                    {/* Nút bấm thanh toán VietQR hoặc Disabled nếu gói đang kích hoạt */}
                    {isPlanActive ? (
                      <button
                        disabled
                        className="w-full py-3 px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-xs sm:text-sm cursor-not-allowed flex items-center justify-center gap-2"
                        title="Bạn đang sở hữu gói này và chưa hết hạn, tạm thời chưa thể mua lại"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Gói đang kích hoạt (Chưa thể mua lại)</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCreateOrder(plan.code)}
                        disabled={creatingOrder === plan.code}
                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-indigo-700 hover:from-red-700 hover:to-indigo-800 text-white font-semibold text-xs sm:text-sm shadow-sm hover:shadow transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {creatingOrder === plan.code ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Đang tạo mã VietQR...</span>
                          </>
                        ) : (
                          <>
                            <QrCode className="w-4 h-4" />
                            <span>Quét mã VietQR ({formatCurrency(plan.priceVnd)})</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Lịch sử đơn hàng & Hóa đơn */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Lịch Sử Đơn Hàng Thanh Toán</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Danh sách các đơn hàng chuyển khoản VietQR qua tài khoản MB Bank (hiệu lực mỗi đơn 5 phút).
              </p>
            </div>
            <button
              onClick={loadOrders}
              disabled={loadingHistory}
              className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition"
              title="Làm mới"
            >
              <RefreshCw className={`w-4 h-4 ${loadingHistory ? 'animate-spin text-indigo-600' : ''}`} />
            </button>
          </div>

          {loadingHistory ? (
            <div className="py-12 text-center text-slate-500 text-xs sm:text-sm">
              Đang tải lịch sử đơn hàng...
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <Clock className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-medium text-slate-700">Chưa có đơn hàng nào</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Khi bạn tạo đơn hàng VietQR và thanh toán, thông tin và lịch sử sẽ được ghi nhận tại đây.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Mã Đơn Hàng</th>
                    <th className="py-3 px-4">Gói Đăng Ký</th>
                    <th className="py-3 px-4">Số Tiền</th>
                    <th className="py-3 px-4">Ngân Hàng Thụ Hưởng</th>
                    <th className="py-3 px-4">Thời Gian Tạo</th>
                    <th className="py-3 px-4">Trạng Thái</th>
                    <th className="py-3 px-4 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {orders.map((ord) => {
                    const expired = isOrderExpired(ord);

                    return (
                      <tr key={ord.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                          {ord.orderCode}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {ord.planName || ord.planCode}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {formatCurrency(ord.amount)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-medium text-slate-700">
                            {ord.bankCode} ({ord.accountNo})
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 text-xs">
                          {formatDate(ord.createdAt)}
                        </td>
                        <td className="py-3.5 px-4">
                          {ord.status === 'PAID' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Đã thanh toán
                            </span>
                          ) : expired ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                              <XCircle className="w-3 h-3 text-slate-500" />
                              Đã hết hạn
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                              <Clock className="w-3 h-3 text-amber-600" />
                              Chờ quét QR
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {ord.status === 'PENDING' && !expired ? (
                            <button
                              onClick={() => setActiveOrder(ord)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition cursor-pointer"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              <span>Mở QR</span>
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400">--</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal Thanh Toán VietQR */}
      {activeOrder && (
        <VietQRPaymentModal
          order={activeOrder}
          onClose={() => setActiveOrder(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}

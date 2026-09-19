import React, { useState, useEffect, useRef } from 'react';
import paymentService from '../../services/paymentService';
import {
  QrCode,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  Zap,
  ShieldCheck,
  X,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export default function VietQRPaymentModal({ order, onClose, onSuccess }) {
  const [copiedField, setCopiedField] = useState(null);
  const [status, setStatus] = useState(order?.status || 'PENDING');

  // Tính thời gian còn lại (tối đa 5 phút kể từ lúc tạo giao dịch order.createdAt)
  const calculateRemainingSeconds = () => {
    if (!order?.createdAt) return 5 * 60;
    const createdMs = new Date(order.createdAt).getTime();
    const expireMs = createdMs + 5 * 60 * 1000; // 5 phút
    const diffSec = Math.floor((expireMs - Date.now()) / 1000);
    return Math.max(0, diffSec);
  };

  const [timeLeft, setTimeLeft] = useState(calculateRemainingSeconds);
  const [simulating, setSimulating] = useState(false);
  const [simulateError, setSimulateError] = useState('');
  const [simulateMsg, setSimulateMsg] = useState('');

  const pollingRef = useRef(null);

  // Đếm ngược thời gian dựa trên timestamp thực tế
  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateRemainingSeconds();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        setStatus('EXPIRED');
        clearInterval(timer);
        if (pollingRef.current) clearInterval(pollingRef.current);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [order?.createdAt]);

  // Polling trạng thái đơn hàng mỗi 2 giây
  useEffect(() => {
    if (status === 'PAID' || status === 'EXPIRED') return;

    pollingRef.current = setInterval(async () => {
      try {
        const latest = await paymentService.getOrderDetails(order.orderCode);
        if (latest) {
          if (latest.status === 'PAID') {
            setStatus('PAID');
            clearInterval(pollingRef.current);
            if (onSuccess) {
              setTimeout(() => {
                onSuccess(latest);
              }, 1800);
            }
          } else if (latest.status === 'EXPIRED') {
            setStatus('EXPIRED');
            clearInterval(pollingRef.current);
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 2000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [order?.orderCode, status, onSuccess]);

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatCurrency = (val) => {
    if (!val && val !== 0) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Giả lập chuyển khoản (Test Local)
  const handleSimulatePayment = async (amount = null) => {
    setSimulating(true);
    setSimulateError('');
    setSimulateMsg('');

    try {
      const res = await paymentService.simulatePaymentSuccess(order.orderCode, amount);
      if (res && res.success) {
        setSimulateMsg(res.message || 'Giả lập chuyển khoản thành công!');
        setStatus('PAID');
        if (onSuccess) {
          setTimeout(() => {
            onSuccess(order);
          }, 1800);
        }
      } else {
        // Trường hợp backend phát hiện chuyển thiếu tiền hoặc đơn hàng hết hạn
        setSimulateError(res?.message || 'Chuyển khoản không hợp lệ!');
      }
    } catch (err) {
      console.error('Simulate error:', err);
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Có lỗi khi giả lập chuyển khoản.';
      setSimulateError(errorMsg);
    } finally {
      setSimulating(false);
    }
  };

  const isExpired = status === 'EXPIRED' || timeLeft <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              TCB
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Thanh Toán Chuyển Khoản VietQR</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
                  Techcombank
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Gói: <strong className="text-slate-800">{order.planName}</strong> — {formatCurrency(order.amount)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Trạng thái 1: PAID */}
          {status === 'PAID' ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Đã Kích Hoạt Quyền Lợi PRO</span>
                </div>
                <h4 className="text-2xl font-bold text-slate-900">Thanh Toán Thành Công!</h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Hệ thống đã nhận được số tiền <strong>{formatCurrency(order.amount)}</strong> cho đơn hàng{' '}
                  <strong className="font-mono text-indigo-600">{order.orderCode}</strong>.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-xs transition"
              >
                Hoàn Tất & Vào Học Ngay
              </button>
            </div>
          ) : isExpired ? (
            /* Trạng thái 2: EXPIRED (Đã hết hạn 5 phút) */
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <AlertTriangle className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl font-bold text-slate-900">Mã QR Đã Hết Hạn</h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Đơn hàng <strong>{order.orderCode}</strong> đã hết hiệu lực sau 5 phút kể từ lúc tạo giao dịch.
                  Vui lòng tạo đơn mới để lấy mã QR thanh toán mới nhất.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-xs transition inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Đóng & Tạo Đơn Hàng Mới</span>
                </button>
              </div>
            </div>
          ) : (
            /* Trạng thái 3: PENDING */
            <>
              {/* Cảnh báo đếm ngược 5 phút */}
              <div className="flex items-center justify-between bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-xs sm:text-sm text-amber-800">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Mã QR có hiệu lực <strong>5 phút</strong> tính từ lúc tạo:
                  </span>
                </div>
                <span className="font-mono font-bold text-base text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  {formatTimer(timeLeft)}
                </span>
              </div>

              {/* Khu vực QR & Thông tin chuyển khoản */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                {/* Cột 1: Ảnh VietQR */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-2.5">
                  <div className="bg-white p-2 rounded-lg border border-slate-200 inline-block shadow-xs">
                    <img
                      src={order.qrUrl}
                      alt="VietQR Techcombank"
                      className="w-56 h-56 object-contain mx-auto"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Quét mã bằng App Ngân Hàng bất kỳ
                    </p>
                    <div className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-medium">
                      <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
                      <span>Đang chờ chuyển khoản...</span>
                    </div>
                  </div>
                </div>

                {/* Cột 2: Thông tin chuyển khoản 1 chạm */}
                <div className="space-y-2.5 text-xs sm:text-sm">
                  {/* Ngân hàng */}
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500 block">Ngân hàng thụ hưởng</span>
                      <span className="font-bold text-slate-800">Techcombank (TCB)</span>
                    </div>
                  </div>

                  {/* Số tài khoản */}
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500 block">Số tài khoản</span>
                      <span className="font-mono font-bold text-base text-slate-900">
                        {order.accountNo}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(order.accountNo, 'acc')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-200 transition cursor-pointer"
                    >
                      {copiedField === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'acc' ? 'Đã chép' : 'Sao chép'}</span>
                    </button>
                  </div>

                  {/* Chủ tài khoản */}
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500 block">Chủ tài khoản</span>
                      <span className="font-bold text-slate-800 uppercase">{order.accountName}</span>
                    </div>
                  </div>

                  {/* Số tiền */}
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500 block">Số tiền chính xác</span>
                      <span className="font-bold text-base text-emerald-600">
                        {formatCurrency(order.amount)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(order.amount.toString(), 'amount')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-200 transition cursor-pointer"
                    >
                      {copiedField === 'amount' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'amount' ? 'Đã chép' : 'Sao chép'}</span>
                    </button>
                  </div>

                  {/* Nội dung chuyển khoản */}
                  <div className="p-2.5 bg-indigo-50/70 rounded-lg border border-indigo-200 flex items-center justify-between ring-1 ring-indigo-300">
                    <div>
                      <span className="text-[11px] font-semibold text-indigo-800 block">
                        Nội dung chuyển khoản (Bắt buộc)
                      </span>
                      <span className="font-mono font-extrabold text-base text-indigo-700">
                        {order.orderCode}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(order.orderCode, 'code')}
                      className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition cursor-pointer"
                    >
                      {copiedField === 'code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'code' ? 'Đã chép' : 'Sao chép'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Chú ý quan trọng */}
              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 text-xs text-amber-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  Vui lòng điền <strong>chính xác nội dung chuyển khoản {order.orderCode}</strong> và{' '}
                  <strong>đúng số tiền {formatCurrency(order.amount)}</strong>. Hệ thống tự động kích hoạt gói Pro ngay khi ngân hàng nhận tiền.
                </p>
              </div>

              {/* Developer Test Tools (Local Simulation) */}
              <div className="p-3.5 rounded-xl bg-slate-900 text-slate-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                    <Zap className="w-4 h-4" />
                    <span>Bộ Công Cụ Thử Nghiệm Local (Simulator)</span>
                  </div>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    Môi trường Development
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Mô phỏng biến động số dư để kiểm thử luồng tự động và tính năng đối soát chống gian lận:
                </p>

                {simulateMsg && (
                  <div className="p-2.5 rounded bg-emerald-900/60 border border-emerald-600 text-emerald-200 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>{simulateMsg}</span>
                  </div>
                )}

                {simulateError && (
                  <div className="p-2.5 rounded bg-red-900/60 border border-red-600 text-red-200 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                    <span className="leading-snug">{simulateError}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleSimulatePayment()}
                    disabled={simulating}
                    className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{simulating ? 'Đang xử lý...' : '⚡ Giả lập chuyển khoản thành công (PAID)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSimulatePayment(order.amount - 10000)}
                    disabled={simulating}
                    className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 font-semibold text-xs border border-slate-700 transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                    title="Thử chuyển thiếu 10.000 VNĐ để kiểm tra tính năng từ chối gian lận của hệ thống"
                  >
                    <span>⚠️ Test chuyển thiếu tiền (-10.000 ₫)</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import paymentService from '../../services/paymentService';
import {
  QrCode,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  AlertCircle,
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

  // Polling kiểm tra trạng thái đơn hàng mỗi 2 giây
  useEffect(() => {
    if (!order?.orderCode || status !== 'PENDING') return;

    pollingRef.current = setInterval(async () => {
      try {
        const res = await paymentService.getOrder(order.orderCode);
        const latestOrder = res.data || res;
        if (latestOrder && latestOrder.status === 'PAID') {
          setStatus('PAID');
          if (pollingRef.current) clearInterval(pollingRef.current);
          if (onSuccess) {
            setTimeout(() => {
              onSuccess(latestOrder);
            }, 1800);
          }
        } else if (latestOrder && latestOrder.status === 'EXPIRED') {
          setStatus('EXPIRED');
          if (pollingRef.current) clearInterval(pollingRef.current);
        }
      } catch (err) {
        console.warn('Lỗi polling đơn hàng:', err);
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

  const getBankName = (code) => {
    if (!code) return 'MB Bank';
    const c = String(code).toUpperCase();
    if (c === 'MB' || c === 'MBBANK') return 'MB Bank (Quân Đội)';
    if (c === 'TCB' || c === 'TECHCOMBANK') return 'Techcombank (TCB)';
    return code;
  };

  const isExpired = status === 'EXPIRED' || timeLeft <= 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full my-auto overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Thanh Toán Chuyển Khoản VietQR</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  {getBankName(order.bankCode)}
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
        <div className="p-5 sm:p-6 space-y-5">
          {/* Trạng thái 1: PAID */}
          {status === 'PAID' ? (
            <div className="text-center py-8 space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg sm:text-xl font-bold text-slate-900">
                  Thanh Toán Thành Công! 🎉
                </h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  Tài khoản của bạn đã được nâng cấp thành công lên gói{' '}
                  <strong className="text-indigo-600">{order.planName}</strong>.
                </p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-left text-xs text-emerald-900 space-y-1">
                <div className="flex justify-between">
                  <span className="text-emerald-700">Mã giao dịch:</span>
                  <span className="font-mono font-bold">{order.orderCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Số tiền:</span>
                  <span className="font-bold">{formatCurrency(order.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Trạng thái:</span>
                  <span className="font-semibold text-emerald-700">ĐÃ KÍCH HOẠT PRO</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition shadow-sm"
              >
                Bắt đầu trải nghiệm ngay
              </button>
            </div>
          ) : isExpired ? (
            /* Trạng thái 2: EXPIRED (Đã hết hạn 5 phút) */
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-900">
                  Đơn hàng đã hết thời gian hiệu lực
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Mỗi giao dịch thanh toán VietQR có hiệu lực trong 5 phút. Vui lòng tạo lại đơn mới để nhận mã QR mới.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs sm:text-sm transition shadow-sm inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Đóng và chọn lại gói</span>
                </button>
              </div>
            </div>
          ) : (
            /* Trạng thái 3: PENDING */
            <>
              {/* Cảnh báo đếm ngược 5 phút */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Thời gian hiệu lực của đơn:</span>
                </div>
                <span className="font-mono font-bold text-amber-700 text-sm">
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
                      alt={`VietQR ${getBankName(order.bankCode)}`}
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
                      <span className="font-bold text-slate-800">{getBankName(order.bankCode)}</span>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

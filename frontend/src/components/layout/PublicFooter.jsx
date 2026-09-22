import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin, ShieldCheck, Heart } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center gap-2 font-bold text-base text-white tracking-tight">
              <div className="w-7 h-7 rounded-lg bg-indigo-500 text-white flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-lg text-white">PathStudy</span>
            </Link>
            <p className="text-slate-400 leading-relaxed text-xs">
              Nền tảng học tập thích ứng thông minh (Adaptive Learning) dành riêng cho học sinh THPT, cá nhân hóa lộ trình và phát hiện lỗ hổng kiến thức chuẩn GDPT.
            </p>
            <div className="flex items-center gap-2 text-slate-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-[11px]">Bảo mật & Chuẩn giáo dục quốc gia</span>
            </div>
          </div>

          {/* Learning Programs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Học tập thích ứng</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/subjects" className="hover:text-white transition">
                  Danh mục môn học Khối 10, 11, 12
                </Link>
              </li>
              <li>
                <Link to="/study-path/english" className="hover:text-white transition">
                  Lộ trình Tiếng Anh THPT thích ứng
                </Link>
              </li>
              <li>
                <Link to="/assessment/placement" className="hover:text-white transition">
                  Bài khảo sát năng lực đầu vào
                </Link>
              </li>
              <li>
                <Link to="/subscription" className="hover:text-white transition">
                  Gói học viên Pro & Quyền lợi
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Community */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Hỗ trợ học sinh</h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span>support@studypath.edu.vn</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span>Hotline: 1900 6868 (8:00 - 21:00)</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span>Hà Nội & TP. Hồ Chí Minh, Việt Nam</span>
              </li>
            </ul>
          </div>

          {/* Policies & Terms */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Điều khoản & Pháp lý</h4>
            <ul className="space-y-2">
              <li>
                <a href="#terms" onClick={(e) => { e.preventDefault(); alert('Chính sách điều khoản sử dụng nền tảng PathStudy.'); }} className="hover:text-white transition">
                  Điều khoản dịch vụ
                </a>
              </li>
              <li>
                <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Chính sách bảo mật thông tin học sinh.'); }} className="hover:text-white transition">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#refund" onClick={(e) => { e.preventDefault(); alert('Chính sách thanh toán VietQR & hoàn phí.'); }} className="hover:text-white transition">
                  Chính sách giao dịch & VietQR
                </a>
              </li>
              <li>
                <a href="#guide" onClick={(e) => { e.preventDefault(); alert('Hướng dẫn học tập trên PathStudy.'); }} className="hover:text-white transition">
                  Hướng dẫn học viên mới
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © 2026 PathStudy. Bản quyền thuộc về Đội ngũ Phát triển Nền tảng Học tập Thích ứng.
          </div>
          <div className="flex items-center gap-1">
            <span>Đồng hành cùng học sinh THPT trên mọi chặng đường</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
}

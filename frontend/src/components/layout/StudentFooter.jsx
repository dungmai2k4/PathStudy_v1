import React from 'react';

export default function StudentFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white py-3 px-4 sm:px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        <div>
          © 2026 PathStudy — Nền tảng học tập thích ứng cá nhân hóa cho học sinh THPT.
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <a
            href="#support"
            onClick={(e) => { e.preventDefault(); alert('Liên hệ hỗ trợ học tập: support@studypath.edu.vn | Hotline: 1900 6868'); }}
            className="hover:text-indigo-600 transition"
          >
            Hỗ trợ học tập
          </a>
          <span className="text-slate-300">•</span>
          <a
            href="#terms"
            onClick={(e) => { e.preventDefault(); alert('Điều khoản sử dụng dịch vụ PathStudy.'); }}
            className="hover:text-indigo-600 transition"
          >
            Điều khoản & Chính sách
          </a>
          <span className="text-slate-300">•</span>
          <a
            href="#privacy"
            onClick={(e) => { e.preventDefault(); alert('Chính sách bảo mật quyền riêng tư học sinh.'); }}
            className="hover:text-indigo-600 transition"
          >
            Bảo mật
          </a>
        </div>
      </div>
    </footer>
  );
}

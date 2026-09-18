import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import contentService from '../../services/contentService';
import {
  Languages,
  Calculator,
  BookOpen,
  Atom,
  FlaskConical,
  Dna,
  Landmark,
  Globe,
  Laptop,
  Scale,
  Cpu,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  HelpCircle,
  Search,
} from 'lucide-react';

const ICON_MAP = {
  Languages: Languages,
  Calculator: Calculator,
  BookOpen: BookOpen,
  Atom: Atom,
  FlaskConical: FlaskConical,
  Dna: Dna,
  Landmark: Landmark,
  Globe: Globe,
  Laptop: Laptop,
  Scale: Scale,
  Cpu: Cpu,
};

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalSubject, setModalSubject] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await contentService.getSubjects();
        setSubjects(data);
      } catch (err) {
        console.error('Lỗi tải danh sách môn học:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 border border-slate-800 shadow-sm">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-500/20 border border-indigo-400/30 text-xs font-semibold text-indigo-300 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Chương trình Giáo dục Phổ thông & Đánh giá Năng lực</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Danh mục Môn học (Subjects)
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Hệ thống hiển thị danh mục đầy đủ các môn học chuẩn chương trình. Hiện tại, PathStudy đang tập trung phát triển chuyên sâu toàn diện lộ trình học thích ứng và kiểm tra đánh giá năng lực cho môn <strong className="text-indigo-400 font-semibold">Tiếng Anh (English)</strong>.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              to="/subjects/english"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition shadow-xs"
            >
              <Languages className="w-4 h-4" />
              <span>Vào học Lộ trình Tiếng Anh</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Notice Banner */}
      <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5 text-xs sm:text-sm">
        <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold">Lưu ý về phạm vi phát triển hiện tại:</span> Các môn học khác ngoài Tiếng Anh hiện đang được hiển thị trong danh mục tổng quan để đảm bảo tính đồng bộ hệ thống. Toàn bộ kho bài học, cây kỹ năng chi tiết, ví dụ thực tế và bài kiểm tra thích ứng hiện đang được tập trung triển khai và tối ưu cho môn <strong>Tiếng Anh</strong>.
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm môn học..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>

        <div className="text-xs sm:text-sm font-medium text-slate-500">
          Tổng cộng: <span className="font-bold text-slate-800">{filteredSubjects.length} môn học</span>
        </div>
      </div>

      {/* Subjects Grid */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-500 font-medium">Đang tải danh mục môn học...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSubjects.map((sub) => {
            const IconComponent = ICON_MAP[sub.icon] || BookOpen;
            const isEnglish = sub.code === 'ENGLISH';

            return (
              <div
                key={sub.id}
                className={`relative rounded-xl border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                  isEnglish
                    ? 'bg-white border-indigo-300 shadow-sm ring-1 ring-indigo-500/20'
                    : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
                }`}
              >
                {/* Highlight banner for English */}
                {isEnglish && (
                  <div className="bg-indigo-600 text-white text-[11px] font-bold px-3.5 py-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      MÔN HỌC TRỌNG TÂM — ĐẦY ĐỦ NỘI DUNG
                    </span>
                    <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">
                      SẴN SÀNG HỌC
                    </span>
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div
                      className={`w-11 h-11 rounded-lg flex items-center justify-center ${
                        isEnglish
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                        isEnglish
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {isEnglish ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Đang hoạt động</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>Chỉ danh mục</span>
                        </>
                      )}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-slate-900 mb-1.5">{sub.name}</h2>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {sub.description}
                  </p>

                  {isEnglish && (
                    <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="block text-slate-400 text-[11px] font-medium">Chủ đề kiến thức</span>
                        <strong className="text-indigo-600 text-xs font-bold">
                          {sub.skillCount || 6} Kỹ năng cốt lõi
                        </strong>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="block text-slate-400 text-[11px] font-medium">Đánh giá thích ứng</span>
                        <strong className="text-emerald-600 text-xs font-bold">
                          Quiz & Topic Test (≥80%)
                        </strong>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-5 pt-0 mt-1">
                  {isEnglish ? (
                    <Link
                      to="/subjects/english"
                      className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs text-center transition shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <span>Vào học Tiếng Anh</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <button
                      onClick={() => setModalSubject(sub)}
                      className="w-full py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Xem lộ trình phát triển</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info Modal for non-English subjects */}
      {modalSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Môn {modalSubject.name} (Đang hoàn thiện)
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Môn <strong>{modalSubject.name}</strong> hiện đang nằm trong danh mục chương trình của nền tảng PathStudy. Theo định hướng hiện tại, hệ thống đang tập trung toàn lực vào môn <strong>Tiếng Anh</strong> để hoàn thiện quy trình Thích ứng (Adaptive Learning), kiểm tra Placement Test và đánh giá năng lực học sinh.
            </p>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <div><strong>Mã môn học:</strong> {modalSubject.code}</div>
              <div><strong>Trạng thái:</strong> Sắp ra mắt (Coming Soon)</div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => setModalSubject(null)}
                className="flex-1 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition cursor-pointer"
              >
                Đóng lại
              </button>
              <Link
                to="/subjects/english"
                onClick={() => setModalSubject(null)}
                className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm text-center transition"
              >
                Học môn Tiếng Anh
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

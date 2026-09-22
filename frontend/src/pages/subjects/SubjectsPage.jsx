import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import contentService from '../../services/contentService';
import { useAuth } from '../../context/AuthContext';
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
  ArrowRight,
  CheckCircle2,
  Clock,
  Search,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';

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

const GRADE_TABS = [
  { id: 'ALL', label: 'Tất cả khối' },
  { id: '10', label: 'Khối 10' },
  { id: '11', label: 'Khối 11' },
  { id: '12', label: 'Khối 12' },
];

export default function SubjectsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedGrade, setSelectedGrade] = useState(() => {
    return user?.grade ? user.grade.toString() : 'ALL';
  });
  const [modalSubject, setModalSubject] = useState(null);

  useEffect(() => {
    if (user?.grade && selectedGrade === 'ALL') {
      setSelectedGrade(user.grade.toString());
    }
  }, [user?.grade]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await contentService.getSubjects();
        setSubjects(data || []);
      } catch (err) {
        console.error('Lỗi tải danh sách môn học:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const handleEnterSubject = (code) => {
    const targetPath = `/study-path/${(code || 'english').toLowerCase()}`;
    if (user) {
      navigate(targetPath);
    } else {
      navigate(`/login?redirect=${encodeURIComponent(targetPath)}`);
    }
  };

  const getSubjectGrade = (s) => {
    if (s?.grade != null && !isNaN(Number(s.grade))) {
      return Number(s.grade);
    }
    const code = (s?.code || '').toUpperCase();
    const name = s?.name || '';
    if (code.endsWith('_10') || code === 'ENGLISH' || name.includes('10')) return 10;
    if (code.endsWith('_11') || name.includes('11')) return 11;
    if (code.endsWith('_12') || name.includes('12')) return 12;
    return null;
  };

  const filteredSubjects = subjects.filter((s) => {
    const matchesSearch =
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.description?.toLowerCase().includes(search.toLowerCase()) ||
      s.code?.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedGrade === 'ALL') return true;
    const gradeNum = getSubjectGrade(s);
    return gradeNum === parseInt(selectedGrade, 10);
  });

  const isUserGradeActive = user?.grade && selectedGrade === user.grade.toString();

  return (
    <div className="space-y-6">
      {/* Unified Page Header */}
      <PageHeader
        title="Danh Mục Môn Học Theo Khối THPT"
        description="Chương trình giáo dục phổ thông phân cấp chuẩn mực cho Khối 10, 11 và 12 với hệ thống học tập thích ứng."
        icon={GraduationCap}
      />

      {/* Grade Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {GRADE_TABS.map((tab) => {
            const isActive = selectedGrade === tab.id;
            const isMyGrade = user?.grade && tab.id === user.grade.toString();

            return (
              <button
                key={tab.id}
                onClick={() => setSelectedGrade(tab.id)}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
                }`}
              >
                <span>{tab.label}</span>
                {isMyGrade && (
                  <span
                    className={`inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      isActive ? 'bg-indigo-800 text-indigo-100' : 'bg-indigo-100 text-indigo-700'
                    }`}
                  >
                    Lớp bạn
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm môn học..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8.5 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Student Grade Banner Hint */}
      {isUserGradeActive && (
        <div className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-lg bg-indigo-50/70 border border-indigo-100 text-indigo-800 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              Đang ưu tiên hiển thị các môn học chuẩn theo hồ sơ <strong>Khối {user.grade}</strong> của bạn.
            </span>
          </div>
          <button
            onClick={() => setSelectedGrade('ALL')}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline cursor-pointer shrink-0"
          >
            Xem tất cả khối
          </button>
        </div>
      )}

      {/* Subjects Grid */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-500 font-medium">Đang tải danh mục môn học...</span>
        </div>
      ) : filteredSubjects.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-xl border border-slate-200 p-6">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">Không tìm thấy môn học nào</p>
          <p className="text-xs text-slate-500 mt-1">
            Thử thay đổi bộ lọc khối lớp hoặc từ khóa tìm kiếm.
          </p>
          <button
            onClick={() => {
              setSelectedGrade('ALL');
              setSearch('');
            }}
            className="mt-3 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition cursor-pointer"
          >
            Xem tất cả môn học
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredSubjects.map((sub) => {
            const IconComponent = ICON_MAP[sub.icon] || BookOpen;
            const isEnglish10 = (sub.code || '').toUpperCase() === 'ENGLISH';

            return (
              <div
                key={sub.id}
                className={`relative rounded-xl border transition-all duration-150 flex flex-col justify-between overflow-hidden ${
                  isEnglish10
                    ? 'bg-white border-indigo-300 shadow-2xs ring-1 ring-indigo-500/20'
                    : 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
                }`}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isEnglish10 ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {(() => {
                        const gradeVal = getSubjectGrade(sub);
                        return gradeVal ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            Khối {gradeVal}
                          </span>
                        ) : null;
                      })()}

                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                          isEnglish10
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {isEnglish10 ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Sẵn sàng học</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>Sắp ra mắt</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                    {sub.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {sub.description}
                  </p>

                  {isEnglish10 && (
                    <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="block text-slate-400 text-[10px] font-medium uppercase">Cấu trúc</span>
                        <strong className="text-indigo-600 text-xs font-bold">Module & Topic</strong>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="block text-slate-400 text-[10px] font-medium uppercase">Đánh giá</span>
                        <strong className="text-emerald-600 text-xs font-bold">Quiz & Luyện tập</strong>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 sm:p-5 pt-0 mt-1">
                  {isEnglish10 ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleEnterSubject(sub.code)}
                      iconRight={ArrowRight}
                      className="w-full"
                    >
                      Vào học môn này
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setModalSubject(sub)}
                      iconRight={ArrowRight}
                      className="w-full"
                    >
                      Xem thông tin lộ trình
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info Modal for Coming Soon subjects */}
      {modalSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>

            <h3 className="text-base font-bold text-slate-900">
              {modalSubject.name} {modalSubject.grade ? `(Khối ${modalSubject.grade})` : ''} — Đang hoàn thiện
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Môn <strong>{modalSubject.name}</strong> hiện đang được đội ngũ sư phạm hoàn thiện nội dung theo khung chương trình GDPT 2018. Hiện tại, bạn có thể trải nghiệm toàn diện hệ thống Thích ứng (Adaptive Learning) và làm bài kiểm tra năng lực với môn <strong>Tiếng Anh 10</strong>.
            </p>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <div><strong>Mã môn học:</strong> {modalSubject.code}</div>
              <div><strong>Khối lớp:</strong> {modalSubject.grade ? `Khối ${modalSubject.grade}` : 'Chung'}</div>
              <div><strong>Trạng thái:</strong> Sắp ra mắt (Coming Soon)</div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setModalSubject(null)}
                className="flex-1"
              >
                Đóng lại
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setModalSubject(null);
                  handleEnterSubject('english');
                }}
                className="flex-1"
              >
                Học Tiếng Anh 10
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

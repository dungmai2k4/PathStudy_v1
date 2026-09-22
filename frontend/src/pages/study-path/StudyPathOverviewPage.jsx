import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import adaptiveService from '../../services/adaptiveService';
import contentService from '../../services/contentService';
import {
  BookOpen,
  Languages,
  Calculator,
  Atom,
  FlaskConical,
  Dna,
  Landmark,
  Globe,
  Laptop,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  GraduationCap,
  Sparkles,
  ClipboardCheck,
  Compass,
} from 'lucide-react';
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
};

const getSubjectGrade = (s) => {
  if (s?.grade != null && !isNaN(Number(s.grade))) return Number(s.grade);
  const code = (s?.code || '').toUpperCase();
  const name = s?.name || '';
  if (code.endsWith('_10') || code === 'ENGLISH' || name.includes('10')) return 10;
  if (code.endsWith('_11') || name.includes('11')) return 11;
  if (code.endsWith('_12') || name.includes('12')) return 12;
  return 10;
};

export default function StudyPathOverviewPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [enrolledSubjects, setEnrolledSubjects] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [subjectDetails, setSubjectDetails] = useState({}); // { [subjectId]: { modules: [...], nodes: [...] } }
  const [filterGrade, setFilterGrade] = useState(() => (user?.grade ? user.grade.toString() : '10'));

  useEffect(() => {
    const loadOverviewData = async () => {
      if (!user?.userId) return;
      try {
        setLoading(true);

        // 1. Fetch all available subjects in catalog
        const catalogData = await contentService.getSubjects();
        setAllSubjects(catalogData || []);

        // 2. Fetch enrolled subjects for student
        const subjects = await adaptiveService.getMySubjects(user.userId);
        const activeSubjects = subjects || [];
        setEnrolledSubjects(activeSubjects);

        // 3. Fetch path details for each enrolled subject
        const details = {};
        for (const sub of activeSubjects) {
          try {
            const pathData = await adaptiveService.getMyStudyPath(user.userId, sub.subjectId);
            if (pathData && pathData.nodes) {
              const nodes = pathData.nodes;
              const moduleMap = {};
              nodes.forEach((node) => {
                const modName = node.moduleName || 'Chuyên đề kiến thức';
                if (!moduleMap[modName]) {
                  moduleMap[modName] = {
                    name: modName,
                    total: 0,
                    completed: 0,
                    nodes: [],
                  };
                }
                moduleMap[modName].total += 1;
                if (node.status === 'COMPLETED') {
                  moduleMap[modName].completed += 1;
                }
                moduleMap[modName].nodes.push(node);
              });

              const modules = Object.values(moduleMap).map((m) => ({
                ...m,
                percentage: m.total > 0 ? Math.round((m.completed / m.total) * 100) : 0,
              }));

              details[sub.subjectId] = {
                pathData,
                nodes,
                modules,
              };
            }
          } catch (e) {
            console.error(`Error loading path details for subject ${sub.subjectId}:`, e);
          }
        }
        setSubjectDetails(details);
      } catch (err) {
        console.error('Lỗi khi tải danh sách lộ trình học:', err);
      } finally {
        setLoading(false);
      }
    };

    loadOverviewData();
  }, [user?.userId]);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 font-medium">Đang tải danh sách lộ trình học của bạn...</p>
      </div>
    );
  }

  // Filter catalog subjects by selected grade
  const availableGradeSubjects = allSubjects.filter((s) => {
    if (filterGrade === 'ALL') return true;
    return getSubjectGrade(s) === parseInt(filterGrade, 10);
  });

  const enrolledSubjectIds = new Set(enrolledSubjects.map((s) => s.subjectId));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Compass className="w-6 h-6 text-indigo-600" />
            <span>Lộ Trình Học Cá Nhân Hóa</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Khảo sát đánh giá năng lực ban đầu và học tập thích ứng theo từng chuyên đề GDPT 2018.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/subjects"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span>Danh mục tất cả môn</span>
          </Link>
        </div>
      </div>

      {/* 1. ENROLLED SUBJECTS (If Any) */}
      {enrolledSubjects.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Lộ trình đang học ({enrolledSubjects.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {enrolledSubjects.map((sub) => {
              const subId = sub.subjectId;
              const detail = subjectDetails[subId];
              const overallPct = sub.progressPercentage || 0;
              const modules = detail?.modules || [];
              const subjectCode = (sub.subjectCode || 'english').toLowerCase();

              return (
                <div
                  key={subId}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                        <Languages className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">{sub.subjectName || 'Tiếng Anh 10'}</h3>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            Khối {user?.grade || 10}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {sub.completedSkills || 0}/{sub.totalSkills || 6} chuyên đề đã hoàn thành
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <span className="text-xs font-medium text-slate-400">Tiến độ môn</span>
                        <p className="text-base font-extrabold text-indigo-600 leading-tight">{overallPct}%</p>
                      </div>
                      <Link
                        to={`/study-path/${subjectCode}`}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition"
                      >
                        <span>Tiếp tục học</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Modules Breakdown */}
                  {modules.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      {modules.map((mod, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-800 line-clamp-1">{mod.name}</span>
                            <span className="font-bold text-indigo-600 text-[11px]">{mod.percentage}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                              style={{ width: `${mod.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. CHỌN MÔN HỌC ĐỂ KHẢO SÁT & TẠO LỘ TRÌNH (Luôn hiển thị hoặc nổi bật khi chưa có môn nào) */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              <span>
                {enrolledSubjects.length === 0
                  ? 'Chọn môn học để khảo sát & tạo lộ trình'
                  : 'Khảo sát thêm môn học khác'}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Chọn môn học bạn muốn nâng cao để làm bài khảo sát năng lực 12 phút. Hệ thống AI sẽ tự động phân tích và tạo lộ trình tối ưu.
            </p>
          </div>

          {/* Grade filter pills */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200 self-start">
            {['10', '11', '12'].map((g) => (
              <button
                key={g}
                onClick={() => setFilterGrade(g)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                  filterGrade === g
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Khối {g}
              </button>
            ))}
          </div>
        </div>

        {/* Subjects Grid for Selected Grade */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableGradeSubjects.map((sub) => {
            const Icon = ICON_MAP[sub.icon] || BookOpen;
            const isEnglish = (sub.code || '').toUpperCase().startsWith('ENGLISH');
            const isEnrolled = enrolledSubjectIds.has(sub.id);
            const gradeNum = getSubjectGrade(sub);

            return (
              <div
                key={sub.id}
                className={`bg-white rounded-xl border p-4.5 flex flex-col justify-between transition ${
                  isEnglish && !isEnrolled
                    ? 'border-indigo-300 shadow-2xs ring-1 ring-indigo-500/20'
                    : 'border-slate-200 shadow-2xs hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        isEnglish ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        Khối {gradeNum}
                      </span>
                      {isEnrolled ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Đang học</span>
                        </span>
                      ) : isEnglish ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          Sẵn sàng khảo sát
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>Sắp ra mắt</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-1">{sub.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                    {sub.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  {isEnrolled ? (
                    <Link
                      to={`/study-path/${(sub.code || 'english').toLowerCase()}`}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition"
                    >
                      <span>Xem lộ trình môn này</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : isEnglish ? (
                    <Link
                      to={`/assessment/placement?subjectId=${sub.id}`}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition"
                    >
                      <ClipboardCheck className="w-3.5 h-3.5" />
                      <span>Khảo sát năng lực & Tạo lộ trình</span>
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2 px-3 rounded-lg bg-slate-100 text-slate-400 font-medium text-xs cursor-not-allowed"
                    >
                      Chưa mở khảo sát
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import adaptiveService from '../../services/adaptiveService';
import {
  Compass,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  GraduationCap,
  BookOpen,
  BarChart3,
  Award,
  Layers,
  ChevronLeft,
  ChevronRight,
  Play,
  CheckCircle2,
  X,
} from 'lucide-react';

const SUBJECTS_CAROUSEL = [
  {
    code: 'english',
    name: 'Tiếng Anh THPT',
    desc: 'Luyện tập ngữ pháp trọng điểm, thì động từ, câu điều kiện, bị động và kỹ năng đọc hiểu chuyên sâu theo đề thi THPT Quốc gia.',
    color: 'from-indigo-600 to-purple-600',
    accentColor: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    icon: 'BookOpen',
    ready: true,
  },
  {
    code: 'math',
    name: 'Toán Học THPT',
    desc: 'Hàm số, hình học không gian, tích phân, xác suất thống kê và phương pháp giải nhanh trắc nghiệm.',
    color: 'from-blue-600 to-cyan-600',
    accentColor: 'bg-blue-50 text-blue-700 border-blue-100',
    icon: 'Layers',
    ready: false,
  },
  {
    code: 'literature',
    name: 'Ngữ Văn THPT',
    desc: 'Kỹ năng đọc hiểu văn bản, nghị luận xã hội và nghị luận văn học phân tích tác phẩm kinh điển.',
    color: 'from-rose-600 to-orange-600',
    accentColor: 'bg-rose-50 text-rose-700 border-rose-100',
    icon: 'BookOpen',
    ready: false,
  },
  {
    code: 'physics',
    name: 'Vật Lý THPT',
    desc: 'Dao động cơ học, sóng cơ và sóng âm, dòng điện xoay chiều, dao động điện từ và vật lý hạt nhân.',
    color: 'from-amber-600 to-emerald-600',
    accentColor: 'bg-amber-50 text-amber-700 border-amber-100',
    icon: 'Compass',
    ready: false,
  },
  {
    code: 'chemistry',
    name: 'Hóa Học THPT',
    desc: 'Este - Lipit, Cacbohiđrat, Amin - Amino axit - Peptit, đại cương kim loại và hóa học ứng dụng.',
    color: 'from-teal-600 to-emerald-600',
    accentColor: 'bg-teal-50 text-teal-700 border-teal-100',
    icon: 'Award',
    ready: false,
  },
];

export default function StudentDashboard() {
  const { user, isPro } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [enrolledSubjects, setEnrolledSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Slideshow State for Create Study Path Widget
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSubjectPickerModal, setShowSubjectPickerModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch user profile
        const prof = await authService.getProfile();
        setProfile(prof);

        // 2. Fetch enrolled subjects
        if (user?.userId) {
          const subjects = await adaptiveService.getMySubjects(user.userId);
          setEnrolledSubjects(subjects || []);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.userId]);

  // Slideshow automatic timer (slides every 3.5 seconds)
  useEffect(() => {
    if (enrolledSubjects.length > 0) return; // Only run slideshow if no study paths

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SUBJECTS_CAROUSEL.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [enrolledSubjects.length]);

  const activeSubject = SUBJECTS_CAROUSEL[currentSlide];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white p-8 sm:p-10 shadow-xl shadow-indigo-200">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-indigo-100 mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>
              {profile?.grade
                ? `Học sinh Khối ${profile.grade}${profile.className ? ` (${profile.className})` : ''}`
                : 'Học sinh THPT'}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Xin chào, {profile?.fullName || user?.fullName || user?.username}! 👋
          </h1>
          <p className="mt-2 text-indigo-100 text-sm sm:text-base leading-relaxed">
            Hệ thống học tập thích ứng (Adaptive Learning) đang theo dõi và tối ưu hóa lộ trình học riêng biệt cho bạn dựa trên năng lực thực tế.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/subjects"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-sm transition"
            >
              <BookOpen className="w-4 h-4" />
              <span>Danh mục Môn học</span>
            </Link>

            {!isPro && (
              <Link
                to="/subscription"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Nâng cấp Pro mở rộng kho bài tập</span>
              </Link>
            )}
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* CASE 1: STUDENT HAS ENROLLED STUDY PATHS */}
      {enrolledSubjects.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>Môn học đang có lộ trình của bạn</span>
            </h2>
            <button
              onClick={() => setShowSubjectPickerModal(true)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
            >
              <span>+ Tạo lộ trình môn khác</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrolledSubjects.map((sub) => {
              const pct = sub.progressPercentage || 0;
              return (
                <div
                  key={sub.subjectId}
                  className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs hover:shadow-md transition space-y-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-900">{sub.subjectName}</h3>
                        <span className="text-xs text-slate-500">
                          {sub.completedSkills || 0} / {sub.totalSkills || 6} Kỹ năng hoàn thành
                        </span>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {pct}% Hoàn thành
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Current Active Skill */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Kỹ năng hiện tại:</span>
                    <strong className="text-indigo-900 font-bold max-w-[200px] truncate text-right">
                      {sub.currentSkillName || 'Kỹ năng mục tiêu'}
                    </strong>
                  </div>

                  {/* Action CTA: Tiếp tục học */}
                  <Link
                    to={`/study-path/${sub.subjectCode || 'english'}`}
                    className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm text-center shadow-md shadow-indigo-100 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Tiếp tục học</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* CASE 2: STUDENT HAS NO ENROLLED SUBJECTS -> SLIDESHOW WIDGET */
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Khởi tạo Lộ Trình Thích Ứng Cá Nhân</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                Bạn chưa tham gia lộ trình học nào
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Hệ thống tự động thiết kế lộ trình học riêng biệt dựa trên bài kiểm tra khảo sát năng lực (Placement Test). Các câu hỏi được chọn ngẫu nhiên để xác định chính xác điểm mạnh và điểm yếu của bạn!
              </p>

              <button
                onClick={() => setShowSubjectPickerModal(true)}
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-base shadow-xl shadow-indigo-200 transition duration-200 cursor-pointer"
              >
                <Sparkles className="w-5 h-5" />
                <span>Tạo Lộ Trình Học</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Slideshow Display Card */}
            <div className="w-full md:w-80 shrink-0">
              <div
                className={`rounded-3xl p-6 text-white shadow-xl transition-all duration-500 bg-gradient-to-br ${activeSubject.color} space-y-4`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                    Khối THPT
                  </span>
                  <span className="text-xs text-white/80">
                    {currentSlide + 1} / {SUBJECTS_CAROUSEL.length}
                  </span>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>

                <div>
                  <h3 className="text-xl font-extrabold">{activeSubject.name}</h3>
                  <p className="text-xs text-white/85 mt-1 line-clamp-3 leading-relaxed">
                    {activeSubject.desc}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {SUBJECTS_CAROUSEL.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={() => setCurrentSlide(dotIdx)}
                        className={`h-2 rounded-full transition-all ${
                          dotIdx === currentSlide ? 'w-6 bg-white' : 'w-2 bg-white/40'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setShowSubjectPickerModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-sm hover:bg-slate-100 transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>Khảo sát</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">
              {enrolledSubjects.length > 0 ? `${enrolledSubjects.length} Môn` : 'Khởi tạo'}
            </div>
            <div className="text-xs text-slate-500 font-medium">Lộ trình học thích ứng</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">
              {enrolledSubjects.reduce((sum, s) => sum + (s.completedSkills || 0), 0)} / 6
            </div>
            <div className="text-xs text-slate-500 font-medium">Kỹ năng hoàn thành</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">
              {enrolledSubjects.length > 0 ? `${enrolledSubjects[0].progressPercentage || 0}%` : '-- %'}
            </div>
            <div className="text-xs text-slate-500 font-medium">Tiến độ tổng quan</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">
              {isPro ? 'Pro Active' : 'Gói Cơ Bản'}
            </div>
            <div className="text-xs text-slate-500 font-medium">Hạng thành viên</div>
          </div>
        </div>
      </div>

      {/* Adaptive Roadmap Architecture Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Quy trình học tập thích ứng</h2>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-indigo-50 text-indigo-700">
              Rule-based System
            </span>
          </div>

          <div className="space-y-4 text-sm text-slate-600">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                1
              </div>
              <div>
                <span className="font-semibold text-slate-800">Khảo sát năng lực ngẫu nhiên (Placement Test — Phase 5):</span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Lấy ngẫu nhiên câu hỏi từ các kỹ năng, xáo trộn câu hỏi và đáp án để đánh giá khách quan độ chính xác từng kỹ năng.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                2
              </div>
              <div>
                <span className="font-semibold text-slate-800">Lộ trình học cá nhân hóa thích ứng (Adaptive Learning — Phase 6):</span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tự động xếp các kỹ năng có độ chính xác dưới 60% lên đầu lộ trình. Kỹ năng tiếp theo bị khóa cho đến khi vượt qua bài kiểm tra kỹ năng.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                3
              </div>
              <div>
                <span className="font-semibold text-slate-800">Bài kiểm tra kỹ năng (1 phút / câu):</span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kiểm tra đếm ngược thời gian (1 phút mỗi câu). Đạt từ 70% sẽ mở khóa kỹ năng tiếp theo và lưu lịch sử làm bài để đối chiếu.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pro Account Status Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-900">Quyền lợi tài khoản Pro</h2>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Không giới hạn số lần làm bài Retest</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Mở khóa toàn bộ ngân hàng câu hỏi nâng cao</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Phân tích năng lực chuyên sâu (Skill Profile)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Nội dung bổ trợ (Remedial) được cá nhân hóa cao</span>
              </li>
            </ul>
          </div>

          <Link
            to="/subscription"
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs text-center transition flex items-center justify-center gap-2"
          >
            <span>{isPro ? 'Quản lý gói Pro' : 'Xem các gói nâng cấp'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* MODAL: SELECT SUBJECT FOR CREATING STUDY PATH */}
      {showSubjectPickerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Chọn môn học để tạo lộ trình</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Hệ thống sẽ tạo bài khảo sát năng lực (Placement Test) trước khi tạo lộ trình học cá nhân.
                </p>
              </div>
              <button
                onClick={() => setShowSubjectPickerModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {SUBJECTS_CAROUSEL.map((sub) => (
                <div
                  key={sub.code}
                  className={`p-4 rounded-2xl border transition flex items-center justify-between gap-4 ${
                    sub.ready
                      ? 'border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50'
                      : 'border-slate-200 bg-slate-50/60 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white bg-gradient-to-br ${sub.color}`}
                    >
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{sub.name}</h4>
                        {sub.ready ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Sẵn sàng khảo sát
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                            Sắp ra mắt
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{sub.desc}</p>
                    </div>
                  </div>

                  {sub.ready ? (
                    <button
                      onClick={() => {
                        setShowSubjectPickerModal(false);
                        navigate('/assessment/placement');
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer shrink-0 shadow-sm"
                    >
                      Bắt đầu khảo sát
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-3 py-2 rounded-xl bg-slate-200 text-slate-400 font-semibold text-xs cursor-not-allowed shrink-0"
                    >
                      Chưa mở
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowSubjectPickerModal(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

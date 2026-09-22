import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Compass,
  GraduationCap,
  Layers,
  Award,
  Zap,
  Target,
  BarChart3,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const SUBJECTS_PREVIEW = [
  {
    code: 'english',
    title: 'Tiếng Anh THPT',
    grade: 'Khối 10, 11, 12',
    desc: 'Lộ trình ngữ pháp trọng điểm, thì động từ, câu điều kiện, cấu trúc câu và từ vựng bám sát kỳ thi THPT.',
    badge: 'Đã sẵn sàng',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    ready: true,
  },
  {
    code: 'math',
    title: 'Toán Học THPT',
    grade: 'Khối 10, 11, 12',
    desc: 'Hàm số, hình học không gian, lượng giác, phương pháp tư duy giải nhanh trắc nghiệm chuẩn Bộ GD&ĐT.',
    badge: 'Đang biên soạn',
    badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
    ready: false,
  },
  {
    code: 'literature',
    title: 'Ngữ Văn THPT',
    grade: 'Khối 10, 11, 12',
    desc: 'Đọc hiểu chuyên sâu, phương pháp viết đoạn văn nghị luận xã hội và phân tích tác phẩm văn học.',
    badge: 'Đang biên soạn',
    badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
    ready: false,
  },
  {
    code: 'physics',
    title: 'Vật Lý THPT',
    grade: 'Khối 10, 11, 12',
    desc: 'Động học, lực cơ học, dao động điều hòa, sóng cơ và bài tập trắc nghiệm định lượng.',
    badge: 'Đang biên soạn',
    badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
    ready: false,
  },
];

const STEPS = [
  {
    step: '01',
    title: 'Khảo sát năng lực đầu vào',
    desc: 'Học sinh làm bài test 12 phút để hệ thống đánh giá chính xác mức độ nắm vững các kỹ năng cốt lõi.',
    icon: Target,
  },
  {
    step: '02',
    title: 'Bản đồ kiến thức cá nhân hóa',
    desc: 'Cây tri thức thích ứng tự động phân cấp các chủ đề từ cơ bản đến nâng cao theo năng lực của bạn.',
    icon: Compass,
  },
  {
    step: '03',
    title: 'Tự động phát hiện & Bổ trợ',
    desc: 'Nếu gặp khó khăn ở chủ đề nào, hệ thống lập tức mở khóa bài học bổ trợ (Remediation) để vá lỗ hổng.',
    icon: Zap,
  },
  {
    step: '04',
    title: 'Làm chủ kiến thức & Bứt phá',
    desc: 'Vượt qua bài kiểm tra từng chuyên đề và bài thi tổng kết với sự tự tin tuyệt đối trong kỳ thi THPT.',
    icon: Award,
  },
];

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartLearning = () => {
    if (user) {
      navigate('/study-path/english');
    } else {
      navigate('/login?redirect=/study-path/english');
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* ── 1. HERO SECTION ── */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Nền tảng Học tập Thích ứng THPT Chuẩn GDPT</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Học thông minh hơn với{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-800">
              lộ trình thích ứng
            </span>{' '}
            dành riêng cho bạn
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            PathStudy phát hiện chính xác lỗ hổng kiến thức qua từng bài học, tự động đề xuất bài giảng bổ trợ và tối ưu hóa thời gian ôn tập cho từng học sinh THPT.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {user ? (
              <Link to="/dashboard" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" icon={GraduationCap} className="w-full sm:w-auto">
                  Vào bàn học cá nhân
                </Button>
              </Link>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={handleStartLearning}
                iconRight={ArrowRight}
                className="w-full sm:w-auto"
              >
                Bắt đầu học ngay
              </Button>
            )}

            <Link to="/subjects" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Xem danh mục môn học
              </Button>
            </Link>
          </div>

          {/* Social Proof stats */}
          <div className="pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-4 max-w-lg mx-auto text-center">
            <div>
              <div className="text-2xl font-bold text-slate-900">100%</div>
              <div className="text-xs text-slate-500 font-medium">Bám sát SGK & Đề THPT</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-600">Adaptive</div>
              <div className="text-xs text-slate-500 font-medium">Học theo năng lực thực tế</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">24/7</div>
              <div className="text-xs text-slate-500 font-medium">Luyện tập & Bổ trợ liên tục</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. ADAPTIVE METHODOLOGY (HOW IT WORKS) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1.5">
            Phương pháp học tập thích ứng
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Cách PathStudy giúp bạn tiến bộ vượt bậc
          </h3>
          <p className="text-sm text-slate-500 mt-2">
            Không học đại trà. Mỗi học sinh được xây dựng một bản đồ kiến thức riêng biệt bám sát năng lực thực tế.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card key={idx} padding="lg" className="relative flex flex-col justify-between hover:border-indigo-300">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-extrabold text-indigo-600 font-mono tracking-widest">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-2">{item.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ── 3. FEATURED SUBJECTS ── */}
      <section className="bg-slate-100/60 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1.5">
                Chương trình THPT
              </h2>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Danh Mục Môn Học & Lộ Trình
              </h3>
            </div>
            <Link to="/subjects" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              <span>Xem tất cả môn học</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {SUBJECTS_PREVIEW.map((sub) => (
              <Card key={sub.code} padding="md" className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold text-slate-500">{sub.grade}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${sub.badgeClass}`}>
                      {sub.badge}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1.5">{sub.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {sub.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  {sub.ready ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleStartLearning}
                      iconRight={ArrowRight}
                      className="w-full"
                    >
                      Vào lộ trình học
                    </Button>
                  ) : (
                    <Button variant="secondary" size="sm" disabled className="w-full">
                      Sắp ra mắt
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. PRO MEMBERSHIP TEASER ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-8 sm:p-12 shadow-sm relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>GÓI NÂNG CẤP PRO THÀNH VIÊN</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Mở khóa toàn bộ bài học bổ trợ & Đề thi thử không giới hạn
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed">
              Trở thành học viên Pro để nhận sự hỗ trợ tối đa từ công nghệ học thích ứng: kích hoạt bài bổ trợ nâng cao, ngân hàng câu hỏi chuyên sâu và xác thực thanh toán tức thì qua VietQR.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link to="/subscription">
                <Button variant="pro" size="md" iconRight={ArrowRight}>
                  Tìm hiểu gói Pro
                </Button>
              </Link>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Thanh toán tự động 24/7 qua VietQR</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

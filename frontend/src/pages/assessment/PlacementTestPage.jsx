import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import assessmentService from '../../services/assessmentService';
import adaptiveService from '../../services/adaptiveService';
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  Award,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  RotateCcw,
  BookOpen,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

const ENGLISH_SUBJECT_ID = '11111111-1111-1111-1111-111111111101';

export default function PlacementTestPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [generatingPath, setGeneratingPath] = useState(false);
  const [testData, setTestData] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: selectedOptionId }
  const [timeLeft, setTimeLeft] = useState(12 * 60); // 12 minutes in seconds
  const [result, setResult] = useState(null);

  // Initialize or fetch test
  useEffect(() => {
    const initTest = async () => {
      if (!user?.userId) return;

      try {
        setLoading(true);
        // Generate random placement test
        const data = await assessmentService.generatePlacementTest(
          ENGLISH_SUBJECT_ID,
          user.userId
        );
        setTestData(data);
        if (data.timeLimitMinutes) {
          setTimeLeft(data.timeLimitMinutes * 60);
        }
      } catch (err) {
        console.error('Lỗi khởi tạo bài kiểm tra năng lực:', err);
      } finally {
        setLoading(false);
      }
    };

    initTest();
  }, [user?.userId]);

  // Live countdown timer
  useEffect(() => {
    if (!testData || result || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest(); // Auto-submit when time expires
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testData, result, timeLeft]);

  const handleSelectOption = (questionId, optionId) => {
    if (result || submitting) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmitTest = async () => {
    if (!testData?.attemptId || submitting || result) return;

    setSubmitting(true);
    try {
      const answerList = Object.entries(answers).map(([questionId, selectedOptionId]) => ({
        questionId,
        selectedOptionId,
      }));

      const res = await assessmentService.submitAssessment(testData.attemptId, answerList);
      setResult(res);
    } catch (err) {
      console.error('Lỗi khi nộp bài khảo sát:', err);
      alert('Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreatePersonalizedPath = async () => {
    if (!result?.attemptId || !user?.userId) return;

    setGeneratingPath(true);
    try {
      // Pass skillBreakdown directly — this is the KEY fix!
      // Backend receives exact per-skill scores instead of re-fetching (which could fail or return defaults)
      await adaptiveService.generateStudyPath(
        ENGLISH_SUBJECT_ID,
        user.userId,
        result.attemptId,
        result.skillBreakdown || null
      );
      // Navigate directly to the personalized study path
      navigate('/study-path/english');
    } catch (err) {
      console.error('Lỗi khi tạo lộ trình học cá nhân:', err);
      alert('Không thể tạo lộ trình. Vui lòng thử lại.');
    } finally {
      setGeneratingPath(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-600 font-medium text-xs sm:text-sm">
          Đang khởi tạo bài kiểm tra ngẫu nhiên và chuẩn bị đề thi...
        </p>
      </div>
    );
  }

  // --- RESULT VIEW ---
  if (result) {
    const isGood = result.accuracyPercentage >= 80;
    const weakSkills = result.skillBreakdown?.filter((s) => s.accuracyPercentage < 60) || [];

    return (
      <div className="max-w-4xl mx-auto space-y-6 py-2">
        {/* Banner Result */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 border border-slate-800 shadow-sm">
          <div className="relative z-10 max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/30 text-xs font-semibold text-emerald-300">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Đã hoàn thành & Lưu vào lịch sử đánh giá</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Báo Cáo Kết Quả Đánh Giá Năng Lực
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Hệ thống đã phân tích chi tiết độ chính xác trên từng nhóm kỹ năng tiếng Anh để thiết kế lộ trình học thích ứng (Adaptive Learning Path) dành riêng cho bạn.
            </p>
          </div>
        </div>

        {/* Overall Score Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl">
              {result.score}/{result.totalQuestions}
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-semibold uppercase">Số câu đúng</div>
              <div className="text-lg font-bold text-slate-900">
                {result.score} trên {result.totalQuestions} câu
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
              {result.accuracyPercentage}%
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-semibold uppercase">Độ chính xác</div>
              <div className="text-lg font-bold text-slate-900">
                {result.accuracyPercentage >= 80
                  ? 'Nền tảng Tốt (≥80%)'
                  : result.accuracyPercentage >= 60
                  ? 'Khá (Cần cải thiện)'
                  : 'Cần củng cố'}
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-semibold uppercase">Kỹ năng cần ưu tiên</div>
              <div className="text-lg font-bold text-amber-700">
                {weakSkills.length > 0 ? `${weakSkills.length} kỹ năng yếu` : 'Đồng đều tốt'}
              </div>
            </div>
          </div>
        </div>

        {/* Skill Breakdown Table / Cards */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Chi tiết năng lực theo từng nhóm kỹ năng ({result.skillBreakdown?.length || 0})
            </h3>
            <span className="text-xs text-slate-500">
              Thuật toán sẽ tự động xếp kỹ năng yếu lên đầu
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {result.skillBreakdown?.map((s) => {
              const acc = s.accuracyPercentage;
              let badgeColor = 'bg-red-50 text-red-700 border-red-200';
              let label = 'Cần củng cố (<60%)';
              let progressColor = 'bg-red-500';

              if (acc >= 80) {
                badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                label = 'Tốt (≥80%)';
                progressColor = 'bg-emerald-500';
              } else if (acc >= 60) {
                badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
                label = 'Đạt yêu cầu (60-79%)';
                progressColor = 'bg-blue-500';
              }

              return (
                <div
                  key={s.skillId}
                  className="p-4 rounded-lg border border-slate-200 bg-slate-50/60 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                      {s.skillName}
                    </h4>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border shrink-0 ${badgeColor}`}>
                      {label}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Số câu đúng: <strong>{s.correctCount} / {s.totalQuestions}</strong></span>
                    <span className="font-bold text-slate-800">{acc}%</span>
                  </div>

                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${progressColor} transition-all duration-500`}
                      style={{ width: `${acc}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Explanation Alert */}
          <div className="p-3.5 rounded-lg bg-indigo-50/80 border border-indigo-200 text-indigo-950 text-xs sm:text-sm leading-relaxed flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-indigo-900">Chiến lược Cá nhân hóa Thích ứng: </strong>
              Khi bạn bấm nút "Tạo Lộ trình Học Cá Nhân", hệ thống sẽ đảo thứ tự lộ trình học, đưa các kỹ năng có kết quả dưới 80% lên vị trí bài học ưu tiên để củng cố ngay lập tức. Sau mỗi kỹ năng, bạn sẽ làm 1 bài kiểm tra kỹ năng (đạt ≥80%) để mở khóa bài học kế tiếp!
            </div>
          </div>

          {/* Action CTA Button */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <Link
              to="/subjects"
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold transition"
            >
              Xem danh mục môn học
            </Link>

            <button
              onClick={handleCreatePersonalizedPath}
              disabled={generatingPath}
              className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition duration-150 flex items-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {generatingPath ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang khởi tạo lộ trình thích ứng...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Tạo Lộ Trình Học Cá Nhân</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- TAKING TEST VIEW ---
  const questions = testData?.questions || [];
  const currentQ = questions[currentQIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Test Header with Live Timer */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100 mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Khảo sát Năng lực Ban đầu ({totalQuestions} Câu ngẫu nhiên)</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">
            {testData?.title || 'Khảo sát Năng lực Tiếng Anh THPT'}
          </h1>
        </div>

        {/* Live Timer Pill */}
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border font-mono font-bold text-sm shadow-xs ${
            timeLeft < 180
              ? 'bg-red-50 border-red-300 text-red-700 animate-pulse'
              : 'bg-indigo-50 border-indigo-200 text-indigo-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 items-start">
        {/* Left side: Current Question Card */}
        <div className="lg:col-span-3 space-y-4">
          {currentQ ? (
            <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
              {/* Question Meta Header */}
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    {currentQIndex + 1}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
                    {currentQ.skillName || 'Kỹ năng'}
                  </span>
                </div>

                <span className="text-xs text-slate-400 font-medium">
                  Câu {currentQIndex + 1} / {totalQuestions}
                </span>
              </div>

              {/* Question Content */}
              <div className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
                {currentQ.content}
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options?.map((opt, idx) => {
                  const letters = ['A', 'B', 'C', 'D'];
                  const isSelected = answers[currentQ.questionId] === opt.id;

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(currentQ.questionId, opt.id)}
                      className={`w-full p-3 rounded-lg border text-left text-xs sm:text-sm font-medium transition flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-950 font-semibold'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-6 h-6 rounded text-xs font-bold flex items-center justify-center ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 border border-slate-200 text-slate-600'
                          }`}
                        >
                          {letters[idx] || (idx + 1)}
                        </span>
                        <span>{opt.optionContent}</span>
                      </div>

                      {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                    </button>
                  );
                })}
              </div>

              {/* Question Navigation Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  disabled={currentQIndex === 0}
                  onClick={() => setCurrentQIndex((prev) => prev - 1)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Câu trước</span>
                </button>

                {currentQIndex < totalQuestions - 1 ? (
                  <button
                    onClick={() => setCurrentQIndex((prev) => prev + 1)}
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Câu tiếp theo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitTest}
                    disabled={submitting}
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Nộp bài khảo sát</span>
                    <CheckCircle className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-sm">
              Không có câu hỏi nào.
            </div>
          )}
        </div>

        {/* Right side: Questions Palette & Submit Box */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900">Mục lục câu hỏi</h3>
              <span className="text-xs font-bold text-indigo-600">
                {answeredCount}/{totalQuestions} đã làm
              </span>
            </div>

            {/* Grid of question numbers */}
            <div className="grid grid-cols-4 gap-1.5">
              {questions.map((q, idx) => {
                const isAnswered = !!answers[q.questionId];
                const isCurrent = idx === currentQIndex;

                let btnClass = 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200';
                if (isCurrent) {
                  btnClass = 'bg-indigo-600 text-white font-bold ring-1 ring-indigo-500';
                } else if (isAnswered) {
                  btnClass = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold';
                }

                return (
                  <button
                    key={q.id || idx}
                    onClick={() => setCurrentQIndex(idx)}
                    className={`h-8 rounded-md border text-xs font-semibold transition cursor-pointer flex items-center justify-center ${btnClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
                <span>Đã trả lời</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-slate-300"></span>
                <span>Chưa trả lời</span>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              onClick={handleSubmitTest}
              disabled={submitting}
              className="w-full mt-3 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang chấm điểm...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Nộp bài khảo sát</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

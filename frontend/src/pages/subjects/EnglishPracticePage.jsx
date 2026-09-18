import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import questionService from '../../services/questionService';
import contentService from '../../services/contentService';
import {
  Layers,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Sparkles,
  Filter,
  Check,
  X,
  HelpCircle,
  RotateCcw,
  BarChart2,
  Award,
} from 'lucide-react';

export default function EnglishPracticePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSkillId = searchParams.get('skillId') || '';

  const [skills, setSkills] = useState([]);
  const [selectedSkillId, setSelectedSkillId] = useState(initialSkillId);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Practice state
  const [userAnswers, setUserAnswers] = useState({}); // questionId -> checkAnswerResponse
  const [checkingQuestionId, setCheckingQuestionId] = useState(null);

  // Fetch skills for filter
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const sub = await contentService.getSubjectByCode('ENGLISH');
        if (sub?.id) {
          const sks = await contentService.getSkills(sub.id);
          setSkills(sks);
        }
      } catch (err) {
        console.error('Lỗi tải kỹ năng:', err);
      }
    };
    fetchSkills();
  }, []);

  // Fetch questions based on filters
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const qList = await questionService.getQuestions({
          skillId: selectedSkillId || undefined,
          difficulty: selectedDifficulty || undefined,
        });
        setQuestions(qList);
      } catch (err) {
        console.error('Lỗi tải danh sách câu hỏi:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [selectedSkillId, selectedDifficulty]);

  const handleSelectOption = async (questionId, optionId) => {
    // If already answered this question, don't re-submit
    if (userAnswers[questionId]) return;

    setCheckingQuestionId(questionId);
    try {
      const result = await questionService.checkAnswer(questionId, optionId);
      const isCorrectVal = Boolean(result.isCorrect ?? result.correct ?? (optionId === result.correctOptionId));
      setUserAnswers((prev) => ({
        ...prev,
        [questionId]: {
          ...result,
          isCorrect: isCorrectVal,
          selectedOptionId: optionId,
        },
      }));
    } catch (err) {
      console.error('Lỗi kiểm tra đáp án:', err);
    } finally {
      setCheckingQuestionId(null);
    }
  };

  const handleResetPractice = () => {
    setUserAnswers({});
  };

  // Stats calculation
  const totalAnswered = Object.keys(userAnswers).length;
  const totalCorrect = Object.values(userAnswers).filter((a) => a.isCorrect).length;
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top back navigation */}
      <div>
        <Link
          to="/subjects/english"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Môn Tiếng Anh & Danh sách Bài học</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 border border-slate-800 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-semibold text-indigo-300 mb-3">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Ngân hàng Câu hỏi Trắc nghiệm Tiếng Anh THPT</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Luyện tập & Đánh giá Năng lực Trực tuyến
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Hệ thống ngân hàng câu hỏi phân cấp 3 mức độ (Dễ, Trung bình, Khó) theo chuẩn cấu trúc đề thi. Nhận phản hồi đúng/sai tức thì kèm lời giải thích ngữ pháp và dịch nghĩa chi tiết.
          </p>
        </div>
      </div>

      {/* Live Score Counter & Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Stats card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-600" />
              <span>Tiến độ luyện tập</span>
            </h3>
            {totalAnswered > 0 && (
              <button
                onClick={handleResetPractice}
                className="text-xs text-slate-500 hover:text-indigo-600 font-medium flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Làm lại</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="block text-[11px] text-slate-500 font-medium">Đã làm</span>
              <strong className="text-lg font-bold text-slate-800">{totalAnswered} / {questions.length}</strong>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
              <span className="block text-[11px] text-emerald-600 font-medium">Số câu đúng</span>
              <strong className="text-lg font-bold text-emerald-700">{totalCorrect}</strong>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100">
              <span className="block text-[11px] text-indigo-600 font-medium">Độ chính xác</span>
              <strong className="text-lg font-bold text-indigo-700">{accuracy}%</strong>
            </div>
          </div>
        </div>

        {/* Filter Selection Controls */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <Filter className="w-4 h-4 text-indigo-600" />
            <span>Bộ lọc câu hỏi</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Nhóm kỹ năng (Skill)
              </label>
              <select
                value={selectedSkillId}
                onChange={(e) => {
                  setSelectedSkillId(e.target.value);
                  setUserAnswers({});
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Tất cả nhóm kỹ năng</option>
                {skills.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Mức độ khó (Difficulty)
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => {
                  setSelectedDifficulty(e.target.value);
                  setUserAnswers({});
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Tất cả mức độ</option>
                <option value="EASY">Dễ (Nhận biết / Thông hiểu)</option>
                <option value="MEDIUM">Trung bình (Vận dụng)</option>
                <option value="HARD">Khó (Vận dụng cao / Phân loại)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Danh sách câu hỏi ({questions.length} câu)
          </h2>
          <span className="text-xs text-slate-500">
            Bấm chọn phương án A, B, C, D để xem lời giải thích
          </span>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-slate-500 font-medium">Đang tải câu hỏi...</span>
          </div>
        ) : questions.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-sm">
            Không có câu hỏi nào khớp với bộ lọc đã chọn.
          </div>
        ) : (
          questions.map((q, idx) => {
            const answerState = userAnswers[q.id];
            const isAnswered = !!answerState;

            let diffBadge = 'bg-slate-100 text-slate-700';
            let diffLabel = 'Trung bình';
            if (q.difficulty === 'EASY') {
              diffBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
              diffLabel = 'Dễ (Nhận biết)';
            } else if (q.difficulty === 'MEDIUM') {
              diffBadge = 'bg-amber-50 text-amber-700 border-amber-200';
              diffLabel = 'Trung bình (Vận dụng)';
            } else if (q.difficulty === 'HARD') {
              diffBadge = 'bg-purple-50 text-purple-700 border-purple-200';
              diffLabel = 'Khó (Vận dụng cao)';
            }

            return (
              <div
                key={q.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5"
              >
                {/* Question Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${diffBadge}`}>
                      {diffLabel}
                    </span>
                  </div>

                  {isAnswered && (
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        answerState.isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {answerState.isCorrect ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Chính xác</span>
                        </>
                      ) : (
                        <>
                          <X className="w-3.5 h-3.5" />
                          <span>Chưa chính xác</span>
                        </>
                      )}
                    </span>
                  )}
                </div>

                {/* Question Stem */}
                <div className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                  {q.content}
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options?.map((opt, oIdx) => {
                    const letters = ['A', 'B', 'C', 'D'];
                    const isSelected = answerState?.selectedOptionId === opt.id;
                    const isCorrect = answerState?.correctOptionId === opt.id;

                    let optClass =
                      'bg-slate-50 border-slate-200 hover:bg-slate-100/80 text-slate-800 hover:border-indigo-400';

                    if (isAnswered) {
                      if (isCorrect) {
                        optClass =
                          'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs';
                      } else if (isSelected && !isCorrect) {
                        optClass = 'bg-red-50 border-red-500 text-red-950 font-semibold';
                      } else {
                        optClass = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        disabled={isAnswered || checkingQuestionId === q.id}
                        onClick={() => handleSelectOption(q.id, opt.id)}
                        className={`p-4 rounded-2xl border text-left text-sm transition flex items-start gap-3 cursor-pointer ${optClass}`}
                      >
                        <span className="w-6 h-6 rounded-lg bg-white/80 border border-slate-200 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 text-slate-700">
                          {letters[oIdx] || oIdx + 1}
                        </span>
                        <span className="flex-1">{opt.optionContent}</span>
                        {isAnswered && isCorrect && (
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        )}
                        {isAnswered && isSelected && !isCorrect && (
                          <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Card */}
                {isAnswered && (
                  <div
                    className={`p-5 rounded-2xl border text-xs sm:text-sm leading-relaxed space-y-2 ${
                      answerState.isCorrect
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                        : 'bg-amber-50/60 border-amber-200 text-amber-950'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5 text-sm">
                      <HelpCircle className="w-4 h-4 text-indigo-600" />
                      <span>Lời giải thích & Phân tích chi tiết:</span>
                    </div>
                    <div className="pl-5 leading-relaxed whitespace-pre-line font-medium">
                      {answerState.explanation || q.explanation || 'Không có giải thích chi tiết.'}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import contentService from '../../services/contentService';
import {
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Layers,
  HelpCircle,
  Award,
  Check,
  X,
  RotateCcw,
} from 'lucide-react';

export default function LessonDetailPage() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [examples, setExamples] = useState([]);
  const [miniQuizzes, setMiniQuizzes] = useState([]);
  const [activeTab, setActiveTab] = useState('theory');
  const [loading, setLoading] = useState(true);

  // Mini Quiz Interactive State
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        const data = await contentService.getLesson(lessonId);
        setLesson(data);
        if (data?.examples) setExamples(data.examples);
        if (data?.miniQuizzes) setMiniQuizzes(data.miniQuizzes);
      } catch (err) {
        console.error('Lỗi tải bài học:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLessonData();
  }, [lessonId]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-slate-500 font-medium">Đang tải bài học lý thuyết...</span>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Không tìm thấy bài học</h2>
        <Link
          to="/study-path/english"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Lộ trình học</span>
        </Link>
      </div>
    );
  }

  // Parse Mini Quiz questions if present
  let parsedQuizQuestions = [];
  if (miniQuizzes.length > 0 && miniQuizzes[0].questionsJson) {
    try {
      parsedQuizQuestions = JSON.parse(miniQuizzes[0].questionsJson);
    } catch (e) {
      console.error('Lỗi parse quiz questions:', e);
    }
  }

  const handleSelectQuizOption = (qIdx, opt) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: opt }));
  };

  const handleCheckQuiz = () => {
    setQuizSubmitted(true);
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 flex-wrap">
        <Link to="/study-path/english" className="hover:text-indigo-600 transition">
          Lộ trình học
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold truncate max-w-xs sm:max-w-md">
          {lesson.title}
        </span>
      </div>

      {/* Lesson Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            LÝ THUYẾT & BÀI HỌC TRỌNG TÂM
          </span>

          <Link
            to={`/subjects/english/practice?skillId=${lesson.skillId}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Luyện tập trắc nghiệm kỹ năng này</span>
          </Link>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {lesson.title}
        </h1>

        {lesson.theorySummary && (
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-sm text-indigo-950 font-medium leading-relaxed">
            <span className="font-bold text-indigo-700">Tóm tắt cốt lõi: </span>
            {lesson.theorySummary}
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('theory')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'theory'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Lý thuyết chuyên sâu</span>
          </button>

          <button
            onClick={() => setActiveTab('examples')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'examples'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Ví dụ minh họa ({examples.length})</span>
          </button>

          {parsedQuizQuestions.length > 0 && (
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'quiz'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Mini Quiz ({parsedQuizQuestions.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Content 1: Theory */}
      {activeTab === 'theory' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <div className="prose max-w-none text-slate-750">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className="text-2xl font-bold text-slate-900 mt-6 mb-3" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-xl font-bold text-slate-900 mt-5 mb-2.5 pb-1 border-b border-slate-100" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-lg font-bold text-indigo-950 mt-4 mb-2" {...props} />
                ),
                h4: ({ node, ...props }) => (
                  <h4 className="text-base font-bold text-slate-800 mt-3 mb-1" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="text-slate-700 leading-relaxed mb-3 text-sm sm:text-base" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc list-inside space-y-1.5 mb-3 text-slate-750 text-sm sm:text-base pl-2" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal list-inside space-y-1.5 mb-3 text-slate-750 text-sm sm:text-base pl-2" {...props} />
                ),
                li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-bold text-slate-900" {...props} />,
                em: ({ node, ...props }) => <em className="italic text-slate-700" {...props} />,
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-indigo-500 bg-indigo-50/50 pl-4 py-2 rounded-r-xl my-3 text-sm text-indigo-950 italic" {...props} />
                ),
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-5 rounded-2xl border border-slate-200 shadow-xs">
                    <table className="min-w-full divide-y divide-slate-200 text-sm" {...props} />
                  </div>
                ),
                thead: ({ node, ...props }) => (
                  <thead className="bg-slate-100/90 text-slate-900 font-bold" {...props} />
                ),
                tbody: ({ node, ...props }) => (
                  <tbody className="divide-y divide-slate-200 bg-white" {...props} />
                ),
                tr: ({ node, ...props }) => (
                  <tr className="hover:bg-slate-50/70 transition" {...props} />
                ),
                th: ({ node, ...props }) => (
                  <th className="px-4 py-3 text-left font-bold text-slate-800 text-xs sm:text-sm uppercase tracking-wider bg-slate-100" {...props} />
                ),
                td: ({ node, ...props }) => (
                  <td className="px-4 py-3 text-slate-700 text-xs sm:text-sm border-t border-slate-100" {...props} />
                ),
                code: ({ node, inline, ...props }) =>
                  inline ? (
                    <code className="px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-mono text-xs font-semibold" {...props} />
                  ) : (
                    <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 overflow-x-auto text-xs sm:text-sm font-mono my-3">
                      <code {...props} />
                    </pre>
                  ),
              }}
            >
              {lesson.content}
            </ReactMarkdown>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between gap-4 flex-wrap">
            <button
              onClick={() => setActiveTab('examples')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm transition"
            >
              <span>Xem các ví dụ minh họa</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>

            <Link
              to={`/subjects/english/practice?skillId=${lesson.skillId}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition shadow-sm"
            >
              <span>Vào luyện tập câu hỏi trắc nghiệm</span>
              <Layers className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Tab Content 2: Examples */}
      {activeTab === 'examples' && (
        <div className="space-y-4">
          {examples.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
              Chưa có ví dụ riêng biệt cho bài học này. Bạn có thể xem ví dụ trực tiếp trong phần lý thuyết.
            </div>
          ) : (
            examples.map((ex, idx) => (
              <div
                key={ex.id || idx}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-100">
                    {ex.title || `Ví dụ ${idx + 1}`}
                  </span>
                </div>

                <div className="text-base sm:text-lg font-bold text-indigo-900 bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono">
                  "{ex.content}"
                </div>

                {ex.translation && (
                  <div className="text-sm text-slate-600 italic">
                    <span className="font-semibold not-italic text-slate-700">Dịch nghĩa: </span>
                    {ex.translation}
                  </div>
                )}

                {ex.explanation && (
                  <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs sm:text-sm text-emerald-900 leading-relaxed">
                    <strong className="font-bold text-emerald-800">Phân tích ngữ pháp: </strong>
                    {ex.explanation}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab Content 3: Mini Quiz */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-900">
              Mini Quiz: Kiểm tra hiểu bài tức thì
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Chọn đáp án đúng cho các câu hỏi bên dưới và nhấn "Kiểm tra đáp án" để xem giải thích.
            </p>
          </div>

          <div className="space-y-6">
            {parsedQuizQuestions.map((q, qIdx) => {
              const selectedOpt = quizAnswers[qIdx];
              const isCorrectAnswer = selectedOpt === q.answer;

              return (
                <div
                  key={qIdx}
                  className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4"
                >
                  <div className="font-bold text-slate-900 text-base">
                    Câu {qIdx + 1}: {q.question}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options?.map((opt, oIdx) => {
                      const isSelected = selectedOpt === opt;
                      const isOptionCorrect = opt === q.answer;

                      let btnStyle =
                        'bg-white border-slate-200 hover:border-indigo-400 text-slate-800';

                      if (isSelected) {
                        btnStyle = 'bg-indigo-50 border-indigo-600 text-indigo-900 font-semibold';
                      }

                      if (quizSubmitted) {
                        if (isOptionCorrect) {
                          btnStyle =
                            'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                        } else if (isSelected && !isOptionCorrect) {
                          btnStyle = 'bg-red-50 border-red-500 text-red-900 line-through';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={quizSubmitted}
                          onClick={() => handleSelectQuizOption(qIdx, opt)}
                          className={`p-3.5 rounded-xl border text-left text-sm transition flex items-center justify-between gap-2 cursor-pointer ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && isOptionCorrect && (
                            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          {quizSubmitted && isSelected && !isOptionCorrect && (
                            <X className="w-4 h-4 text-red-500 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div
                      className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed border ${
                        isCorrectAnswer
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-amber-50 border-amber-200 text-amber-900'
                      }`}
                    >
                      <div className="font-bold mb-1">
                        {isCorrectAnswer ? 'Chính xác! 🎉' : 'Chưa chính xác!'}
                      </div>
                      <div>
                        <strong>Giải thích: </strong>
                        {q.explanation}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex items-center justify-between gap-4">
            {!quizSubmitted ? (
              <button
                onClick={handleCheckQuiz}
                disabled={Object.keys(quizAnswers).length < parsedQuizQuestions.length}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm transition shadow-sm cursor-pointer"
              >
                Kiểm tra đáp án
              </button>
            ) : (
              <button
                onClick={handleResetQuiz}
                className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-sm transition flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Làm lại Quiz</span>
              </button>
            )}

            <Link
              to={`/subjects/english/practice?skillId=${lesson.skillId}`}
              className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700"
            >
              <span>Chuyển sang Ngân hàng câu hỏi →</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

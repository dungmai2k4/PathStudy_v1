import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  CheckCircle,
  AlertTriangle,
  Shuffle,
  Check,
  X,
  RotateCcw,
  ChevronRight,
  Lock,
  Award,
} from 'lucide-react';
import adaptiveService from '../../services/adaptiveService';
import { getRandomQuizForLesson } from '../../data/fallbackQuizzes';
import { FONT } from './studyPathConstants';

/* ── Lesson content panel with Sequential Progression ── */
export default function LessonContentPanel({
  lesson,
  examples,
  miniQuizzes,
  activeSkillNode,
  userId,
  onOpenTest,
  lessonProgress,
  onProgressUpdated,
  onNextLesson,
  hasNextLesson,
  canTakeTopicTest,
}) {
  const [quizQuestions, setQuizQuestions] = useState(() => getRandomQuizForLesson(lesson, miniQuizzes));
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [quizScorePct, setQuizScorePct] = useState(null);
  const [quizPassed, setQuizPassed] = useState(false);

  useEffect(() => {
    // Reset quiz state and draw fresh randomized questions when switching lesson
    setQuizQuestions(getRandomQuizForLesson(lesson, miniQuizzes));
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScorePct(null);
    setQuizPassed(false);
  }, [lesson?.id]);

  const handleRefreshQuiz = () => {
    setQuizQuestions(getRandomQuizForLesson(lesson, miniQuizzes));
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScorePct(null);
    setQuizPassed(false);
  };

  const letters = ['A', 'B', 'C', 'D'];

  const handleQuizSubmit = async () => {
    if (Object.keys(quizAnswers).length < quizQuestions.length) return;
    setSubmittingQuiz(true);
    let correct = 0;
    quizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.answer) correct++;
    });
    const score = Math.round((correct / quizQuestions.length) * 100);
    // Passing rule:
    // For 1 question: at least 1 correct answer (100%).
    // For 2-3 questions: at least 2 correct answers (>= 66%).
    // For > 3 questions: score >= 80%.
    const minRequired = quizQuestions.length <= 1
      ? 1
      : quizQuestions.length <= 3
      ? 2
      : Math.ceil(quizQuestions.length * 0.8);
    const isPassed = correct >= minRequired;
    setQuizScorePct(score);
    setQuizPassed(isPassed);
    setQuizSubmitted(true);

    try {
      await adaptiveService.recordLessonProgress(
        userId,
        activeSkillNode.skillId,
        lesson.id,
        isPassed, // isCompleted is ONLY marked true if quiz passed!
        true,     // quizCompleted
        score     // quizScore
      );
      onProgressUpdated();
    } catch (e) {
      console.error('Failed to record lesson progress', e);
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const mdComponents = {
    h1: ({ node, ...p }) => <h1 style={{ fontSize: 18, fontWeight: 700, margin: '20px 0 8px' }} {...p} />,
    h2: ({ node, ...p }) => <h2 style={{ fontSize: 16, fontWeight: 700, margin: '18px 0 6px', paddingBottom: 4, borderBottom: '1px solid #f3f4f6' }} {...p} />,
    h3: ({ node, ...p }) => <h3 style={{ fontSize: 14, fontWeight: 700, margin: '14px 0 4px' }} {...p} />,
    p: ({ node, ...p }) => <p style={{ marginBottom: 10, lineHeight: 1.75 }} {...p} />,
    ul: ({ node, ...p }) => <ul style={{ listStyleType: 'disc', paddingLeft: 20, marginBottom: 10 }} {...p} />,
    ol: ({ node, ...p }) => <ol style={{ listStyleType: 'decimal', paddingLeft: 20, marginBottom: 10 }} {...p} />,
    li: ({ node, ...p }) => <li style={{ marginBottom: 4 }} {...p} />,
    strong: ({ node, ...p }) => <strong style={{ fontWeight: 700, color: '#111827' }} {...p} />,
    blockquote: ({ node, ...p }) => <blockquote style={{ borderLeft: '3px solid #d1d5db', paddingLeft: 14, color: '#6b7280', margin: '10px 0', fontStyle: 'italic' }} {...p} />,
    table: ({ node, ...p }) => <div style={{ overflowX: 'auto', margin: '14px 0', border: '1px solid #e5e7eb' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }} {...p} /></div>,
    thead: ({ node, ...p }) => <thead style={{ background: '#f9fafb' }} {...p} />,
    th: ({ node, ...p }) => <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700, borderBottom: '1px solid #e5e7eb', fontSize: 12, color: '#374151' }} {...p} />,
    td: ({ node, ...p }) => <td style={{ padding: '8px 12px', borderBottom: '1px solid #f3f4f6', color: '#374151' }} {...p} />,
    code: ({ node, inline, ...p }) => inline
      ? <code style={{ background: '#f3f4f6', padding: '1px 5px', fontFamily: 'Courier New,monospace', fontSize: 12 }} {...p} />
      : <pre style={{ background: '#1f2937', color: '#f9fafb', padding: 14, overflowX: 'auto', fontSize: 12, fontFamily: 'Courier New,monospace', margin: '10px 0' }}><code {...p} /></pre>,
  };

  const isLessonFinished = lessonProgress?.isCompleted && lessonProgress?.quizCompleted;

  return (
    <div style={{ maxWidth: 760, fontFamily: FONT }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {activeSkillNode?.moduleName || 'Khối kiến thức'} · {activeSkillNode?.skillName}
          </span>
          {isLessonFinished && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', fontSize: 11, padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
              <CheckCircle size={12} /> Đã hoàn thành bài học
            </span>
          )}
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '4px 0 8px', lineHeight: 1.3 }}>
          {lesson.title}
        </h1>
        {lesson.theorySummary && (
          <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.65, borderLeft: '3px solid #3730a3', paddingLeft: 14, margin: '12px 0', background: '#f8fafc', padding: '10px 14px' }}>
            {lesson.theorySummary}
          </p>
        )}
      </div>
      <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', marginBottom: 24 }} />

      {/* Theory */}
      <section>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 14, paddingBottom: 6, borderBottom: '1px solid #e5e7eb' }}>
          1. Lý thuyết cốt lõi
        </h2>
        <div style={{ fontSize: 14, color: '#1f2937', lineHeight: 1.75 }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{lesson.content}</ReactMarkdown>
        </div>
      </section>

      {/* Examples */}
      {examples.length > 0 && (
        <section style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 14, paddingBottom: 6, borderBottom: '1px solid #e5e7eb' }}>
            2. Ví dụ minh họa thực tế
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {examples.map((ex, idx) => (
              <div key={ex.id || idx} style={{ border: '1px solid #e5e7eb', padding: '14px 18px', background: '#fff' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', marginBottom: 6 }}>
                  Ví dụ {idx + 1}{ex.title ? ` — ${ex.title}` : ''}
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#1e1b4b', fontStyle: 'italic', marginBottom: 6 }}>
                  "{ex.content}"
                </div>
                {ex.translation && (
                  <div style={{ fontSize: 13, color: '#4b5563', marginBottom: 6 }}>
                    <span style={{ fontWeight: 700 }}>Dịch nghĩa: </span>{ex.translation}
                  </div>
                )}
                {ex.explanation && (
                  <div style={{ fontSize: 13, color: '#374151', borderTop: '1px solid #f3f4f6', paddingTop: 8, marginTop: 6 }}>
                    <span style={{ fontWeight: 700 }}>Phân tích: </span>{ex.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Mini Quiz */}
      {quizQuestions.length > 0 && (
        <section style={{ marginTop: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, paddingBottom: 6, borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>
                3. Kiểm tra nhanh (Mini Quiz - {quizQuestions.length} câu ngẫu nhiên)
              </h2>
              <button
                type="button"
                onClick={handleRefreshQuiz}
                title="Đổi bộ câu hỏi và xáo trộn phương án ngẫu nhiên"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 11,
                  padding: '3px 8px',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: 3,
                  cursor: 'pointer',
                  color: '#475569',
                  fontFamily: FONT,
                }}
              >
                <Shuffle size={11} /> Đổi câu hỏi
              </button>
            </div>
            {quizSubmitted && quizScorePct !== null && (
              <span style={{ fontSize: 13, fontWeight: 700, color: quizPassed ? '#15803d' : '#b45309' }}>
                Kết quả: {quizScorePct}% ({quizPassed ? 'Đạt' : 'Chưa đạt'})
              </span>
            )}
          </div>
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
            Hoàn thành đúng tối thiểu {quizQuestions.length <= 1 ? '1 câu' : `${Math.min(2, quizQuestions.length)} câu`} quiz để hệ thống đánh dấu đã học và mở khóa bài học tiếp theo trong Topic. Các câu hỏi và đáp án được ngẫu nhiên mỗi lần luyện tập.
          </p>

          {/* Feedback banner after submitting quiz */}
          {quizSubmitted && (
            <div
              style={{
                margin: '12px 0 18px',
                padding: '12px 16px',
                background: quizPassed ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${quizPassed ? '#86efac' : '#fca5a5'}`,
                borderRadius: 4,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: quizPassed ? '#166534' : '#991b1b', fontWeight: 700, fontSize: 13.5 }}>
                {quizPassed ? <CheckCircle size={16} color="#16a34a" /> : <AlertTriangle size={16} color="#dc2626" />}
                {quizPassed
                  ? `Chúc mừng! Bạn đã đạt quiz (${quizScorePct}%) và hoàn thành bài học!`
                  : `Chưa đạt yêu cầu (${quizScorePct}%). Bạn cần trả lời đúng tối thiểu ${quizQuestions.length <= 1 ? '1 câu' : `${Math.min(2, quizQuestions.length)} câu`} để hoàn thành bài học.`}
              </div>
              <div style={{ fontSize: 12.5, color: quizPassed ? '#15803d' : '#b91c1c', marginTop: 4, lineHeight: 1.4 }}>
                {quizPassed
                  ? 'Bài học đã được hệ thống ghi nhận hoàn thành. Bài học tiếp theo đã được mở khóa!'
                  : 'Vui lòng xem lại phần lý thuyết cốt lõi ở trên và bấm "Làm lại Quiz (Đổi câu hỏi mới)" để vượt qua bài học.'}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {quizQuestions.map((q, qIdx) => {
              const sel = quizAnswers[qIdx];
              const isCorr = sel === q.answer;
              return (
                <div key={qIdx} style={{ border: '1px solid #e5e7eb', padding: '14px 18px', background: '#fff' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 12, lineHeight: 1.5 }}>
                    Câu {qIdx + 1}: {q.question}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {q.options?.map((opt, oIdx) => {
                      const isSel = sel === opt;
                      const isCorrectOpt = opt === q.answer;
                      let bg = '#fff', bdr = '1px solid #d1d5db', clr = '#374151';
                      if (isSel && !quizSubmitted) { bg = '#eff6ff'; bdr = '1px solid #3730a3'; clr = '#1e1b4b'; }
                      if (quizSubmitted && isCorrectOpt) { bg = '#f0fdf4'; bdr = '1px solid #16a34a'; clr = '#14532d'; }
                      if (quizSubmitted && isSel && !isCorrectOpt) { bg = '#fef2f2'; bdr = '1px solid #dc2626'; clr = '#7f1d1d'; }
                      return (
                        <button
                          key={oIdx}
                          disabled={quizSubmitted}
                          onClick={() => { if (!quizSubmitted) setQuizAnswers(prev => ({ ...prev, [qIdx]: opt })); }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '9px 12px',
                            background: bg,
                            border: bdr,
                            color: clr,
                            cursor: quizSubmitted ? 'default' : 'pointer',
                            textAlign: 'left',
                            fontSize: 13,
                            lineHeight: 1.4,
                            fontFamily: FONT,
                          }}
                        >
                          <span style={{ fontWeight: 700, color: '#6b7280', minWidth: 16, fontSize: 12 }}>{letters[oIdx]}.</span>
                          <span style={{ flex: 1 }}>{opt}</span>
                          {quizSubmitted && isCorrectOpt && <Check size={12} color="#16a34a" style={{ flexShrink: 0 }} />}
                          {quizSubmitted && isSel && !isCorrectOpt && <X size={12} color="#dc2626" style={{ flexShrink: 0 }} />}
                        </button>
                      );
                    })}
                  </div>
                  {quizSubmitted && (
                    <div
                      style={{
                        marginTop: 10,
                        padding: '10px 12px',
                        fontSize: 13,
                        lineHeight: 1.5,
                        background: isCorr ? '#f0fdf4' : '#fffbeb',
                        border: `1px solid ${isCorr ? '#bbf7d0' : '#fde68a'}`,
                        color: isCorr ? '#14532d' : '#78350f',
                      }}
                    >
                      <span style={{ fontWeight: 700 }}>{isCorr ? '✓ Chính xác! ' : '✕ Chưa đúng. '}</span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
            {!quizSubmitted ? (
              <button
                onClick={handleQuizSubmit}
                disabled={submittingQuiz || Object.keys(quizAnswers).length < quizQuestions.length}
                style={{
                  padding: '9px 20px',
                  background: '#1f2937',
                  color: '#fff',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  opacity: Object.keys(quizAnswers).length < quizQuestions.length ? 0.5 : 1,
                  fontFamily: FONT,
                }}
              >
                {submittingQuiz ? 'Đang lưu kết quả...' : 'Kiểm tra đáp án & Lưu tiến độ'}
              </button>
            ) : (
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={handleRefreshQuiz}
                  style={{
                    padding: '8px 16px',
                    background: '#fff',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    fontSize: 13,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontFamily: FONT,
                  }}
                >
                  <RotateCcw size={12} /> Làm lại Quiz (Đổi câu hỏi mới)
                </button>
                {hasNextLesson && (lessonProgress?.isCompleted || quizPassed) && (
                  <button
                    onClick={onNextLesson}
                    style={{
                      padding: '8px 20px',
                      background: '#3730a3',
                      color: '#fff',
                      border: 'none',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontFamily: FONT,
                    }}
                  >
                    Chuyển sang bài học tiếp theo <ChevronRight size={14} />
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Topic Test CTA */}
      {activeSkillNode && (
        <div style={{ marginTop: 44, paddingTop: 20, borderTop: '1px solid #e5e7eb' }}>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px 20px', borderRadius: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', margin: 0 }}>
                {activeSkillNode.status === 'NEEDS_REMEDIATION' || activeSkillNode.hasRemedialActive
                  ? `Củng cố kiến thức & Kiểm tra lại Topic "${activeSkillNode.skillName}"`
                  : `Đã hoàn thành các bài học trong Topic "${activeSkillNode.skillName}"?`}
              </h4>
              {!canTakeTopicTest && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#b45309', background: '#fffbeb', border: '1px solid #fde68a', padding: '2px 8px', borderRadius: 3, fontWeight: 600 }}>
                  <Lock size={11} /> Chưa mở khóa bài kiểm tra
                </span>
              )}
            </div>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12, lineHeight: 1.5 }}>
              {canTakeTopicTest
                ? ((activeSkillNode.status === 'NEEDS_REMEDIATION' || activeSkillNode.hasRemedialActive)
                    ? 'Bạn đã hoàn thành bài học bổ sung! Hãy làm lại bài kiểm tra Topic để đánh giá lại năng lực và mở khóa nội dung tiếp theo.'
                    : 'Làm bài kiểm tra Topic để đánh giá độ thuần thục. Đạt từ 60% sẽ mở khóa Topic tiếp theo trong lộ trình học!')
                : ((activeSkillNode.status === 'NEEDS_REMEDIATION' || activeSkillNode.hasRemedialActive)
                    ? 'Hệ thống đã bổ sung bài học bổ sung để củng cố lỗ hổng kiến thức. Bạn hãy hoàn thành bài học này để mở khóa thi lại Topic!'
                    : 'Bạn cần hoàn thành tất cả các bài học chính trong Topic này trước khi có thể làm bài kiểm tra đánh giá năng lực.')}
            </p>
            <button
              disabled={!canTakeTopicTest}
              onClick={() => canTakeTopicTest && onOpenTest(activeSkillNode)}
              style={{
                padding: '10px 22px',
                background: canTakeTopicTest ? '#1f2937' : '#94a3b8',
                color: '#fff',
                border: 'none',
                fontSize: 13,
                fontWeight: 600,
                cursor: canTakeTopicTest ? 'pointer' : 'not-allowed',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: FONT,
                opacity: canTakeTopicTest ? 1 : 0.75,
              }}
            >
              {canTakeTopicTest ? <Award size={14} /> : <Lock size={14} />}
              {canTakeTopicTest
                ? ((activeSkillNode.status === 'NEEDS_REMEDIATION' || activeSkillNode.hasRemedialActive)
                    ? `Làm lại bài kiểm tra Topic: ${activeSkillNode.skillName}`
                    : `Làm bài kiểm tra Topic: ${activeSkillNode.skillName}`)
                : `Làm bài kiểm tra Topic: ${activeSkillNode.skillName} (Khóa)`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

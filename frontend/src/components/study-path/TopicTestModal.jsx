import React, { useState, useEffect, useRef } from 'react';
import assessmentService from '../../services/assessmentService';
import adaptiveService from '../../services/adaptiveService';
import {
  X,
  Clock,
  RotateCcw,
  Lock,
  FileText,
  Play,
} from 'lucide-react';
import { ENGLISH_SUBJECT_ID, FONT, formatDateTime } from './studyPathConstants';

/* ── Topic Test Modal (Random questions + Topic Test Attempt History) ── */
export default function TopicTestModal({ node, subjectId, onClose, userId, fetchStudyPath, canTakeTest = true }) {
  const activeSubjectId = subjectId || ENGLISH_SUBJECT_ID;
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [activeTest, setActiveTest] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const answersRef = useRef(answers);
  answersRef.current = answers;

  const letters = ['A', 'B', 'C', 'D'];

  const loadHistory = () => {
    setLoadingHistory(true);
    assessmentService.getTopicTestHistory(userId, node.skillId)
      .then(h => setHistory(h || []))
      .catch(() => {})
      .finally(() => setLoadingHistory(false));
  };

  useEffect(() => {
    loadHistory();
  }, [node.skillId]);

  useEffect(() => {
    if (!activeTest || result || timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft(p => {
      if (p <= 1) {
        clearInterval(t);
        handleSubmit();
        return 0;
      }
      return p - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [activeTest, result]);

  const handleStart = async () => {
    if (!canTakeTest) return;
    try {
      const test = await assessmentService.generateTopicTest(
        node.skillId,
        node.skillName,
        activeSubjectId,
        userId
      );
      setActiveTest(test);
      setTimeLeft((test.totalQuestions || 5) * 60);
      setAnswers({});
      setResult(null);
    } catch {
      alert('Không thể tạo bài kiểm tra Topic.');
    }
  };

  const handleSubmit = async () => {
    if (!activeTest?.attemptId || submitting || result) return;
    setSubmitting(true);
    try {
      const currentAnswers = answersRef.current;
      const al = Object.entries(currentAnswers).map(([questionId, selectedOptionId]) => ({
        questionId,
        selectedOptionId,
      }));
      const res = await assessmentService.submitAssessment(activeTest.attemptId, al);
      setResult(res);

      if (res.isPassed) {
        // Unlock next skill / topic
        await adaptiveService.unlockNextSkill(userId, activeSubjectId, node.skillId, node.skillId);
      } else {
        // Extract weak lessons from assessment result to adaptively reorder lessons
        const weakLessonIds = res.weakLessons ? res.weakLessons.map(w => w.lessonId).filter(Boolean) : [];
        const weakLessonTitles = res.weakLessons ? res.weakLessons.map(w => w.lessonTitle).filter(Boolean) : [];
        await adaptiveService.handleTopicTestFailed(
          userId,
          activeSubjectId,
          node.skillId,
          res.accuracyPercentage,
          weakLessonIds,
          weakLessonTitles
        );
      }
      fetchStudyPath();
      loadHistory();
    } catch {
      alert('Có lỗi xảy ra khi nộp bài kiểm tra.');
    } finally {
      setSubmitting(false);
    }
  };

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          maxWidth: 700,
          width: '100%',
          padding: '24px 28px',
          maxHeight: '90vh',
          overflowY: 'auto',
          fontFamily: FONT,
          borderRadius: 4,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid #e5e7eb' }}>
          <div>
            <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
              Bài kiểm tra đánh giá chủ đề (Topic Mastery Test)
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>
              Chủ đề: {node.skillName}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
            <X size={18} />
          </button>
        </div>

        {/* Active Test Questions Form */}
        {activeTest && !result && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, padding: '10px 14px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: 13, color: '#334155' }}>
                Số câu: {activeTest.totalQuestions || 5} câu ngẫu nhiên · Cần đạt ≥ 60% (≥ 3/5 câu) để mở khóa Topic tiếp theo
              </span>
              <span style={{ fontFamily: 'Courier New,monospace', fontSize: 16, fontWeight: 700, color: timeLeft < 60 ? '#dc2626' : '#111827' }}>
                <Clock size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                {fmt(timeLeft)}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {activeTest.questions?.map((q, idx) => (
                <div key={q.id || idx} style={{ border: '1px solid #e5e7eb', padding: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 12, lineHeight: 1.5 }}>
                    Câu {idx + 1}: {q.content}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {q.options?.map((opt, oIdx) => {
                      const isSel = answers[q.questionId] === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setAnswers(p => ({ ...p, [q.questionId]: opt.id }))}
                          style={{
                            padding: '9px 12px',
                            textAlign: 'left',
                            fontSize: 13,
                            background: isSel ? '#1f2937' : '#fff',
                            color: isSel ? '#fff' : '#374151',
                            border: `1px solid ${isSel ? '#1f2937' : '#d1d5db'}`,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            fontFamily: FONT,
                          }}
                        >
                          <span style={{ fontWeight: 700, fontSize: 12, minWidth: 16 }}>{letters[oIdx]}.</span>
                          <span>{opt.optionContent}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={() => setActiveTest(null)} style={{ padding: '8px 16px', border: '1px solid #d1d5db', background: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: FONT }}>
                Hủy bài kiểm tra
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  padding: '8px 22px',
                  background: '#1f2937',
                  color: '#fff',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  opacity: submitting ? 0.7 : 1,
                  fontFamily: FONT,
                }}
              >
                {submitting ? 'Đang chấm điểm...' : 'Nộp bài kiểm tra'}
              </button>
            </div>
          </div>
        )}

        {/* Test Result Screen with Weak Lessons Diagnostics */}
        {result && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: 44, marginBottom: 8, lineHeight: 1, color: result.isPassed ? '#16a34a' : '#64748b' }}>
              {result.isPassed ? '✓' : '✕'}
            </div>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
              {result.isPassed
                ? 'Chúc mừng! Bạn đã đạt yêu cầu và mở khóa Topic tiếp theo'
                : 'Chưa đạt yêu cầu (Cần từ 60%)'}
            </h4>
            <p style={{ fontSize: 14, color: '#4b5563', marginBottom: 12 }}>
              Điểm số: <strong style={{ color: '#111827' }}>{result.score}/{result.totalQuestions}</strong> câu đúng ({result.accuracyPercentage}%)
            </p>

            {!result.isPassed && (
              <div style={{ maxWidth: 540, margin: '0 auto 20px', textAlign: 'left' }}>
                <div style={{ fontSize: 13, color: '#334155', background: '#f8fafc', border: '1px solid #cbd5e1', padding: '12px 14px', borderRadius: 4, lineHeight: 1.5, marginBottom: 12 }}>
                  <strong>Chưa đạt chuẩn (Cần ≥ 60%):</strong>
                  <p style={{ margin: '6px 0 0', fontSize: 12.5, color: '#475569' }}>
                    Hệ thống đã tự động sắp xếp lại lộ trình học của chủ đề này và bổ sung bài học bổ sung bên dưới để bạn ôn luyện trước khi làm lại bài kiểm tra.
                  </p>
                </div>

                {result.weakLessons && result.weakLessons.length > 0 && (
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 4, padding: '10px 14px' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 6 }}>
                      Các bài học cần củng cố lại:
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: '#334155' }}>
                      {result.weakLessons.map((wl, wIdx) => (
                        <li key={wIdx} style={{ marginBottom: 4 }}>
                          <strong>{wl.lessonTitle || 'Bài học liên quan'}</strong> — làm sai {wl.wrongCount}/{wl.totalQuestions} câu
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16 }}>
              <button
                onClick={handleStart}
                disabled={!canTakeTest}
                style={{
                  padding: '8px 18px',
                  border: '1px solid #d1d5db',
                  background: '#fff',
                  fontSize: 13,
                  cursor: canTakeTest ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontFamily: FONT,
                  opacity: canTakeTest ? 1 : 0.6,
                }}
              >
                <RotateCcw size={12} /> Làm lại bài kiểm tra Topic
              </button>
              <button
                onClick={onClose}
                style={{
                  padding: '8px 22px',
                  background: '#1f2937',
                  color: '#fff',
                  border: 'none',
                  fontSize: 13,
                  cursor: 'pointer',
                  fontFamily: FONT,
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        {/* Start Screen & Topic Test History */}
        {!activeTest && !result && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div style={{ border: '1px solid #e5e7eb', padding: '12px 14px', background: '#f8fafc' }}>
                <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', marginBottom: 2 }}>Quy định thời gian</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>5 câu · 1 phút/câu</div>
              </div>
              <div style={{ border: '1px solid #e5e7eb', padding: '12px 14px', background: '#f8fafc' }}>
                <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', marginBottom: 2 }}>Điều kiện vượt qua</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>Đạt tối thiểu 60% (≥ 3/5 câu)</div>
              </div>
            </div>

            {!canTakeTest && (
              <div style={{ marginBottom: 20, padding: '12px 14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Lock size={16} color="#d97706" style={{ flexShrink: 0 }} />
                <div style={{ fontSize: 12.5, color: '#b45309', lineHeight: 1.45 }}>
                  <strong>Tính năng kiểm tra đang khóa:</strong> Bạn chưa hoàn thành tất cả các bài học chính trong Topic này. Vui lòng học xong các bài học để mở khóa bài kiểm tra Topic!
                </div>
              </div>
            )}

            {/* TOPIC TEST HISTORY TABLE */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FileText size={14} color="#475569" />
                  Lịch sử làm bài kiểm tra Topic ({history.length} lần)
                </h4>
              </div>

              {loadingHistory ? (
                <p style={{ fontSize: 12.5, color: '#9ca3af', padding: 10 }}>Đang tải lịch sử...</p>
              ) : history.length === 0 ? (
                <div style={{ border: '1px dashed #cbd5e1', padding: '14px 16px', textAlign: 'center', fontSize: 12.5, color: '#94a3b8', fontStyle: 'italic' }}>
                  Chưa có lịch sử làm bài kiểm tra cho chủ đề này.
                </div>
              ) : (
                <div style={{ border: '1px solid #e5e7eb', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', textAlign: 'left' }}>
                        <th style={{ padding: '6px 10px', fontWeight: 600 }}>Lần làm</th>
                        <th style={{ padding: '6px 10px', fontWeight: 600 }}>Điểm số</th>
                        <th style={{ padding: '6px 10px', fontWeight: 600 }}>Tỷ lệ</th>
                        <th style={{ padding: '6px 10px', fontWeight: 600 }}>Đánh giá</th>
                        <th style={{ padding: '6px 10px', fontWeight: 600 }}>Thời gian</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((att, i) => (
                        <tr key={att.attemptId || i} style={{ borderBottom: i < history.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                          <td style={{ padding: '7px 10px', color: '#334155' }}>Lần #{history.length - i}</td>
                          <td style={{ padding: '7px 10px', fontWeight: 600, color: '#0f172a' }}>{att.score}/{att.totalQuestions}</td>
                          <td style={{ padding: '7px 10px' }}>{att.accuracyPercentage}%</td>
                          <td style={{ padding: '7px 10px' }}>
                            <span
                              style={{
                                padding: '1px 6px',
                                borderRadius: 3,
                                fontSize: 11,
                                fontWeight: 600,
                                background: att.isPassed ? '#dcfce7' : '#fee2e2',
                                color: att.isPassed ? '#15803d' : '#b91c1c',
                              }}
                            >
                              {att.isPassed ? 'Đạt' : 'Chưa đạt'}
                            </span>
                          </td>
                          <td style={{ padding: '7px 10px', color: '#64748b', fontSize: 11.5 }}>
                            {formatDateTime(att)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={onClose} style={{ padding: '8px 16px', border: '1px solid #d1d5db', background: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: FONT }}>
                Đóng
              </button>
              <button
                disabled={!canTakeTest}
                onClick={handleStart}
                style={{
                  padding: '8px 22px',
                  background: canTakeTest ? '#1f2937' : '#94a3b8',
                  color: '#fff',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: canTakeTest ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: FONT,
                  opacity: canTakeTest ? 1 : 0.7,
                }}
              >
                {canTakeTest ? <Play size={13} /> : <Lock size={13} />}
                {canTakeTest ? 'Bắt đầu kiểm tra Topic' : 'Chưa mở khóa kiểm tra'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import assessmentService from '../../services/assessmentService';
import adaptiveService from '../../services/adaptiveService';
import {
  X,
  Clock,
  RotateCcw,
  FileText,
  Play,
} from 'lucide-react';
import { ENGLISH_SUBJECT_ID, FONT, formatDateTime } from './studyPathConstants';

/* ── Course Final Test Modal (Comprehensive Exam + Course Attempt History) ── */
export default function CourseFinalTestModal({ onClose, userId, subjectId, fetchStudyPath, isUnlocked }) {
  const activeSubjectId = subjectId || ENGLISH_SUBJECT_ID;
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [activeTest, setActiveTest] = useState(null);
  const [timeLeft, setTimeLeft] = useState(900); // 15 questions * 1 min = 15 mins
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const answersRef = useRef(answers);
  answersRef.current = answers;

  const letters = ['A', 'B', 'C', 'D'];

  const loadHistory = () => {
    setLoadingHistory(true);
    assessmentService.getSubjectTestHistory(userId, activeSubjectId)
      .then(h => setHistory(h || []))
      .catch(() => {})
      .finally(() => setLoadingHistory(false));
  };

  useEffect(() => {
    loadHistory();
  }, [activeSubjectId]);

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
    try {
      const test = await assessmentService.generateCourseFinalTest(activeSubjectId, userId);
      setActiveTest(test);
      setTimeLeft((test.totalQuestions || 15) * 60);
      setAnswers({});
      setResult(null);
    } catch {
      alert('Không thể tạo bài kiểm tra tổng kết môn.');
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
        await adaptiveService.completeCourseFinalTest(userId, activeSubjectId, res.accuracyPercentage);
      }
      fetchStudyPath();
      loadHistory();
    } catch {
      alert('Có lỗi khi nộp bài kiểm tra tổng kết môn.');
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
          maxWidth: 720,
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
              Đánh giá tổng kết môn học (Course Comprehensive Test)
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>
              Kiểm tra toàn diện kiến thức Tiếng Anh THPT
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
            <X size={18} />
          </button>
        </div>

        {/* In active test */}
        {activeTest && !result && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, padding: '10px 14px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: 13, color: '#334155' }}>
                Tổng số: {activeTest.totalQuestions || 15} câu ngẫu nhiên (Ngữ pháp + Từ vựng) · Đạt ≥ 80% (≥ 12/15 câu) để hoàn thành môn
              </span>
              <span style={{ fontFamily: 'Courier New,monospace', fontSize: 16, fontWeight: 700, color: timeLeft < 120 ? '#dc2626' : '#111827' }}>
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
                Hủy bài thi
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
                {submitting ? 'Đang chấm điểm...' : 'Nộp bài thi'}
              </button>
            </div>
          </div>
        )}

        {/* Result Screen */}
        {result && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: 44, marginBottom: 8, lineHeight: 1, color: result.isPassed ? '#16a34a' : '#64748b' }}>
              {result.isPassed ? '✓' : '✕'}
            </div>
            <h4 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
              {result.isPassed
                ? 'Xuất sắc! Bạn đã chính thức hoàn thành toàn bộ khóa học Tiếng Anh THPT!'
                : 'Chưa đạt yêu cầu hoàn thành môn (Cần từ 80%)'}
            </h4>
            <p style={{ fontSize: 14, color: '#4b5563', marginBottom: 16 }}>
              Điểm số: <strong style={{ color: '#111827' }}>{result.score}/{result.totalQuestions}</strong> câu đúng ({result.accuracyPercentage}%)
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16 }}>
              <button
                onClick={handleStart}
                style={{
                  padding: '8px 18px',
                  border: '1px solid #d1d5db',
                  background: '#fff',
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontFamily: FONT,
                }}
              >
                <RotateCcw size={12} /> Làm lại bài kiểm tra môn học
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

        {/* Start Screen & Subject Test History */}
        {!activeTest && !result && (
          <div>
            {!isUnlocked && (
              <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '12px 14px', borderRadius: 4, marginBottom: 16, color: '#334155', fontSize: 13 }}>
                <strong>Chưa mở khóa:</strong> Bạn cần hoàn thành tất cả các chủ đề trong các module để làm bài kiểm tra tổng kết môn học!
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div style={{ border: '1px solid #e5e7eb', padding: '12px 14px', background: '#f8fafc' }}>
                <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', marginBottom: 2 }}>Phạm vi đề thi</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>15 câu tổng hợp (Ngữ pháp & Từ vựng)</div>
              </div>
              <div style={{ border: '1px solid #e5e7eb', padding: '12px 14px', background: '#f8fafc' }}>
                <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', marginBottom: 2 }}>Thời gian & Chuẩn đầu ra</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>15 phút · Đạt từ 80% (≥ 12/15 câu)</div>
              </div>
            </div>

            {/* SUBJECT TEST HISTORY TABLE */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FileText size={14} color="#475569" />
                  Lịch sử làm bài kiểm tra môn học ({history.length} lần)
                </h4>
              </div>

              {loadingHistory ? (
                <p style={{ fontSize: 12.5, color: '#9ca3af', padding: 10 }}>Đang tải lịch sử...</p>
              ) : history.length === 0 ? (
                <div style={{ border: '1px dashed #cbd5e1', padding: '14px 16px', textAlign: 'center', fontSize: 12.5, color: '#94a3b8', fontStyle: 'italic' }}>
                  Chưa có lịch sử làm bài kiểm tra tổng kết môn học.
                </div>
              ) : (
                <div style={{ border: '1px solid #e5e7eb', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', textAlign: 'left' }}>
                        <th style={{ padding: '6px 10px', fontWeight: 600 }}>Lần thi</th>
                        <th style={{ padding: '6px 10px', fontWeight: 600 }}>Điểm số</th>
                        <th style={{ padding: '6px 10px', fontWeight: 600 }}>Tỷ lệ</th>
                        <th style={{ padding: '6px 10px', fontWeight: 600 }}>Kết quả</th>
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
                              {att.isPassed ? 'Hoàn thành môn' : 'Chưa đạt'}
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
                onClick={handleStart}
                disabled={!isUnlocked}
                style={{
                  padding: '8px 22px',
                  background: isUnlocked ? '#1f2937' : '#94a3b8',
                  color: '#fff',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: isUnlocked ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: FONT,
                }}
              >
                <Play size={13} /> Bắt đầu bài kiểm tra môn học
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

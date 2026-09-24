import React, { useState } from 'react';
import LessonRow from './LessonRow';
import {
  CheckCircle2,
  AlertTriangle,
  Lock,
  ChevronDown,
  ChevronRight,
  Award,
} from 'lucide-react';

const FONT = "'Times New Roman', Times, Georgia, serif";

export default function TopicItem({
  node,
  isLocked: propIsLocked,
  isPro,
  onAddProRemedial,
  lessons,
  remedialLessons,
  lessonProgressMap,
  isExpanded,
  onToggleTopic,
  activeLessonId,
  onSelectLesson,
  onOpenTopicTest,
}) {
  const [hov, setHov] = useState(false);
  const [proRequestedRemedial, setProRequestedRemedial] = useState(false);
  const isCompleted = node.status === 'COMPLETED';
  const isLocked = propIsLocked !== undefined ? propIsLocked : node.status === 'LOCKED';
  const isRemedial = node.status === 'NEEDS_REMEDIATION' || node.hasRemedialActive;

  // Weak lessons from node.lessonOrderJson
  let weakLessonIds = [];
  if (node.lessonOrderJson) {
    try {
      const parsed = JSON.parse(node.lessonOrderJson);
      if (Array.isArray(parsed)) weakLessonIds = parsed;
    } catch (e) {}
  }

  // Combine regular and remedial lessons (if remedial mode active)
  const hasStudiedRemedial = remedialLessons && remedialLessons.some(rl => {
    const p = lessonProgressMap[rl.id];
    return p && (p.isCompleted || p.quizCompleted || (p.quizScore !== undefined && p.quizScore !== null));
  });

  const shouldIncludeRemedial = isRemedial || isCompleted || hasStudiedRemedial || proRequestedRemedial;

  let combinedLessons = [...(lessons || [])];
  if (shouldIncludeRemedial && remedialLessons && remedialLessons.length > 0) {
    remedialLessons.forEach(rl => {
      if (!combinedLessons.some(cl => cl.id === rl.id)) {
        combinedLessons.push(rl);
      }
    });
  }

  // Sort combined lessons: regular lessons first (by displayOrder), then remedial lessons
  combinedLessons.sort((a, b) => {
    if (!a.isRemedial && b.isRemedial) return -1;
    if (a.isRemedial && !b.isRemedial) return 1;
    return (a.displayOrder || 0) - (b.displayOrder || 0);
  });

  // Check if all regular lessons (isRemedial == false) are completed
  const regularLessons = combinedLessons.filter(l => !l.isRemedial);
  const remedialLessonsList = combinedLessons.filter(l => l.isRemedial);

  const allRegularLessonsDone = regularLessons.length === 0 || regularLessons.every(l => {
    const prog = lessonProgressMap[l.id];
    return isCompleted || (prog && prog.isCompleted && prog.quizCompleted);
  });

  const allRemedialLessonsDone = remedialLessonsList.length === 0 || remedialLessonsList.every(l => {
    const prog = lessonProgressMap[l.id];
    return isCompleted || (prog && prog.isCompleted && prog.quizCompleted);
  });

  // When node is COMPLETED -> can always test/retest
  // When in remedial mode -> regular lessons must be done AND remedial improvement lessons must be completed
  // When in normal mode -> regular lessons must be done
  const canTakeTest = isCompleted || (isRemedial ? (allRegularLessonsDone && allRemedialLessonsDone) : allRegularLessonsDone);

  return (
    <div style={{ borderBottom: '1px solid #f3f4f6' }}>
      <button
        disabled={isLocked}
        onClick={() => !isLocked && onToggleTopic(node.topicId || node.skillId)}
        onMouseEnter={() => !isLocked && setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
          textAlign: 'left',
          padding: '8px 12px 8px 18px',
          background: hov ? '#f9fafb' : 'transparent',
          cursor: isLocked ? 'not-allowed' : 'pointer',
          opacity: isLocked ? 0.5 : 1,
          border: 'none',
          fontFamily: FONT,
        }}
      >
        <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          {isCompleted ? (
            <CheckCircle2 size={13} color="#15803d" />
          ) : isRemedial ? (
            <AlertTriangle size={13} color="#64748b" />
          ) : isLocked ? (
            <Lock size={12} color="#94a3b8" />
          ) : (
            <span style={{ width: 11, height: 11, borderRadius: '50%', border: '2px solid #3730a3', display: 'inline-block' }} />
          )}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: '#111827', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {node.skillName}
          </div>
          {isRemedial && (
            <div style={{ fontSize: 10, color: '#64748b', fontWeight: 500 }}>Có bài học bổ sung</div>
          )}
        </div>
        {!isLocked && (isExpanded ? <ChevronDown size={12} color="#6b7280" /> : <ChevronRight size={12} color="#6b7280" />)}
      </button>

      {isExpanded && !isLocked && (
        <div style={{ paddingBottom: 6 }}>
          {isRemedial && (
            <div style={{ margin: '4px 12px 6px 32px', padding: '6px 8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 3 }}>
              <div style={{ fontSize: 11, color: '#475569', lineHeight: 1.35 }}>
                {node.remedialReason || 'Chưa đạt yêu cầu (cần ≥ 60%). Vui lòng hoàn thành bài học bổ sung bên dưới để củng cố kiến thức trước khi làm lại bài kiểm tra.'}
              </div>
            </div>
          )}

          {combinedLessons && combinedLessons.length > 0 ? (
            combinedLessons.map((l, i) => {
              // Sequential Gating rule:
              // Remedial lessons are always unlocked once remedial mode is active so the student can review them freely!
              // For regular lessons:
              // Lesson 0 is unlocked.
              // Lesson i is unlocked if Lesson i-1 is completed & quiz completed, or if whole topic is completed.
              const prevL = i > 0 ? combinedLessons[i - 1] : null;
              const prevProg = prevL ? lessonProgressMap[prevL.id] : null;
              const prevDone = i === 0 || isCompleted || l.isRemedial || (prevProg && prevProg.isCompleted && prevProg.quizCompleted);
              const lessonLocked = !prevDone;

              const currProg = lessonProgressMap[l.id];
              const isComp = isCompleted || (currProg && currProg.isCompleted);
              const quizDone = currProg && currProg.quizCompleted;
              const quizScr = currProg?.quizScore;
              const isWeak = !isCompleted && weakLessonIds.includes(l.id);

              return (
                <LessonRow
                  key={l.id}
                  lesson={l}
                  lessonIdx={i}
                  isLocked={lessonLocked}
                  isCompleted={isComp}
                  quizCompleted={quizDone}
                  quizScore={quizScr}
                  isActive={activeLessonId === l.id}
                  isWeakLesson={isWeak}
                  onClick={() => onSelectLesson(l, node)}
                />
              );
            })
          ) : (
            <p style={{ padding: '4px 12px 4px 32px', fontSize: 11.5, color: '#9ca3af', fontStyle: 'italic' }}>
              Đang tải bài học...
            </p>
          )}

          {/* Button to open Topic Test */}
          <div style={{ padding: '6px 12px 4px 32px' }}>
            <button
              disabled={!canTakeTest}
              onClick={() => canTakeTest && onOpenTopicTest(node)}
              title={!canTakeTest ? (isRemedial ? 'Vui lòng hoàn thành bài học cải thiện bổ sung để mở khóa thi lại Topic' : 'Bạn cần hoàn thành tất cả các bài học trong Topic để mở khóa bài kiểm tra') : ''}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 8px',
                background: isCompleted ? '#f0fdf4' : canTakeTest ? '#f8fafc' : '#f1f5f9',
                border: isCompleted ? '1px solid #bbf7d0' : canTakeTest ? '1px dashed #cbd5e1' : '1px solid #e2e8f0',
                borderRadius: 3,
                fontSize: 11,
                color: isCompleted ? '#166534' : canTakeTest ? '#334155' : '#94a3b8',
                cursor: canTakeTest ? 'pointer' : 'not-allowed',
                width: '100%',
                justifyContent: 'center',
                fontFamily: FONT,
                fontWeight: 600,
                opacity: canTakeTest ? 1 : 0.75,
              }}
            >
              {isCompleted ? (
                <Award size={12} color="#16a34a" />
              ) : canTakeTest ? (
                <Award size={12} color="#475569" />
              ) : (
                <Lock size={12} color="#94a3b8" />
              )}
              {isCompleted
                ? 'Kiểm tra lại Topic'
                : isRemedial
                ? (canTakeTest ? 'Làm lại bài kiểm tra Topic' : 'Làm lại kiểm tra (Cần học bài bổ sung)')
                : canTakeTest
                ? 'Làm bài kiểm tra Topic'
                : 'Làm bài kiểm tra Topic (Khóa)'}
            </button>
          </div>

          {/* Optional: PRO Member can actively request remedial practice */}
          {isPro && !shouldIncludeRemedial && (
            <div style={{ padding: '2px 12px 6px 32px' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setProRequestedRemedial(true);
                  if (onAddProRemedial) onAddProRemedial(node.topicId || node.skillId);
                }}
                style={{
                  width: '100%',
                  padding: '4px 8px',
                  background: '#f8fafc',
                  border: '1px dashed #cbd5e1',
                  borderRadius: 3,
                  fontSize: 10.5,
                  color: '#475569',
                  cursor: 'pointer',
                  fontFamily: FONT,
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                }}
              >
                + Thêm bài học bổ sung (Dành cho PRO)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

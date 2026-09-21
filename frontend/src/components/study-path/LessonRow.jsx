import React, { useState } from 'react';
import { Check, Lock } from 'lucide-react';

const FONT = "'Times New Roman', Times, Georgia, serif";

export default function LessonRow({
  lesson,
  lessonIdx,
  isLocked,
  isCompleted,
  quizCompleted,
  quizScore,
  isActive,
  isWeakLesson,
  onClick
}) {
  const [hov, setHov] = useState(false);

  return (
    <button
      disabled={isLocked}
      onClick={onClick}
      onMouseEnter={() => !isLocked && setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        textAlign: 'left',
        padding: '7px 12px 7px 32px',
        background: isActive ? '#f0f4ff' : hov ? '#f8f8f8' : 'transparent',
        borderLeft: isActive ? '3px solid #3730a3' : '3px solid transparent',
        borderRight: 'none',
        borderTop: 'none',
        borderBottom: 'none',
        cursor: isLocked ? 'not-allowed' : 'pointer',
        opacity: isLocked ? 0.45 : 1,
        fontFamily: FONT,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
        <span
          style={{
            minWidth: 18,
            height: 18,
            borderRadius: '50%',
            border: isCompleted ? '1.5px solid #16a34a' : '1.5px solid #94a3b8',
            background: isCompleted ? '#16a34a' : isActive ? '#3730a3' : '#fff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            color: (isCompleted || isActive) ? '#fff' : '#64748b',
            flexShrink: 0,
          }}
        >
          {isCompleted ? <Check size={10} color="#fff" /> : isLocked ? <Lock size={9} color="#94a3b8" /> : lessonIdx + 1}
        </span>
        <span
          style={{
            fontSize: 12.5,
            color: isActive ? '#1e1b4b' : isLocked ? '#9ca3af' : '#374151',
            lineHeight: 1.35,
            fontWeight: isActive ? 600 : 400,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title={lesson.title}
        >
          {lesson.isRemedial ? (
            <span style={{ fontSize: 10, color: '#475569', background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '1px 6px', marginRight: 6, borderRadius: 3, fontWeight: 600 }}>
              Bài học bổ sung
            </span>
          ) : isWeakLesson ? (
            <span style={{ fontSize: 10, color: '#475569', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1px 5px', marginRight: 4, borderRadius: 3, fontWeight: 500 }}>
              Cần lưu ý
            </span>
          ) : null}
          {lesson.title}
        </span>
      </div>

      {quizCompleted && (
        <span
          style={{
            fontSize: 10,
            padding: '1px 5px',
            background: '#dcfce7',
            color: '#15803d',
            borderRadius: 3,
            fontWeight: 600,
            flexShrink: 0,
            marginLeft: 4,
          }}
        >
          {quizScore !== undefined && quizScore !== null ? `${quizScore}%` : 'Quiz ✓'}
        </span>
      )}
    </button>
  );
}

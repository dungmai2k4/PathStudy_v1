import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import adaptiveService from '../../services/adaptiveService';
import assessmentService from '../../services/assessmentService';
import contentService from '../../services/contentService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Lock, CheckCircle2, ChevronDown, ChevronRight,
  RotateCcw, X, Check, Award, Play, AlertTriangle, BookOpen, Clock, FileText, CheckCircle, Shuffle
} from 'lucide-react';

const ENGLISH_SUBJECT_ID = '11111111-1111-1111-1111-111111111101';
const FONT = "'Times New Roman', Times, Georgia, serif";

const formatDateTime = (att) => {
  const ts = att?.submittedAt || att?.createdAt || att?.startedAt;
  if (!ts) return '—';
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return '—';
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${hours}:${mins} ${day}/${month}/${year}`;
  } catch {
    return '—';
  }
};

/* ── Sidebar: Individual lesson row with sequential locking & quiz status ── */
function LessonRow({ lesson, lessonIdx, isLocked, isCompleted, quizCompleted, quizScore, isActive, isWeakLesson, onClick }) {
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
          {isWeakLesson && (
            <span style={{ fontSize: 9.5, color: '#b91c1c', background: '#fee2e2', border: '1px solid #fecaca', padding: '1px 5px', marginRight: 4, borderRadius: 2, fontWeight: 700 }}>
              Cần củng cố
            </span>
          )}
          {lesson.isRemedial && (
            <span style={{ fontSize: 9.5, color: '#b45309', background: '#fef3c7', border: '1px solid #fde68a', padding: '1px 5px', marginRight: 4, borderRadius: 2, fontWeight: 600 }}>
              Luyện lại
            </span>
          )}
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

/* ── Sidebar: Topic Item with Lesson List & Topic Test CTA ── */
function TopicItem({
  node,
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
  const isCompleted = node.status === 'COMPLETED';
  const isLocked = node.status === 'LOCKED';
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
  let combinedLessons = [...(lessons || [])];
  if (isRemedial && remedialLessons && remedialLessons.length > 0) {
    remedialLessons.forEach(rl => {
      if (!combinedLessons.some(cl => cl.id === rl.id)) {
        combinedLessons.push(rl);
      }
    });
  }

  // Adaptively sort combinedLessons:
  // 1. Lessons that student was weak at in Topic Test come FIRST
  // 2. Remedial lessons come NEXT
  // 3. Other lessons follow in normal order
  if (weakLessonIds.length > 0) {
    combinedLessons.sort((a, b) => {
      const aWeak = weakLessonIds.includes(a.id);
      const bWeak = weakLessonIds.includes(b.id);
      if (aWeak && !bWeak) return -1;
      if (!aWeak && bWeak) return 1;
      if (a.isRemedial && !b.isRemedial) return -1;
      if (!a.isRemedial && b.isRemedial) return 1;
      return (a.displayOrder || 0) - (b.displayOrder || 0);
    });
  }

  // Check if all regular lessons (isRemedial == false) are completed:
  // "chưa xong lession trong topic thì sẽ khóa tính năng test (trừ mục luyện lại). nếu mở hết lession rồi thì được phép làm bài kiểm tra."
  const regularLessons = combinedLessons.filter(l => !l.isRemedial);
  const allRegularLessonsDone = regularLessons.length > 0 && regularLessons.every(l => {
    const prog = lessonProgressMap[l.id];
    return isCompleted || (prog && prog.isCompleted && prog.quizCompleted);
  });
  const canTakeTest = isCompleted || allRegularLessonsDone;

  return (
    <div style={{ borderBottom: '1px solid #f3f4f6' }}>
      <button
        disabled={isLocked}
        onClick={() => !isLocked && onToggleTopic(node.skillId)}
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
            <AlertTriangle size={13} color="#d97706" />
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
            <div style={{ fontSize: 10, color: '#d97706', fontWeight: 600 }}>Cần ôn tập bổ sung</div>
          )}
        </div>
        {!isLocked && (isExpanded ? <ChevronDown size={12} color="#6b7280" /> : <ChevronRight size={12} color="#6b7280" />)}
      </button>

      {isExpanded && !isLocked && (
        <div style={{ paddingBottom: 6 }}>
          {isRemedial && (
            <div style={{ margin: '4px 12px 6px 32px', padding: '6px 8px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 3 }}>
              <div style={{ fontSize: 11, color: '#b45309', lineHeight: 1.35 }}>
                ⚠️ {node.remedialReason || 'Bạn chưa đạt 80% bài kiểm tra Topic. Vui lòng hoàn thành các bài ôn tập bổ sung bên dưới!'}
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
              const isWeak = weakLessonIds.includes(l.id);

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
              title={!canTakeTest ? 'Bạn cần hoàn thành tất cả các bài học trong Topic để mở khóa bài kiểm tra' : ''}
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
              {canTakeTest ? (
                <Award size={12} color={isCompleted ? '#16a34a' : '#475569'} />
              ) : (
                <Lock size={12} color="#94a3b8" />
              )}
              {isCompleted ? 'Kiểm tra lại Topic' : canTakeTest ? 'Làm bài kiểm tra Topic' : 'Làm bài kiểm tra Topic (Khóa)'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Fallback Mini-Quiz pools (5 questions per topic for random selection) ── */
const FALLBACK_LESSON_QUIZZES = {
  present_perfect_form: [
    {
      question: "Cấu trúc câu khẳng định của thì Hiện tại hoàn thành với chủ ngữ số nhiều (I/We/You/They) là:",
      options: ["S + has + V3/ed", "S + have + V3/ed", "S + had + V3/ed", "S + have + V-ing"],
      answer: "S + have + V3/ed",
      explanation: "Chủ ngữ I/We/You/They đi với trợ động từ 'have' + động từ ở dạng quá khứ phân từ (V3/ed)."
    },
    {
      question: "Chọn câu đúng: She ___ in Hanoi since 2020.",
      options: ["lives", "has lived", "had lived", "lived"],
      answer: "has lived",
      explanation: "Diễn tả hành động bắt đầu trong quá khứ và kéo dài đến hiện tại với mốc 'since 2020'."
    },
    {
      question: "Câu phủ định của thì Hiện tại hoàn thành có dạng:",
      options: ["S + don't/doesn't + have + V3/ed", "S + haven't/hasn't + V3/ed", "S + haven't/hasn't + V-inf", "S + didn't + have + V3/ed"],
      answer: "S + haven't/hasn't + V3/ed",
      explanation: "Dạng phủ định thêm 'not' trực tiếp sau have/has: haven't / hasn't + V3/ed."
    },
    {
      question: "Cấu trúc câu hỏi nghi vấn Yes/No của thì Hiện tại hoàn thành là:",
      options: ["Have/Has + S + V3/ed?", "Do/Does + S + have + V3/ed?", "Did + S + have + V3/ed?", "Had + S + V-ing?"],
      answer: "Have/Has + S + V3/ed?",
      explanation: "Đảo trợ động từ Have/Has lên trước chủ ngữ: Have/Has + S + V3/ed?"
    },
    {
      question: "He ___ his passport, so he cannot board the plane now.",
      options: ["has lost", "lost", "had lost", "loses"],
      answer: "has lost",
      explanation: "Hành động làm mất hộ chiếu trong quá khứ để lại kết quả trực tiếp ở hiện tại (không thể lên máy bay)."
    }
  ],
  present_perfect_since_for: [
    {
      question: "Điền vào chỗ trống: I have studied English ___ five years.",
      options: ["since", "for", "in", "at"],
      answer: "for",
      explanation: "'five years' là một khoảng thời gian nên đi với giới từ 'for'."
    },
    {
      question: "Điền vào chỗ trống: She has worked here ___ last September.",
      options: ["for", "since", "during", "from"],
      answer: "since",
      explanation: "'last September' là mốc thời gian cụ thể trong quá khứ nên dùng 'since'."
    },
    {
      question: "Cụm từ nào sau đây đi với 'since'?",
      options: ["two weeks", "a long time", "2018", "ten months"],
      answer: "2018",
      explanation: "'2018' là mốc thời gian xác định nên đi với 'since', các phương án còn lại là khoảng thời gian (dùng 'for')."
    },
    {
      question: "Cụm từ nào sau đây đi với 'for'?",
      options: ["yesterday morning", "three days", "last Christmas", "she arrived"],
      answer: "three days",
      explanation: "'three days' là khoảng thời gian kéo dài, đi kèm giới từ 'for'."
    },
    {
      question: "We haven't seen each other ___ we left high school.",
      options: ["since", "for", "during", "ago"],
      answer: "since",
      explanation: "'we left high school' là một mệnh đề chỉ mốc sự kiện trong quá khứ, dùng 'since + clause'."
    }
  ],
  present_perfect_signals: [
    {
      question: "Vị trí thông thường của 'already' trong câu khẳng định thì Hiện tại hoàn thành là:",
      options: ["Đứng sau have/has và trước V3/ed", "Đứng ở đầu câu", "Đứng sau tân ngữ", "Đứng ở mệnh đề phụ"],
      answer: "Đứng sau have/has và trước V3/ed",
      explanation: "'already' thường đứng giữa trợ động từ have/has và quá khứ phân từ V3/ed."
    },
    {
      question: "Từ 'yet' thường xuất hiện ở đâu trong thì Hiện tại hoàn thành?",
      options: ["Cuối câu phủ định và câu hỏi", "Đầu câu khẳng định", "Giữa trợ động từ và động từ chính", "Sau tính từ"],
      answer: "Cuối câu phủ định và câu hỏi",
      explanation: "'yet' mang nghĩa 'chưa' thường được đặt ở cuối câu phủ định hoặc câu nghi vấn."
    },
    {
      question: "Điền từ thích hợp: Have you ___ been to Singapore?",
      options: ["ever", "yet", "already", "since"],
      answer: "ever",
      explanation: "'Have you ever...?' là cấu trúc chuẩn để hỏi về trải nghiệm từ trước đến nay."
    },
    {
      question: "Từ nào mang nghĩa 'vừa mới' diễn tả hành động vừa hoàn tất cách đây ít phút?",
      options: ["just", "yet", "ever", "ago"],
      answer: "just",
      explanation: "'just' đứng giữa have/has và V3/ed mang nghĩa vừa mới làm xong điều gì."
    },
    {
      question: "I have ___ completed all my assignments and I am ready to rest.",
      options: ["already", "yet", "ever", "never"],
      answer: "already",
      explanation: "'already' diễn tả hành động đã hoàn tất sớm hơn dự kiến trong câu khẳng định."
    }
  ],
  past_perfect_form: [
    {
      question: "Cấu trúc của thì Quá khứ hoàn thành (Past Perfect) là:",
      options: ["S + has + V3/ed", "S + had + V3/ed", "S + was/were + V3/ed", "S + had been + V-ing"],
      answer: "S + had + V3/ed",
      explanation: "Thì Quá khứ hoàn thành dùng trợ động từ 'had' cho tất cả các ngôi + V3/ed."
    },
    {
      question: "Khi họ đến rạp chiếu phim, bộ phim ___ bắt đầu.",
      options: ["has already", "had already", "was already", "already"],
      answer: "had already",
      explanation: "Hành động phim chiếu xảy ra trước hành động đến rạp (quá khứ đơn) nên chia ở Quá khứ hoàn thành."
    },
    {
      question: "Dạng phủ định của thì Quá khứ hoàn thành là:",
      options: ["S + hadn't + V3/ed", "S + didn't had + V3/ed", "S + wasn't + V3/ed", "S + haven't + V3/ed"],
      answer: "S + hadn't + V3/ed",
      explanation: "Thêm 'not' vào sau 'had' thành 'had not' hoặc 'hadn't' + V3/ed."
    },
    {
      question: "Câu nghi vấn đảo ngữ của thì Quá khứ hoàn thành bắt đầu bằng trợ động từ nào?",
      options: ["Had", "Have", "Did", "Was"],
      answer: "Had",
      explanation: "Cấu trúc câu hỏi: Had + S + V3/ed?"
    },
    {
      question: "She told me that she ___ that museum twice before.",
      options: ["had visited", "has visited", "visited", "was visiting"],
      answer: "had visited",
      explanation: "Hành động tham quan xảy ra trước thời điểm kể lại 'told' trong quá khứ."
    }
  ],
  past_perfect_clauses: [
    {
      question: "Trong câu chứa 'Before + Quá khứ đơn', mệnh đề chính thường chia ở thì:",
      options: ["Hiện tại hoàn thành", "Quá khứ hoàn thành", "Tương lai đơn", "Quá khứ tiếp diễn"],
      answer: "Quá khứ hoàn thành",
      explanation: "Hành động xảy ra trước mốc 'Before + S + V2/ed' được chia ở thì Quá khứ hoàn thành."
    },
    {
      question: "After he ___ dinner, he went out with friends.",
      options: ["has finished", "had finished", "finished", "was finishing"],
      answer: "had finished",
      explanation: "'After + S + had V3/ed, S + V2/ed' diễn tả hành động ăn tối xảy ra trước khi đi chơi."
    },
    {
      question: "By the time we arrived, the meeting ___.",
      options: ["had ended", "ended", "has ended", "was ending"],
      answer: "had ended",
      explanation: "'By the time + S + V2/ed, S + had V3/ed' là cấu trúc phối hợp thì kinh điển trong đề thi."
    },
    {
      question: "As soon as the teacher ___ the exam papers, the students began writing.",
      options: ["had handed out", "has handed out", "hands out", "was handing out"],
      answer: "had handed out",
      explanation: "Hành động phát đề xảy ra trước và hoàn tất rồi học sinh mới bắt đầu viết."
    },
    {
      question: "Hardly ___ when the electricity went off.",
      options: ["had he started working", "he had started working", "did he start working", "has he started working"],
      answer: "had he started working",
      explanation: "Cấu trúc đảo ngữ: Hardly + had + S + V3/ed + when + S + V2/ed."
    }
  ],
  past_simple_vs_past_perfect: [
    {
      question: "Hành động xảy ra trước một hành động khác trong quá khứ được chia ở thì nào?",
      options: ["Quá khứ đơn", "Quá khứ hoàn thành", "Hiện tại hoàn thành", "Quá khứ tiếp diễn"],
      answer: "Quá khứ hoàn thành",
      explanation: "Quá khứ hoàn thành diễn tả hành động xảy ra và hoàn tất trước một hành động khác trong quá khứ."
    },
    {
      question: "He was exhausted because he ___ for 10 hours.",
      options: ["had worked", "has worked", "works", "is working"],
      answer: "had worked",
      explanation: "Làm việc 10 tiếng là nguyên nhân xảy ra trước trạng thái kiệt sức 'was exhausted'."
    },
    {
      question: "When I ___ to the party, everyone ___ home.",
      options: ["came / had gone", "had come / went", "came / went", "come / had gone"],
      answer: "came / had gone",
      explanation: "Mọi người về nhà trước khi tôi đến, nên 'came' (quá khứ đơn) và 'had gone' (quá khứ hoàn thành)."
    },
    {
      question: "The grass was yellow because it ___ for weeks.",
      options: ["hadn't rained", "hasn't rained", "didn't rain", "wasn't raining"],
      answer: "hadn't rained",
      explanation: "Việc không mưa diễn ra trước trạng thái cỏ vàng 'was yellow'."
    },
    {
      question: "Tom ___ the door after everyone ___ the building.",
      options: ["locked / had left", "had locked / left", "locked / left", "has locked / left"],
      answer: "locked / had left",
      explanation: "Mọi người rời đi trước (had left), sau đó Tom mới khóa cửa (locked)."
    }
  ],
  present_perfect_vs_past_simple: [
    {
      question: "Câu nào dưới đây đúng ngữ pháp khi có thời gian xác định trong quá khứ?",
      options: ["I have visited Da Nang last year.", "I visited Da Nang last year.", "I had visited Da Nang last year.", "I was visiting Da Nang last year."],
      answer: "I visited Da Nang last year.",
      explanation: "Khi có thời gian xác định 'last year' kết thúc trong quá khứ, bắt buộc dùng Quá khứ đơn."
    },
    {
      question: "She ___ three cups of coffee this morning (bây giờ là buổi sáng lúc 8h).",
      options: ["drank", "has drunk", "had drunk", "drinks"],
      answer: "has drunk",
      explanation: "Khoảng thời gian 'this morning' chưa kết thúc nên hành động dùng Hiện tại hoàn thành."
    },
    {
      question: "Shakespeare ___ many famous plays.",
      options: ["has written", "wrote", "had written", "writes"],
      answer: "wrote",
      explanation: "Shakespeare đã qua đời, hành động không còn liên hệ đến hiện tại nên dùng Quá khứ đơn."
    },
    {
      question: "I ___ my keys! I can't open the door right now.",
      options: ["have lost", "lost", "had lost", "was losing"],
      answer: "have lost",
      explanation: "Hành động mất chìa khóa diễn ra trong quá khứ nhưng để lại hậu quả hiện tại không vào được nhà."
    },
    {
      question: "My brother ___ from university two years ago.",
      options: ["graduated", "has graduated", "had graduated", "graduates"],
      answer: "graduated",
      explanation: "Có trạng từ 'two years ago' chỉ mốc thời gian quá khứ rõ ràng nên dùng Quá khứ đơn."
    }
  ],
  time_expressions: [
    {
      question: "Trạng từ nào sau đây là dấu hiệu ĐẶC TRƯNG của thì Hiện tại hoàn thành?",
      options: ["yesterday", "so far", "two days ago", "in 1999"],
      answer: "so far",
      explanation: "'so far' (cho đến nay) là dấu hiệu của thì Hiện tại hoàn thành; các từ còn lại dùng Quá khứ đơn."
    },
    {
      question: "Điền vào chỗ trống: In 2021, my company ___ its headquarters to Da Nang.",
      options: ["moved", "has moved", "had moved", "was moving"],
      answer: "moved",
      explanation: "'In 2021' là mốc thời gian quá khứ đã kết thúc xác định, dùng Quá khứ đơn."
    },
    {
      question: "Cụm từ nào KHÔNG dùng với thì Hiện tại hoàn thành?",
      options: ["up to now", "recently", "last night", "lately"],
      answer: "last night",
      explanation: "'last night' là thời điểm quá khứ xác định, đi với thì Quá khứ đơn."
    },
    {
      question: "Cụm 'over the past few years' thường đi với thì nào?",
      options: ["Hiện tại hoàn thành", "Quá khứ đơn", "Tương lai đơn", "Quá khứ tiếp diễn"],
      answer: "Hiện tại hoàn thành",
      explanation: "'over the past few years' (trong vài năm qua) diễn tả quá trình kéo dài đến nay, dùng Hiện tại hoàn thành."
    },
    {
      question: "He hasn't written any letters to his parents ___.",
      options: ["recently", "yesterday", "last week", "two months ago"],
      answer: "recently",
      explanation: "'recently' (gần đây) dùng với câu thì Hiện tại hoàn thành."
    }
  ],
  remedial_tenses: [
    {
      question: "Yesterday I ___ a new jacket, but today I ___ that the zipper is broken.",
      options: ["bought / have noticed", "bought / noticed", "have bought / noticed", "had bought / notice"],
      answer: "bought / have noticed",
      explanation: "'Yesterday' dùng quá khứ đơn (bought), 'today' kết quả nhận thấy ở hiện tại dùng Hiện tại hoàn thành (have noticed)."
    },
    {
      question: "By the time the teacher arrived, all students ___ their homework.",
      options: ["completed", "had completed", "have completed", "were completing"],
      answer: "had completed",
      explanation: "Hành động hoàn thành bài tập xảy ra trước khi giáo viên đến (quá khứ hoàn thành)."
    },
    {
      question: "Listen! Someone ___ loudly outside.",
      options: ["shouts", "is shouting", "has shouted", "shouted"],
      answer: "is shouting",
      explanation: "Dấu hiệu mệnh lệnh 'Listen!' diễn tả hành động đang diễn ra tại thời điểm nói (Hiện tại tiếp diễn)."
    },
    {
      question: "While I ___ down the street, I ___ an old friend.",
      options: ["was walking / met", "walked / had met", "had walked / was meeting", "was walking / have met"],
      answer: "was walking / met",
      explanation: "Hành động đang diễn ra (was walking) thì hành động khác chen ngang (met)."
    },
    {
      question: "Up to the present, our team ___ five important milestones.",
      options: ["has achieved", "achieved", "had achieved", "achieves"],
      answer: "has achieved",
      explanation: "'Up to the present' (cho tới nay) là dấu hiệu kinh điển của thì Hiện tại hoàn thành."
    }
  ],
  zero_conditional: [
    {
      question: "Cấu trúc câu điều kiện loại 0 (Zero Conditional) là:",
      options: ["If + S + V (hiện tại đơn), S + will + V-inf", "If + S + V (hiện tại đơn), S + V (hiện tại đơn)", "If + S + V2/ed, S + would + V-inf", "If + S + had V3/ed, S + would have V3/ed"],
      answer: "If + S + V (hiện tại đơn), S + V (hiện tại đơn)",
      explanation: "Câu điều kiện loại 0 diễn tả chân lý, sự thật hiển nhiên: cả 2 mệnh đề đều ở thì Hiện tại đơn."
    },
    {
      question: "If you heat water to 100 degrees Celsius, it ___.",
      options: ["boils", "will boil", "boiled", "would boil"],
      answer: "boils",
      explanation: "Đây là quy luật khoa học hiển nhiên, dùng thì hiện tại đơn ở mệnh đề chính: boils."
    },
    {
      question: "Plants die if they ___ enough water and sunlight.",
      options: ["don't get", "won't get", "didn't get", "haven't got"],
      answer: "don't get",
      explanation: "Điều kiện loại 0 diễn tả sự thật tự nhiên: If + S + don't/doesn't + V-inf."
    },
    {
      question: "If people don't eat or drink, they ___ survive.",
      options: ["cannot", "won't have", "could not have", "didn't"],
      answer: "cannot",
      explanation: "Sự thật hiển nhiên về sinh học trong điều kiện loại 0: dùng hiện tại đơn / can / cannot."
    },
    {
      question: "Ice turns into water if you ___ it in room temperature.",
      options: ["leave", "will leave", "left", "had left"],
      answer: "leave",
      explanation: "Quy luật vật lý tự nhiên: If + S + V(hiện tại đơn)."
    }
  ],
  first_conditional: [
    {
      question: "Cấu trúc mệnh đề chính của câu điều kiện loại 1 là:",
      options: ["S + will/can + V-inf", "S + would + V-inf", "S + would have + V3/ed", "S + V (hiện tại đơn)"],
      answer: "S + will/can + V-inf",
      explanation: "Điều kiện loại 1 diễn tả sự việc có thể xảy ra ở hiện tại hoặc tương lai: If + S + V(s/es), S + will + V-inf."
    },
    {
      question: "If it ___ tomorrow, we will stay at home.",
      options: ["rains", "will rain", "rained", "is raining"],
      answer: "rains",
      explanation: "Mệnh đề If của câu điều kiện loại 1 không dùng will mà dùng thì Hiện tại đơn (rains)."
    },
    {
      question: "Unless you study diligently, you ___ pass the examination.",
      options: ["won't", "will", "would", "wouldn't"],
      answer: "won't",
      explanation: "Unless = If not. 'Trừ khi bạn chăm chỉ, bạn sẽ không vượt qua kỳ thi': dùng won't."
    },
    {
      question: "If we catch the 8 AM train, we ___ arrive in time for the meeting.",
      options: ["will", "would", "would have", "were to"],
      answer: "will",
      explanation: "Sự việc có khả năng cao diễn ra ở tương lai, mệnh đề chính dùng will + V-inf."
    },
    {
      question: "What will happen if they ___ the deadline tomorrow?",
      options: ["miss", "will miss", "missed", "are missing"],
      answer: "miss",
      explanation: "Mệnh đề If chia ở hiện tại đơn (miss)."
    }
  ],
  second_conditional: [
    {
      question: "Cấu trúc của câu điều kiện loại 2 (Second Conditional) là:",
      options: ["If + S + V2/ed (were), S + would/could + V-inf", "If + S + V-s/es, S + will + V-inf", "If + S + had V3/ed, S + would have V3/ed", "If + S + V2/ed, S + will + V-inf"],
      answer: "If + S + V2/ed (were), S + would/could + V-inf",
      explanation: "Câu điều kiện loại 2 diễn tả điều kiện giả định không có thật ở hiện tại."
    },
    {
      question: "If I ___ you, I would accept that scholarship offer immediately.",
      options: ["am", "was", "were", "have been"],
      answer: "were",
      explanation: "Trong câu điều kiện loại 2, to be dùng 'were' cho tất cả các ngôi trong văn phong học thuật chuẩn."
    },
    {
      question: "What ___ if you found a wallet full of money in the street?",
      options: ["would you do", "will you do", "did you do", "would you have done"],
      answer: "would you do",
      explanation: "Mệnh đề If chia ở quá khứ đơn (found), mệnh đề chính dùng 'would + V-inf'."
    },
    {
      question: "If she ___ more free time, she would travel around Southeast Asia.",
      options: ["had", "has", "would have", "had had"],
      answer: "had",
      explanation: "Giả định trái thực tế ở hiện tại, mệnh đề If chia quá khứ đơn (had)."
    },
    {
      question: "If I knew his contact number, I ___ him right now.",
      options: ["would call", "will call", "called", "would have called"],
      answer: "would call",
      explanation: "Mệnh đề chính câu điều kiện loại 2 dùng 'would + V-inf'."
    }
  ],
  academic_collocations: [
    {
      question: "Chọn từ đi cùng để tạo collocation đúng: Scientists must ___ experiments before drawing conclusions.",
      options: ["conduct", "make", "take", "bring"],
      answer: "conduct",
      explanation: "'conduct an experiment/survey' là collocation chuẩn trong tiếng Anh học thuật."
    },
    {
      question: "Smoking can ___ serious damage to your lungs.",
      options: ["do", "cause", "give", "make"],
      answer: "cause",
      explanation: "'cause damage / harm to sth' là kết hợp từ cố định chuẩn."
    },
    {
      question: "She made a valuable ___ to the community project.",
      options: ["contribution", "distribution", "attribute", "tribute"],
      answer: "contribution",
      explanation: "'make a contribution to sth' nghĩa là đóng góp cho cái gì."
    },
    {
      question: "The government needs to ___ measures to reduce environmental pollution.",
      options: ["take", "make", "do", "give"],
      answer: "take",
      explanation: "'take measures / action' là kết hợp từ cố định mang nghĩa thực hiện biện pháp."
    },
    {
      question: "Students should ___ advantage of library resources to improve their studies.",
      options: ["take", "have", "make", "gain"],
      answer: "take",
      explanation: "'take advantage of sth' là thành ngữ chuẩn nghĩa là tận dụng cái gì."
    }
  ],
  word_formation: [
    {
      question: "Chọn dạng từ thích hợp: Regular exercise is ___ for both physical and mental health. (BENEFIT)",
      options: ["benefit", "beneficial", "beneficially", "benefactor"],
      answer: "beneficial",
      explanation: "Sau to be 'is' cần một tính từ: beneficial (có lợi)."
    },
    {
      question: "She answered the interview questions with great ___. (CONFIDENT)",
      options: ["confidential", "confidence", "confidently", "confide"],
      answer: "confidence",
      explanation: "Sau giới từ 'with' cần một danh từ: confidence (sự tự tin)."
    },
    {
      question: "The economic ___ of the city has improved noticeably in the past decade. (DEVELOP)",
      options: ["development", "developer", "developing", "developed"],
      answer: "development",
      explanation: "Cụm danh từ 'The economic development' (sự phát triển kinh tế) đóng vai trò chủ ngữ."
    },
    {
      question: "He is a very ___ worker who always finishes tasks on time. (RELY)",
      options: ["reliable", "reliably", "reliance", "relying"],
      answer: "reliable",
      explanation: "Trước danh từ 'worker' cần tính từ: reliable (đáng tin cậy)."
    },
    {
      question: "Many species face the threat of ___ due to deforestation. (EXTINCT)",
      options: ["extinction", "extinct", "extinctive", "extinguishing"],
      answer: "extinction",
      explanation: "Sau giới từ 'of' cần một danh từ: extinction (sự tuyệt chủng)."
    }
  ],
  phrasal_verbs: [
    {
      question: "Cụm động từ 'give up' có nghĩa là gì?",
      options: ["Từ bỏ", "Tiếp tục", "Trì hoãn", "Ủng hộ"],
      answer: "Từ bỏ",
      explanation: "'give up' đồng nghĩa với abandon / stop doing something (từ bỏ)."
    },
    {
      question: "The football match had to be ___ because of the heavy thunderstorm.",
      options: ["called off", "put on", "taken after", "looked into"],
      answer: "called off",
      explanation: "'call off' nghĩa là hủy bỏ sự kiện (cancel)."
    },
    {
      question: "If you don't know the meaning of this word, ___ it in the dictionary.",
      options: ["look up", "look for", "look after", "look out"],
      answer: "look up",
      explanation: "'look up a word' nghĩa là tra từ trong từ điển."
    },
    {
      question: "They decided to ___ the meeting until next Monday.",
      options: ["put off", "put on", "give in", "bring up"],
      answer: "put off",
      explanation: "'put off' có nghĩa là trì hoãn (postpone/delay)."
    },
    {
      question: "She resembles her mother; she really ___ her.",
      options: ["takes after", "takes off", "takes over", "takes in"],
      answer: "takes after",
      explanation: "'take after somebody' nghĩa là giống ai đó về ngoại hình hoặc tính cách."
    }
  ]
};

// Fisher-Yates shuffle helper
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getQuestionPoolForLesson(lesson) {
  const title = (lesson?.title || '').toLowerCase();
  if (title.includes('cấu trúc') && title.includes('hiện tại hoàn thành')) return FALLBACK_LESSON_QUIZZES.present_perfect_form;
  if (title.includes('since') || title.includes('for')) return FALLBACK_LESSON_QUIZZES.present_perfect_since_for;
  if (title.includes('dấu hiệu') || title.includes('already') || title.includes('yet')) return FALLBACK_LESSON_QUIZZES.present_perfect_signals;
  if (title.includes('quá khứ hoàn thành') && (title.includes('khẳng định') || title.includes('cấu trúc') || title.includes('công thức'))) return FALLBACK_LESSON_QUIZZES.past_perfect_form;
  if (title.includes('before') || title.includes('after') || title.includes('by the time')) return FALLBACK_LESSON_QUIZZES.past_perfect_clauses;
  if (title.includes('phân biệt') && title.includes('quá khứ đơn') && title.includes('quá khứ hoàn thành')) return FALLBACK_LESSON_QUIZZES.past_simple_vs_past_perfect;
  if (title.includes('hiện tại hoàn thành') && title.includes('quá khứ đơn')) return FALLBACK_LESSON_QUIZZES.present_perfect_vs_past_simple;
  if (title.includes('thời gian xác định') || title.includes('trạng từ thời gian')) return FALLBACK_LESSON_QUIZZES.time_expressions;
  if (title.includes('ôn tập') || title.includes('remedial') || title.includes('bổ sung') || title.includes('tenses')) return FALLBACK_LESSON_QUIZZES.remedial_tenses;
  if (title.includes('loại 0') || title.includes('zero conditional')) return FALLBACK_LESSON_QUIZZES.zero_conditional;
  if (title.includes('loại 1') || title.includes('first conditional')) return FALLBACK_LESSON_QUIZZES.first_conditional;
  if (title.includes('loại 2') || title.includes('second conditional')) return FALLBACK_LESSON_QUIZZES.second_conditional;
  if (title.includes('collocation') || title.includes('kết hợp từ')) return FALLBACK_LESSON_QUIZZES.academic_collocations;
  if (title.includes('cấu tạo từ') || title.includes('word formation') || title.includes('tiền tố') || title.includes('hậu tố')) return FALLBACK_LESSON_QUIZZES.word_formation;
  if (title.includes('phrasal verb') || title.includes('cụm động từ')) return FALLBACK_LESSON_QUIZZES.phrasal_verbs;

  return [
    {
      question: `Trong tiếng Anh, cấu trúc ngữ pháp và từ vựng của bài "${lesson?.title || 'học'}" cần lưu ý điều gì?`,
      options: [
        "Tuân thủ chính xác quy tắc chia thì và sự hòa hợp giữa chủ ngữ - động từ",
        "Có thể dùng bất kỳ thì nào mà không cần xét ngữ cảnh",
        "Chỉ cần dịch nghĩa theo từng từ đơn lẻ (word-by-word)",
        "Không cần để ý đến dấu hiệu nhận biết thời gian"
      ],
      answer: "Tuân thủ chính xác quy tắc chia thì và sự hòa hợp giữa chủ ngữ - động từ",
      explanation: "Ngữ pháp tiếng Anh luôn đòi hỏi tính chuẩn xác về thì và hòa hợp ngữ pháp dựa trên ngữ cảnh câu."
    },
    {
      question: "Khi làm bài tập trắc nghiệm liên quan đến nội dung bài này, bước đầu tiên quan trọng nhất là:",
      options: [
        "Xác định thì của câu dựa vào trạng từ chỉ thời gian và cấu trúc câu",
        "Chọn ngay phương án dài nhất",
        "Dịch toàn bộ bài trước khi nhìn vào 4 phương án",
        "Bỏ qua các từ nối trong câu"
      ],
      answer: "Xác định thì của câu dựa vào trạng từ chỉ thời gian và cấu trúc câu",
      explanation: "Việc xác định ngữ cảnh và trạng từ thời gian giúp loại trừ ngay các phương án sai."
    },
    {
      question: "Dấu hiệu nào sau đây giúp loại trừ nhanh các phương án sai trong câu kiểm tra ngữ pháp?",
      options: [
        "Sự hòa hợp giữa thì của mệnh đề chính và mệnh đề phụ",
        "Độ dài của từng phương án trắc nghiệm",
        "Thứ tự bảng chữ cái của đáp án A, B, C, D",
        "Các từ không xuất hiện trong từ điển"
      ],
      answer: "Sự hòa hợp giữa thì của mệnh đề chính và mệnh đề phụ",
      explanation: "Quy tắc hòa hợp thì luôn là căn cứ khoa học chính xác nhất để loại trừ đáp án không tương thích."
    }
  ];
}

/* ── Randomized Quiz Generator: shuffles pool questions & option choices A/B/C/D ── */
function getRandomQuizForLesson(lesson, miniQuizzes, count = 3) {
  let pool = [];
  if (miniQuizzes && miniQuizzes.length > 0) {
    for (const mq of miniQuizzes) {
      if (mq.questionsJson) {
        try {
          const parsed = JSON.parse(mq.questionsJson);
          if (Array.isArray(parsed) && parsed.length > 0) {
            pool.push(...parsed);
          }
        } catch (e) {}
      }
    }
  }

  // Always supplement with fallback pool to ensure at least 3 randomized questions
  const fallback = getQuestionPoolForLesson(lesson) || [];
  pool.push(...fallback);

  // Deduplicate by question text
  const seen = new Set();
  const uniquePool = pool.filter(q => {
    if (!q || !q.question) return false;
    const key = q.question.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Shuffle question pool and select count questions (default 3)
  const targetCount = Math.min(count, uniquePool.length);
  const selected = shuffleArray(uniquePool).slice(0, targetCount);

  // Shuffle options for each question so correct answer position is randomized
  return selected.map(q => {
    if (!q.options || q.options.length <= 1) return q;
    return {
      ...q,
      options: shuffleArray(q.options)
    };
  });
}

/* ── Lesson content panel with Sequential Progression ── */
function LessonContentPanel({
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
                Đã hoàn thành các bài học trong Topic "{activeSkillNode.skillName}"?
              </h4>
              {!canTakeTopicTest && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#b45309', background: '#fffbeb', border: '1px solid #fde68a', padding: '2px 8px', borderRadius: 3, fontWeight: 600 }}>
                  <Lock size={11} /> Chưa mở khóa bài kiểm tra
                </span>
              )}
            </div>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12, lineHeight: 1.5 }}>
              {canTakeTopicTest
                ? 'Làm bài kiểm tra Topic để đánh giá độ thuần thục. Đạt từ 80% sẽ mở khóa Topic tiếp theo trong lộ trình học!'
                : 'Bạn cần hoàn thành tất cả các bài học chính trong Topic này trước khi có thể làm bài kiểm tra đánh giá năng lực.'}
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
                ? `Làm bài kiểm tra Topic: ${activeSkillNode.skillName}`
                : `Làm bài kiểm tra Topic: ${activeSkillNode.skillName} (Khóa)`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Topic Test Modal (Random questions + Topic Test Attempt History) ── */
function TopicTestModal({ node, onClose, userId, fetchStudyPath, canTakeTest = true }) {
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [activeTest, setActiveTest] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
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
        ENGLISH_SUBJECT_ID,
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
      const al = Object.entries(answers).map(([questionId, selectedOptionId]) => ({
        questionId,
        selectedOptionId,
      }));
      const res = await assessmentService.submitAssessment(activeTest.attemptId, al);
      setResult(res);

      if (res.isPassed) {
        // Unlock next skill / topic
        await adaptiveService.unlockNextSkill(userId, ENGLISH_SUBJECT_ID, node.skillId, node.skillId);
      } else {
        // Extract weak lessons from assessment result to adaptively reorder lessons
        const weakLessonIds = res.weakLessons ? res.weakLessons.map(w => w.lessonId).filter(Boolean) : [];
        const weakLessonTitles = res.weakLessons ? res.weakLessons.map(w => w.lessonTitle).filter(Boolean) : [];
        await adaptiveService.handleTopicTestFailed(
          userId,
          ENGLISH_SUBJECT_ID,
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
                Số câu: {activeTest.totalQuestions || 5} câu ngẫu nhiên · Cần đạt ≥ 80% (≥ 4/5 câu) để mở khóa Topic tiếp theo
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
            <div style={{ fontSize: 48, marginBottom: 8, lineHeight: 1, color: result.isPassed ? '#16a34a' : '#d97706' }}>
              {result.isPassed ? '✓' : '⚠️'}
            </div>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
              {result.isPassed
                ? 'Chúc mừng! Bạn đã đạt yêu cầu và mở khóa Topic tiếp theo'
                : 'Chưa đạt yêu cầu (Cần từ 80%)'}
            </h4>
            <p style={{ fontSize: 14, color: '#4b5563', marginBottom: 12 }}>
              Điểm số: <strong style={{ color: '#111827' }}>{result.score}/{result.totalQuestions}</strong> câu đúng ({result.accuracyPercentage}%)
            </p>

            {!result.isPassed && (
              <div style={{ maxWidth: 540, margin: '0 auto 20px', textAlign: 'left' }}>
                <div style={{ fontSize: 13, color: '#b45309', background: '#fffbeb', border: '1px solid #fde68a', padding: '12px 14px', borderRadius: 4, lineHeight: 1.5, marginBottom: 12 }}>
                  ⚠️ <strong>Chưa đạt chuẩn (Cần ≥ 80%):</strong>
                  <p style={{ margin: '6px 0 0', fontSize: 12.5, color: '#92400e' }}>
                    Hệ thống đã tự động sắp xếp lại lộ trình học của chủ đề này: các bài học bạn chưa vững được đưa lên đầu để củng cố trước, kèm bài tập ôn tập bổ sung.
                  </p>
                </div>

                {result.weakLessons && result.weakLessons.length > 0 && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 4, padding: '10px 14px' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#991b1b', textTransform: 'uppercase', marginBottom: 6 }}>
                      Các bài học cần củng cố lại:
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: '#7f1d1d' }}>
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
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>Đạt tối thiểu 80% (≥ 4/5 câu)</div>
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

/* ── Course Final Test Modal (Comprehensive Exam + Course Attempt History) ── */
function CourseFinalTestModal({ onClose, userId, fetchStudyPath, isUnlocked }) {
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [activeTest, setActiveTest] = useState(null);
  const [timeLeft, setTimeLeft] = useState(900); // 15 questions * 1 min = 15 mins
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const letters = ['A', 'B', 'C', 'D'];

  const loadHistory = () => {
    setLoadingHistory(true);
    assessmentService.getSubjectTestHistory(userId, ENGLISH_SUBJECT_ID)
      .then(h => setHistory(h || []))
      .catch(() => {})
      .finally(() => setLoadingHistory(false));
  };

  useEffect(() => {
    loadHistory();
  }, []);

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
      const test = await assessmentService.generateCourseFinalTest(ENGLISH_SUBJECT_ID, userId);
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
      const al = Object.entries(answers).map(([questionId, selectedOptionId]) => ({
        questionId,
        selectedOptionId,
      }));
      const res = await assessmentService.submitAssessment(activeTest.attemptId, al);
      setResult(res);

      if (res.isPassed) {
        await adaptiveService.completeCourseFinalTest(userId, ENGLISH_SUBJECT_ID, res.accuracyPercentage);
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
            <div style={{ fontSize: 52, marginBottom: 8, lineHeight: 1, color: result.isPassed ? '#16a34a' : '#b45309' }}>
              {result.isPassed ? '🎓' : '📚'}
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
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '12px 14px', borderRadius: 4, marginBottom: 16, color: '#991b1b', fontSize: 13 }}>
                🔒 <strong>Chưa mở khóa:</strong> Bạn cần hoàn thành tất cả các Topic trong 2 module Ngữ pháp và Từ vựng để làm bài kiểm tra tổng kết môn học!
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

/* ── Overview panel ── */
function OverviewPanel({ nodes, onOpenCourseTest, allCompleted }) {
  const done = nodes.filter(n => n.status === 'COMPLETED').length;
  const pct = nodes.length > 0 ? Math.round((done / nodes.length) * 100) : 0;

  return (
    <div style={{ maxWidth: 640, fontFamily: FONT }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
        Lộ trình học Tiếng Anh THPT theo Module & Chủ đề
      </h1>
      <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 20, lineHeight: 1.65 }}>
        Môn học gồm 2 module kỹ năng: <strong>Ngữ pháp</strong> và <strong>Từ vựng</strong>. Trong mỗi module có các chủ đề (Topic) bài học. Bạn cần hoàn thành tuần tự từng bài học và quiz để mở khóa bài học kế tiếp.
      </p>

      {/* Progress Bar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#374151', marginBottom: 6 }}>
          <span>Tiến độ hoàn thành các chủ đề</span>
          <span style={{ fontWeight: 700 }}>{done} / {nodes.length} chủ đề ({pct}%)</span>
        </div>
        <div style={{ height: 6, background: '#e5e7eb', width: '100%' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? '#16a34a' : '#374151', transition: 'width 0.5s' }} />
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Tổng chủ đề', value: nodes.length },
          { label: 'Đã hoàn thành', value: done },
          { label: 'Cần củng cố', value: nodes.filter(n => n.status === 'NEEDS_REMEDIATION' || n.proficiencyLevel === 'NEEDS_IMPROVEMENT').length },
        ].map(s => (
          <div key={s.label} style={{ border: '1px solid #e5e7eb', padding: '14px 16px', background: '#fff' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#111827' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* COURSE FINAL TEST CARD */}
      <div
        style={{
          border: allCompleted ? '2px solid #16a34a' : '1px solid #e5e7eb',
          background: allCompleted ? '#f0fdf4' : '#fff',
          padding: '20px 24px',
          marginBottom: 24,
          borderRadius: 4,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 11, color: allCompleted ? '#166534' : '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontWeight: 700 }}>
              {allCompleted ? '🎉 Đủ điều kiện dự thi' : '🔒 Khóa'} · Đánh giá tổng thể
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 6 }}>
              Bài kiểm tra tổng kết môn học (15 câu ngẫu nhiên)
            </h3>
            <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.5, marginBottom: 12 }}>
              {allCompleted
                ? 'Bạn đã hoàn thành tất cả các chủ đề! Hãy làm bài thi kiểm tra lại toàn bộ kiến thức để hoàn tất môn học.'
                : 'Cần hoàn thành 100% các chủ đề và bài kiểm tra Topic để mở khóa bài thi tổng kết môn học.'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCourseTest}
          style={{
            padding: '9px 20px',
            background: allCompleted ? '#16a34a' : '#1f2937',
            color: '#fff',
            border: 'none',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: FONT,
          }}
        >
          <Award size={14} />
          {allCompleted ? 'Bắt đầu bài kiểm tra tổng kết môn' : 'Xem chi tiết & Lịch sử bài thi'}
        </button>
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
        <Link
          to="/assessment/placement"
          style={{ fontSize: 13, color: '#9ca3af', display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
        >
          <RotateCcw size={11} /> Làm lại bài khảo sát đầu vào để tái cấu trúc lộ trình
        </Link>
      </div>
    </div>
  );
}

/* ── MAIN PAGE ── */
export default function StudyPathRoadmapPage() {
  const { user } = useAuth();
  const [studyPath, setStudyPath] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lessons and Progress state
  const [lessonsByTopic, setLessonsByTopic] = useState({});
  const [remedialByTopic, setRemedialByTopic] = useState({});
  const [progressByTopic, setProgressByTopic] = useState({});
  const [expandedTopics, setExpandedTopics] = useState(new Set());

  // Active Lesson
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [activeLessonData, setActiveLessonData] = useState(null);
  const [activeExamples, setActiveExamples] = useState([]);
  const [activeMiniQuizzes, setActiveMiniQuizzes] = useState([]);
  const [activeSkillNode, setActiveSkillNode] = useState(null);
  const [loadingLesson, setLoadingLesson] = useState(false);

  // Modals
  const [topicTestNode, setTopicTestNode] = useState(null);
  const [showCourseTestModal, setShowCourseTestModal] = useState(false);

  const fetchStudyPath = async () => {
    if (!user?.userId) return;
    try {
      setLoading(true);
      const pathData = await adaptiveService.getMyStudyPath(user.userId, ENGLISH_SUBJECT_ID);
      setStudyPath(pathData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudyPath();
  }, [user?.userId]);

  // Expand active topic automatically on load
  useEffect(() => {
    if (!studyPath?.nodes) return;
    const u = studyPath.nodes.find(n => n.status === 'UNLOCKED' || n.status === 'NEEDS_REMEDIATION');
    if (u) {
      const topicKey = u.topicId || u.skillId;
      setExpandedTopics(new Set([topicKey]));
      loadTopicData(topicKey);
    }
  }, [studyPath]);

  const loadTopicData = async (topicId) => {
    if (!topicId) return;
    try {
      // 1. Fetch lessons
      if (!lessonsByTopic[topicId]) {
        const lessons = await contentService.getTopicLessons(topicId);
        // Fallback to getLessons if empty
        const finalLessons = (lessons && lessons.length > 0) ? lessons : await contentService.getLessons(topicId);
        setLessonsByTopic(prev => ({ ...prev, [topicId]: finalLessons || [] }));
      }
      // 2. Fetch remedial lessons
      if (!remedialByTopic[topicId]) {
        const rem = await contentService.getRemedialLessons(topicId);
        setRemedialByTopic(prev => ({ ...prev, [topicId]: rem || [] }));
      }
      // 3. Fetch lesson progress
      if (user?.userId) {
        const prog = await adaptiveService.getLessonProgress(user.userId, topicId);
        const map = {};
        (prog || []).forEach(p => { map[p.lessonId] = p; });
        setProgressByTopic(prev => ({ ...prev, [topicId]: map }));
      }
    } catch (err) {
      console.error('Error loading topic data', err);
    }
  };

  const handleToggleTopic = async (topicId) => {
    setExpandedTopics(prev => {
      const n = new Set(prev);
      n.has(topicId) ? n.delete(topicId) : n.add(topicId);
      return n;
    });
    await loadTopicData(topicId);
  };

  const handleSelectLesson = async (lesson, node) => {
    if (activeLessonId === lesson.id) return;
    setActiveLessonId(lesson.id);
    setActiveSkillNode(node);
    setActiveLessonData(null);
    setActiveExamples([]);
    setActiveMiniQuizzes([]);
    setLoadingLesson(true);
    try {
      const data = await contentService.getLesson(lesson.id);
      setActiveLessonData(data);
      if (data?.examples) setActiveExamples(data.examples);
      if (data?.miniQuizzes) setActiveMiniQuizzes(data.miniQuizzes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLesson(false);
    }
  };

  const handleProgressUpdated = () => {
    if (activeSkillNode) {
      const topicKey = activeSkillNode.topicId || activeSkillNode.skillId;
      loadTopicData(topicKey);
    }
  };

  const handleNextLesson = () => {
    if (!activeSkillNode) return;
    const topicKey = activeSkillNode.topicId || activeSkillNode.skillId;
    const list = lessonsByTopic[topicKey] || [];
    const currIdx = list.findIndex(l => l.id === activeLessonId);
    if (currIdx >= 0 && currIdx + 1 < list.length) {
      handleSelectLesson(list[currIdx + 1], activeSkillNode);
    }
  };

  if (loading && !studyPath) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px 0', flexDirection: 'column', gap: 12 }}>
        <div style={{ width: 32, height: 32, border: '3px solid #d1d5db', borderTopColor: '#374151', borderRadius: '50%' }} className="animate-spin" />
        <p style={{ fontSize: 13, color: '#6b7280', fontFamily: FONT }}>Đang tải lộ trình học thích ứng...</p>
      </div>
    );
  }

  if (!studyPath || !studyPath.nodes || studyPath.nodes.length === 0) {
    return (
      <div style={{ maxWidth: 480, margin: '80px auto', textAlign: 'center', fontFamily: FONT }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 12 }}>Chưa có lộ trình học cho môn Tiếng Anh</h2>
        <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.65, marginBottom: 24 }}>
          Thực hiện bài khảo sát đánh giá năng lực để hệ thống AI tự động sắp xếp lộ trình phù hợp theo Module & Chủ đề.
        </p>
        <Link
          to="/assessment/placement"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', background: '#1f2937', color: '#fff', fontSize: 14, fontWeight: 600, textDecoration: 'none', fontFamily: FONT }}
        >
          Bắt đầu bài khảo sát năng lực
        </Link>
      </div>
    );
  }

  const nodes = studyPath.nodes || [];
  const done = nodes.filter(n => n.status === 'COMPLETED').length;
  const pct = Math.round((done / nodes.length) * 100);
  const allCompleted = done === nodes.length;

  // Group nodes by Module
  const grammarNodes = nodes.filter(n => (n.moduleName && n.moduleName.includes('Ngữ pháp')) || n.sequenceOrder <= 4);
  const vocabNodes = nodes.filter(n => (n.moduleName && n.moduleName.includes('Từ vựng')) || n.sequenceOrder > 4);

  // Check whether all regular lessons in a topic/node are finished so test can be unlocked
  const isNodeTestUnlocked = (node) => {
    if (!node) return false;
    if (node.status === 'COMPLETED') return true;
    const topicKey = node.topicId || node.skillId;
    const lessons = lessonsByTopic[topicKey] || [];
    const progressMap = progressByTopic[topicKey] || {};
    const regularLessons = lessons.filter(l => !l.isRemedial);
    if (regularLessons.length === 0) return true;
    return regularLessons.every(l => {
      const p = progressMap[l.id];
      return p && p.isCompleted && p.quizCompleted;
    });
  };

  // Check next lesson existence
  let hasNextLesson = false;
  if (activeSkillNode && activeLessonId) {
    const topicKey = activeSkillNode.topicId || activeSkillNode.skillId;
    const list = lessonsByTopic[topicKey] || [];
    const currIdx = list.findIndex(l => l.id === activeLessonId);
    hasNextLesson = currIdx >= 0 && currIdx + 1 < list.length;
  }

  return (
    <div style={{ display: 'flex', width: '100%', height: 'calc(100vh - 64px)', fontFamily: FONT, overflow: 'hidden' }}>
      {/* SIDEBAR: MODULE & TOPIC TREE */}
      <aside
        style={{
          width: 310,
          minWidth: 310,
          borderRight: '1px solid #e5e7eb',
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ padding: '16px 14px 12px', borderBottom: '1px solid #e5e7eb', flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
            Lộ trình học thích ứng
          </div>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 10, lineHeight: 1.3 }}>
            Tiếng Anh THPT
          </h2>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6b7280', marginBottom: 4 }}>
              <span>{done}/{nodes.length} chủ đề</span>
              <span style={{ fontWeight: 700 }}>{pct}%</span>
            </div>
            <div style={{ height: 4, background: '#e5e7eb', width: '100%' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? '#16a34a' : '#374151', transition: 'width 0.5s' }} />
            </div>
          </div>
        </div>

        {/* Tree content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Module 1: Grammar */}
          {grammarNodes.length > 0 && (
            <div>
              <div style={{ padding: '8px 14px 4px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Module 1: Ngữ pháp (Grammar)
              </div>
              {grammarNodes.map((node, idx) => {
                const topicKey = node.topicId || node.skillId;
                return (
                  <TopicItem
                    key={node.id || idx}
                    node={node}
                    lessons={lessonsByTopic[topicKey]}
                    remedialLessons={remedialByTopic[topicKey]}
                    lessonProgressMap={progressByTopic[topicKey] || {}}
                    isExpanded={expandedTopics.has(topicKey)}
                    onToggleTopic={handleToggleTopic}
                    activeLessonId={activeLessonId}
                    onSelectLesson={handleSelectLesson}
                    onOpenTopicTest={setTopicTestNode}
                  />
                );
              })}
            </div>
          )}

          {/* Module 2: Vocabulary */}
          {vocabNodes.length > 0 && (
            <div>
              <div style={{ padding: '8px 14px 4px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Module 2: Từ vựng (Vocabulary)
              </div>
              {vocabNodes.map((node, idx) => {
                const topicKey = node.topicId || node.skillId;
                return (
                  <TopicItem
                    key={node.id || idx}
                    node={node}
                    lessons={lessonsByTopic[topicKey]}
                    remedialLessons={remedialByTopic[topicKey]}
                    lessonProgressMap={progressByTopic[topicKey] || {}}
                    isExpanded={expandedTopics.has(topicKey)}
                    onToggleTopic={handleToggleTopic}
                    activeLessonId={activeLessonId}
                    onSelectLesson={handleSelectLesson}
                    onOpenTopicTest={setTopicTestNode}
                  />
                );
              })}
            </div>
          )}

          {/* COURSE FINAL TEST BUTTON IN SIDEBAR */}
          <div style={{ padding: '12px 14px', borderTop: '1px solid #e5e7eb', background: allCompleted ? '#f0fdf4' : '#fafafa' }}>
            <button
              onClick={() => setShowCourseTestModal(true)}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: allCompleted ? '#16a34a' : '#f1f5f9',
                border: allCompleted ? '1px solid #15803d' : '1px dashed #cbd5e1',
                color: allCompleted ? '#fff' : '#475569',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                fontFamily: FONT,
              }}
            >
              <Award size={13} color={allCompleted ? '#fff' : '#64748b'} />
              {allCompleted ? 'Thi tổng kết môn học' : 'Bài thi tổng kết môn (Khóa)'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '10px 14px', borderTop: '1px solid #e5e7eb', flexShrink: 0 }}>
          <Link
            to="/assessment/placement"
            style={{ fontSize: 11, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
          >
            <RotateCcw size={10} /> Làm lại bài khảo sát đầu vào
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT PANEL */}
      <div style={{ flex: 1, padding: '28px 36px', background: '#fafafa', overflowY: 'auto', height: '100%' }}>
        {loadingLesson ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px 0', flexDirection: 'column', gap: 12 }}>
            <div style={{ width: 28, height: 28, border: '3px solid #d1d5db', borderTopColor: '#374151', borderRadius: '50%' }} className="animate-spin" />
            <p style={{ fontSize: 13, color: '#6b7280' }}>Đang tải nội dung bài học...</p>
          </div>
        ) : activeLessonData ? (
          <LessonContentPanel
            lesson={activeLessonData}
            examples={activeExamples}
            miniQuizzes={activeMiniQuizzes}
            activeSkillNode={activeSkillNode}
            userId={user.userId}
            onOpenTest={setTopicTestNode}
            lessonProgress={
              activeSkillNode && progressByTopic[activeSkillNode.topicId || activeSkillNode.skillId]
                ? progressByTopic[activeSkillNode.topicId || activeSkillNode.skillId][activeLessonData.id]
                : null
            }
            onProgressUpdated={handleProgressUpdated}
            onNextLesson={handleNextLesson}
            hasNextLesson={hasNextLesson}
            canTakeTopicTest={activeSkillNode ? isNodeTestUnlocked(activeSkillNode) : false}
          />
        ) : (
          <OverviewPanel
            nodes={nodes}
            onOpenCourseTest={() => setShowCourseTestModal(true)}
            allCompleted={allCompleted}
          />
        )}
      </div>

      {/* TOPIC TEST MODAL (With Topic Test History) */}
      {topicTestNode && (
        <TopicTestModal
          node={topicTestNode}
          onClose={() => setTopicTestNode(null)}
          userId={user.userId}
          fetchStudyPath={fetchStudyPath}
          canTakeTest={topicTestNode ? isNodeTestUnlocked(topicTestNode) : false}
        />
      )}

      {/* COURSE FINAL TEST MODAL (With Subject Test History) */}
      {showCourseTestModal && (
        <CourseFinalTestModal
          onClose={() => setShowCourseTestModal(false)}
          userId={user.userId}
          fetchStudyPath={fetchStudyPath}
          isUnlocked={allCompleted}
        />
      )}
    </div>
  );
}

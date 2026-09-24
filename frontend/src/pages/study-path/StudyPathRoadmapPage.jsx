import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import adaptiveService from '../../services/adaptiveService';
import contentService from '../../services/contentService';
import { RotateCcw, Award, Compass, ArrowLeft } from 'lucide-react';
import TopicItem from '../../components/study-path/TopicItem';
import LessonContentPanel from '../../components/study-path/LessonContentPanel';
import TopicTestModal from '../../components/study-path/TopicTestModal';
import CourseFinalTestModal from '../../components/study-path/CourseFinalTestModal';
import OverviewPanel from '../../components/study-path/OverviewPanel';
import { ENGLISH_SUBJECT_ID, FONT } from '../../components/study-path/studyPathConstants';

/* ── MAIN PAGE ── */
export default function StudyPathRoadmapPage() {
  const { user, isPro } = useAuth();
  const { subjectCode } = useParams();
  const [subject, setSubject] = useState(null);
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

  // Determine current active userId safely
  const uid = user?.userId || user?.id;

  // Resolve subject by subjectCode dynamically
  useEffect(() => {
    let isMounted = true;
    const resolveSubject = async () => {
      try {
        if (!subjectCode) {
          // Default fallback
          const defaultSub = await contentService.getSubject(ENGLISH_SUBJECT_ID);
          if (isMounted) setSubject(defaultSub);
          return;
        }

        // Try getting subject by code first
        try {
          const sub = await contentService.getSubjectByCode(subjectCode);
          if (sub && isMounted) {
            setSubject(sub);
            return;
          }
        } catch (e) {
          // Fallback to searching all subjects
        }

        const allSubs = await contentService.getSubjects();
        const found = (allSubs || []).find(
          s => (s.code || '').toLowerCase() === subjectCode.toLowerCase() ||
               (s.id || '').toLowerCase() === subjectCode.toLowerCase()
        );
        if (found && isMounted) {
          setSubject(found);
        } else if (isMounted) {
          setSubject({ id: ENGLISH_SUBJECT_ID, name: subjectCode.toUpperCase(), code: subjectCode });
        }
      } catch (err) {
        console.error('Error resolving subject:', err);
      }
    };

    resolveSubject();
    return () => { isMounted = false; };
  }, [subjectCode]);

  const activeSubjectId = subject?.id || ENGLISH_SUBJECT_ID;

  const fetchStudyPath = async () => {
    if (!uid || !activeSubjectId) return;
    try {
      setLoading(true);
      const pathData = await adaptiveService.getMyStudyPath(uid, activeSubjectId);
      setStudyPath(pathData);
    } catch (err) {
      console.error('Lỗi tải lộ trình học:', err);
      setStudyPath(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (uid && activeSubjectId) {
      fetchStudyPath();
    }
  }, [uid, activeSubjectId]);

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
      if (uid) {
        const prog = await adaptiveService.getLessonProgress(uid, topicId);
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

  const handleAddProRemedial = async (topicId) => {
    try {
      const rem = await contentService.getRemedialLessons(topicId);
      if (rem && rem.length > 0) {
        setRemedialByTopic(prev => ({ ...prev, [topicId]: rem }));
        setExpandedTopics(prev => new Set([...prev, topicId]));
      }
    } catch (err) {
      console.error('Failed to add PRO remedial lesson', err);
    }
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

  const getTopicCombinedList = (topicKey, isNodeRem, isNodeComp) => {
    const regular = lessonsByTopic[topicKey] || [];
    const remedials = remedialByTopic[topicKey] || [];
    const progressMap = progressByTopic[topicKey] || {};
    const hasStudiedRemedial = remedials.some(rl => {
      const p = progressMap[rl.id];
      return p && (p.isCompleted || p.quizCompleted || (p.quizScore !== undefined && p.quizScore !== null));
    });
    const shouldInclude = isNodeRem || isNodeComp || hasStudiedRemedial;
    const combined = [...regular];
    if (shouldInclude && remedials.length > 0) {
      remedials.forEach(rl => {
        if (!combined.some(cl => cl.id === rl.id)) combined.push(rl);
      });
    }
    combined.sort((a, b) => {
      if (!a.isRemedial && b.isRemedial) return -1;
      if (a.isRemedial && !b.isRemedial) return 1;
      return (a.displayOrder || 0) - (b.displayOrder || 0);
    });
    return combined;
  };

  const handleNextLesson = () => {
    if (!activeSkillNode) return;
    const topicKey = activeSkillNode.topicId || activeSkillNode.skillId;
    const isNodeRem = activeSkillNode.status === 'NEEDS_REMEDIATION' || activeSkillNode.hasRemedialActive;
    const isNodeComp = activeSkillNode.status === 'COMPLETED';
    const list = getTopicCombinedList(topicKey, isNodeRem, isNodeComp);
    const currIdx = list.findIndex(l => l.id === activeLessonId);
    if (currIdx >= 0 && currIdx + 1 < list.length) {
      handleSelectLesson(list[currIdx + 1], activeSkillNode);
    }
  };

  const nodes = studyPath?.nodes || [];
  const done = nodes.filter(n => n.status === 'COMPLETED').length;
  const pct = nodes.length > 0 ? Math.round((done / nodes.length) * 100) : 0;
  const allCompleted = nodes.length > 0 && done === nodes.length;

  // Group nodes dynamically by Module ID / Module Name (must be before any early return)
  const modulesGrouped = useMemo(() => {
    const map = new Map();
    nodes.forEach(node => {
      const mId = node.moduleId || 'default-module';
      const mName = node.moduleName || 'Khối kiến thức';
      if (!map.has(mId)) {
        map.set(mId, { id: mId, name: mName, nodes: [] });
      }
      map.get(mId).nodes.push(node);
    });
    return Array.from(map.values());
  }, [nodes]);

  if (loading && !studyPath) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px 0', flexDirection: 'column', gap: 12 }}>
        <div style={{ width: 32, height: 32, border: '3px solid #e2e8f0', borderTopColor: '#4f46e5', borderRadius: '50%' }} className="animate-spin" />
        <p style={{ fontSize: 13, color: '#64748b', fontFamily: FONT }}>Đang tải lộ trình học thích ứng...</p>
      </div>
    );
  }

  if (!studyPath || !studyPath.nodes || studyPath.nodes.length === 0) {
    const subjectDisplayName = subject?.name || (subjectCode ? subjectCode.toUpperCase() : 'môn học');

    return (
      <div style={{ maxWidth: 520, margin: '60px auto', textAlign: 'center', fontFamily: FONT, background: '#fff', padding: '40px 32px', borderRadius: 20, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Compass style={{ width: 24, height: 24 }} />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>
          Chưa có lộ trình học cho môn {subjectDisplayName}
        </h2>
        <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65, marginBottom: 24 }}>
          Bạn chưa thực hiện bài khảo sát năng lực ban đầu cho môn học này. Hãy hoàn thành khảo sát 12 phút để hệ thống AI phân tích và xây dựng lộ trình học thích ứng dành riêng cho bạn.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
          <Link
            to={`/assessment/placement?subjectId=${activeSubjectId}`}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px 24px', background: '#4f46e5', color: '#fff', fontSize: 14, fontWeight: 600, textDecoration: 'none', borderRadius: 10, fontFamily: FONT, width: '100%', maxWidth: 300 }}
          >
            Bắt đầu bài khảo sát năng lực
          </Link>
          <Link
            to="/study-path"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 20px', background: '#f8fafc', color: '#475569', fontSize: 13, fontWeight: 600, textDecoration: 'none', borderRadius: 8, border: '1px solid #e2e8f0', fontFamily: FONT }}
          >
            <ArrowLeft style={{ width: 14, height: 14 }} />
            <span>Chọn môn học khác</span>
          </Link>
        </div>
      </div>
    );
  }

  // Check whether lessons in a topic/node are finished so test can be unlocked
  const isNodeTestUnlocked = (node) => {
    if (!node) return false;
    if (node.status === 'COMPLETED') return true;
    const topicKey = node.topicId || node.skillId;
    const lessons = lessonsByTopic[topicKey] || [];
    const remedials = remedialByTopic[topicKey] || [];
    const progressMap = progressByTopic[topicKey] || {};
    const isRemedial = node.status === 'NEEDS_REMEDIATION' || node.hasRemedialActive;

    const regularLessons = lessons.filter(l => !l.isRemedial);
    const regularDone = regularLessons.length === 0 || regularLessons.every(l => {
      const p = progressMap[l.id];
      return p && p.isCompleted && p.quizCompleted;
    });

    if (!isRemedial) {
      return regularDone;
    }

    const remedialDone = remedials.length === 0 || remedials.every(l => {
      const p = progressMap[l.id];
      return p && p.isCompleted && p.quizCompleted;
    });
    return regularDone && remedialDone;
  };

  // Check next lesson existence
  let hasNextLesson = false;
  if (activeSkillNode && activeLessonId) {
    const topicKey = activeSkillNode.topicId || activeSkillNode.skillId;
    const isNodeRem = activeSkillNode.status === 'NEEDS_REMEDIATION' || activeSkillNode.hasRemedialActive;
    const isNodeComp = activeSkillNode.status === 'COMPLETED';
    const list = getTopicCombinedList(topicKey, isNodeRem, isNodeComp);
    const currIdx = list.findIndex(l => l.id === activeLessonId);
    hasNextLesson = currIdx >= 0 && currIdx + 1 < list.length;
  }

  return (
    <div style={{ display: 'flex', width: '100%', height: 'calc(100vh - 56px)', fontFamily: FONT, overflow: 'hidden' }}>
      {/* SIDEBAR: MODULE & TOPIC TREE */}
      <aside
        style={{
          width: 320,
          minWidth: 320,
          borderRight: '1px solid #e2e8f0',
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflowY: 'auto',
        }}
      >
        {/* Focused Professional Learning Header */}
        <div className="p-4 border-b border-slate-200 shrink-0 bg-white">
          <Link
            to="/study-path"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition mb-2"
          >
            ← Danh sách lộ trình
          </Link>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Lộ trình học thích ứng
          </div>
          <h2 className="text-base font-bold text-slate-900 mb-2 leading-tight">
            {subject?.name || (subjectCode ? subjectCode.toUpperCase() : 'Môn học')}
          </h2>
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1.5 font-medium">
              <span>{done}/{nodes.length} chủ đề đạt chuẩn</span>
              <span className={`font-bold ${pct === 100 ? 'text-emerald-600' : 'text-indigo-600'}`}>{pct}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 w-full rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? 'bg-emerald-600' : 'bg-indigo-600'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tree content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Dynamic N Modules rendering */}
          {modulesGrouped.map((moduleGroup, mIdx) => {
            const groupNodes = moduleGroup.nodes || [];
            if (groupNodes.length === 0) return null;

            return (
              <div key={moduleGroup.id || mIdx}>
                <div style={{ padding: '8px 14px 4px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Module {mIdx + 1}: {moduleGroup.name}
                </div>
                {groupNodes.map((node, idx) => {
                  const topicKey = node.topicId || node.skillId;
                  // Each module is independent: first topic is unlocked. Subsequent topics unlock when previous topic is COMPLETED.
                  const isTopicLocked = idx === 0
                    ? false
                    : !(groupNodes[idx - 1].status === 'COMPLETED' || node.status === 'UNLOCKED' || node.status === 'COMPLETED' || node.status === 'NEEDS_REMEDIATION');

                  return (
                    <TopicItem
                      key={node.id || idx}
                      node={node}
                      isLocked={isTopicLocked}
                      isPro={isPro}
                      onAddProRemedial={handleAddProRemedial}
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
            );
          })}

          {/* COURSE FINAL TEST BUTTON IN SIDEBAR */}
          <div style={{ padding: '12px 14px', borderTop: '1px solid #e2e8f0', background: allCompleted ? '#f0fdf4' : '#fff' }}>
            <button
              onClick={() => setShowCourseTestModal(true)}
              style={{
                width: '100%',
                padding: '9px 12px',
                background: allCompleted ? '#059669' : '#f8fafc',
                border: allCompleted ? '1px solid #047857' : '1px solid #e2e8f0',
                color: allCompleted ? '#fff' : '#64748b',
                borderRadius: 8,
                cursor: allCompleted ? 'pointer' : 'not-allowed',
                fontSize: 12,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                fontFamily: FONT,
              }}
            >
              <Award size={14} color={allCompleted ? '#fff' : '#94a3b8'} />
              {allCompleted ? 'Thi tổng kết môn học' : 'Bài thi tổng kết môn (Khóa)'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '10px 14px', borderTop: '1px solid #e2e8f0', flexShrink: 0 }}>
          <Link
            to="/assessment/placement"
            style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
          >
            <RotateCcw size={11} /> Làm lại bài khảo sát đầu vào
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT PANEL */}
      <div style={{ flex: 1, padding: '28px 36px', background: '#f8fafc', overflowY: 'auto', height: '100%' }}>
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
            userId={uid}
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
            subject={subject}
            onOpenCourseTest={() => setShowCourseTestModal(true)}
            allCompleted={allCompleted}
          />
        )}
      </div>

      {/* TOPIC TEST MODAL (With Topic Test History) */}
      {topicTestNode && (
        <TopicTestModal
          node={topicTestNode}
          subjectId={activeSubjectId}
          onClose={() => setTopicTestNode(null)}
          userId={uid}
          fetchStudyPath={fetchStudyPath}
          canTakeTest={topicTestNode ? isNodeTestUnlocked(topicTestNode) : false}
        />
      )}

      {/* COURSE FINAL TEST MODAL (With Subject Test History) */}
      {showCourseTestModal && (
        <CourseFinalTestModal
          onClose={() => setShowCourseTestModal(false)}
          userId={uid}
          subjectId={activeSubjectId}
          fetchStudyPath={fetchStudyPath}
          isUnlocked={allCompleted}
        />
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import adaptiveService from '../../services/adaptiveService';
import contentService from '../../services/contentService';
import { RotateCcw, Award } from 'lucide-react';
import TopicItem from '../../components/study-path/TopicItem';
import LessonContentPanel from '../../components/study-path/LessonContentPanel';
import TopicTestModal from '../../components/study-path/TopicTestModal';
import CourseFinalTestModal from '../../components/study-path/CourseFinalTestModal';
import OverviewPanel from '../../components/study-path/OverviewPanel';
import { ENGLISH_SUBJECT_ID, FONT } from '../../components/study-path/studyPathConstants';

/* ── MAIN PAGE ── */
export default function StudyPathRoadmapPage() {
  const { user, isPro } = useAuth();
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

  // Group nodes strictly by Module (no duplicate nodes between modules)
  const isGrammarNode = (n) => {
    const mod = (n.moduleName || '').toLowerCase();
    if (mod.includes('ngữ pháp') || mod.includes('grammar')) return true;
    if (mod.includes('từ vựng') || mod.includes('vocab')) return false;
    const sId = String(n.topicId || n.skillId || '');
    return sId.endsWith('01') || sId.endsWith('02') || sId.endsWith('03') || sId.endsWith('04');
  };
  const grammarNodes = nodes.filter(isGrammarNode);
  const vocabNodes = nodes.filter(n => !isGrammarNode(n));

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
                // Module 1 is independent: first topic is unlocked. Subsequent topics unlock when previous topic is COMPLETED.
                const isTopicLocked = idx === 0
                  ? false
                  : !(grammarNodes[idx - 1].status === 'COMPLETED' || node.status === 'UNLOCKED' || node.status === 'COMPLETED' || node.status === 'NEEDS_REMEDIATION');

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
          )}

          {/* Module 2: Vocabulary */}
          {vocabNodes.length > 0 && (
            <div>
              <div style={{ padding: '8px 14px 4px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Module 2: Từ vựng (Vocabulary)
              </div>
              {vocabNodes.map((node, idx) => {
                const topicKey = node.topicId || node.skillId;
                // Module 2 is independent: first topic is unlocked. Subsequent topics unlock when previous topic is COMPLETED.
                const isTopicLocked = idx === 0
                  ? false
                  : !(vocabNodes[idx - 1].status === 'COMPLETED' || node.status === 'UNLOCKED' || node.status === 'COMPLETED' || node.status === 'NEEDS_REMEDIATION');

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

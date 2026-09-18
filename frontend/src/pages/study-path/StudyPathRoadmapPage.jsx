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
  RotateCcw, X, Check, Award, Play,
} from 'lucide-react';

const ENGLISH_SUBJECT_ID = '11111111-1111-1111-1111-111111111101';
const FONT = "'Times New Roman', Times, Georgia, serif";

/* ── Sidebar: individual lesson row ── */
function LessonRow({ lesson, lessonIdx, isActive, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display:'flex', alignItems:'flex-start', gap:10, width:'100%', textAlign:'left',
        padding:'7px 14px 7px 36px', background: isActive ? '#f0f4ff' : hov ? '#f8f8f8' : 'transparent',
        borderLeft: isActive ? '2px solid #3730a3' : '2px solid transparent',
        borderRight:'none', borderTop:'none', borderBottom:'none',
        cursor:'pointer', fontFamily: FONT }}>
      <span style={{ minWidth:18, height:18, borderRadius:'50%', border:'1.5px solid #94a3b8',
        background: isActive ? '#3730a3' : '#fff', display:'inline-flex', alignItems:'center',
        justifyContent:'center', fontSize:10, color: isActive ? '#fff' : '#64748b',
        marginTop:1, flexShrink:0 }}>{lessonIdx + 1}</span>
      <span style={{ fontSize:13, color: isActive ? '#1e1b4b' : '#374151', lineHeight:1.4,
        fontWeight: isActive ? 600 : 400 }}>{lesson.title}</span>
    </button>
  );
}

/* ── Sidebar: skill group ── */
function SkillGroup({ node, lessons, expandedSkills, onToggleSkill, activeLessonId, onSelectLesson }) {
  const [hov, setHov] = useState(false);
  const key = node.skillId;
  const isExpanded = expandedSkills.has(key);
  const isCompleted = node.status === 'COMPLETED';
  const isLocked = node.status === 'LOCKED';
  return (
    <div style={{ borderBottom:'1px solid #e5e7eb' }}>
      <button disabled={isLocked}
        onClick={() => !isLocked && onToggleSkill(key)}
        onMouseEnter={() => !isLocked && setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{ display:'flex', alignItems:'center', gap:10, width:'100%', textAlign:'left',
          padding:'10px 14px', background: hov ? '#f3f4f6' : 'transparent',
          cursor: isLocked ? 'not-allowed' : 'pointer', opacity: isLocked ? 0.5 : 1,
          border:'none', fontFamily: FONT }}>
        <span style={{ flexShrink:0, display:'flex', alignItems:'center' }}>
          {isCompleted ? <CheckCircle2 size={14} color="#15803d" /> :
           isLocked ? <Lock size={12} color="#94a3b8" /> :
           <span style={{ width:12, height:12, borderRadius:'50%', border:'2px solid #3730a3', display:'inline-block' }} />}
        </span>
        <span style={{ flex:1, fontSize:13, fontWeight:600, color:'#111827', lineHeight:1.35 }}>{node.skillName}</span>
        {!isLocked && (isExpanded ? <ChevronDown size={12} color="#6b7280" /> : <ChevronRight size={12} color="#6b7280" />)}
      </button>
      {isExpanded && !isLocked && (
        <div style={{ paddingBottom:4 }}>
          {lessons && lessons.length > 0 ? lessons.map((l, i) => (
            <LessonRow key={l.id} lesson={l} lessonIdx={i}
              isActive={activeLessonId === l.id}
              onClick={() => onSelectLesson(l, node)} />
          )) : (
            <p style={{ padding:'6px 14px 6px 36px', fontSize:12, color:'#9ca3af', fontStyle:'italic' }}>
              Đang tải bài học...</p>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Lesson content panel ── */
function LessonContentPanel({ lesson, examples, miniQuizzes, activeSkillNode, onOpenTest }) {
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  let parsedQ = [];
  if (miniQuizzes.length > 0 && miniQuizzes[0].questionsJson) {
    try { parsedQ = JSON.parse(miniQuizzes[0].questionsJson); } catch (e) {}
  }
  const letters = ['A','B','C','D'];
  const mdComponents = {
    h1: ({node,...p}) => <h1 style={{fontSize:18,fontWeight:700,margin:'20px 0 8px'}} {...p}/>,
    h2: ({node,...p}) => <h2 style={{fontSize:16,fontWeight:700,margin:'18px 0 6px',paddingBottom:4,borderBottom:'1px solid #f3f4f6'}} {...p}/>,
    h3: ({node,...p}) => <h3 style={{fontSize:14,fontWeight:700,margin:'14px 0 4px'}} {...p}/>,
    p:  ({node,...p}) => <p  style={{marginBottom:10,lineHeight:1.75}} {...p}/>,
    ul: ({node,...p}) => <ul style={{listStyleType:'disc',paddingLeft:20,marginBottom:10}} {...p}/>,
    ol: ({node,...p}) => <ol style={{listStyleType:'decimal',paddingLeft:20,marginBottom:10}} {...p}/>,
    li: ({node,...p}) => <li style={{marginBottom:4}} {...p}/>,
    strong: ({node,...p}) => <strong style={{fontWeight:700,color:'#111827'}} {...p}/>,
    blockquote: ({node,...p}) => <blockquote style={{borderLeft:'3px solid #d1d5db',paddingLeft:14,color:'#6b7280',margin:'10px 0',fontStyle:'italic'}} {...p}/>,
    table: ({node,...p}) => <div style={{overflowX:'auto',margin:'14px 0',border:'1px solid #e5e7eb'}}><table style={{width:'100%',borderCollapse:'collapse',fontSize:13}} {...p}/></div>,
    thead: ({node,...p}) => <thead style={{background:'#f9fafb'}} {...p}/>,
    th: ({node,...p}) => <th style={{padding:'8px 12px',textAlign:'left',fontWeight:700,borderBottom:'1px solid #e5e7eb',fontSize:12,color:'#374151'}} {...p}/>,
    td: ({node,...p}) => <td style={{padding:'8px 12px',borderBottom:'1px solid #f3f4f6',color:'#374151'}} {...p}/>,
    code: ({node,inline,...p}) => inline
      ? <code style={{background:'#f3f4f6',padding:'1px 5px',fontFamily:'Courier New,monospace',fontSize:12}} {...p}/>
      : <pre style={{background:'#1f2937',color:'#f9fafb',padding:14,overflowX:'auto',fontSize:12,fontFamily:'Courier New,monospace',margin:'10px 0'}}><code {...p}/></pre>,
  };
  return (
    <div style={{ maxWidth:760, fontFamily: FONT }}>
      <div style={{ marginBottom:24 }}>
        <span style={{ fontSize:11, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.06em' }}>
          {activeSkillNode?.skillName}
        </span>
        <h1 style={{ fontSize:22, fontWeight:700, color:'#111827', margin:'4px 0 8px', lineHeight:1.3 }}>
          {lesson.title}
        </h1>
        {lesson.theorySummary && (
          <p style={{ fontSize:14, color:'#4b5563', lineHeight:1.65, borderLeft:'3px solid #d1d5db', paddingLeft:14, margin:'12px 0' }}>
            {lesson.theorySummary}
          </p>
        )}
      </div>
      <hr style={{ border:'none', borderTop:'1px solid #e5e7eb', marginBottom:28 }} />

      {/* Theory */}
      <section>
        <h2 style={{ fontSize:16, fontWeight:700, color:'#111827', marginBottom:14, paddingBottom:6, borderBottom:'1px solid #e5e7eb' }}>Lý thuyết</h2>
        <div style={{ fontSize:14, color:'#1f2937', lineHeight:1.75 }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{lesson.content}</ReactMarkdown>
        </div>
      </section>

      {/* Examples */}
      {examples.length > 0 && (
        <section style={{ marginTop:36 }}>
          <h2 style={{ fontSize:16, fontWeight:700, color:'#111827', marginBottom:14, paddingBottom:6, borderBottom:'1px solid #e5e7eb' }}>Ví dụ minh họa</h2>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {examples.map((ex, idx) => (
              <div key={ex.id||idx} style={{ border:'1px solid #e5e7eb', padding:'14px 18px' }}>
                <div style={{ fontSize:11, fontWeight:700, color:'#6b7280', textTransform:'uppercase', marginBottom:8 }}>
                  Ví dụ {idx+1}{ex.title ? ` — ${ex.title}` : ''}
                </div>
                <div style={{ fontSize:15, fontWeight:600, color:'#1e1b4b', fontStyle:'italic', marginBottom:8 }}>
                  "{ex.content}"
                </div>
                {ex.translation && <div style={{ fontSize:13, color:'#4b5563', marginBottom:6 }}><span style={{fontWeight:700}}>Dịch: </span>{ex.translation}</div>}
                {ex.explanation && (
                  <div style={{ fontSize:13, color:'#374151', borderTop:'1px solid #f3f4f6', paddingTop:8, marginTop:6 }}>
                    <span style={{fontWeight:700}}>Phân tích: </span>{ex.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Mini Quiz */}
      {parsedQ.length > 0 && (
        <section style={{ marginTop:36 }}>
          <h2 style={{ fontSize:16, fontWeight:700, color:'#111827', marginBottom:4, paddingBottom:6, borderBottom:'1px solid #e5e7eb' }}>Kiểm tra nhanh (Mini Quiz)</h2>
          <p style={{ fontSize:13, color:'#6b7280', marginBottom:18 }}>Hoàn thành các câu hỏi dưới đây để củng cố bài học.</p>
          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
            {parsedQ.map((q, qIdx) => {
              const sel = quizAnswers[qIdx];
              const isCorr = sel === q.answer;
              return (
                <div key={qIdx} style={{ border:'1px solid #e5e7eb', padding:'14px 18px' }}>
                  <div style={{ fontSize:14, fontWeight:600, color:'#111827', marginBottom:12, lineHeight:1.5 }}>
                    {qIdx+1}. {q.question}
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                    {q.options?.map((opt, oIdx) => {
                      const isSel = sel === opt;
                      const isCorrectOpt = opt === q.answer;
                      let bg='#fff', bdr='1px solid #d1d5db', clr='#374151';
                      if (isSel && !quizSubmitted) { bg='#eff6ff'; bdr='1px solid #3730a3'; clr='#1e1b4b'; }
                      if (quizSubmitted && isCorrectOpt) { bg='#f0fdf4'; bdr='1px solid #16a34a'; clr='#14532d'; }
                      if (quizSubmitted && isSel && !isCorrectOpt) { bg='#fef2f2'; bdr='1px solid #dc2626'; clr='#7f1d1d'; }
                      return (
                        <button key={oIdx} disabled={quizSubmitted}
                          onClick={() => { if (!quizSubmitted) setQuizAnswers(prev => ({...prev,[qIdx]:opt})); }}
                          style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 12px', background:bg, border:bdr, color:clr,
                            cursor:quizSubmitted?'default':'pointer', textAlign:'left', fontSize:13, lineHeight:1.4, fontFamily:FONT }}>
                          <span style={{fontWeight:700,color:'#6b7280',minWidth:16,fontSize:12}}>{letters[oIdx]}.</span>
                          <span style={{flex:1}}>{opt}</span>
                          {quizSubmitted && isCorrectOpt && <Check size={12} color="#16a34a" style={{flexShrink:0}}/>}
                          {quizSubmitted && isSel && !isCorrectOpt && <X size={12} color="#dc2626" style={{flexShrink:0}}/>}
                        </button>
                      );
                    })}
                  </div>
                  {quizSubmitted && (
                    <div style={{ marginTop:10, padding:'10px 12px', fontSize:13, lineHeight:1.5,
                      background: isCorr ? '#f0fdf4' : '#fffbeb',
                      border: `1px solid ${isCorr ? '#bbf7d0' : '#fde68a'}`,
                      color: isCorr ? '#14532d' : '#78350f' }}>
                      <span style={{fontWeight:700}}>{isCorr ? 'Đúng. ' : 'Chưa đúng. '}</span>{q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop:16, display:'flex', gap:12, alignItems:'center' }}>
            {!quizSubmitted ? (
              <button onClick={() => setQuizSubmitted(true)}
                disabled={Object.keys(quizAnswers).length < parsedQ.length}
                style={{ padding:'8px 18px', background:'#1f2937', color:'#fff', border:'none', fontSize:13, fontWeight:600, cursor:'pointer',
                  opacity: Object.keys(quizAnswers).length < parsedQ.length ? 0.5 : 1, fontFamily:FONT }}>
                Kiểm tra đáp án
              </button>
            ) : (
              <button onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); }}
                style={{ padding:'8px 16px', background:'#fff', color:'#374151', border:'1px solid #d1d5db', fontSize:13, cursor:'pointer',
                  display:'flex', alignItems:'center', gap:6, fontFamily:FONT }}>
                <RotateCcw size={12}/> Làm lại
              </button>
            )}
          </div>
        </section>
      )}

      {/* Skill test CTA */}
      {activeSkillNode && activeSkillNode.status !== 'LOCKED' && (
        <div style={{ marginTop:48, paddingTop:24, borderTop:'1px solid #e5e7eb' }}>
          <p style={{ fontSize:13, color:'#6b7280', marginBottom:12 }}>
            Đã nắm vững bài học? Làm bài kiểm tra kỹ năng để mở khóa kỹ năng tiếp theo.
          </p>
          <button onClick={() => onOpenTest(activeSkillNode)}
            style={{ padding:'10px 22px', background:'#1f2937', color:'#fff', border:'none', fontSize:13, fontWeight:600, cursor:'pointer',
              display:'inline-flex', alignItems:'center', gap:8, fontFamily:FONT }}>
            <Award size={14}/> Bài kiểm tra kỹ năng: {activeSkillNode.skillName}
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Overview panel ── */
function OverviewPanel({ nodes }) {
  const done = nodes.filter(n => n.status === 'COMPLETED').length;
  const pct = nodes.length > 0 ? Math.round((done / nodes.length) * 100) : 0;
  return (
    <div style={{ maxWidth:600, fontFamily:FONT }}>
      <h1 style={{ fontSize:22, fontWeight:700, color:'#111827', marginBottom:8 }}>Lộ trình Tiếng Anh THPT</h1>
      <p style={{ fontSize:14, color:'#6b7280', marginBottom:24, lineHeight:1.65 }}>
        Lộ trình được AI cá nhân hóa dựa trên kết quả khảo sát. Chọn một kỹ năng ở sidebar bên trái để bắt đầu.
      </p>
      <div style={{ marginBottom:28 }}>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'#374151', marginBottom:6 }}>
          <span>Tiến độ hoàn thành</span>
          <span style={{fontWeight:700}}>{done} / {nodes.length} kỹ năng ({pct}%)</span>
        </div>
        <div style={{ height:6, background:'#e5e7eb', width:'100%' }}>
          <div style={{ height:'100%', width:`${pct}%`, background:'#374151', transition:'width 0.5s' }}/>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:28 }}>
        {[
          {label:'Tổng kỹ năng', value:nodes.length},
          {label:'Đã hoàn thành', value:done},
          {label:'Cần củng cố', value:nodes.filter(n=>n.proficiencyLevel==='NEEDS_IMPROVEMENT').length},
        ].map(s => (
          <div key={s.label} style={{ border:'1px solid #e5e7eb', padding:'14px 16px' }}>
            <div style={{ fontSize:22, fontWeight:700, color:'#111827' }}>{s.value}</div>
            <div style={{ fontSize:12, color:'#6b7280', marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ borderTop:'1px solid #e5e7eb', paddingTop:20 }}>
        <Link to="/assessment/placement"
          style={{ fontSize:13, color:'#9ca3af', display:'inline-flex', alignItems:'center', gap:6, textDecoration:'none' }}>
          <RotateCcw size={11}/> Làm lại bài khảo sát để tái cấu trúc lộ trình
        </Link>
      </div>
    </div>
  );
}

/* ── Skill Test Modal ── */
function SkillTestModal({ node, onClose, userId, fetchStudyPath }) {
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [activeTest, setActiveTest] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const letters = ['A','B','C','D'];

  useEffect(() => {
    assessmentService.getSkillTestHistory(userId, node.skillId)
      .then(h => setHistory(h||[])).catch(()=>{}).finally(()=>setLoadingHistory(false));
  }, [node.skillId]);

  useEffect(() => {
    if (!activeTest || result || timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft(p => { if(p<=1){clearInterval(t);handleSubmit();return 0;} return p-1; }), 1000);
    return () => clearInterval(t);
  }, [activeTest, result]);

  const handleStart = async () => {
    try {
      const test = await assessmentService.generateSkillTest(node.skillId, node.skillName, ENGLISH_SUBJECT_ID, userId);
      setActiveTest(test); setTimeLeft((test.totalQuestions||5)*60); setAnswers({}); setResult(null);
    } catch { alert('Không thể tạo bài kiểm tra.'); }
  };

  const handleSubmit = async () => {
    if (!activeTest?.attemptId || submitting || result) return;
    setSubmitting(true);
    try {
      const al = Object.entries(answers).map(([questionId,selectedOptionId])=>({questionId,selectedOptionId}));
      const res = await assessmentService.submitAssessment(activeTest.attemptId, al);
      setResult(res);
      if (res.isPassed) { await adaptiveService.unlockNextSkill(userId,ENGLISH_SUBJECT_ID,node.skillId); fetchStudyPath(); }
      const h = await assessmentService.getSkillTestHistory(userId, node.skillId);
      setHistory(h||[]);
    } catch { alert('Có lỗi khi nộp bài.'); }
    finally { setSubmitting(false); }
  };

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  return (
    <div style={{ position:'fixed', inset:0, zIndex:50, background:'rgba(0,0,0,0.45)', display:'flex',
      alignItems:'center', justifyContent:'center', padding:16, overflowY:'auto' }}>
      <div style={{ background:'#fff', border:'1px solid #e5e7eb', maxWidth:680, width:'100%',
        padding:'28px 32px', maxHeight:'90vh', overflowY:'auto', fontFamily:FONT }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start',
          marginBottom:20, paddingBottom:16, borderBottom:'1px solid #e5e7eb' }}>
          <div>
            <div style={{ fontSize:11, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>
              Bài kiểm tra kỹ năng
            </div>
            <h3 style={{ fontSize:18, fontWeight:700, color:'#111827' }}>{node.skillName}</h3>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#6b7280' }}><X size={18}/></button>
        </div>

        {activeTest && !result && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20,
              padding:'10px 14px', background:'#f9fafb', border:'1px solid #e5e7eb' }}>
              <span style={{ fontSize:13, color:'#374151' }}>1 phút/câu · Cần đạt 70% để mở khóa</span>
              <span style={{ fontFamily:'Courier New,monospace', fontSize:16, fontWeight:700, color:timeLeft<60?'#dc2626':'#111827' }}>{fmt(timeLeft)}</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {activeTest.questions?.map((q, idx) => (
                <div key={q.id||idx} style={{ border:'1px solid #e5e7eb', padding:16 }}>
                  <div style={{ fontSize:14, fontWeight:600, color:'#111827', marginBottom:12, lineHeight:1.5 }}>
                    {idx+1}. {q.content}
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                    {q.options?.map((opt, oIdx) => {
                      const isSel = answers[q.questionId]===opt.id;
                      return (
                        <button key={opt.id} onClick={()=>setAnswers(p=>({...p,[q.questionId]:opt.id}))}
                          style={{ padding:'9px 12px', textAlign:'left', fontSize:13,
                            background:isSel?'#1f2937':'#fff', color:isSel?'#fff':'#374151',
                            border:`1px solid ${isSel?'#1f2937':'#d1d5db'}`, cursor:'pointer',
                            display:'flex', alignItems:'center', gap:8, fontFamily:FONT }}>
                          <span style={{ fontWeight:700, fontSize:12, minWidth:16 }}>{letters[oIdx]}.</span>
                          <span>{opt.optionContent}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:20, display:'flex', justifyContent:'flex-end', gap:10 }}>
              <button onClick={()=>setActiveTest(null)} style={{ padding:'8px 16px', border:'1px solid #d1d5db', background:'#fff', fontSize:13, cursor:'pointer', fontFamily:FONT }}>Hủy</button>
              <button onClick={handleSubmit} disabled={submitting}
                style={{ padding:'8px 20px', background:'#1f2937', color:'#fff', border:'none', fontSize:13, fontWeight:600, cursor:'pointer', opacity:submitting?0.7:1, fontFamily:FONT }}>
                {submitting ? 'Đang chấm...' : 'Nộp bài'}
              </button>
            </div>
          </div>
        )}

        {result && (
          <div style={{ textAlign:'center', padding:'16px 0' }}>
            <div style={{ fontSize:52, marginBottom:12, lineHeight:1 }}>{result.isPassed ? '✓' : '○'}</div>
            <h4 style={{ fontSize:18, fontWeight:700, color:'#111827', marginBottom:8 }}>
              {result.isPassed ? 'Đạt — Kỹ năng tiếp theo đã mở khóa' : 'Chưa đạt (cần từ 70%)'}
            </h4>
            <p style={{ fontSize:13, color:'#6b7280', marginBottom:20 }}>
              {result.score}/{result.totalQuestions} câu đúng ({result.accuracyPercentage}%)
            </p>
            <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
              <button onClick={handleStart} style={{ padding:'8px 16px', border:'1px solid #d1d5db', background:'#fff', fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontFamily:FONT }}>
                <RotateCcw size={12}/> Làm lại
              </button>
              <button onClick={onClose} style={{ padding:'8px 20px', background:'#1f2937', color:'#fff', border:'none', fontSize:13, cursor:'pointer', fontFamily:FONT }}>Đóng</button>
            </div>
          </div>
        )}

        {!activeTest && !result && (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:24 }}>
              <div style={{ border:'1px solid #e5e7eb', padding:'14px 16px' }}>
                <div style={{ fontSize:12, color:'#6b7280', marginBottom:4 }}>Thời gian</div>
                <div style={{ fontSize:15, fontWeight:700, color:'#111827' }}>5 câu · 1 phút/câu</div>
              </div>
              <div style={{ border:'1px solid #e5e7eb', padding:'14px 16px' }}>
                <div style={{ fontSize:12, color:'#6b7280', marginBottom:4 }}>Điều kiện mở khóa</div>
                <div style={{ fontSize:15, fontWeight:700, color:'#111827' }}>Đạt từ 70%</div>
              </div>
            </div>
            <div style={{ marginBottom:24 }}>
              <h4 style={{ fontSize:13, fontWeight:700, color:'#374151', marginBottom:10 }}>
                Lịch sử làm bài ({history.length} lần)
              </h4>
              {loadingHistory ? <p style={{fontSize:13,color:'#9ca3af'}}>Đang tải...</p>
               : history.length === 0
               ? <p style={{fontSize:13,color:'#9ca3af',fontStyle:'italic'}}>Chưa có lần làm bài nào.</p>
               : (
                <div style={{ maxHeight:160, overflowY:'auto', border:'1px solid #e5e7eb' }}>
                  {history.map((att, i) => (
                    <div key={att.attemptId||i} style={{ display:'flex', justifyContent:'space-between', padding:'8px 12px',
                      borderBottom: i < history.length-1 ? '1px solid #f3f4f6' : 'none', fontSize:13 }}>
                      <span style={{color:'#374151'}}>Lần {history.length-i}: {att.score}/{att.totalQuestions} ({att.accuracyPercentage}%)</span>
                      <span style={{fontWeight:700,color:att.isPassed?'#15803d':'#b91c1c'}}>{att.isPassed?'Đạt':'Chưa đạt'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display:'flex', justifyContent:'flex-end', gap:10 }}>
              <button onClick={onClose} style={{ padding:'8px 16px', border:'1px solid #d1d5db', background:'#fff', fontSize:13, cursor:'pointer', fontFamily:FONT }}>Đóng</button>
              <button onClick={handleStart}
                style={{ padding:'8px 22px', background:'#1f2937', color:'#fff', border:'none', fontSize:13, fontWeight:600, cursor:'pointer',
                  display:'flex', alignItems:'center', gap:8, fontFamily:FONT }}>
                <Play size={13}/> Bắt đầu kiểm tra
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── MAIN PAGE ── */
export default function StudyPathRoadmapPage() {
  const { user } = useAuth();
  const [studyPath, setStudyPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lessonsBySkill, setLessonsBySkill] = useState({});
  const [expandedSkills, setExpandedSkills] = useState(new Set());

  const [activeLessonId, setActiveLessonId] = useState(null);
  const [activeLessonData, setActiveLessonData] = useState(null);
  const [activeExamples, setActiveExamples] = useState([]);
  const [activeMiniQuizzes, setActiveMiniQuizzes] = useState([]);
  const [activeSkillNode, setActiveSkillNode] = useState(null);
  const [loadingLesson, setLoadingLesson] = useState(false);
  const [testModalNode, setTestModalNode] = useState(null);

  const fetchStudyPath = async () => {
    if (!user?.userId) return;
    try {
      setLoading(true);
      const pathData = await adaptiveService.getMyStudyPath(user.userId, ENGLISH_SUBJECT_ID);
      setStudyPath(pathData);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStudyPath(); }, [user?.userId]);

  useEffect(() => {
    if (!studyPath?.nodes) return;
    const u = studyPath.nodes.find(n => n.status === 'UNLOCKED');
    if (u) { setExpandedSkills(new Set([u.skillId])); loadLessons(u.skillId); }
  }, [studyPath]);

  const loadLessons = async (skillId) => {
    if (!skillId || lessonsBySkill[skillId]) return;
    try {
      const lessons = await contentService.getLessons(skillId);
      setLessonsBySkill(prev => ({...prev, [skillId]: lessons}));
    } catch (err) { console.error(err); }
  };

  const handleToggleSkill = async (skillId) => {
    setExpandedSkills(prev => { const n = new Set(prev); n.has(skillId) ? n.delete(skillId) : n.add(skillId); return n; });
    await loadLessons(skillId);
  };

  const handleSelectLesson = async (lesson, node) => {
    if (activeLessonId === lesson.id) return;
    setActiveLessonId(lesson.id); setActiveSkillNode(node);
    setActiveLessonData(null); setActiveExamples([]); setActiveMiniQuizzes([]);
    setLoadingLesson(true);
    try {
      const data = await contentService.getLesson(lesson.id);
      setActiveLessonData(data);
      if (data?.examples) setActiveExamples(data.examples);
      if (data?.miniQuizzes) setActiveMiniQuizzes(data.miniQuizzes);
    } catch (err) { console.error(err); }
    finally { setLoadingLesson(false); }
  };

  if (loading && !studyPath) {
    return (
      <div style={{ display:'flex', justifyContent:'center', alignItems:'center', padding:'80px 0', flexDirection:'column', gap:12 }}>
        <div style={{ width:32, height:32, border:'3px solid #d1d5db', borderTopColor:'#374151', borderRadius:'50%' }} className="animate-spin"/>
        <p style={{ fontSize:13, color:'#6b7280', fontFamily:FONT }}>Đang tải lộ trình học...</p>
      </div>
    );
  }

  if (!studyPath || !studyPath.nodes || studyPath.nodes.length === 0) {
    return (
      <div style={{ maxWidth:480, margin:'80px auto', textAlign:'center', fontFamily:FONT }}>
        <h2 style={{ fontSize:20, fontWeight:700, color:'#111827', marginBottom:12 }}>Chưa có lộ trình học cho môn Tiếng Anh</h2>
        <p style={{ fontSize:14, color:'#6b7280', lineHeight:1.65, marginBottom:24 }}>
          Thực hiện bài khảo sát đánh giá năng lực để hệ thống AI tự động sắp xếp lộ trình phù hợp.
        </p>
        <Link to="/assessment/placement"
          style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'10px 22px', background:'#1f2937', color:'#fff', fontSize:14, fontWeight:600, textDecoration:'none', fontFamily:FONT }}>
          Bắt đầu bài khảo sát năng lực
        </Link>
      </div>
    );
  }

  const nodes = studyPath.nodes || [];
  const done = nodes.filter(n => n.status === 'COMPLETED').length;
  const pct = Math.round((done / nodes.length) * 100);

  return (
    <div style={{ display:'flex', width:'100%', height:'calc(100vh - 64px)', fontFamily:FONT, overflow:'hidden' }}>
      {/* SIDEBAR */}
      <aside style={{ width:290, minWidth:290, borderRight:'1px solid #e5e7eb', background:'#fff',
        display:'flex', flexDirection:'column', height:'100%', overflowY:'auto' }}>
        <div style={{ padding:'18px 16px 14px', borderBottom:'1px solid #e5e7eb', flexShrink:0 }}>
          <div style={{ fontSize:10, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>
            Lộ trình học
          </div>
          <h2 style={{ fontSize:14, fontWeight:700, color:'#111827', marginBottom:12, lineHeight:1.3 }}>
            Tiếng Anh THPT
          </h2>
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#6b7280', marginBottom:4 }}>
              <span>{done}/{nodes.length} kỹ năng</span><span>{pct}%</span>
            </div>
            <div style={{ height:4, background:'#e5e7eb', width:'100%' }}>
              <div style={{ height:'100%', width:`${pct}%`, background:'#374151', transition:'width 0.5s' }}/>
            </div>
          </div>
        </div>

        <div style={{ flex:1, overflowY:'auto' }}>
          {nodes.map((node, idx) => (
            <SkillGroup key={node.id||idx} node={node}
              lessons={lessonsBySkill[node.skillId]}
              expandedSkills={expandedSkills}
              onToggleSkill={handleToggleSkill}
              activeLessonId={activeLessonId}
              onSelectLesson={handleSelectLesson}
            />
          ))}
        </div>

        <div style={{ padding:'10px 16px', borderTop:'1px solid #e5e7eb', flexShrink:0 }}>
          <Link to="/assessment/placement"
            style={{ fontSize:11, color:'#9ca3af', display:'flex', alignItems:'center', gap:6, textDecoration:'none' }}>
            <RotateCcw size={10}/> Làm lại bài khảo sát
          </Link>
        </div>
      </aside>

      {/* CONTENT PANEL */}
      <div style={{ flex:1, padding:'32px 40px', background:'#fafafa', overflowY:'auto', height:'100%' }}>
        {loadingLesson ? (
          <div style={{ display:'flex', justifyContent:'center', alignItems:'center', padding:'80px 0', flexDirection:'column', gap:12 }}>
            <div style={{ width:28, height:28, border:'3px solid #d1d5db', borderTopColor:'#374151', borderRadius:'50%' }} className="animate-spin"/>
            <p style={{ fontSize:13, color:'#6b7280' }}>Đang tải nội dung bài học...</p>
          </div>
        ) : activeLessonData ? (
          <LessonContentPanel lesson={activeLessonData} examples={activeExamples}
            miniQuizzes={activeMiniQuizzes} activeSkillNode={activeSkillNode} onOpenTest={setTestModalNode}/>
        ) : (
          <OverviewPanel nodes={nodes}/>
        )}
      </div>

      {testModalNode && (
        <SkillTestModal node={testModalNode} onClose={() => setTestModalNode(null)}
          userId={user.userId} fetchStudyPath={fetchStudyPath}/>
      )}
    </div>
  );
}

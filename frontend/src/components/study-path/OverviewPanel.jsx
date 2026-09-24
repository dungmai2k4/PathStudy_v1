import React from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, Award } from 'lucide-react';
import { FONT } from './studyPathConstants';

/* ── Overview panel ── */
export default function OverviewPanel({ nodes, subject, onOpenCourseTest, allCompleted }) {
  const done = nodes.filter(n => n.status === 'COMPLETED').length;
  const pct = nodes.length > 0 ? Math.round((done / nodes.length) * 100) : 0;
  const subjectName = subject?.name || 'môn học';

  // Count unique modules dynamically
  const uniqueModules = new Set(nodes.map(n => n.moduleName || n.moduleId).filter(Boolean));
  const moduleCount = uniqueModules.size || 1;

  return (
    <div style={{ maxWidth: 640, fontFamily: FONT }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
        Lộ trình học {subjectName} theo Module & Chủ đề
      </h1>
      <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 20, lineHeight: 1.65 }}>
        Môn học gồm {moduleCount} khối kiến thức (Module). Trong mỗi module có các chủ đề (Topic) bài học. Bạn cần hoàn thành tuần tự từng bài học và quiz để mở khóa bài học kế tiếp.
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
              {allCompleted ? '✓ Đủ điều kiện dự thi' : 'Khóa'} · Đánh giá tổng thể
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

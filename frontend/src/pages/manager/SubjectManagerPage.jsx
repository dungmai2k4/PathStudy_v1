import React, { useState, useEffect } from 'react';
import managerService from '../../services/managerService';
import { 
  BookOpen, Plus, Layers, BookMarked, RefreshCw, 
  Edit, Trash2, CheckCircle, AlertCircle, X, ChevronRight 
} from 'lucide-react';

export default function SubjectManagerPage() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [lessons, setLessons] = useState([]);

  const [loading, setLoading] = useState(true);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Modals
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);

  // Forms
  const [subjectForm, setSubjectForm] = useState({ code: '', name: '', description: '' });
  const [skillForm, setSkillForm] = useState({ code: '', name: '', description: '' });
  const [lessonForm, setLessonForm] = useState({ title: '', content: '', isRemedial: false });

  const loadSubjects = async () => {
    setLoading(true);
    try {
      const data = await managerService.getSubjects();
      setSubjects(data || []);
      if (data && data.length > 0 && !selectedSubject) {
        handleSelectSubject(data[0]);
      }
    } catch (err) {
      console.error('Lỗi tải môn học:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const handleSelectSubject = async (subject) => {
    setSelectedSubject(subject);
    setSelectedSkill(null);
    setLessons([]);
    setSkillsLoading(true);
    try {
      const data = await managerService.getSkillsBySubject(subject.id);
      setSkills(data || []);
      if (data && data.length > 0) {
        handleSelectSkill(data[0]);
      }
    } catch (err) {
      console.error('Lỗi tải kỹ năng:', err);
    } finally {
      setSkillsLoading(false);
    }
  };

  const handleSelectSkill = async (skill) => {
    setSelectedSkill(skill);
    setLessonsLoading(true);
    try {
      const data = await managerService.getLessonsBySkill(skill.id);
      setLessons(data || []);
    } catch (err) {
      console.error('Lỗi tải bài học:', err);
    } finally {
      setLessonsLoading(false);
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    try {
      await managerService.createSubject(subjectForm);
      setIsSubjectModalOpen(false);
      setSubjectForm({ code: '', name: '', description: '' });
      setSuccessMsg('Tạo môn học thành công!');
      setTimeout(() => setSuccessMsg(''), 4000);
      loadSubjects();
    } catch (err) {
      alert('Lỗi tạo môn học: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCreateSkill = async (e) => {
    e.preventDefault();
    if (!selectedSubject) return;
    try {
      await managerService.createSkill({
        subjectId: selectedSubject.id,
        code: skillForm.code,
        name: skillForm.name,
        description: skillForm.description,
      });
      setIsSkillModalOpen(false);
      setSkillForm({ code: '', name: '', description: '' });
      setSuccessMsg('Thêm kỹ năng thành công!');
      setTimeout(() => setSuccessMsg(''), 4000);
      // reload skills
      const updated = await managerService.getSkillsBySubject(selectedSubject.id);
      setSkills(updated || []);
    } catch (err) {
      alert('Lỗi thêm kỹ năng: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    if (!selectedSkill) return;
    try {
      await managerService.createLesson({
        skillId: selectedSkill.id,
        title: lessonForm.title,
        content: lessonForm.content,
        isRemedial: lessonForm.isRemedial,
      });
      setIsLessonModalOpen(false);
      setLessonForm({ title: '', content: '', isRemedial: false });
      setSuccessMsg('Thêm bài học thành công!');
      setTimeout(() => setSuccessMsg(''), 4000);
      // reload lessons
      const updated = await managerService.getLessonsBySkill(selectedSkill.id);
      setLessons(updated || []);
    } catch (err) {
      alert('Lỗi thêm bài học: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-indigo-600" />
            <span>Quản lý Môn học, Kỹ năng & Bài giảng</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Biên tập cây kiến thức thích ứng và tổ chức bài học theo từng kỹ năng môn học
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSubjectModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Môn học</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-medium text-emerald-800 flex items-center gap-2 shadow-2xs">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 3-Column Hierarchy View */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Column 1: Subjects List */}
        <div className="md:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Môn học ({subjects.length})</span>
            </div>
          </div>

          <div className="space-y-1.5">
            {loading ? (
              <div className="p-6 text-center text-xs text-slate-400">Đang tải môn học...</div>
            ) : subjects.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">Chưa có môn học nào.</div>
            ) : (
              subjects.map((sub) => {
                const isSelected = selectedSubject?.id === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => handleSelectSubject(sub)}
                    className={`w-full text-left p-3 rounded-xl text-sm transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-50/80 text-indigo-700 font-semibold border border-indigo-200 shadow-2xs'
                        : 'text-slate-700 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <div>
                      <div className="truncate">{sub.name}</div>
                      <div className="text-xs text-slate-400 font-normal">{sub.code} • {sub.skillCount || 0} kỹ năng</div>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-300'}`} />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Column 2: Skills of Selected Subject */}
        <div className="md:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Kỹ năng: {selectedSubject?.name || '...'}</span>
            </div>
            {selectedSubject && (
              <button
                onClick={() => setIsSkillModalOpen(true)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm</span>
              </button>
            )}
          </div>

          <div className="space-y-1.5 max-h-[600px] overflow-y-auto">
            {skillsLoading ? (
              <div className="p-6 text-center text-xs text-slate-400">Đang tải kỹ năng...</div>
            ) : skills.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">Môn học này chưa có kỹ năng nào. Bấm Thêm để tạo kỹ năng mới.</div>
            ) : (
              skills.map((skl) => {
                const isSelected = selectedSkill?.id === skl.id;
                return (
                  <button
                    key={skl.id}
                    onClick={() => handleSelectSkill(skl)}
                    className={`w-full text-left p-3 rounded-xl text-sm transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50/80 text-blue-700 font-semibold border border-blue-200 shadow-2xs'
                        : 'text-slate-700 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <div>
                      <div className="truncate">{skl.name}</div>
                      <div className="text-xs text-slate-400 font-normal">Mã: {skl.code}</div>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-300'}`} />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Column 3: Lessons of Selected Skill */}
        <div className="md:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <BookMarked className="w-4 h-4 text-purple-600" />
              <span>Bài học: {selectedSkill?.name || '...'}</span>
            </div>
            {selectedSkill && (
              <button
                onClick={() => setIsLessonModalOpen(true)}
                className="text-xs font-semibold text-purple-600 hover:text-purple-700 inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm bài học</span>
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {lessonsLoading ? (
              <div className="p-6 text-center text-xs text-slate-400">Đang tải bài học...</div>
            ) : lessons.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">Kỹ năng này chưa có bài học nào.</div>
            ) : (
              lessons.map((les) => (
                <div key={les.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm text-slate-900">{les.title}</h4>
                    {les.isRemedial && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        BỔ TRỢ
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {les.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal Create Subject */}
      {isSubjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">Thêm Môn học mới</h3>
              <button onClick={() => setIsSubjectModalOpen(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateSubject} className="py-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mã môn học *</label>
                <input
                  type="text"
                  required
                  placeholder="ví dụ: MATH, PHYSICS, CHEMISTRY"
                  value={subjectForm.code}
                  onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tên môn học *</label>
                <input
                  type="text"
                  required
                  placeholder="ví dụ: Toán học 10"
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả môn học</label>
                <textarea
                  rows={3}
                  placeholder="Mô tả nội dung chương trình học..."
                  value={subjectForm.description}
                  onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSubjectModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs"
                >
                  Tạo môn học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Create Skill */}
      {isSkillModalOpen && selectedSubject && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">Thêm Kỹ năng cho {selectedSubject.name}</h3>
              <button onClick={() => setIsSkillModalOpen(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateSkill} className="py-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mã kỹ năng *</label>
                <input
                  type="text"
                  required
                  placeholder="ví dụ: ENG_VOCAB_B1, MATH_ALGEBRA_10"
                  value={skillForm.code}
                  onChange={(e) => setSkillForm({ ...skillForm, code: e.target.value })}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tên kỹ năng *</label>
                <input
                  type="text"
                  required
                  placeholder="ví dụ: Từ vựng chủ đề Giáo dục"
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả năng lực</label>
                <textarea
                  rows={3}
                  placeholder="Mô tả chuẩn đầu ra năng lực của kỹ năng này..."
                  value={skillForm.description}
                  onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSkillModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs"
                >
                  Lưu kỹ năng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Create Lesson */}
      {isLessonModalOpen && selectedSkill && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">Thêm Bài học cho {selectedSkill.name}</h3>
              <button onClick={() => setIsLessonModalOpen(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateLesson} className="py-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tiêu đề bài học *</label>
                <input
                  type="text"
                  required
                  placeholder="ví dụ: Cấu trúc câu điều kiện loại 1 & 2"
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nội dung bài học *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Nội dung lý thuyết trọng tâm..."
                  value={lessonForm.content}
                  onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-xs"
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="remedial"
                  checked={lessonForm.isRemedial}
                  onChange={(e) => setLessonForm({ ...lessonForm, isRemedial: e.target.checked })}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="remedial" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Đây là bài học bổ trợ (Remedial Learning) khi học sinh yếu kỹ năng
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLessonModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-xs"
                >
                  Lưu bài học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

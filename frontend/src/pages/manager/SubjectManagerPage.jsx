import React, { useState, useEffect } from 'react';
import managerService from '../../services/managerService';
import { 
  BookOpen, Plus, Layers, BookMarked, FolderTree,
  CheckCircle, X, ChevronRight, Hash
} from 'lucide-react';

export default function SubjectManagerPage() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [lessons, setLessons] = useState([]);

  const [loading, setLoading] = useState(true);
  const [modulesLoading, setModulesLoading] = useState(false);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Modals
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);

  // Forms
  const [gradeFilter, setGradeFilter] = useState('ALL');
  const [subjectForm, setSubjectForm] = useState({ code: '', name: '', description: '', grade: '' });
  const [moduleForm, setModuleForm] = useState({ code: '', name: '', description: '' });
  const [topicForm, setTopicForm] = useState({ code: '', name: '', description: '' });
  const [lessonForm, setLessonForm] = useState({ title: '', content: '', isRemedial: false });

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // ===== Load subjects =====
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

  // ===== Select subject → load modules =====
  const handleSelectSubject = async (subject) => {
    setSelectedSubject(subject);
    setSelectedModule(null);
    setSelectedTopic(null);
    setTopics([]);
    setLessons([]);
    setModulesLoading(true);
    try {
      const data = await managerService.getModulesBySubject(subject.id);
      setModules(data || []);
      if (data && data.length > 0) {
        handleSelectModule(data[0]);
      }
    } catch (err) {
      console.error('Lỗi tải module:', err);
      setModules([]);
    } finally {
      setModulesLoading(false);
    }
  };

  // ===== Select module → load topics =====
  const handleSelectModule = async (mod) => {
    setSelectedModule(mod);
    setSelectedTopic(null);
    setLessons([]);
    setTopicsLoading(true);
    try {
      // Module DTO from backend already includes topics array
      let topicList = mod.topics;
      if (!topicList || topicList.length === 0) {
        topicList = await managerService.getTopicsByModule(mod.id);
      }
      setTopics(topicList || []);
      if (topicList && topicList.length > 0) {
        handleSelectTopic(topicList[0]);
      }
    } catch (err) {
      console.error('Lỗi tải topic:', err);
      setTopics([]);
    } finally {
      setTopicsLoading(false);
    }
  };

  // ===== Select topic → load lessons =====
  const handleSelectTopic = async (topic) => {
    setSelectedTopic(topic);
    setLessonsLoading(true);
    try {
      // Topic DTO may already include lessons
      let lessonList = topic.lessons;
      if (!lessonList || lessonList.length === 0) {
        lessonList = await managerService.getLessonsByTopic(topic.id);
      }
      setLessons(lessonList || []);
    } catch (err) {
      console.error('Lỗi tải bài học:', err);
      setLessons([]);
    } finally {
      setLessonsLoading(false);
    }
  };

  // ===== CRUD handlers =====
  const handleCreateSubject = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...subjectForm,
        grade: subjectForm.grade ? parseInt(subjectForm.grade, 10) : null,
      };
      await managerService.createSubject(payload);
      setIsSubjectModalOpen(false);
      setSubjectForm({ code: '', name: '', description: '', grade: '' });
      showSuccess('Tạo môn học thành công!');
      loadSubjects();
    } catch (err) {
      alert('Lỗi tạo môn học: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCreateModule = async (e) => {
    e.preventDefault();
    if (!selectedSubject) return;
    try {
      await managerService.createModule({
        subjectId: selectedSubject.id,
        code: moduleForm.code,
        name: moduleForm.name,
        description: moduleForm.description,
      });
      setIsModuleModalOpen(false);
      setModuleForm({ code: '', name: '', description: '' });
      showSuccess('Tạo module thành công!');
      // Reload modules
      const updated = await managerService.getModulesBySubject(selectedSubject.id);
      setModules(updated || []);
    } catch (err) {
      alert('Lỗi tạo module: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    if (!selectedModule) return;
    try {
      await managerService.createTopic({
        moduleId: selectedModule.id,
        code: topicForm.code,
        name: topicForm.name,
        description: topicForm.description,
      });
      setIsTopicModalOpen(false);
      setTopicForm({ code: '', name: '', description: '' });
      showSuccess('Tạo topic thành công!');
      // Reload topics
      const updated = await managerService.getTopicsByModule(selectedModule.id);
      setTopics(updated || []);
    } catch (err) {
      alert('Lỗi tạo topic: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    if (!selectedTopic) return;
    try {
      await managerService.createLesson({
        topicId: selectedTopic.id,
        title: lessonForm.title,
        content: lessonForm.content,
        isRemedial: lessonForm.isRemedial,
      });
      setIsLessonModalOpen(false);
      setLessonForm({ title: '', content: '', isRemedial: false });
      showSuccess('Thêm bài học thành công!');
      // Reload lessons
      const updated = await managerService.getLessonsByTopic(selectedTopic.id);
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
            <span>Quản lý Môn học, Module, Topic &amp; Bài giảng</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Biên tập cây kiến thức theo cấu trúc: Môn học → Module → Topic → Bài học
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

      {/* 4-Column Hierarchy View */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
        {/* Column 1: Subjects List */}
        <div className="md:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-2xs p-3 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>Môn học ({subjects.filter(s => gradeFilter === 'ALL' || (gradeFilter === 'NONE' ? !s.grade : s.grade === parseInt(gradeFilter, 10))).length})</span>
            </div>
            <button
              onClick={() => setIsSubjectModalOpen(true)}
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-0.5"
            >
              <Plus className="w-3 h-3" />
              <span>Thêm</span>
            </button>
          </div>

          {/* Quick Grade Filter */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px]">
            {[
              { id: 'ALL', label: 'Tất cả' },
              { id: '10', label: 'K10' },
              { id: '11', label: 'K11' },
              { id: '12', label: 'K12' },
              { id: 'NONE', label: 'Chung' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setGradeFilter(f.id)}
                className={`px-2 py-0.5 rounded-md font-semibold transition cursor-pointer shrink-0 ${
                  gradeFilter === f.id
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="space-y-1">
            {loading ? (
              <div className="p-4 text-center text-xs text-slate-400">Đang tải...</div>
            ) : subjects.filter(s => gradeFilter === 'ALL' || (gradeFilter === 'NONE' ? !s.grade : s.grade === parseInt(gradeFilter, 10))).length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">Không có môn học phù hợp.</div>
            ) : (
              subjects
                .filter(s => gradeFilter === 'ALL' || (gradeFilter === 'NONE' ? !s.grade : s.grade === parseInt(gradeFilter, 10)))
                .map((sub) => {
                  const isSelected = selectedSubject?.id === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => handleSelectSubject(sub)}
                      className={`w-full text-left p-2.5 rounded-xl text-sm transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-indigo-50/80 text-indigo-700 font-semibold border border-indigo-200 shadow-2xs'
                          : 'text-slate-700 hover:bg-slate-50 font-medium'
                      }`}
                    >
                      <div className="min-w-0 pr-1">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate text-[13px]">{sub.name}</span>
                          {sub.grade ? (
                            <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-indigo-100 text-indigo-700 border border-indigo-200 shrink-0">
                              K{sub.grade}
                            </span>
                          ) : (
                            <span className="px-1 py-0.2 rounded text-[9px] font-medium bg-slate-100 text-slate-500 border border-slate-200 shrink-0">
                              Chung
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal">{sub.code}</div>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-300'}`} />
                    </button>
                  );
                })
            )}
          </div>
        </div>

        {/* Column 2: Modules */}
        <div className="md:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-2xs p-3 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Module: {selectedSubject?.name || '...'}</span>
            </div>
            {selectedSubject && (
              <button
                onClick={() => setIsModuleModalOpen(true)}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-0.5"
              >
                <Plus className="w-3 h-3" />
                <span>Thêm</span>
              </button>
            )}
          </div>

          <div className="space-y-1 max-h-[600px] overflow-y-auto">
            {modulesLoading ? (
              <div className="p-4 text-center text-xs text-slate-400">Đang tải module...</div>
            ) : !selectedSubject ? (
              <div className="p-4 text-center text-xs text-slate-400">Chọn một môn học bên trái.</div>
            ) : modules.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">Môn học này chưa có module. Bấm Thêm để tạo.</div>
            ) : (
              modules.map((mod) => {
                const isSelected = selectedModule?.id === mod.id;
                return (
                  <button
                    key={mod.id}
                    onClick={() => handleSelectModule(mod)}
                    className={`w-full text-left p-2.5 rounded-xl text-sm transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50/80 text-blue-700 font-semibold border border-blue-200 shadow-2xs'
                        : 'text-slate-700 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="truncate text-[13px]">{mod.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal flex items-center gap-1">
                        <Hash className="w-2.5 h-2.5" />
                        {mod.code}
                        {mod.topics && <span> • {mod.topics.length} topic</span>}
                      </div>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-300'}`} />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Column 3: Topics */}
        <div className="md:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-2xs p-3 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <FolderTree className="w-3.5 h-3.5 text-violet-600" />
              <span>Topic: {selectedModule?.name || '...'}</span>
            </div>
            {selectedModule && (
              <button
                onClick={() => setIsTopicModalOpen(true)}
                className="text-[11px] font-semibold text-violet-600 hover:text-violet-700 inline-flex items-center gap-0.5"
              >
                <Plus className="w-3 h-3" />
                <span>Thêm</span>
              </button>
            )}
          </div>

          <div className="space-y-1 max-h-[600px] overflow-y-auto">
            {topicsLoading ? (
              <div className="p-4 text-center text-xs text-slate-400">Đang tải topic...</div>
            ) : !selectedModule ? (
              <div className="p-4 text-center text-xs text-slate-400">Chọn một module bên trái.</div>
            ) : topics.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">Module này chưa có topic. Bấm Thêm để tạo.</div>
            ) : (
              topics.map((topic) => {
                const isSelected = selectedTopic?.id === topic.id;
                return (
                  <button
                    key={topic.id}
                    onClick={() => handleSelectTopic(topic)}
                    className={`w-full text-left p-2.5 rounded-xl text-sm transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-violet-50/80 text-violet-700 font-semibold border border-violet-200 shadow-2xs'
                        : 'text-slate-700 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="truncate text-[13px]">{topic.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal flex items-center gap-1">
                        <Hash className="w-2.5 h-2.5" />
                        {topic.code}
                        {topic.lessons && <span> • {topic.lessons.length} bài</span>}
                      </div>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-violet-600' : 'text-slate-300'}`} />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Column 4: Lessons */}
        <div className="md:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-2xs p-3 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <BookMarked className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bài học: {selectedTopic?.name || '...'}</span>
            </div>
            {selectedTopic && (
              <button
                onClick={() => setIsLessonModalOpen(true)}
                className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-0.5"
              >
                <Plus className="w-3 h-3" />
                <span>Thêm bài học</span>
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {lessonsLoading ? (
              <div className="p-4 text-center text-xs text-slate-400">Đang tải bài học...</div>
            ) : !selectedTopic ? (
              <div className="p-4 text-center text-xs text-slate-400">Chọn một topic bên trái.</div>
            ) : lessons.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">Topic này chưa có bài học. Bấm Thêm để tạo.</div>
            ) : (
              lessons.map((les) => (
                <div key={les.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-semibold text-[13px] text-slate-900 truncate">{les.title}</h4>
                    {les.isRemedial && (
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                        BỔ TRỢ
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed">
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
                  placeholder="ví dụ: MATH, PHYSICS"
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Khối lớp (Trình độ)</label>
                <select
                  value={subjectForm.grade || ''}
                  onChange={(e) => setSubjectForm({ ...subjectForm, grade: e.target.value })}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                >
                  <option value="">-- Môn chung (Không phân khối) --</option>
                  <option value="10">Khối 10 (Lớp 10)</option>
                  <option value="11">Khối 11 (Lớp 11)</option>
                  <option value="12">Khối 12 (Lớp 12)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả</label>
                <textarea
                  rows={3}
                  placeholder="Mô tả nội dung chương trình học..."
                  value={subjectForm.description}
                  onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsSubjectModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl">Hủy</button>
                <button type="submit" className="px-5 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs">Tạo môn học</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Create Module */}
      {isModuleModalOpen && selectedSubject && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">Thêm Module cho {selectedSubject.name}</h3>
              <button onClick={() => setIsModuleModalOpen(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateModule} className="py-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mã module *</label>
                <input
                  type="text"
                  required
                  placeholder="ví dụ: ENG_GRAMMAR, MATH_ALGEBRA"
                  value={moduleForm.code}
                  onChange={(e) => setModuleForm({ ...moduleForm, code: e.target.value })}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tên module *</label>
                <input
                  type="text"
                  required
                  placeholder="ví dụ: Ngữ pháp (Grammar)"
                  value={moduleForm.name}
                  onChange={(e) => setModuleForm({ ...moduleForm, name: e.target.value })}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả module</label>
                <textarea
                  rows={3}
                  placeholder="Mô tả nội dung module..."
                  value={moduleForm.description}
                  onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsModuleModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl">Hủy</button>
                <button type="submit" className="px-5 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs">Tạo module</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Create Topic */}
      {isTopicModalOpen && selectedModule && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">Thêm Topic cho {selectedModule.name}</h3>
              <button onClick={() => setIsTopicModalOpen(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateTopic} className="py-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mã topic *</label>
                <input
                  type="text"
                  required
                  placeholder="ví dụ: ENG_PERFECT_TENSES"
                  value={topicForm.code}
                  onChange={(e) => setTopicForm({ ...topicForm, code: e.target.value })}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tên topic *</label>
                <input
                  type="text"
                  required
                  placeholder="ví dụ: Perfect Tenses (Thì hoàn thành)"
                  value={topicForm.name}
                  onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả topic</label>
                <textarea
                  rows={3}
                  placeholder="Mô tả chủ đề và chuẩn đầu ra..."
                  value={topicForm.description}
                  onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsTopicModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl">Hủy</button>
                <button type="submit" className="px-5 py-2 text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-xs">Tạo topic</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Create Lesson */}
      {isLessonModalOpen && selectedTopic && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">Thêm Bài học cho {selectedTopic.name}</h3>
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
                  placeholder="ví dụ: Present Perfect (Hiện tại hoàn thành)"
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
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="remedial" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Đây là bài học bổ trợ (Remedial Learning) khi học sinh không đạt
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsLessonModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl">Hủy</button>
                <button type="submit" className="px-5 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs">Lưu bài học</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
import managerService from '../../services/managerService';
import {
  HelpCircle, Plus, Filter, Trash2, CheckCircle2,
  X, FolderPlus, Sparkles, BookOpen, AlertCircle, Check,
  Search, RotateCcw, Edit, Layers
} from 'lucide-react';

export default function QuestionBankManagerPage() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [skills, setSkills] = useState([]);
  const [modules, setModules] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);

  // Filter criteria
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const [skillFilter, setSkillFilter] = useState('ALL');
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const [topicFilter, setTopicFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [loading, setLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Modals
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null); // When editing, holds question object

  // Forms
  const [bankForm, setBankForm] = useState({ name: '', description: '' });
  const [questionForm, setQuestionForm] = useState({
    skillId: '',
    moduleId: '',
    topicId: '',
    lessonId: '',
    content: '',
    difficulty: 'MEDIUM',
    explanation: '',
    options: [
      { optionContent: '', isCorrect: true, displayOrder: 1 },
      { optionContent: '', isCorrect: false, displayOrder: 2 },
      { optionContent: '', isCorrect: false, displayOrder: 3 },
      { optionContent: '', isCorrect: false, displayOrder: 4 },
    ],
  });

  // Modal cascaded topics and lessons for question form
  const [formTopics, setFormTopics] = useState([]);
  const [formLessons, setFormLessons] = useState([]);

  // Load initial subjects and question banks
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const [subsData, banksData] = await Promise.all([
          managerService.getSubjects(),
          managerService.getQuestionBanks(),
        ]);
        setSubjects(subsData || []);
        setBanks(banksData || []);
        if (subsData && subsData.length > 0) {
          setSelectedSubjectId(subsData[0].id);
        }
        if (banksData && banksData.length > 0) {
          handleSelectBank(banksData[0]);
        }
      } catch (err) {
        console.error('Lỗi tải ngân hàng câu hỏi:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // When subject changes, load skills and modules for that subject
  useEffect(() => {
    if (selectedSubjectId) {
      managerService.getSkillsBySubject(selectedSubjectId).then((data) => {
        setSkills(data || []);
      });
      managerService.getModulesBySubject(selectedSubjectId).then(async (mods) => {
        const modsList = mods || [];
        // Fetch topics for each module so we have complete tree
        for (const m of modsList) {
          if (!m.topics || m.topics.length === 0) {
            try {
              const tops = await managerService.getTopicsByModule(m.id);
              m.topics = tops || [];
            } catch (ignored) { }
          }
        }
        setModules(modsList);
      });
    }
  }, [selectedSubjectId]);

  // When modal moduleId changes, update formTopics
  useEffect(() => {
    if (questionForm.moduleId) {
      const selectedMod = modules.find(m => m.id === questionForm.moduleId);
      if (selectedMod && selectedMod.topics) {
        setFormTopics(selectedMod.topics);
        if (selectedMod.topics.length > 0 && !selectedMod.topics.some(t => t.id === questionForm.topicId)) {
          setQuestionForm(prev => ({ ...prev, topicId: selectedMod.topics[0].id }));
        }
      } else {
        managerService.getTopicsByModule(questionForm.moduleId).then(tops => {
          setFormTopics(tops || []);
          if (tops && tops.length > 0 && !tops.some(t => t.id === questionForm.topicId)) {
            setQuestionForm(prev => ({ ...prev, topicId: tops[0].id }));
          }
        });
      }
    } else {
      setFormTopics([]);
      setFormLessons([]);
    }
  }, [questionForm.moduleId, modules]);

  // When modal topicId changes, update formLessons
  useEffect(() => {
    if (questionForm.topicId) {
      managerService.getLessonsByTopic(questionForm.topicId).then(les => {
        setFormLessons(les || []);
        if (les && les.length > 0 && !les.some(l => l.id === questionForm.lessonId)) {
          setQuestionForm(prev => ({ ...prev, lessonId: les[0].id }));
        }
      });
    } else {
      setFormLessons([]);
    }
  }, [questionForm.topicId]);

  const handleSelectBank = async (bank) => {
    setSelectedBank(bank);
    setSelectedSubjectId(bank.subjectId);
    setModuleFilter('ALL');
    setTopicFilter('ALL');
    loadQuestions(bank.id);
  };

  const loadQuestions = async (bankId) => {
    setQuestionsLoading(true);
    try {
      const data = await managerService.getQuestionsForManager({
        questionBankId: bankId,
      });
      setAllQuestions(data || []);
    } catch (err) {
      console.error('Lỗi tải câu hỏi:', err);
    } finally {
      setQuestionsLoading(false);
    }
  };

  // Filtered topics for filter bar based on moduleFilter
  const filterAvailableTopics = useMemo(() => {
    if (moduleFilter === 'ALL') {
      return modules.flatMap(m => m.topics || []);
    }
    const foundMod = modules.find(m => m.id === moduleFilter);
    return foundMod?.topics || [];
  }, [modules, moduleFilter]);

  // Filtered questions memoized for instant, jump-free updates
  const filteredQuestions = useMemo(() => {
    return allQuestions.filter((q) => {
      const qDiff = (q.difficulty || '').toUpperCase();
      const matchesDiff = difficultyFilter === 'ALL' || qDiff === difficultyFilter;
      const matchesSkill = skillFilter === 'ALL' || q.skillId === skillFilter;
      const matchesModule = moduleFilter === 'ALL' || q.moduleId === moduleFilter;
      const matchesTopic = topicFilter === 'ALL' || q.topicId === topicFilter;

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        q.content?.toLowerCase().includes(query) ||
        q.explanation?.toLowerCase().includes(query) ||
        q.options?.some((opt) => opt.optionContent?.toLowerCase().includes(query));

      return matchesDiff && matchesSkill && matchesModule && matchesTopic && matchesSearch;
    });
  }, [allQuestions, difficultyFilter, skillFilter, moduleFilter, topicFilter, searchQuery]);

  // Real-time difficulty count badges
  const diffCounts = useMemo(() => {
    const counts = { ALL: allQuestions.length, EASY: 0, MEDIUM: 0, HARD: 0 };
    allQuestions.forEach((q) => {
      const diff = (q.difficulty || '').toUpperCase();
      if (counts[diff] !== undefined) {
        counts[diff] += 1;
      }
    });
    return counts;
  }, [allQuestions]);

  const handleDifficultyFilterChange = (diff) => {
    setDifficultyFilter(diff);
  };

  const handleResetFilters = () => {
    setDifficultyFilter('ALL');
    setSkillFilter('ALL');
    setModuleFilter('ALL');
    setTopicFilter('ALL');
    setSearchQuery('');
  };

  const isFiltered = difficultyFilter !== 'ALL' || skillFilter !== 'ALL' || moduleFilter !== 'ALL' || topicFilter !== 'ALL' || searchQuery.trim() !== '';

  const handleCreateBank = async (e) => {
    e.preventDefault();
    try {
      const newBank = await managerService.createQuestionBank({
        subjectId: selectedSubjectId,
        name: bankForm.name,
        description: bankForm.description,
      });
      setIsBankModalOpen(false);
      setBankForm({ name: '', description: '' });
      setSuccessMsg('Tạo ngân hàng câu hỏi thành công!');
      setTimeout(() => setSuccessMsg(''), 4000);
      // reload banks
      const updated = await managerService.getQuestionBanks();
      setBanks(updated || []);
      handleSelectBank(newBank);
    } catch (err) {
      alert('Lỗi tạo ngân hàng câu hỏi: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleOpenCreateModal = () => {
    setEditingQuestion(null);
    const initialModId = modules[0]?.id || '';
    const initialTopics = modules[0]?.topics || [];
    const initialTopicId = initialTopics[0]?.id || '';

    setQuestionForm({
      skillId: skills[0]?.id || '',
      moduleId: initialModId,
      topicId: initialTopicId,
      lessonId: '',
      content: '',
      difficulty: 'MEDIUM',
      explanation: '',
      options: [
        { optionContent: '', isCorrect: true, displayOrder: 1 },
        { optionContent: '', isCorrect: false, displayOrder: 2 },
        { optionContent: '', isCorrect: false, displayOrder: 3 },
        { optionContent: '', isCorrect: false, displayOrder: 4 },
      ],
    });
    setFormTopics(initialTopics);
    setIsQuestionModalOpen(true);
  };

  const handleOpenEditModal = async (q) => {
    setEditingQuestion(q);
    const qOptions = (q.options && q.options.length > 0)
      ? q.options.map((opt, i) => ({
        id: opt.id,
        optionContent: opt.optionContent || '',
        isCorrect: !!opt.isCorrect,
        displayOrder: opt.displayOrder || (i + 1),
      }))
      : [
        { optionContent: '', isCorrect: true, displayOrder: 1 },
        { optionContent: '', isCorrect: false, displayOrder: 2 },
        { optionContent: '', isCorrect: false, displayOrder: 3 },
        { optionContent: '', isCorrect: false, displayOrder: 4 },
      ];

    const currentModId = q.moduleId || modules[0]?.id || '';
    const foundMod = modules.find(m => m.id === currentModId);
    let topicsList = foundMod?.topics || [];
    if (topicsList.length === 0 && currentModId) {
      try {
        topicsList = await managerService.getTopicsByModule(currentModId) || [];
      } catch (e) { }
    }
    setFormTopics(topicsList);

    const currentTopicId = q.topicId || topicsList[0]?.id || '';
    let lessonsList = [];
    if (currentTopicId) {
      try {
        lessonsList = await managerService.getLessonsByTopic(currentTopicId) || [];
      } catch (e) { }
    }
    setFormLessons(lessonsList);

    setQuestionForm({
      skillId: q.skillId || skills[0]?.id || '',
      moduleId: currentModId,
      topicId: currentTopicId,
      lessonId: q.lessonId || '',
      content: q.content || '',
      difficulty: (q.difficulty || 'MEDIUM').toUpperCase(),
      explanation: q.explanation || '',
      options: qOptions,
    });
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!selectedBank) return;
    try {
      if (editingQuestion) {
        // Update question
        await managerService.updateQuestion(editingQuestion.id, {
          skillId: questionForm.skillId || undefined,
          moduleId: questionForm.moduleId || undefined,
          topicId: questionForm.topicId || undefined,
          lessonId: questionForm.lessonId || undefined,
          content: questionForm.content,
          difficulty: questionForm.difficulty,
          explanation: questionForm.explanation,
          options: questionForm.options,
        });
        setSuccessMsg('Cập nhật câu hỏi thành công!');
      } else {
        // Create question
        await managerService.createQuestion({
          questionBankId: selectedBank.id,
          skillId: questionForm.skillId || (skills[0] && skills[0].id),
          moduleId: questionForm.moduleId || undefined,
          topicId: questionForm.topicId || undefined,
          lessonId: questionForm.lessonId || undefined,
          content: questionForm.content,
          difficulty: questionForm.difficulty,
          explanation: questionForm.explanation,
          options: questionForm.options,
        });
        setSuccessMsg('Thêm câu hỏi mới thành công!');
      }

      setIsQuestionModalOpen(false);
      setEditingQuestion(null);
      setTimeout(() => setSuccessMsg(''), 4000);
      loadQuestions(selectedBank.id);
      const updated = await managerService.getQuestionBanks();
      setBanks(updated || []);
    } catch (err) {
      alert('Lỗi lưu câu hỏi: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này khỏi ngân hàng đề?')) return;
    try {
      await managerService.deleteQuestion(questionId);
      setSuccessMsg('Đã xóa câu hỏi thành công.');
      setTimeout(() => setSuccessMsg(''), 4000);
      loadQuestions(selectedBank.id);
      const updated = await managerService.getQuestionBanks();
      setBanks(updated || []);
    } catch (err) {
      alert('Lỗi xóa câu hỏi: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteBank = async (bankToDelete) => {
    if (!bankToDelete) return;
    const count = bankToDelete.questionCount || 0;
    const confirmMsg = `Bạn có chắc chắn muốn xóa ngân hàng đề:\n"${bankToDelete.name}"?\n\n⚠️ CẢNH BÁO: Toàn bộ ${count} câu hỏi bên trong ngân hàng đề này cũng sẽ bị xóa vĩnh viễn và không thể khôi phục!`;
    if (!window.confirm(confirmMsg)) return;

    try {
      await managerService.deleteQuestionBank(bankToDelete.id);
      setSuccessMsg(`Đã xóa ngân hàng đề "${bankToDelete.name}" thành công.`);
      setTimeout(() => setSuccessMsg(''), 4000);

      // Reload bank list
      const updated = await managerService.getQuestionBanks();
      setBanks(updated || []);

      // If the deleted bank was selected, switch to the first remaining bank
      if (selectedBank?.id === bankToDelete.id) {
        if (updated && updated.length > 0) {
          handleSelectBank(updated[0]);
        } else {
          setSelectedBank(null);
          setAllQuestions([]);
        }
      }
    } catch (err) {
      alert('Lỗi khi xóa ngân hàng đề: ' + (err.response?.data?.message || err.message));
    }
  };

  const setCorrectOptionIndex = (idx) => {
    const updatedOptions = questionForm.options.map((opt, i) => ({
      ...opt,
      isCorrect: i === idx,
    }));
    setQuestionForm({ ...questionForm, options: updatedOptions });
  };

  const handleOptionChange = (idx, text) => {
    const updatedOptions = [...questionForm.options];
    updatedOptions[idx].optionContent = text;
    setQuestionForm({ ...questionForm, options: updatedOptions });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <HelpCircle className="w-7 h-7 text-purple-600" />
            <span>Ngân hàng Câu hỏi & Soạn thảo Đề thi</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Biên tập câu hỏi trắc nghiệm, cấu hình đáp án đúng và phân loại độ khó cho Placement Test & Quiz
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBankModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition shadow-2xs"
          >
            <FolderPlus className="w-4 h-4 text-purple-600" />
            <span>Tạo Ngân hàng đề</span>
          </button>
          {selectedBank && (
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm câu hỏi mới</span>
            </button>
          )}
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-medium text-emerald-800 flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Layout: Bank Selector on Left (Sticky), Question List on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left: Banks List (Sticky to prevent layout jump when scrolling questions) */}
        <div className="md:col-span-4 sticky top-6 self-start bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Ngân hàng câu hỏi ({banks.length})
            </span>
          </div>

          <div className="space-y-2 max-h-[calc(100vh-240px)] overflow-y-auto pr-1">
            {loading ? (
              <div className="p-6 text-center text-xs text-slate-400">Đang tải...</div>
            ) : banks.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">Chưa có ngân hàng câu hỏi nào.</div>
            ) : (
              banks.map((b) => {
                const isSelected = selectedBank?.id === b.id;
                const subjectName = subjects.find((s) => s.id === b.subjectId)?.name || 'Môn học';
                return (
                  <div
                    key={b.id}
                    onClick={() => handleSelectBank(b)}
                    className={`group w-full text-left p-3.5 rounded-xl text-sm transition flex flex-col gap-1 cursor-pointer ${isSelected
                        ? 'bg-purple-50 text-purple-900 border border-purple-200 font-semibold shadow-2xs'
                        : 'text-slate-700 hover:bg-slate-50 border border-slate-100'
                      }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate flex-1 font-medium">{b.name}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/80 border border-slate-200 text-slate-600">
                          {b.questionCount || 0} câu
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBank(b);
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title={`Xóa ngân hàng đề "${b.name}"`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 font-normal">
                      Môn: {subjectName}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Questions of Selected Bank */}
        <div className="md:col-span-8 space-y-4 min-h-[550px]">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
            {/* Top row: Title, Total Count, and Delete Bank Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {selectedBank ? selectedBank.name : 'Chọn một ngân hàng để xem câu hỏi'}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedBank?.description || 'Hiển thị danh sách câu hỏi kèm đáp án đúng được Manager cấu hình'}
                </p>
              </div>
              {selectedBank && (
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                    Tổng: {allQuestions.length} câu
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteBank(selectedBank)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition"
                    title={`Xóa ngân hàng đề "${selectedBank.name}"`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa ngân hàng</span>
                  </button>
                </div>
              )}
            </div>

            {/* Middle row: Search Bar & Skill Filter & Difficulty Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
              {/* Search input */}
              <div className="relative min-w-[200px] flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm nội dung câu hỏi, giải thích..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 focus:bg-white text-slate-800 transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Module dropdown filter */}
              {modules.length > 0 && (
                <div className="min-w-[150px]">
                  <select
                    value={moduleFilter}
                    onChange={(e) => {
                      setModuleFilter(e.target.value);
                      setTopicFilter('ALL');
                    }}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="ALL">Tất cả Module ({modules.length})</option>
                    {modules.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Topic dropdown filter */}
              {filterAvailableTopics.length > 0 && (
                <div className="min-w-[150px]">
                  <select
                    value={topicFilter}
                    onChange={(e) => setTopicFilter(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="ALL">Tất cả Topic ({filterAvailableTopics.length})</option>
                    {filterAvailableTopics.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Difficulty Tabs with Whitespace-nowrap & Realtime Counts */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Độ khó:</span>
                <div className="inline-flex rounded-xl bg-slate-100 p-1 flex-nowrap">
                  {[
                    { key: 'ALL', label: 'Tất cả', count: diffCounts.ALL },
                    { key: 'EASY', label: 'EASY', count: diffCounts.EASY, color: 'text-emerald-700' },
                    { key: 'MEDIUM', label: 'MEDIUM', count: diffCounts.MEDIUM, color: 'text-amber-700' },
                    { key: 'HARD', label: 'HARD', count: diffCounts.HARD, color: 'text-rose-700' },
                  ].map((tab) => {
                    const isActive = difficultyFilter === tab.key;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => handleDifficultyFilterChange(tab.key)}
                        className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-semibold transition shrink-0 flex items-center gap-1 ${isActive
                            ? `bg-white ${tab.color || 'text-purple-700'} shadow-xs font-bold`
                            : 'text-slate-600 hover:text-slate-900'
                          }`}
                      >
                        <span>{tab.label}</span>
                        <span className={`text-[10px] px-1 py-0.2 rounded-full font-medium ${isActive ? 'bg-slate-100 text-slate-700' : 'text-slate-400'
                          }`}>
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Filter status row (if any filter is applied) */}
            {isFiltered && (
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1.5 border-t border-slate-50">
                <div className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-purple-600" />
                  <span>
                    Hiển thị <strong className="text-slate-800">{filteredQuestions.length}</strong> / {allQuestions.length} câu hỏi phù hợp
                  </span>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 font-semibold hover:underline"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Đặt lại bộ lọc</span>
                </button>
              </div>
            )}
          </div>

          {/* Question List (Min height to prevent sudden layout shrink) */}
          <div className="space-y-3 min-h-[380px]">
            {questionsLoading ? (
              <div className="bg-white p-16 rounded-2xl border border-slate-200 text-center text-sm text-slate-400 space-y-3">
                <div className="w-7 h-7 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p>Đang tải danh sách câu hỏi...</p>
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-sm text-slate-500 space-y-3">
                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-medium text-slate-700">
                  {allQuestions.length === 0
                    ? 'Chưa có câu hỏi nào trong ngân hàng này.'
                    : 'Không tìm thấy câu hỏi nào phù hợp với bộ lọc hiện tại.'}
                </p>
                {isFiltered ? (
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-xl text-xs font-semibold hover:bg-purple-100 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Xóa bộ lọc để xem tất cả {allQuestions.length} câu</span>
                  </button>
                ) : (
                  <p className="text-xs text-slate-400">
                    Bấm "Thêm câu hỏi mới" ở góc trên bên phải để bắt đầu soạn đề.
                  </p>
                )}
              </div>
            ) : (
              filteredQuestions.map((q, idx) => {
                const qDiff = (q.difficulty || 'MEDIUM').toUpperCase();
                const diffBadge =
                  qDiff === 'EASY'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : qDiff === 'HARD'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200';

                const skillName = skills.find((s) => s.id === q.skillId)?.name;
                const moduleName = modules.find((m) => m.id === q.moduleId)?.name;
                const topicName = modules.flatMap(m => m.topics || []).find(t => t.id === q.topicId)?.name;

                return (
                  <div
                    key={q.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 hover:border-purple-200 transition-all duration-150"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm leading-relaxed">
                            {q.content}
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                            <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${diffBadge}`}>
                              {qDiff}
                            </span>
                            {moduleName && (
                              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                                <Layers className="w-3 h-3" />
                                {moduleName}
                              </span>
                            )}
                            {topicName && (
                              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                                <BookOpen className="w-3 h-3" />
                                {topicName}
                              </span>
                            )}
                            {skillName && (
                              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                {skillName}
                              </span>
                            )}
                            {q.explanation && (
                              <span className="text-xs text-slate-500 italic block sm:inline mt-1 sm:mt-0">
                                Giải thích: {q.explanation}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleOpenEditModal(q)}
                          className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                          title="Chỉnh sửa câu hỏi"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Xóa câu hỏi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Options list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      {(q.options || []).map((opt, optIdx) => {
                        const optLetter = String.fromCharCode(65 + optIdx);
                        const isCorrect = opt.isCorrect === true;
                        return (
                          <div
                            key={opt.id || optIdx}
                            className={`p-2.5 rounded-xl text-xs flex items-center gap-2 border ${isCorrect
                                ? 'bg-emerald-50/90 border-emerald-300 text-emerald-900 font-semibold'
                                : 'bg-slate-50/70 border-slate-200 text-slate-700'
                              }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${isCorrect
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-200 text-slate-600'
                                }`}
                            >
                              {optLetter}
                            </span>
                            <span className="flex-1 truncate">{opt.optionContent}</span>
                            {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Create Bank Modal */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">Tạo Ngân hàng Câu hỏi mới</h3>
              <button onClick={() => setIsBankModalOpen(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateBank} className="py-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Môn học *</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tên ngân hàng đề *</label>
                <input
                  type="text"
                  required
                  placeholder="ví dụ: Ngân hàng Đề thi Đánh giá Năng lực Toán 10"
                  value={bankForm.name}
                  onChange={(e) => setBankForm({ ...bankForm, name: e.target.value })}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả</label>
                <textarea
                  rows={3}
                  placeholder="Mô tả phạm vi kiến thức của ngân hàng câu hỏi..."
                  value={bankForm.description}
                  onChange={(e) => setBankForm({ ...bankForm, description: e.target.value })}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBankModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-xs"
                >
                  Tạo ngân hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create/Edit Question Modal */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">
                {editingQuestion ? 'Chỉnh sửa Câu hỏi Trắc nghiệm' : 'Soạn thảo Câu hỏi Trắc nghiệm Mới'}
              </h3>
              <button onClick={() => setIsQuestionModalOpen(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveQuestion} className="py-4 space-y-4">
              {/* Module, Topic, Lesson selection */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-600" />
                  <span>Phân bổ vào cấu trúc Môn học</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Module</label>
                    <select
                      value={questionForm.moduleId}
                      onChange={(e) => setQuestionForm({ ...questionForm, moduleId: e.target.value })}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:ring-1 focus:ring-purple-500"
                    >
                      <option value="">-- Không chọn --</option>
                      {modules.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Topic</label>
                    <select
                      value={questionForm.topicId}
                      onChange={(e) => setQuestionForm({ ...questionForm, topicId: e.target.value })}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:ring-1 focus:ring-purple-500"
                      disabled={!questionForm.moduleId}
                    >
                      <option value="">-- Không chọn --</option>
                      {formTopics.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Bài học (Lesson)</label>
                    <select
                      value={questionForm.lessonId}
                      onChange={(e) => setQuestionForm({ ...questionForm, lessonId: e.target.value })}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:ring-1 focus:ring-purple-500"
                      disabled={!questionForm.topicId}
                    >
                      <option value="">-- Không chọn --</option>
                      {formLessons.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kỹ năng đánh giá</label>
                  <select
                    value={questionForm.skillId}
                    onChange={(e) => setQuestionForm({ ...questionForm, skillId: e.target.value })}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  >
                    <option value="">-- Không chọn kỹ năng --</option>
                    {skills.map((skl) => (
                      <option key={skl.id} value={skl.id}>
                        {skl.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Độ khó (Difficulty) *</label>
                  <select
                    value={questionForm.difficulty}
                    onChange={(e) => setQuestionForm({ ...questionForm, difficulty: e.target.value })}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  >
                    <option value="EASY">EASY (Cơ bản - Nhận biết)</option>
                    <option value="MEDIUM">MEDIUM (Trung bình - Thông hiểu)</option>
                    <option value="HARD">HARD (Nâng cao - Vận dụng cao)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nội dung câu hỏi *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Nhập đề bài câu hỏi trắc nghiệm..."
                  value={questionForm.content}
                  onChange={(e) => setQuestionForm({ ...questionForm, content: e.target.value })}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              {/* 4 Choices */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  4 Lựa chọn trả lời (Chọn radio để đánh dấu ĐÁP ÁN ĐÚNG) *
                </label>
                {questionForm.options.map((opt, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctOption"
                        checked={opt.isCorrect}
                        onChange={() => setCorrectOptionIndex(idx)}
                        className="text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
                        title="Đánh dấu đây là đáp án đúng"
                      />
                      <span className="w-6 text-xs font-bold text-slate-500">{letter}.</span>
                      <input
                        type="text"
                        required
                        placeholder={`Lựa chọn ${letter}`}
                        value={opt.optionContent}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        className={`flex-1 text-sm rounded-xl px-3 py-2 border ${opt.isCorrect
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                          }`}
                      />
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Giải thích chi tiết đáp án</label>
                <textarea
                  rows={2}
                  placeholder="Giải thích vì sao đáp án này đúng để học sinh tham khảo sau khi làm bài..."
                  value={questionForm.explanation}
                  onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsQuestionModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-xs"
                >
                  {editingQuestion ? 'Lưu thay đổi' : 'Tạo câu hỏi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

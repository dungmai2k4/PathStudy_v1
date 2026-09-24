import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import managerService from '../../services/managerService';
import { 
  BookOpen, Plus, Layers, BookMarked, FolderTree,
  CheckCircle, X, ChevronRight, ChevronDown, Hash, Edit3, Trash2,
  Eye, Search, Sparkles, AlertTriangle, FileText,
  HelpCircle, Check, ArrowRight, CornerDownRight, PanelLeft,
  Bold, Italic, Heading1, Heading2, List, Code, Quote, Table as TableIcon
} from 'lucide-react';

export default function SubjectManagerPage() {
  // Tree state
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [lessons, setLessons] = useState([]);

  // Loadings
  const [loading, setLoading] = useState(true);
  const [modulesLoading, setModulesLoading] = useState(false);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Filters & Search
  const [gradeFilter, setGradeFilter] = useState('ALL');
  const [searchSubject, setSearchSubject] = useState('');

  // Modals state: Môn học
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [subjectModalMode, setSubjectModalMode] = useState('create'); // 'create' | 'edit'
  const [subjectForm, setSubjectForm] = useState({ id: null, code: '', name: '', description: '', grade: '' });

  // Modals state: Module
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [moduleModalMode, setModuleModalMode] = useState('create');
  const [moduleForm, setModuleForm] = useState({ id: null, code: '', name: '', description: '', displayOrder: 0 });

  // Modals state: Topic
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [topicModalMode, setTopicModalMode] = useState('create');
  const [topicForm, setTopicForm] = useState({ id: null, code: '', name: '', description: '', displayOrder: 0 });

  // Modals state: Lesson Create
  const [isLessonCreateModalOpen, setIsLessonCreateModalOpen] = useState(false);
  const [lessonForm, setLessonForm] = useState({ title: '', theorySummary: '', content: '', isRemedial: false, displayOrder: 0 });

  // Delete Confirmation Modal
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    type: '', // 'subject' | 'module' | 'topic' | 'lesson'
    id: null,
    title: '',
    warningText: '',
  });

  // ===== RICH LESSON STUDIO / INSPECTOR =====
  const [selectedLessonDetail, setSelectedLessonDetail] = useState(null);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [studioActiveTab, setStudioActiveTab] = useState('theory'); // 'theory' | 'examples' | 'quiz' | 'preview'
  const [theoryEditorTab, setTheoryEditorTab] = useState('write'); // 'write' | 'preview'
  const [studioLoading, setStudioLoading] = useState(false);

  // Lesson Studio Edit Form
  const [lessonStudioForm, setLessonStudioForm] = useState({
    id: null,
    title: '',
    theorySummary: '',
    content: '',
    isRemedial: false,
    displayOrder: 0,
  });

  // Example Edit state inside studio
  const [examplesList, setExamplesList] = useState([]);
  const [exampleModal, setExampleModal] = useState({
    isOpen: false,
    mode: 'create', // 'create' | 'edit'
    id: null,
    title: '',
    content: '',
    translation: '',
    explanation: '',
    displayOrder: 0,
  });

  // Mini Quiz Edit state inside studio
  const [miniQuizzesList, setMiniQuizzesList] = useState([]);
  const [quizQuestionModal, setQuizQuestionModal] = useState({
    isOpen: false,
    mode: 'create', // 'create' | 'edit'
    quizId: null,
    questionIndex: -1,
    questionText: '',
    options: [
      { text: '', isCorrect: true },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ],
    explanation: '',
  });

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setErrorMsg('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const showError = (msg) => {
    setErrorMsg(msg);
    setSuccessMsg('');
    setTimeout(() => setErrorMsg(''), 5000);
  };

  // ===== Load subjects =====
  const loadSubjects = async (preserveSelectedId = null) => {
    setLoading(true);
    try {
      const data = await managerService.getSubjects();
      setSubjects(data || []);
      if (data && data.length > 0) {
        if (preserveSelectedId) {
          const match = data.find((s) => s.id === preserveSelectedId);
          if (match) {
            handleSelectSubject(match);
            return;
          }
        }
        if (!selectedSubject) {
          handleSelectSubject(data[0]);
        }
      } else {
        setSelectedSubject(null);
        setModules([]);
        setSelectedModule(null);
        setTopics([]);
        setSelectedTopic(null);
        setLessons([]);
      }
    } catch (err) {
      console.error('Lỗi tải môn học:', err);
      showError('Không thể tải danh sách môn học.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  // ===== Select subject → load modules =====
  const handleSelectSubject = async (subject, preserveModuleId = null) => {
    setSelectedSubject(subject);
    setSelectedModule(null);
    setSelectedTopic(null);
    setTopics([]);
    setLessons([]);
    setModulesLoading(true);
    // Auto-expand this subject in the tree
    setExpandedSubjects((prev) => ({ ...prev, [subject.id]: true }));
    try {
      const data = await managerService.getModulesBySubject(subject.id);
      setModules(data || []);
      if (data && data.length > 0) {
        if (preserveModuleId) {
          const match = data.find((m) => m.id === preserveModuleId);
          if (match) {
            handleSelectModule(match);
            return;
          }
        }
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
  const handleSelectModule = async (mod, preserveTopicId = null) => {
    setSelectedModule(mod);
    setSelectedTopic(null);
    setLessons([]);
    // Auto-expand this module in the tree
    setExpandedModules((prev) => ({ ...prev, [mod.id]: true }));
    setTopicsLoading(true);
    try {
      let topicList = await managerService.getTopicsByModule(mod.id);
      setTopics(topicList || []);
      if (topicList && topicList.length > 0) {
        if (preserveTopicId) {
          const match = topicList.find((t) => t.id === preserveTopicId);
          if (match) {
            handleSelectTopic(match);
            return;
          }
        }
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
      const lessonList = await managerService.getLessonsByTopic(topic.id);
      setLessons(lessonList || []);
    } catch (err) {
      console.error('Lỗi tải bài học:', err);
      setLessons([]);
    } finally {
      setLessonsLoading(false);
    }
  };

  // ===== Open Studio for a Lesson =====
  const handleOpenStudio = async (lesson) => {
    setStudioLoading(true);
    setIsStudioOpen(true);
    setStudioActiveTab('theory');
    setTheoryEditorTab('write');
    try {
      const detailedLesson = await managerService.getLessonById(lesson.id);
      setSelectedLessonDetail(detailedLesson);
      setLessonStudioForm({
        id: detailedLesson.id,
        title: detailedLesson.title || '',
        theorySummary: detailedLesson.theorySummary || '',
        content: detailedLesson.content || '',
        isRemedial: Boolean(detailedLesson.isRemedial),
        displayOrder: detailedLesson.displayOrder || 0,
      });
      setExamplesList(detailedLesson.examples || []);
      setMiniQuizzesList(detailedLesson.miniQuizzes || []);
    } catch (err) {
      console.error('Lỗi mở bài học:', err);
      showError('Không thể tải chi tiết bài học.');
      // Fallback with basic info
      setSelectedLessonDetail(lesson);
      setLessonStudioForm({
        id: lesson.id,
        title: lesson.title || '',
        theorySummary: lesson.theorySummary || '',
        content: lesson.content || '',
        isRemedial: Boolean(lesson.isRemedial),
        displayOrder: lesson.displayOrder || 0,
      });
    } finally {
      setStudioLoading(false);
    }
  };

  // Save lesson theory & metadata from Studio
  const handleSaveLessonStudio = async (e) => {
    e?.preventDefault();
    if (!lessonStudioForm.id || !selectedTopic) return;
    try {
      const payload = {
        topicId: selectedTopic.id,
        title: lessonStudioForm.title.trim(),
        theorySummary: lessonStudioForm.theorySummary.trim(),
        content: lessonStudioForm.content,
        isRemedial: lessonStudioForm.isRemedial,
        displayOrder: parseInt(lessonStudioForm.displayOrder, 10) || 0,
      };
      await managerService.updateLesson(lessonStudioForm.id, payload);
      showSuccess('Cập nhật nội dung lý thuyết bài học thành công!');

      // Refresh lessons list
      const updated = await managerService.getLessonsByTopic(selectedTopic.id);
      setLessons(updated || []);

      // Refresh detailed view
      const refreshed = await managerService.getLessonById(lessonStudioForm.id);
      setSelectedLessonDetail(refreshed);
    } catch (err) {
      alert('Lỗi cập nhật bài học: ' + (err.response?.data?.message || err.message));
    }
  };

  // ===== SUBJECT CRUD =====
  const openCreateSubjectModal = () => {
    setSubjectModalMode('create');
    setSubjectForm({ id: null, code: '', name: '', description: '', grade: '' });
    setIsSubjectModalOpen(true);
  };

  const openEditSubjectModal = (sub, e) => {
    e.stopPropagation();
    setSubjectModalMode('edit');
    setSubjectForm({
      id: sub.id,
      code: sub.code || '',
      name: sub.name || '',
      description: sub.description || '',
      grade: sub.grade ? String(sub.grade) : '',
    });
    setIsSubjectModalOpen(true);
  };

  const handleSubmitSubject = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        code: subjectForm.code.trim().toUpperCase(),
        name: subjectForm.name.trim(),
        description: subjectForm.description,
        grade: subjectForm.grade ? parseInt(subjectForm.grade, 10) : null,
      };

      if (subjectModalMode === 'create') {
        const created = await managerService.createSubject(payload);
        setIsSubjectModalOpen(false);
        showSuccess(`Tạo môn học "${payload.name}" thành công!`);
        await loadSubjects(created.id);
      } else {
        await managerService.updateSubject(subjectForm.id, payload);
        setIsSubjectModalOpen(false);
        showSuccess(`Cập nhật môn học "${payload.name}" thành công!`);
        await loadSubjects(subjectForm.id);
      }
    } catch (err) {
      alert('Lỗi lưu môn học: ' + (err.response?.data?.message || err.message));
    }
  };

  // ===== MODULE CRUD =====
  const openCreateModuleModal = () => {
    if (!selectedSubject) return;
    setModuleModalMode('create');
    setModuleForm({ id: null, code: '', name: '', description: '', displayOrder: modules.length + 1 });
    setIsModuleModalOpen(true);
  };

  const openEditModuleModal = (mod, e) => {
    e.stopPropagation();
    setModuleModalMode('edit');
    setModuleForm({
      id: mod.id,
      code: mod.code || '',
      name: mod.name || '',
      description: mod.description || '',
      displayOrder: mod.displayOrder || 0,
    });
    setIsModuleModalOpen(true);
  };

  const handleSubmitModule = async (e) => {
    e.preventDefault();
    if (!selectedSubject) return;
    try {
      const payload = {
        subjectId: selectedSubject.id,
        code: moduleForm.code.trim().toUpperCase(),
        name: moduleForm.name.trim(),
        description: moduleForm.description,
        displayOrder: parseInt(moduleForm.displayOrder, 10) || 0,
      };

      if (moduleModalMode === 'create') {
        await managerService.createModule(payload);
        setIsModuleModalOpen(false);
        showSuccess(`Thêm module "${payload.name}" thành công!`);
      } else {
        await managerService.updateModule(moduleForm.id, payload);
        setIsModuleModalOpen(false);
        showSuccess(`Cập nhật module "${payload.name}" thành công!`);
      }
      const updated = await managerService.getModulesBySubject(selectedSubject.id);
      setModules(updated || []);
      if (moduleModalMode === 'create' && updated.length > 0) {
        handleSelectModule(updated[updated.length - 1]);
      }
    } catch (err) {
      alert('Lỗi lưu module: ' + (err.response?.data?.message || err.message));
    }
  };

  // ===== TOPIC CRUD =====
  const openCreateTopicModal = () => {
    if (!selectedModule) return;
    setTopicModalMode('create');
    setTopicForm({ id: null, code: '', name: '', description: '', displayOrder: topics.length + 1 });
    setIsTopicModalOpen(true);
  };

  const openEditTopicModal = (topic, e) => {
    e.stopPropagation();
    setTopicModalMode('edit');
    setTopicForm({
      id: topic.id,
      code: topic.code || '',
      name: topic.name || '',
      description: topic.description || '',
      displayOrder: topic.displayOrder || 0,
    });
    setIsTopicModalOpen(true);
  };

  const handleSubmitTopic = async (e) => {
    e.preventDefault();
    if (!selectedModule) return;
    try {
      const payload = {
        moduleId: selectedModule.id,
        code: topicForm.code.trim().toUpperCase(),
        name: topicForm.name.trim(),
        description: topicForm.description,
        displayOrder: parseInt(topicForm.displayOrder, 10) || 0,
      };

      if (topicModalMode === 'create') {
        await managerService.createTopic(payload);
        setIsTopicModalOpen(false);
        showSuccess(`Thêm topic "${payload.name}" thành công!`);
      } else {
        await managerService.updateTopic(topicForm.id, payload);
        setIsTopicModalOpen(false);
        showSuccess(`Cập nhật topic "${payload.name}" thành công!`);
      }
      const updated = await managerService.getTopicsByModule(selectedModule.id);
      setTopics(updated || []);
      if (topicModalMode === 'create' && updated.length > 0) {
        handleSelectTopic(updated[updated.length - 1]);
      }
    } catch (err) {
      alert('Lỗi lưu topic: ' + (err.response?.data?.message || err.message));
    }
  };

  // ===== LESSON CREATE =====
  const openCreateLessonModal = () => {
    if (!selectedTopic) return;
    setLessonForm({
      title: '',
      theorySummary: '',
      content: '# 1. Lý thuyết trọng tâm\n\nNội dung kiến thức...',
      isRemedial: false,
      displayOrder: lessons.length + 1,
    });
    setIsLessonCreateModalOpen(true);
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    if (!selectedTopic) return;
    try {
      const payload = {
        topicId: selectedTopic.id,
        title: lessonForm.title.trim(),
        theorySummary: lessonForm.theorySummary.trim(),
        content: lessonForm.content,
        isRemedial: lessonForm.isRemedial,
        displayOrder: parseInt(lessonForm.displayOrder, 10) || 0,
      };
      const created = await managerService.createLesson(payload);
      setIsLessonCreateModalOpen(false);
      showSuccess(`Thêm bài học "${payload.title}" thành công!`);
      const updated = await managerService.getLessonsByTopic(selectedTopic.id);
      setLessons(updated || []);
      // Open studio for newly created lesson
      if (created) {
        handleOpenStudio(created);
      }
    } catch (err) {
      alert('Lỗi thêm bài học: ' + (err.response?.data?.message || err.message));
    }
  };

  // ===== DELETE ACTIONS =====
  const promptDelete = (type, item, e) => {
    if (e) e.stopPropagation();
    let warningText = '';
    if (type === 'subject') {
      warningText = `Thao tác này sẽ xóa môn học "${item.name}" và toàn bộ module, topic, bài học thuộc môn này.`;
    } else if (type === 'module') {
      warningText = `Thao tác này sẽ xóa module "${item.name}" và toàn bộ topic, bài học thuộc module.`;
    } else if (type === 'topic') {
      warningText = `Thao tác này sẽ xóa topic "${item.name}" và toàn bộ bài học thuộc topic.`;
    } else if (type === 'lesson') {
      warningText = `Thao tác này sẽ xóa bài học "${item.title}" cùng ví dụ minh họa và mini-quiz kèm theo.`;
    }

    setDeleteDialog({
      isOpen: true,
      type,
      id: item.id,
      title: item.name || item.title,
      warningText,
    });
  };

  const executeDelete = async () => {
    const { type, id } = deleteDialog;
    try {
      if (type === 'subject') {
        await managerService.deleteSubject(id);
        showSuccess('Đã xóa môn học thành công!');
        setDeleteDialog({ isOpen: false, type: '', id: null, title: '', warningText: '' });
        await loadSubjects();
      } else if (type === 'module') {
        await managerService.deleteModule(id);
        showSuccess('Đã xóa module thành công!');
        setDeleteDialog({ isOpen: false, type: '', id: null, title: '', warningText: '' });
        if (selectedSubject) {
          const updated = await managerService.getModulesBySubject(selectedSubject.id);
          setModules(updated || []);
          if (updated && updated.length > 0) handleSelectModule(updated[0]);
          else {
            setSelectedModule(null);
            setTopics([]);
            setSelectedTopic(null);
            setLessons([]);
          }
        }
      } else if (type === 'topic') {
        await managerService.deleteTopic(id);
        showSuccess('Đã xóa topic thành công!');
        setDeleteDialog({ isOpen: false, type: '', id: null, title: '', warningText: '' });
        if (selectedModule) {
          const updated = await managerService.getTopicsByModule(selectedModule.id);
          setTopics(updated || []);
          if (updated && updated.length > 0) handleSelectTopic(updated[0]);
          else {
            setSelectedTopic(null);
            setLessons([]);
          }
        }
      } else if (type === 'lesson') {
        await managerService.deleteLesson(id);
        showSuccess('Đã xóa bài học thành công!');
        setDeleteDialog({ isOpen: false, type: '', id: null, title: '', warningText: '' });
        if (selectedTopic) {
          const updated = await managerService.getLessonsByTopic(selectedTopic.id);
          setLessons(updated || []);
        }
        if (isStudioOpen && selectedLessonDetail?.id === id) {
          setIsStudioOpen(false);
          setSelectedLessonDetail(null);
        }
      }
    } catch (err) {
      alert('Lỗi xóa mục: ' + (err.response?.data?.message || err.message));
    }
  };

  // ===== EXAMPLES CRUD (Inside Studio) =====
  const openAddExample = () => {
    setExampleModal({
      isOpen: true,
      mode: 'create',
      id: null,
      title: `Ví dụ ${examplesList.length + 1}`,
      content: '',
      translation: '',
      explanation: '',
      displayOrder: examplesList.length + 1,
    });
  };

  const openEditExample = (ex) => {
    setExampleModal({
      isOpen: true,
      mode: 'edit',
      id: ex.id,
      title: ex.title || '',
      content: ex.content || '',
      translation: ex.translation || '',
      explanation: ex.explanation || '',
      displayOrder: ex.displayOrder || 0,
    });
  };

  const handleSaveExample = async (e) => {
    e.preventDefault();
    if (!selectedLessonDetail) return;
    try {
      const payload = {
        title: exampleModal.title.trim(),
        content: exampleModal.content.trim(),
        translation: exampleModal.translation.trim(),
        explanation: exampleModal.explanation.trim(),
        displayOrder: parseInt(exampleModal.displayOrder, 10) || 0,
      };

      if (exampleModal.mode === 'create') {
        await managerService.createExample(selectedLessonDetail.id, payload);
        showSuccess('Thêm ví dụ minh họa thành công!');
      } else {
        await managerService.updateExample(exampleModal.id, payload);
        showSuccess('Cập nhật ví dụ thành công!');
      }
      setExampleModal({ ...exampleModal, isOpen: false });

      // Reload lesson details
      const refreshed = await managerService.getLessonById(selectedLessonDetail.id);
      setSelectedLessonDetail(refreshed);
      setExamplesList(refreshed.examples || []);
    } catch (err) {
      alert('Lỗi lưu ví dụ: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteExample = async (exampleId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa ví dụ này không?')) return;
    try {
      await managerService.deleteExample(exampleId);
      showSuccess('Đã xóa ví dụ thành công!');
      const refreshed = await managerService.getLessonById(selectedLessonDetail.id);
      setSelectedLessonDetail(refreshed);
      setExamplesList(refreshed.examples || []);
    } catch (err) {
      alert('Lỗi xóa ví dụ: ' + (err.response?.data?.message || err.message));
    }
  };

  // ===== MINI QUIZ CRUD (Inside Studio) =====
  const openAddQuizQuestion = (quiz) => {
    setQuizQuestionModal({
      isOpen: true,
      mode: 'create',
      quizId: quiz?.id || null,
      questionIndex: -1,
      questionText: '',
      options: [
        { text: '', isCorrect: true },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ],
      explanation: '',
    });
  };

  const openEditQuizQuestion = (quiz, qItem, qIndex) => {
    // Parse question structure
    const options = [
      { text: qItem.options?.A || qItem.options?.[0] || '', isCorrect: (qItem.correctAnswer === 'A' || qItem.correctAnswer === 0) },
      { text: qItem.options?.B || qItem.options?.[1] || '', isCorrect: (qItem.correctAnswer === 'B' || qItem.correctAnswer === 1) },
      { text: qItem.options?.C || qItem.options?.[2] || '', isCorrect: (qItem.correctAnswer === 'C' || qItem.correctAnswer === 2) },
      { text: qItem.options?.D || qItem.options?.[3] || '', isCorrect: (qItem.correctAnswer === 'D' || qItem.correctAnswer === 3) },
    ];

    setQuizQuestionModal({
      isOpen: true,
      mode: 'edit',
      quizId: quiz.id,
      questionIndex: qIndex,
      questionText: qItem.question || qItem.content || '',
      options,
      explanation: qItem.explanation || '',
    });
  };

  const handleSaveQuizQuestion = async (e) => {
    e.preventDefault();
    if (!selectedLessonDetail) return;
    try {
      let targetQuiz = miniQuizzesList.find((q) => q.id === quizQuestionModal.quizId);
      let parsedQuestions = [];

      if (targetQuiz && targetQuiz.questionsJson) {
        try {
          parsedQuestions = JSON.parse(targetQuiz.questionsJson) || [];
        } catch {
          parsedQuestions = [];
        }
      }

      // Determine correct answer letter (A, B, C, D)
      const correctIdx = quizQuestionModal.options.findIndex((o) => o.isCorrect);
      const correctLetter = ['A', 'B', 'C', 'D'][correctIdx >= 0 ? correctIdx : 0];

      const newQ = {
        question: quizQuestionModal.questionText.trim(),
        options: {
          A: quizQuestionModal.options[0]?.text.trim() || '',
          B: quizQuestionModal.options[1]?.text.trim() || '',
          C: quizQuestionModal.options[2]?.text.trim() || '',
          D: quizQuestionModal.options[3]?.text.trim() || '',
        },
        correctAnswer: correctLetter,
        explanation: quizQuestionModal.explanation.trim(),
      };

      if (quizQuestionModal.mode === 'create') {
        parsedQuestions.push(newQ);
      } else {
        parsedQuestions[quizQuestionModal.questionIndex] = newQ;
      }

      const questionsJsonStr = JSON.stringify(parsedQuestions);

      if (targetQuiz) {
        // Update existing mini quiz
        await managerService.updateMiniQuiz(targetQuiz.id, {
          title: targetQuiz.title,
          description: targetQuiz.description,
          questionsJson: questionsJsonStr,
        });
      } else {
        // Create new mini quiz for lesson
        await managerService.createMiniQuiz(selectedLessonDetail.id, {
          title: `Kiểm tra nhanh: ${selectedLessonDetail.title}`,
          description: 'Hoàn thành mini-quiz để củng cố kiến thức bài học.',
          questionsJson: questionsJsonStr,
        });
      }

      showSuccess('Cập nhật câu hỏi kiểm tra nhanh thành công!');
      setQuizQuestionModal({ ...quizQuestionModal, isOpen: false });

      // Reload lesson details
      const refreshed = await managerService.getLessonById(selectedLessonDetail.id);
      setSelectedLessonDetail(refreshed);
      setMiniQuizzesList(refreshed.miniQuizzes || []);
    } catch (err) {
      alert('Lỗi lưu câu hỏi quiz: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteQuizQuestion = async (quiz, qIndex) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này không?')) return;
    try {
      let parsed = [];
      try {
        parsed = JSON.parse(quiz.questionsJson) || [];
      } catch {
        parsed = [];
      }
      parsed.splice(qIndex, 1);

      await managerService.updateMiniQuiz(quiz.id, {
        title: quiz.title,
        description: quiz.description,
        questionsJson: JSON.stringify(parsed),
      });

      showSuccess('Đã xóa câu hỏi!');
      const refreshed = await managerService.getLessonById(selectedLessonDetail.id);
      setSelectedLessonDetail(refreshed);
      setMiniQuizzesList(refreshed.miniQuizzes || []);
    } catch (err) {
      alert('Lỗi xóa câu hỏi: ' + (err.response?.data?.message || err.message));
    }
  };

  // Helper Markdown Insertion in Editor
  const insertMarkdown = (prefix, suffix = '') => {
    const textarea = document.getElementById('lesson-content-editor');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end) || 'văn bản mẫu';
    const replacement = `${prefix}${selected}${suffix}`;
    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setLessonStudioForm({ ...lessonStudioForm, content: newContent });
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 50);
  };

  // Sidebar collapse
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // Track expanded subjects/modules in the tree
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [expandedModules, setExpandedModules] = useState({});

  const toggleSubjectExpand = (subId) => {
    setExpandedSubjects((prev) => ({ ...prev, [subId]: !prev[subId] }));
  };
  const toggleModuleExpand = (modId) => {
    setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  // Filtered subjects
  const filteredSubjects = subjects.filter((s) => {
    const matchGrade = gradeFilter === 'ALL' || (gradeFilter === 'NONE' ? !s.grade : s.grade === parseInt(gradeFilter, 10));
    const matchSearch = !searchSubject.trim() || 
      s.name.toLowerCase().includes(searchSubject.toLowerCase()) || 
      (s.code && s.code.toLowerCase().includes(searchSubject.toLowerCase()));
    return matchGrade && matchSearch;
  });

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <span>Quản Lý Môn Học &amp; Nội Dung Bài Giảng</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Biên tập cây kiến thức thích ứng 4 cấp: <span className="font-semibold text-slate-700">Môn học</span> → <span className="font-semibold text-slate-700">Khối kiến thức (Module)</span> → <span className="font-semibold text-slate-700">Chuyên đề (Topic)</span> → <span className="font-semibold text-slate-700">Bài học (Lesson)</span>
          </p>
        </div>

      </div>



      {/* Notifications */}
      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2 shadow-2xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-800 flex items-center gap-2 shadow-2xs">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ====== 2-PANEL LAYOUT: SIDEBAR TREE + MAIN CONTENT ====== */}
      <div className="flex gap-0 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden" style={{ minHeight: '680px', maxHeight: '82vh' }}>
        {/* ====================================================
            LEFT SIDEBAR: Tree Navigator
        ==================================================== */}
        <div
          className="flex flex-col border-r border-slate-200 bg-slate-50 shrink-0 transition-all duration-300"
          style={{ width: sidebarCollapsed ? '48px' : '280px', overflowY: 'auto' }}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-3 py-3 border-b border-slate-200 bg-white shrink-0">
            {!sidebarCollapsed && (
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <FolderTree className="w-4 h-4 text-indigo-600" />
                Cây nội dung
              </span>
            )}
            <button
              type="button"
              onClick={() => setSidebarCollapsed((v) => !v)}
              title={sidebarCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer ml-auto"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
          </div>

          {!sidebarCollapsed && (
            <>
              {/* Search & Filter */}
              <div className="px-3 pt-3 pb-2 space-y-2 shrink-0 bg-white border-b border-slate-100">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm môn học..."
                    value={searchSubject}
                    onChange={(e) => setSearchSubject(e.target.value)}
                    className="w-full text-xs pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-[10px]">
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
                      className={`px-2 py-1 rounded-md font-bold transition cursor-pointer shrink-0 ${
                        gradeFilter === f.id
                          ? 'bg-indigo-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subjects + "Add" button */}
              <div className="px-3 pt-2 pb-1 flex items-center justify-between shrink-0">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Môn học ({filteredSubjects.length})
                </span>
                <button
                  type="button"
                  onClick={openCreateSubjectModal}
                  title="Thêm Môn học mới"
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-0.5 bg-indigo-50 hover:bg-indigo-100 px-1.5 py-0.5 rounded-md transition cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  Thêm
                </button>
              </div>

              {/* Tree list */}
              <div className="flex-1 overflow-y-auto px-2 pb-4">
                {loading ? (
                  <div className="py-10 text-center text-xs text-slate-400">Đang tải...</div>
                ) : filteredSubjects.length === 0 ? (
                  <div className="py-10 text-center text-xs text-slate-400">Không có môn học.</div>
                ) : (
                  filteredSubjects.map((sub) => {
                    const isSubSelected = selectedSubject?.id === sub.id;
                    const isSubExpanded = expandedSubjects[sub.id];
                    const subModules = isSubSelected ? modules : [];
                    return (
                      <div key={sub.id} className="mb-0.5">
                        {/* Subject row */}
                        <div
                          className={`group flex items-center gap-1 rounded-lg px-2 py-1.5 cursor-pointer transition ${
                            isSubSelected
                              ? 'bg-indigo-100 text-indigo-900'
                              : 'hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              toggleSubjectExpand(sub.id);
                              if (!isSubSelected) handleSelectSubject(sub);
                            }}
                            className="shrink-0 p-0.5 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                          >
                            {isSubExpanded && isSubSelected
                              ? <ChevronDown className="w-3.5 h-3.5" />
                              : <ChevronRight className="w-3.5 h-3.5" />
                            }
                          </button>
                          <BookOpen className={`w-3.5 h-3.5 shrink-0 ${isSubSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                          <span
                            className="flex-1 text-xs font-semibold truncate min-w-0"
                            onClick={() => {
                              setExpandedSubjects((prev) => ({ ...prev, [sub.id]: true }));
                              handleSelectSubject(sub);
                            }}
                          >
                            {sub.name}
                            {sub.grade && (
                              <span className="ml-1 text-[9px] font-bold text-indigo-500">K{sub.grade}</span>
                            )}
                          </span>
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 shrink-0">
                            <button
                              type="button"
                              title="Sửa môn học"
                              onClick={(e) => openEditSubjectModal(sub, e)}
                              className="p-0.5 text-slate-400 hover:text-indigo-600 rounded transition"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              title="Xóa môn học"
                              onClick={(e) => promptDelete('subject', sub, e)}
                              className="p-0.5 text-slate-400 hover:text-rose-600 rounded transition"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Modules under this subject */}
                        {isSubExpanded && isSubSelected && (
                          <div className="ml-4 mt-0.5">
                            {modulesLoading ? (
                              <div className="text-[10px] text-slate-400 px-2 py-1">Đang tải...</div>
                            ) : (
                              <>
                                {subModules.map((mod) => {
                                  const isModSelected = selectedModule?.id === mod.id;
                                  const isModExpanded = expandedModules[mod.id];
                                  const modTopics = isModSelected ? topics : [];
                                  return (
                                    <div key={mod.id} className="mb-0.5">
                                      {/* Module row */}
                                      <div
                                        className={`group flex items-center gap-1 rounded-lg px-2 py-1.5 cursor-pointer transition ${
                                          isModSelected
                                            ? 'bg-blue-100 text-blue-900'
                                            : 'hover:bg-slate-100 text-slate-600'
                                        }`}
                                      >
                                        <button
                                          type="button"
                                          onClick={() => {
                                            toggleModuleExpand(mod.id);
                                            if (!isModSelected) handleSelectModule(mod);
                                          }}
                                          className="shrink-0 p-0.5 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                                        >
                                          {isModExpanded && isModSelected
                                            ? <ChevronDown className="w-3 h-3" />
                                            : <ChevronRight className="w-3 h-3" />
                                          }
                                        </button>
                                        <Layers className={`w-3.5 h-3.5 shrink-0 ${isModSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                                        <span
                                          className="flex-1 text-xs font-medium truncate min-w-0"
                                          onClick={() => {
                                            setExpandedModules((prev) => ({ ...prev, [mod.id]: true }));
                                            handleSelectModule(mod);
                                          }}
                                        >
                                          {mod.name}
                                        </span>
                                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 shrink-0">
                                          <button type="button" title="Sửa module" onClick={(e) => openEditModuleModal(mod, e)} className="p-0.5 text-slate-400 hover:text-blue-600 rounded transition"><Edit3 className="w-3 h-3" /></button>
                                          <button type="button" title="Xóa module" onClick={(e) => promptDelete('module', mod, e)} className="p-0.5 text-slate-400 hover:text-rose-600 rounded transition"><Trash2 className="w-3 h-3" /></button>
                                        </div>
                                      </div>

                                      {/* Topics under this module */}
                                      {isModExpanded && isModSelected && (
                                        <div className="ml-4 mt-0.5">
                                          {topicsLoading ? (
                                            <div className="text-[10px] text-slate-400 px-2 py-1">Đang tải...</div>
                                          ) : modTopics.length === 0 ? (
                                            <div className="text-[10px] text-slate-400 px-2 py-1 italic">Chưa có topic</div>
                                          ) : (
                                            modTopics.map((topic) => {
                                              const isTopicSelected = selectedTopic?.id === topic.id;
                                              return (
                                                <div
                                                  key={topic.id}
                                                  className={`group flex items-center gap-1.5 rounded-lg px-2 py-1.5 cursor-pointer transition ${
                                                    isTopicSelected
                                                      ? 'bg-violet-100 text-violet-900 font-bold'
                                                      : 'hover:bg-slate-100 text-slate-600'
                                                  }`}
                                                  onClick={() => handleSelectTopic(topic)}
                                                >
                                                  <FolderTree className={`w-3.5 h-3.5 shrink-0 ${isTopicSelected ? 'text-violet-600' : 'text-slate-400'}`} />
                                                  <span className="flex-1 text-xs truncate min-w-0">{topic.name}</span>
                                                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 shrink-0">
                                                    <button type="button" title="Sửa topic" onClick={(e) => openEditTopicModal(topic, e)} className="p-0.5 text-slate-400 hover:text-violet-600 rounded transition"><Edit3 className="w-3 h-3" /></button>
                                                    <button type="button" title="Xóa topic" onClick={(e) => promptDelete('topic', topic, e)} className="p-0.5 text-slate-400 hover:text-rose-600 rounded transition"><Trash2 className="w-3 h-3" /></button>
                                                  </div>
                                                </div>
                                              );
                                            })
                                          )}
                                          {/* Add Topic button */}
                                          {isModSelected && (
                                            <button
                                              type="button"
                                              onClick={openCreateTopicModal}
                                              className="flex items-center gap-1 text-[10px] text-violet-600 hover:text-violet-800 font-bold px-2 py-1 hover:bg-violet-50 rounded-md transition cursor-pointer w-full"
                                            >
                                              <Plus className="w-3 h-3" />
                                              Thêm chuyên đề
                                            </button>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                                {/* Add Module button */}
                                {isSubSelected && (
                                  <button
                                    type="button"
                                    onClick={openCreateModuleModal}
                                    className="flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-800 font-bold px-2 py-1 hover:bg-blue-50 rounded-md transition cursor-pointer w-full"
                                  >
                                    <Plus className="w-3 h-3" />
                                    Thêm module
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>

        {/* ====================================================
            RIGHT PANEL: Lesson Cards (Main Content)
        ==================================================== */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Panel Header / Breadcrumb */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-white shrink-0 flex-wrap gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 flex-wrap">
              {selectedSubject ? (
                <>
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="font-semibold text-slate-900">{selectedSubject.name}</span>
                  {selectedModule && (
                    <>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                      <Layers className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="font-semibold text-slate-800">{selectedModule.name}</span>
                    </>
                  )}
                  {selectedTopic && (
                    <>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                      <FolderTree className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                      <span className="font-semibold text-violet-800">{selectedTopic.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-md">
                        {lessons.length} bài học
                      </span>
                    </>
                  )}
                </>
              ) : (
                <span className="text-slate-400 italic">Chọn một môn học từ cây bên trái để bắt đầu.</span>
              )}
            </div>
            {selectedTopic && (
              <button
                type="button"
                onClick={openCreateLessonModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm bài học
              </button>
            )}
          </div>

          {/* Lessons Grid */}
          <div className="flex-1 overflow-y-auto p-5">
            {!selectedSubject ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
                <FolderTree className="w-12 h-12 mb-3 text-slate-200" />
                <p className="text-sm font-semibold">Chưa chọn môn học</p>
                <p className="text-xs mt-1">Chọn môn học → Module → Chuyên đề từ cây bên trái để xem bài học.</p>
              </div>
            ) : !selectedModule ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
                <Layers className="w-12 h-12 mb-3 text-slate-200" />
                <p className="text-sm font-semibold">Chưa chọn Module</p>
                <p className="text-xs mt-1">Mở rộng môn học trong cây bên trái và chọn một Module.</p>
              </div>
            ) : !selectedTopic ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
                <FolderTree className="w-12 h-12 mb-3 text-slate-200" />
                <p className="text-sm font-semibold">Chưa chọn Chuyên đề</p>
                <p className="text-xs mt-1">Mở rộng Module trong cây bên trái và chọn một Chuyên đề (Topic).</p>
              </div>
            ) : lessonsLoading ? (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                Đang tải bài học...
              </div>
            ) : lessons.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
                <BookMarked className="w-12 h-12 mb-3 text-slate-200" />
                <p className="text-sm font-semibold">Chưa có bài học nào</p>
                <p className="text-xs mt-1">Nhấn <strong>+ Thêm bài học</strong> để tạo bài giảng đầu tiên cho chuyên đề này.</p>
                <button
                  type="button"
                  onClick={openCreateLessonModal}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Thêm bài học đầu tiên
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {lessons.map((les) => (
                  <div
                    key={les.id}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group"
                  >
                    {/* Card top color band */}
                    <div className={`h-1.5 w-full ${les.isRemedial ? 'bg-amber-400' : 'bg-emerald-500'}`} />

                    <div className="p-4 flex flex-col flex-1 gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2 flex-1">
                          {les.title}
                        </h4>
                        {les.isRemedial ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">BỔ TRỢ</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">CHUẨN</span>
                        )}
                      </div>

                      {les.theorySummary && (
                        <p className="text-[11px] text-slate-500 line-clamp-2 italic leading-relaxed bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                          "{les.theorySummary}"
                        </p>
                      )}

                      {!les.theorySummary && les.content && (
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {les.content}
                        </p>
                      )}

                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-auto pt-1">
                        <Hash className="w-3 h-3" />
                        <span>Thứ tự: {les.displayOrder || '—'}</span>
                      </div>

                      {/* Actions */}
                      <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenStudio(les)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[11px] font-bold shadow-xs transition cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          Biên tập Studio
                        </button>
                        <button
                          type="button"
                          title="Xóa bài học"
                          onClick={(e) => promptDelete('lesson', les, e)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition border border-slate-200 hover:border-rose-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>



      {/* =========================================================================
          RICH LESSON CONTENT STUDIO MODAL (Biên tập & Xem trước chuyên sâu)
      ========================================================================= */}
      {isStudioOpen && selectedLessonDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Studio Top Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                  <span>{selectedSubject?.name}</span>
                  <span>•</span>
                  <span>{selectedModule?.name}</span>
                  <span>•</span>
                  <span className="text-indigo-300 font-semibold">{selectedTopic?.name}</span>
                </div>
                <h2 className="text-base font-bold text-white truncate flex items-center gap-2 mt-0.5">
                  <BookMarked className="w-4 h-4 text-emerald-400" />
                  <span>{lessonStudioForm.title || selectedLessonDetail.title}</span>
                  {lessonStudioForm.isRemedial && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-amber-400 text-slate-950">
                      BÀI HỌC BỔ TRỢ
                    </span>
                  )}
                </h2>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleSaveLessonStudio}
                  className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Lưu thay đổi bài học</span>
                </button>
                <button
                  onClick={() => setIsStudioOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Studio Main Navigation Tabs */}
            <div className="flex items-center px-4 bg-slate-100 border-b border-slate-200 shrink-0 overflow-x-auto">
              {[
                { id: 'theory', label: '1. Lý thuyết cốt lõi & Tóm tắt', icon: FileText, count: null },
                { id: 'examples', label: '2. Ví dụ minh họa thực tế', icon: BookOpen, count: examplesList.length },
                { id: 'quiz', label: '3. Kiểm tra nhanh (Mini Quiz)', icon: HelpCircle, count: miniQuizzesList.reduce((acc, q) => {
                  try { return acc + (JSON.parse(q.questionsJson || '[]').length); } catch { return acc; }
                }, 0) },
                { id: 'preview', label: '4. Xem trước góc nhìn Học sinh', icon: Eye, count: null },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = studioActiveTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setStudioActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'border-indigo-600 text-indigo-700 bg-white shadow-2xs'
                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                    {tab.count !== null && (
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'}`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Studio Body Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
              {studioLoading ? (
                <div className="py-20 text-center text-sm text-slate-500">Đang tải dữ liệu bài học...</div>
              ) : (
                <>
                  {/* ========================================================
                      TAB 1: LÝ THUYẾT & TÓM TẮT
                  ======================================================== */}
                  {studioActiveTab === 'theory' && (
                    <form onSubmit={handleSaveLessonStudio} className="space-y-4 max-w-4xl mx-auto">
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                        <div className="sm:col-span-8">
                          <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu đề bài học *</label>
                          <input
                            type="text"
                            required
                            value={lessonStudioForm.title}
                            onChange={(e) => setLessonStudioForm({ ...lessonStudioForm, title: e.target.value })}
                            className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">Thứ tự (#)</label>
                          <input
                            type="number"
                            value={lessonStudioForm.displayOrder}
                            onChange={(e) => setLessonStudioForm({ ...lessonStudioForm, displayOrder: e.target.value })}
                            className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                          />
                        </div>
                        <div className="sm:col-span-2 flex items-end pb-2">
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                            <input
                              type="checkbox"
                              checked={lessonStudioForm.isRemedial}
                              onChange={(e) => setLessonStudioForm({ ...lessonStudioForm, isRemedial: e.target.checked })}
                              className="rounded text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>Bài bổ trợ</span>
                          </label>
                        </div>
                      </div>

                      {/* Theory Summary */}
                      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                        <label className="block text-xs font-bold text-slate-700">Tóm tắt lý thuyết (Hiển thị đầu trang cho học sinh)</label>
                        <p className="text-[11px] text-slate-400">Đoạn văn ngắn gọn, cô đọng nội dung trọng tâm bài học.</p>
                        <textarea
                          rows={2}
                          placeholder="Ví dụ: Trong bài này chúng ta phân biệt Present Simple và Present Continuous theo ngữ cảnh thực tế..."
                          value={lessonStudioForm.theorySummary}
                          onChange={(e) => setLessonStudioForm({ ...lessonStudioForm, theorySummary: e.target.value })}
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      {/* Core Content Editor */}
                      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                        <div className="p-3 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setTheoryEditorTab('write')}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                                theoryEditorTab === 'write' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Soạn thảo (Markdown)
                            </button>
                            <button
                              type="button"
                              onClick={() => setTheoryEditorTab('preview')}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                                theoryEditorTab === 'preview' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Xem trước trực tiếp (Live Preview)
                            </button>
                          </div>

                          {theoryEditorTab === 'write' && (
                            <div className="flex items-center gap-1 text-slate-600">
                              <button type="button" onClick={() => insertMarkdown('## ')} title="Heading 2" className="p-1 hover:bg-slate-200 rounded"><Heading2 className="w-3.5 h-3.5" /></button>
                              <button type="button" onClick={() => insertMarkdown('**', '**')} title="In đậm" className="p-1 hover:bg-slate-200 rounded"><Bold className="w-3.5 h-3.5" /></button>
                              <button type="button" onClick={() => insertMarkdown('*', '*')} title="In nghiêng" className="p-1 hover:bg-slate-200 rounded"><Italic className="w-3.5 h-3.5" /></button>
                              <button type="button" onClick={() => insertMarkdown('- ')} title="Danh sách" className="p-1 hover:bg-slate-200 rounded"><List className="w-3.5 h-3.5" /></button>
                              <button type="button" onClick={() => insertMarkdown('> ')} title="Trích dẫn" className="p-1 hover:bg-slate-200 rounded"><Quote className="w-3.5 h-3.5" /></button>
                              <button type="button" onClick={() => insertMarkdown('```\n', '\n```')} title="Khối mã/Code" className="p-1 hover:bg-slate-200 rounded"><Code className="w-3.5 h-3.5" /></button>
                            </div>
                          )}
                        </div>

                        {theoryEditorTab === 'write' ? (
                          <div className="p-3">
                            <textarea
                              id="lesson-content-editor"
                              rows={14}
                              required
                              value={lessonStudioForm.content}
                              onChange={(e) => setLessonStudioForm({ ...lessonStudioForm, content: e.target.value })}
                              className="w-full text-xs sm:text-sm font-mono p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                              placeholder="Nhập nội dung bài học bằng Markdown..."
                            />
                          </div>
                        ) : (
                          <div className="p-6 prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed min-h-[300px] bg-white">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {lessonStudioForm.content || '*Chưa có nội dung lý thuyết.*'}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
                        >
                          Lưu nội dung lý thuyết bài học
                        </button>
                      </div>
                    </form>
                  )}

                  {/* ========================================================
                      TAB 2: VÍ DỤ MINH HỌA THỰC TẾ (EXAMPLES)
                  ======================================================== */}
                  {studioActiveTab === 'examples' && (
                    <div className="space-y-4 max-w-4xl mx-auto">
                      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">Danh sách Ví dụ Minh họa Thực tế</h3>
                          <p className="text-xs text-slate-500">Giúp học sinh quan sát mẫu câu, ngữ cảnh áp dụng thực tế và phân tích cấu trúc.</p>
                        </div>
                        <button
                          type="button"
                          onClick={openAddExample}
                          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Thêm ví dụ mới</span>
                        </button>
                      </div>

                      {examplesList.length === 0 ? (
                        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                          <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
                          <div className="text-xs text-slate-500">Bài học này chưa có ví dụ minh họa nào.</div>
                          <button
                            onClick={openAddExample}
                            className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold rounded-xl transition"
                          >
                            + Thêm ví dụ đầu tiên
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {examplesList.map((ex, idx) => (
                            <div key={ex.id || idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <span className="text-[11px] font-extrabold text-indigo-600 uppercase tracking-wider">
                                  Ví dụ {idx + 1}: {ex.title || 'Mẫu câu minh họa'}
                                </span>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => openEditExample(ex)}
                                    className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteExample(ex.id)}
                                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              <div className="text-sm font-semibold text-slate-900 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                "{ex.content}"
                              </div>

                              {ex.translation && (
                                <div className="text-xs text-slate-600">
                                  <span className="font-bold text-slate-800">Dịch nghĩa: </span>
                                  <span>{ex.translation}</span>
                                </div>
                              )}

                              {ex.explanation && (
                                <div className="text-xs text-slate-600 bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                                  <span className="font-bold text-amber-900">Phân tích: </span>
                                  <span>{ex.explanation}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ========================================================
                      TAB 3: KIỂM TRA NHANH (MINI QUIZ)
                  ======================================================== */}
                  {studioActiveTab === 'quiz' && (
                    <div className="space-y-4 max-w-4xl mx-auto">
                      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">Ngân hàng Câu hỏi Kiểm tra nhanh (Mini Quiz)</h3>
                          <p className="text-xs text-slate-500">Học sinh hoàn thành tối thiểu 2 câu đúng để mở khóa bài học tiếp theo trong Topic.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => openAddQuizQuestion(miniQuizzesList[0])}
                          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Thêm câu hỏi trắc nghiệm</span>
                        </button>
                      </div>

                      {miniQuizzesList.length === 0 || miniQuizzesList.every(q => {
                        try { return JSON.parse(q.questionsJson || '[]').length === 0; } catch { return true; }
                      }) ? (
                        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                          <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
                          <div className="text-xs text-slate-500">Chưa có câu hỏi kiểm tra nhanh nào cho bài học này.</div>
                          <button
                            onClick={() => openAddQuizQuestion(miniQuizzesList[0])}
                            className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold rounded-xl transition"
                          >
                            + Thêm câu hỏi đầu tiên
                          </button>
                        </div>
                      ) : (
                        miniQuizzesList.map((quiz, qzIdx) => {
                          let questions = [];
                          try {
                            questions = JSON.parse(quiz.questionsJson) || [];
                          } catch {
                            questions = [];
                          }
                          return (
                            <div key={quiz.id || qzIdx} className="space-y-3">
                              {questions.map((q, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                                    <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                                      <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-extrabold text-[11px]">
                                        {idx + 1}
                                      </span>
                                      <span>{q.question || q.content}</span>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                      <button
                                        onClick={() => openEditQuizQuestion(quiz, q, idx)}
                                        className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteQuizQuestion(quiz, idx)}
                                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                    {['A', 'B', 'C', 'D'].map((letter) => {
                                      const text = q.options ? (q.options[letter] || q.options[letter.charCodeAt(0) - 65]) : '';
                                      const isCorrect = q.correctAnswer === letter;
                                      return (
                                        <div
                                          key={letter}
                                          className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                                            isCorrect
                                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                                              : 'bg-slate-50 border-slate-200 text-slate-700'
                                          }`}
                                        >
                                          <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black ${
                                            isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                                          }`}>
                                            {letter}
                                          </span>
                                          <span className="truncate">{text || `(Lựa chọn ${letter})`}</span>
                                          {isCorrect && (
                                            <span className="ml-auto text-[9px] uppercase font-bold text-emerald-700 bg-emerald-100 px-1 rounded">
                                              Đúng
                                            </span>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {q.explanation && (
                                    <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                      <span className="font-bold text-slate-700">Giải thích: </span>
                                      <span>{q.explanation}</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}

                  {/* ========================================================
                      TAB 4: XEM TRƯỚC GÓC NHÌN HỌC SINH (LEARNER PREVIEW)
                  ======================================================== */}
                  {studioActiveTab === 'preview' && (
                    <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                      <div className="border-b border-slate-100 pb-4">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          {selectedModule?.name || 'Khối kiến thức'} • {selectedTopic?.name}
                        </div>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                          {lessonStudioForm.title}
                        </h1>
                        {lessonStudioForm.theorySummary && (
                          <div className="mt-3 p-3.5 bg-indigo-50/70 border-l-4 border-indigo-600 rounded-r-xl text-xs text-indigo-950 font-medium leading-relaxed">
                            {lessonStudioForm.theorySummary}
                          </div>
                        )}
                      </div>

                      {/* 1. Core theory */}
                      <section className="space-y-3">
                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
                          1. Lý thuyết cốt lõi
                        </h2>
                        <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {lessonStudioForm.content || '*Chưa có nội dung lý thuyết.*'}
                          </ReactMarkdown>
                        </div>
                      </section>

                      {/* 2. Examples */}
                      {examplesList.length > 0 && (
                        <section className="space-y-3 pt-4 border-t border-slate-100">
                          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
                            2. Ví dụ minh họa thực tế
                          </h2>
                          <div className="space-y-3">
                            {examplesList.map((ex, idx) => (
                              <div key={ex.id || idx} className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1.5">
                                <div className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider">
                                  VÍ DỤ {idx + 1} — {ex.title || 'MẪU CÂU'}
                                </div>
                                <div className="text-sm font-bold text-indigo-950 italic">
                                  "{ex.content}"
                                </div>
                                {ex.translation && (
                                  <div className="text-xs text-slate-600">
                                    <span className="font-bold">Dịch nghĩa: </span>{ex.translation}
                                  </div>
                                )}
                                {ex.explanation && (
                                  <div className="text-xs text-slate-600 pt-1 border-t border-slate-100">
                                    <span className="font-bold">Phân tích: </span>{ex.explanation}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </section>
                      )}

                      {/* 3. Mini Quiz */}
                      {miniQuizzesList.length > 0 && (
                        <section className="space-y-3 pt-4 border-t border-slate-100">
                          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
                            3. Kiểm tra nhanh (Mini Quiz)
                          </h2>
                          <p className="text-xs text-slate-500">
                            Hoàn thành đúng tối thiểu 2 câu quiz để hệ thống đánh dấu đã học và mở khóa bài tiếp theo.
                          </p>
                          <div className="space-y-4">
                            {miniQuizzesList.map((quiz, qzIdx) => {
                              let questions = [];
                              try { questions = JSON.parse(quiz.questionsJson) || []; } catch { questions = []; }
                              return questions.map((q, idx) => (
                                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                                  <div className="font-bold text-xs text-slate-900">
                                    Câu {idx + 1}: {q.question || q.content}
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                    {['A', 'B', 'C', 'D'].map((letter) => {
                                      const text = q.options ? (q.options[letter] || q.options[letter.charCodeAt(0) - 65]) : '';
                                      return (
                                        <div key={letter} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center gap-2">
                                          <span className="w-5 h-5 rounded-md bg-white border border-slate-200 font-bold flex items-center justify-center text-[10px]">
                                            {letter}
                                          </span>
                                          <span>{text}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ));
                            })}
                          </div>
                        </section>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: THÊM / SỬA MÔN HỌC (SUBJECT)
      ========================================================================= */}
      {isSubjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {subjectModalMode === 'create' ? 'Thêm Môn học mới' : 'Chỉnh sửa Môn học'}
              </h3>
              <button onClick={() => setIsSubjectModalOpen(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitSubject} className="py-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mã môn học *</label>
                <input
                  type="text"
                  required
                  placeholder="ví dụ: MATH_10, ENGLISH_10"
                  value={subjectForm.code}
                  onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên môn học *</label>
                <input
                  type="text"
                  required
                  placeholder="ví dụ: Tiếng Anh 10"
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Khối lớp (Trình độ)</label>
                <select
                  value={subjectForm.grade || ''}
                  onChange={(e) => setSubjectForm({ ...subjectForm, grade: e.target.value })}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                >
                  <option value="">-- Môn chung (Không phân khối) --</option>
                  <option value="10">Khối 10 (Lớp 10)</option>
                  <option value="11">Khối 11 (Lớp 11)</option>
                  <option value="12">Khối 12 (Lớp 12)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả chương trình học</label>
                <textarea
                  rows={3}
                  placeholder="Mô tả nội dung chương trình học..."
                  value={subjectForm.description}
                  onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsSubjectModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">Hủy</button>
                <button type="submit" className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs">
                  {subjectModalMode === 'create' ? 'Tạo môn học' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: THÊM / SỬA MODULE
      ========================================================================= */}
      {isModuleModalOpen && selectedSubject && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {moduleModalMode === 'create' ? `Thêm Module cho ${selectedSubject.name}` : 'Chỉnh sửa Module'}
              </h3>
              <button onClick={() => setIsModuleModalOpen(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitModule} className="py-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mã module *</label>
                <input
                  type="text"
                  required
                  placeholder="ví dụ: GRAMMAR_G10, VOCAB_G10"
                  value={moduleForm.code}
                  onChange={(e) => setModuleForm({ ...moduleForm, code: e.target.value })}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên module *</label>
                <input
                  type="text"
                  required
                  placeholder="ví dụ: Chuyên đề Ngữ pháp Trọng tâm"
                  value={moduleForm.name}
                  onChange={(e) => setModuleForm({ ...moduleForm, name: e.target.value })}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Thứ tự hiển thị (#)</label>
                <input
                  type="number"
                  value={moduleForm.displayOrder}
                  onChange={(e) => setModuleForm({ ...moduleForm, displayOrder: e.target.value })}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả module</label>
                <textarea
                  rows={3}
                  placeholder="Mô tả nội dung module..."
                  value={moduleForm.description}
                  onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsModuleModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">Hủy</button>
                <button type="submit" className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs">
                  {moduleModalMode === 'create' ? 'Tạo module' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: THÊM / SỬA TOPIC
      ========================================================================= */}
      {isTopicModalOpen && selectedModule && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {topicModalMode === 'create' ? `Thêm Topic cho ${selectedModule.name}` : 'Chỉnh sửa Topic'}
              </h3>
              <button onClick={() => setIsTopicModalOpen(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitTopic} className="py-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mã topic *</label>
                <input
                  type="text"
                  required
                  placeholder="ví dụ: UNIT1_GRAMMAR, VERB_TENSES"
                  value={topicForm.code}
                  onChange={(e) => setTopicForm({ ...topicForm, code: e.target.value })}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên topic *</label>
                <input
                  type="text"
                  required
                  placeholder="ví dụ: Unit 1: Present Simple vs. Present Continuous"
                  value={topicForm.name}
                  onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Thứ tự hiển thị (#)</label>
                <input
                  type="number"
                  value={topicForm.displayOrder}
                  onChange={(e) => setTopicForm({ ...topicForm, displayOrder: e.target.value })}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả topic &amp; mục tiêu chuẩn đầu ra</label>
                <textarea
                  rows={3}
                  placeholder="Mô tả chủ đề và chuẩn đầu ra..."
                  value={topicForm.description}
                  onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsTopicModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">Hủy</button>
                <button type="submit" className="px-5 py-2 text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-xs">
                  {topicModalMode === 'create' ? 'Tạo topic' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: THÊM BÀI HỌC (CREATE LESSON QUICK FORM)
      ========================================================================= */}
      {isLessonCreateModalOpen && selectedTopic && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                Thêm Bài học mới cho {selectedTopic.name}
              </h3>
              <button onClick={() => setIsLessonCreateModalOpen(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateLesson} className="py-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu đề bài học *</label>
                <input
                  type="text"
                  required
                  placeholder="ví dụ: Unit 1: Present Simple & Stative Verbs"
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tóm tắt ngắn gọn</label>
                <textarea
                  rows={2}
                  placeholder="Tóm tắt lý thuyết hiển thị cho học sinh..."
                  value={lessonForm.theorySummary}
                  onChange={(e) => setLessonForm({ ...lessonForm, theorySummary: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nội dung lý thuyết (Markdown) *</label>
                <textarea
                  rows={6}
                  required
                  value={lessonForm.content}
                  onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                  className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl p-3"
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={lessonForm.isRemedial}
                    onChange={(e) => setLessonForm({ ...lessonForm, isRemedial: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Bài học bổ trợ (Remedial Learning)</span>
                </label>
                <div className="w-24">
                  <input
                    type="number"
                    placeholder="Thứ tự"
                    value={lessonForm.displayOrder}
                    onChange={(e) => setLessonForm({ ...lessonForm, displayOrder: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-center font-bold"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsLessonCreateModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">Hủy</button>
                <button type="submit" className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs">
                  Thêm &amp; Mở Studio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: THÊM / SỬA VÍ DỤ MINH HỌA (EXAMPLE MODAL)
      ========================================================================= */}
      {exampleModal.isOpen && (
        <div className="fixed inset-0 z-60 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {exampleModal.mode === 'create' ? 'Thêm Ví dụ Minh họa' : 'Chỉnh sửa Ví dụ'}
              </h3>
              <button onClick={() => setExampleModal({ ...exampleModal, isOpen: false })} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveExample} className="py-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu đề ví dụ</label>
                <input
                  type="text"
                  placeholder="ví dụ: Ví dụ 1 — Stative Verb Meaning"
                  value={exampleModal.title}
                  onChange={(e) => setExampleModal({ ...exampleModal, title: e.target.value })}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nội dung câu mẫu / biểu thức *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="ví dụ: 'I think recycling old newspapers is very important.'"
                  value={exampleModal.content}
                  onChange={(e) => setExampleModal({ ...exampleModal, content: e.target.value })}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 italic font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dịch nghĩa tiếng Việt</label>
                <textarea
                  rows={2}
                  placeholder="ví dụ: Tôi nghĩ việc tái chế báo cũ là rất quan trọng."
                  value={exampleModal.translation}
                  onChange={(e) => setExampleModal({ ...exampleModal, translation: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phân tích ngữ cảnh / giải thích chuyên sâu</label>
                <textarea
                  rows={3}
                  placeholder="ví dụ: 'Think' ở đây diễn tả quan điểm, nên phải chia ở thì Present Simple..."
                  value={exampleModal.explanation}
                  onChange={(e) => setExampleModal({ ...exampleModal, explanation: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setExampleModal({ ...exampleModal, isOpen: false })} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">Hủy</button>
                <button type="submit" className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs">
                  {exampleModal.mode === 'create' ? 'Thêm ví dụ' : 'Lưu ví dụ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: THÊM / SỬA CÂU HỎI TRẮC NGHIỆM MINI QUIZ
      ========================================================================= */}
      {quizQuestionModal.isOpen && (
        <div className="fixed inset-0 z-60 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {quizQuestionModal.mode === 'create' ? 'Thêm Câu hỏi Kiểm tra nhanh' : 'Chỉnh sửa Câu hỏi'}
              </h3>
              <button onClick={() => setQuizQuestionModal({ ...quizQuestionModal, isOpen: false })} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveQuizQuestion} className="py-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nội dung câu hỏi *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="ví dụ: By the time the teacher arrived, all students ___ their homework."
                  value={quizQuestionModal.questionText}
                  onChange={(e) => setQuizQuestionModal({ ...quizQuestionModal, questionText: e.target.value })}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                />
              </div>

              {/* 4 Options */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Các phương án trả lời &amp; Chọn đáp án đúng *</label>
                {['A', 'B', 'C', 'D'].map((letter, idx) => (
                  <div key={letter} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const newOpts = quizQuestionModal.options.map((o, i) => ({
                          ...o,
                          isCorrect: i === idx,
                        }));
                        setQuizQuestionModal({ ...quizQuestionModal, options: newOpts });
                      }}
                      className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center transition cursor-pointer shrink-0 ${
                        quizQuestionModal.options[idx]?.isCorrect
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                      title={quizQuestionModal.options[idx]?.isCorrect ? 'Đáp án đúng' : 'Click để chọn làm đáp án đúng'}
                    >
                      {letter}
                    </button>
                    <input
                      type="text"
                      required
                      placeholder={`Nội dung phương án ${letter}...`}
                      value={quizQuestionModal.options[idx]?.text || ''}
                      onChange={(e) => {
                        const newOpts = [...quizQuestionModal.options];
                        newOpts[idx] = { ...newOpts[idx], text: e.target.value };
                        setQuizQuestionModal({ ...quizQuestionModal, options: newOpts });
                      }}
                      className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lời giải thích chi tiết</label>
                <textarea
                  rows={2}
                  placeholder="Giải thích tại sao chọn đáp án này..."
                  value={quizQuestionModal.explanation}
                  onChange={(e) => setQuizQuestionModal({ ...quizQuestionModal, explanation: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setQuizQuestionModal({ ...quizQuestionModal, isOpen: false })} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">Hủy</button>
                <button type="submit" className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs">
                  Lưu câu hỏi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: XÁC NHẬN XÓA AN TOÀN (DELETE CONFIRMATION)
      ========================================================================= */}
      {deleteDialog.isOpen && (
        <div className="fixed inset-0 z-70 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 leading-snug">
                Xác nhận xóa: {deleteDialog.title}
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {deleteDialog.warningText}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteDialog({ isOpen: false, type: '', id: null, title: '', warningText: '' })}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={executeDelete}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import managerService from '../../services/managerService';
import { 
  HelpCircle, Plus, Filter, Trash2, CheckCircle2, 
  X, FolderPlus, Sparkles, BookOpen, AlertCircle, Check 
} from 'lucide-react';

export default function QuestionBankManagerPage() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [skills, setSkills] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Modals
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

  // Forms
  const [bankForm, setBankForm] = useState({ name: '', description: '' });
  const [questionForm, setQuestionForm] = useState({
    skillId: '',
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

  // When subject changes, load skills for that subject
  useEffect(() => {
    if (selectedSubjectId) {
      managerService.getSkillsBySubject(selectedSubjectId).then((data) => {
        setSkills(data || []);
        if (data && data.length > 0) {
          setQuestionForm((prev) => ({ ...prev, skillId: data[0].id }));
        }
      });
    }
  }, [selectedSubjectId]);

  const handleSelectBank = async (bank) => {
    setSelectedBank(bank);
    setSelectedSubjectId(bank.subjectId);
    loadQuestions(bank.id, difficultyFilter);
  };

  const loadQuestions = async (bankId, difficulty) => {
    setQuestionsLoading(true);
    try {
      const data = await managerService.getQuestionsForManager({
        questionBankId: bankId,
        difficulty: difficulty,
      });
      setQuestions(data || []);
    } catch (err) {
      console.error('Lỗi tải câu hỏi:', err);
    } finally {
      setQuestionsLoading(false);
    }
  };

  const handleDifficultyFilterChange = (diff) => {
    setDifficultyFilter(diff);
    if (selectedBank) {
      loadQuestions(selectedBank.id, diff);
    }
  };

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

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    if (!selectedBank) return;
    try {
      await managerService.createQuestion({
        questionBankId: selectedBank.id,
        skillId: questionForm.skillId || (skills[0] && skills[0].id),
        content: questionForm.content,
        difficulty: questionForm.difficulty,
        explanation: questionForm.explanation,
        options: questionForm.options,
      });
      setIsQuestionModalOpen(false);
      setQuestionForm({
        skillId: skills[0]?.id || '',
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
      setSuccessMsg('Thêm câu hỏi mới thành công!');
      setTimeout(() => setSuccessMsg(''), 4000);
      loadQuestions(selectedBank.id, difficultyFilter);
      // refresh question count
      const updated = await managerService.getQuestionBanks();
      setBanks(updated || []);
    } catch (err) {
      alert('Lỗi tạo câu hỏi: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này khỏi ngân hàng đề?')) return;
    try {
      await managerService.deleteQuestion(questionId);
      setSuccessMsg('Đã xóa câu hỏi thành công.');
      setTimeout(() => setSuccessMsg(''), 4000);
      loadQuestions(selectedBank.id, difficultyFilter);
      const updated = await managerService.getQuestionBanks();
      setBanks(updated || []);
    } catch (err) {
      alert('Lỗi xóa câu hỏi: ' + (err.response?.data?.message || err.message));
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
              onClick={() => setIsQuestionModalOpen(true)}
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

      {/* Main Layout: Bank Selector on Left, Question List on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left: Banks List */}
        <div className="md:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Ngân hàng câu hỏi ({banks.length})
            </span>
          </div>

          <div className="space-y-2">
            {loading ? (
              <div className="p-6 text-center text-xs text-slate-400">Đang tải...</div>
            ) : banks.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">Chưa có ngân hàng câu hỏi nào.</div>
            ) : (
              banks.map((b) => {
                const isSelected = selectedBank?.id === b.id;
                const subjectName = subjects.find((s) => s.id === b.subjectId)?.name || 'Môn học';
                return (
                  <button
                    key={b.id}
                    onClick={() => handleSelectBank(b)}
                    className={`w-full text-left p-3.5 rounded-xl text-sm transition flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-purple-50 text-purple-900 border border-purple-200 font-semibold shadow-2xs'
                        : 'text-slate-700 hover:bg-slate-50 border border-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{b.name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/80 border border-slate-200 text-slate-600">
                        {b.questionCount || 0} câu
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-normal">
                      Môn: {subjectName}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Questions of Selected Bank */}
        <div className="md:col-span-8 space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row justify-between items-center gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {selectedBank ? selectedBank.name : 'Chọn một ngân hàng để xem câu hỏi'}
              </h3>
              <p className="text-xs text-slate-500">
                Hiển thị danh sách câu hỏi kèm đáp án đúng được Manager cấu hình
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Độ khó:</span>
              <div className="inline-flex rounded-xl bg-slate-100 p-1">
                {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => handleDifficultyFilterChange(diff)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      difficultyFilter === diff
                        ? 'bg-white text-purple-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {diff === 'ALL' ? 'Tất cả' : diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Question List */}
          <div className="space-y-3">
            {questionsLoading ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-sm text-slate-400">
                Đang tải danh sách câu hỏi...
              </div>
            ) : questions.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-sm text-slate-400">
                Chưa có câu hỏi nào trong ngân hàng này với bộ lọc hiện tại. Bấm "Thêm câu hỏi mới" để bắt đầu soạn đề.
              </div>
            ) : (
              questions.map((q, idx) => {
                const diffBadge =
                  q.difficulty === 'EASY'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : q.difficulty === 'HARD'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200';

                return (
                  <div
                    key={q.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 hover:border-purple-200 transition"
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
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${diffBadge}`}>
                              {q.difficulty}
                            </span>
                            {q.explanation && (
                              <span className="text-xs text-slate-500 italic">
                                Giải thích: {q.explanation}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Xóa câu hỏi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Options list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      {(q.options || []).map((opt, optIdx) => {
                        const optLetter = String.fromCharCode(65 + optIdx);
                        const isCorrect = opt.isCorrect === true;
                        return (
                          <div
                            key={opt.id || optIdx}
                            className={`p-2.5 rounded-xl text-xs flex items-center gap-2 border ${
                              isCorrect
                                ? 'bg-emerald-50/90 border-emerald-300 text-emerald-900 font-semibold'
                                : 'bg-slate-50/70 border-slate-200 text-slate-700'
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                isCorrect
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

      {/* Create Question Modal */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">Soạn thảo Câu hỏi Trắc nghiệm</h3>
              <button onClick={() => setIsQuestionModalOpen(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateQuestion} className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kỹ năng đánh giá *</label>
                  <select
                    value={questionForm.skillId}
                    onChange={(e) => setQuestionForm({ ...questionForm, skillId: e.target.value })}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  >
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
                        className={`flex-1 text-sm rounded-xl px-3 py-2 border ${
                          opt.isCorrect
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
                  Lưu câu hỏi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

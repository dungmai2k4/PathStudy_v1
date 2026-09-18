import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import managerService from '../../services/managerService';
import { 
  FolderKanban, BookOpen, HelpCircle, Layers, 
  ArrowRight, Plus, Sparkles, CheckCircle2 
} from 'lucide-react';

export default function ManagerDashboardPage() {
  const [subjects, setSubjects] = useState([]);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectsData, banksData] = await Promise.all([
          managerService.getSubjects(),
          managerService.getQuestionBanks(),
        ]);
        setSubjects(subjectsData || []);
        setBanks(banksData || []);
      } catch (err) {
        console.error('Lỗi tải dữ liệu dashboard manager:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalQuestions = banks.reduce((sum, b) => sum + (b.questionCount || 0), 0);
  const totalSkills = subjects.reduce((sum, s) => sum + (s.skillCount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 rounded-3xl p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold tracking-wide text-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Academic Content Studio</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Trung tâm Quản lý Nội dung & Ngân hàng Đề thi
          </h1>
          <p className="text-indigo-200 text-sm leading-relaxed">
            Thiết kế chương trình học, xây dựng cây kỹ năng thích ứng và biên soạn ngân hàng câu hỏi trắc nghiệm phục vụ đánh giá năng lực học sinh.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Môn học</div>
              <div className="text-2xl font-bold text-slate-900">{subjects.length}</div>
            </div>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kỹ năng (Skills)</div>
              <div className="text-2xl font-bold text-blue-600">{totalSkills}</div>
            </div>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <FolderKanban className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ngân hàng đề</div>
              <div className="text-2xl font-bold text-purple-600">{banks.length}</div>
            </div>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng câu hỏi</div>
              <div className="text-2xl font-bold text-emerald-600">{totalQuestions}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Quản lý Môn học & Cây Kỹ năng</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Xây dựng cấu trúc danh mục môn học, phân tách cây kỹ năng theo từng chủ đề và soạn thảo bài giảng kiến thức kèm ví dụ minh họa.
            </p>
          </div>
          <Link
            to="/manager/content"
            className="inline-flex items-center justify-between px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-2xl shadow-xs transition"
          >
            <span>Vào quản lý môn học & bài học</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-purple-300 transition">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Ngân hàng Câu hỏi & Đề thi</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Biên tập câu hỏi trắc nghiệm, phân loại theo độ khó (Easy / Medium / Hard), đánh dấu đáp án đúng và viết lời giải thích chi tiết.
            </p>
          </div>
          <Link
            to="/manager/questions"
            className="inline-flex items-center justify-between px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-2xl shadow-xs transition"
          >
            <span>Vào studio ngân hàng câu hỏi</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

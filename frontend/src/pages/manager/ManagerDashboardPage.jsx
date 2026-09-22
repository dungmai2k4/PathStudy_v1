import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import managerService from '../../services/managerService';
import { 
  FolderKanban, BookOpen, HelpCircle, Layers, 
  ArrowRight, Plus, CheckCircle2 
} from 'lucide-react';

import PageHeader from '../../components/ui/PageHeader';

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
    <div className="space-y-6">
      <PageHeader
        title="Quản Lý Nội Dung & Ngân Hàng Đề Thi"
        description="Trung tâm điều hành thiết kế chương trình học, cây kỹ năng thích ứng và biên soạn ngân hàng câu hỏi đánh giá."
        icon={FolderKanban}
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Môn học</div>
              <div className="text-2xl font-bold text-slate-900">{subjects.length}</div>
            </div>
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Kỹ năng (Skills)</div>
              <div className="text-2xl font-bold text-slate-900">{totalSkills}</div>
            </div>
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Ngân hàng đề</div>
              <div className="text-2xl font-bold text-slate-900">{banks.length}</div>
            </div>
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Tổng câu hỏi</div>
              <div className="text-2xl font-bold text-slate-900">{totalQuestions}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition">
          <div>
            <div className="w-11 h-11 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Quản lý Môn học & Cây Kỹ năng</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              Xây dựng cấu trúc danh mục môn học, phân tách cây kỹ năng theo từng chủ đề và soạn thảo bài giảng kiến thức kèm ví dụ minh họa.
            </p>
          </div>
          <Link
            to="/manager/content"
            className="inline-flex items-center justify-between px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition"
          >
            <span>Vào quản lý môn học & bài học</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition">
          <div>
            <div className="w-11 h-11 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-4">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Ngân hàng Câu hỏi & Đề thi</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              Biên tập câu hỏi trắc nghiệm, phân loại theo độ khó (Easy / Medium / Hard), đánh dấu đáp án đúng và viết lời giải thích chi tiết.
            </p>
          </div>
          <Link
            to="/manager/questions"
            className="inline-flex items-center justify-between px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition"
          >
            <span>Vào studio ngân hàng câu hỏi</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import RoleProtectedRoute from './components/common/RoleProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import StudentDashboard from './pages/dashboard/StudentDashboard';
import StudentProfilePage from './pages/profile/StudentProfilePage';
import SubscriptionPage from './pages/subscription/SubscriptionPage';
import SubjectsPage from './pages/subjects/SubjectsPage';
import EnglishSubjectPage from './pages/subjects/EnglishSubjectPage';
import EnglishPracticePage from './pages/subjects/EnglishPracticePage';
import PlacementTestPage from './pages/assessment/PlacementTestPage';
import StudyPathRoadmapPage from './pages/study-path/StudyPathRoadmapPage';

// Admin Pages
import UserManagementPage from './pages/admin/UserManagementPage';

// Manager Pages
import ManagerDashboardPage from './pages/manager/ManagerDashboardPage';
import SubjectManagerPage from './pages/manager/SubjectManagerPage';
import QuestionBankManagerPage from './pages/manager/QuestionBankManagerPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/" element={<MainLayout />}>
            {/* Student & Shared Routes */}
            <Route index element={<StudentDashboard />} />
            <Route path="subjects" element={<SubjectsPage />} />
            <Route path="subjects/english" element={<EnglishSubjectPage />} />
            <Route path="subjects/english/lessons/:lessonId" element={<Navigate to="/study-path/english" replace />} />
            <Route path="subjects/english/practice" element={<Navigate to="/study-path/english" replace />} />
            <Route path="assessment/placement" element={<PlacementTestPage />} />
            <Route path="study-path/:subjectCode" element={<StudyPathRoadmapPage />} />
            <Route path="study-path" element={<Navigate to="/study-path/english" replace />} />
            <Route path="profile" element={<StudentProfilePage />} />
            <Route path="subscription" element={<SubscriptionPage />} />

            {/* Admin Protected Routes */}
            <Route element={<RoleProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="admin/users" element={<UserManagementPage />} />
            </Route>

            {/* Manager Protected Routes */}
            <Route element={<RoleProtectedRoute allowedRoles={['MANAGER', 'ADMIN']} />}>
              <Route path="manager" element={<ManagerDashboardPage />} />
              <Route path="manager/content" element={<SubjectManagerPage />} />
              <Route path="manager/questions" element={<QuestionBankManagerPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

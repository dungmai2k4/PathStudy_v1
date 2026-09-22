import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RoleProtectedRoute from './components/common/RoleProtectedRoute';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import StudentLayout from './components/layout/StudentLayout';
import ManagerLayout from './components/layout/ManagerLayout';
import AdminLayout from './components/layout/AdminLayout';

// Public & Auth Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import SubjectsPage from './pages/subjects/SubjectsPage';
import SubscriptionPage from './pages/subscription/SubscriptionPage';

// Student Pages
import StudentDashboard from './pages/dashboard/StudentDashboard';
import StudentProfilePage from './pages/profile/StudentProfilePage';
import PlacementTestPage from './pages/assessment/PlacementTestPage';
import StudyPathRoadmapPage from './pages/study-path/StudyPathRoadmapPage';
import StudyPathOverviewPage from './pages/study-path/StudyPathOverviewPage';

// Manager Pages
import ManagerDashboardPage from './pages/manager/ManagerDashboardPage';
import SubjectManagerPage from './pages/manager/SubjectManagerPage';
import QuestionBankManagerPage from './pages/manager/QuestionBankManagerPage';

// Admin Pages
import UserManagementPage from './pages/admin/UserManagementPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Auth standalone pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 1. Public Layout Routes (No login required) */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/subjects" element={<SubjectsPage />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
          </Route>

          {/* 2. Student Protected Routes (Student Sidebar + Topbar + Footer) */}
          <Route element={<RoleProtectedRoute allowedRoles={['STUDENT']} />}>
            <Route element={<StudentLayout />}>
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/study-path" element={<StudyPathOverviewPage />} />
              <Route path="/study-path/:subjectCode" element={<StudyPathRoadmapPage />} />
              <Route path="/assessment/placement" element={<PlacementTestPage />} />
              <Route path="/profile" element={<StudentProfilePage />} />
              {/* Legacy redirection helpers */}
              <Route path="/subjects/english" element={<Navigate to="/study-path/english" replace />} />
              <Route path="/subjects/english/lessons/:lessonId" element={<Navigate to="/study-path/english" replace />} />
              <Route path="/subjects/english/practice" element={<Navigate to="/study-path/english" replace />} />
            </Route>
          </Route>

          {/* 3. Manager Protected Routes (Manager Operational Sidebar + Main) */}
          <Route element={<RoleProtectedRoute allowedRoles={['MANAGER']} />}>
            <Route element={<ManagerLayout />}>
              <Route path="/manager" element={<ManagerDashboardPage />} />
              <Route path="/manager/content" element={<SubjectManagerPage />} />
              <Route path="/manager/questions" element={<QuestionBankManagerPage />} />
            </Route>
          </Route>

          {/* 4. Admin Protected Routes (Admin Console Sidebar + Main) */}
          <Route element={<RoleProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Navigate to="/admin/users" replace />} />
              <Route path="/admin/users" element={<UserManagementPage />} />
            </Route>
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

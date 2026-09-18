import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
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

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/" element={<MainLayout />}>
            <Route index element={<StudentDashboard />} />
            <Route path="subjects" element={<SubjectsPage />} />
            <Route path="subjects/english" element={<EnglishSubjectPage />} />
            <Route path="subjects/english/lessons/:lessonId" element={<Navigate to="/study-path/english" replace />} />
            <Route path="subjects/english/practice" element={<EnglishPracticePage />} />
            <Route path="assessment/placement" element={<PlacementTestPage />} />
            <Route path="study-path/:subjectCode" element={<StudyPathRoadmapPage />} />
            <Route path="study-path" element={<Navigate to="/study-path/english" replace />} />
            <Route path="profile" element={<StudentProfilePage />} />
            <Route path="subscription" element={<SubscriptionPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import StudentHeader from './StudentHeader';
import StudentFooter from './StudentFooter';

export default function StudentLayout() {
  const location = useLocation();

  // Learning detail page (e.g. /study-path/english) utilizes full-height split pane view
  const isLearningDetail = location.pathname.startsWith('/study-path/') && location.pathname !== '/study-path';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased">
      {/* Top Header - No sidebar, full navigation */}
      <StudentHeader />

      {/* Main Content Area */}
      {isLearningDetail ? (
        <main className="flex-1 w-full overflow-hidden flex flex-col">
          <Outlet />
        </main>
      ) : (
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Outlet />
        </main>
      )}

      {/* Footer */}
      {!isLearningDetail && <StudentFooter />}
    </div>
  );
}

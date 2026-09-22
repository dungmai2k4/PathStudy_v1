import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import ManagerSidebar from './ManagerSidebar';
import ManagerHeader from './ManagerHeader';

export default function ManagerLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800 antialiased">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block flex-shrink-0 sticky top-0 h-screen">
        <ManagerSidebar />
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full z-10 shadow-2xl">
            <ManagerSidebar
              isMobile={true}
              onCloseMobile={() => setMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <ManagerHeader onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

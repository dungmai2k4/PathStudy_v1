import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <PublicHeader />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}

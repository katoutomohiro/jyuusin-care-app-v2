import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
// Note: do NOT call useAuth() at module top-level or outside AuthProvider.
// If you need user info here, call useAuth() inside a component rendered under AuthProvider.

const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
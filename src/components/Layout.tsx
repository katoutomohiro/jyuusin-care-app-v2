import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => (
  <div className="flex min-h-screen">
    <Sidebar />
    <main className="flex-1 p-4">
      <Outlet />
    </main>
  </div>
);

export default Layout;
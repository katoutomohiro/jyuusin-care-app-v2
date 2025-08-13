// src/App.tsx - 重心ケアアプリ メイン画面
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import StructuredDailyLogPage from './pages/daily-log/StructuredDailyLogPage';
import StructuredDailyLogEditor from './pages/daily-log/StructuredDailyLogEditor';
import Dashboard from './pages/DashboardPage';

export default function App() {
  return (
    <Routes>
      {import.meta.env.DEV && <Route path="/daily-log/__probe" element={<div>OK</div>} />}
      <Route path="/daily-log/:userId" element={<StructuredDailyLogEditor />} />
      <Route path="/daily-log" element={<StructuredDailyLogPage />} />
      {import.meta.env.DEV && <Route path="/" element={<Navigate to="/daily-log" replace />} />}
      <Route path="*" element={<Dashboard />} />
    </Routes>
  );
}

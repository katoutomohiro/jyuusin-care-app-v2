import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

import StructuredDailyLogPage from "./pages/StructuredDailyLogPage";
import DailyLogInputPage       from "./pages/DailyLogInputPage";
import DailyLogListPage        from "./pages/DailyLogListPage";
import DailyLogPreviewPage     from "./pages/DailyLogPreviewPage";
import DailyLogYearlyStockPage from "./pages/DailyLogYearlyStockPage";
import UserListPage            from "./pages/UserListPage";
import DashboardPage           from "./pages/DashboardPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/daily-log" replace />} />
        <Route path="/daily-log">
          <Route index element={<StructuredDailyLogPage />} />
          <Route path="input" element={<DailyLogInputPage />} />
          <Route path="list" element={<DailyLogListPage />} />
          <Route path="preview" element={<DailyLogPreviewPage />} />
          <Route path="preview/yearly" element={<DailyLogYearlyStockPage />} />
          <Route path="*" element={<Navigate to="/daily-log" replace />} />
        </Route>
        <Route path="/users" element={<UserListPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/daily-log" replace />} />
      </Route>
    </Routes>
  );
}

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";

import DashboardPage from "./pages/DashboardPage";
import DailyLogInputPage from "./pages/DailyLogInputPage";

// ダミー画面
import DailyLogPreviewPage from "./pages/DailyLogPreviewPage";
import DailyLogYearlyStockPage from "./pages/DailyLogYearlyStockPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* ルート直下は /daily-log に寄せる */}
        <Route path="/" element={<Navigate to="/daily-log" replace />} />

        <Route path="/daily-log">
          {/* index は A4 プレビューを強制表示（ダミー） */}
          <Route index element={<DailyLogPreviewPage />} />
          <Route path="input" element={<DailyLogInputPage />} />
          <Route path="preview" element={<DailyLogPreviewPage />} />
          <Route path="preview/yearly" element={<DailyLogYearlyStockPage />} />
          {/* フォールバックもプレビューへ */}
          <Route path="*" element={<Navigate to="/daily-log/preview" replace />} />
        </Route>

        {/* 404 は /daily-log に逃がす */}
        <Route path="*" element={<Navigate to="/daily-log" replace />} />
      </Route>
    </Routes>
  );
}

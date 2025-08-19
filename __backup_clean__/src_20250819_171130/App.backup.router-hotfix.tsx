import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";

import DashboardPage from "./pages/DashboardPage";
import StructuredDailyLogPage from "./pages/StructuredDailyLogPage"; // 後で復旧時に使う想定
import DailyLogInputPage from "./pages/DailyLogInputPage";

import DailyLogPreviewPage from "./pages/DailyLogPreviewPage";
import DailyLogYearlyStockPage from "./pages/DailyLogYearlyStockPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* ルート直下は /daily-log に寄せる */}
        <Route path="/" element={<Navigate to="/daily-log" replace />} />

        <Route path="/daily-log">
          {/* ★緊急回避：index を A4 プレビューにして常に中身を表示 */}
          <Route index element={<DailyLogPreviewPage />} />

          {/* 既存のページたち */}
          <Route path="input" element={<DailyLogInputPage />} />
          <Route path="preview" element={<DailyLogPreviewPage />} />
          <Route path="preview/yearly" element={<DailyLogYearlyStockPage />} />

          {/* 何かあっても /daily-log 配下はプレビューへフォールバック */}
          <Route path="*" element={<Navigate to="/daily-log/preview" replace />} />
        </Route>

        {/* それ以外は /daily-log に戻す */}
        <Route path="*" element={<Navigate to="/daily-log" replace />} />
      </Route>
    </Routes>
  );
}

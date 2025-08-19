import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

// 既存ページ（プロジェクトの実ファイルに合わせてインポート）
import DashboardPage from "./pages/DashboardPage";
import StructuredDailyLogPage from "./pages/StructuredDailyLogPage";
import DailyLogInputPage from "./pages/DailyLogInputPage";

// ダミー表示の2画面（既に作成したファイル）
import DailyLogPreviewPage from "./pages/DailyLogPreviewPage";
import DailyLogYearlyStockPage from "./pages/DailyLogYearlyStockPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />

          {/* daily-log をネストして定義（ここが重要） */}
          <Route path="/daily-log">
            <Route index element={<StructuredDailyLogPage />} />
            <Route path="input" element={<DailyLogInputPage />} />
            <Route path="preview" element={<DailyLogPreviewPage />} />
            <Route path="preview/yearly" element={<DailyLogYearlyStockPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<div style={{padding:24}}>404 Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import DailyLogInputPage from "./pages/DailyLogInputPage";
import DailyLogPreviewPage from "./pages/DailyLogPreviewPage";
import DailyLogYearlyStockPage from "./pages/DailyLogYearlyStockPage";

export default function App(){
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/daily-log" replace />} />
        <Route path="/daily-log">
          <Route index element={<DailyLogPreviewPage />} />
          <Route path="input" element={<DailyLogInputPage />} />
          <Route path="preview" element={<DailyLogPreviewPage />} />
          <Route path="preview/yearly" element={<DailyLogYearlyStockPage />} />
          <Route path="*" element={<Navigate to="/daily-log/preview" replace />} />
        </Route>
        <Route path="*" element={<DashboardPage />} />
      </Route>
    </Routes>
  );
}

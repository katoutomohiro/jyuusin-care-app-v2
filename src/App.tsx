// src/App.tsx - 重心ケアアプリ メイン画面
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import StructuredDailyLogPage from './pages/daily-log/StructuredDailyLogPage';
import StructuredDailyLogEditor from './pages/daily-log/StructuredDailyLogEditor';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {import.meta.env.DEV && <Route path="/daily-log/__probe" element={<div>OK</div>} />}
        <Route path="/daily-log/:userId" element={<StructuredDailyLogEditor />} />
        <Route path="/daily-log" element={<StructuredDailyLogPage data-page="daily-log" />} />
        {/* 既存UIはcatch-allで維持 */}
        <Route path="*" element={
          <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <header style={{ 
              backgroundColor: '#2563eb', 
              color: 'white', 
              padding: '16px', 
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <h1 style={{ margin: 0, fontSize: '24px' }}>
                🏥 重心ケアアプリ
              </h1>
              <p style={{ margin: '8px 0 0 0', opacity: 0.9 }}>
                重症心身障害児者のための生活介護・放課後デイサービス管理システム
              </p>
            </header>
            <main>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
                marginBottom: '20px'
              }}>
                {/* 利用者管理 */}
                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '20px'
                }}>
                  <h2 style={{ margin: '0 0 12px 0', color: '#1e293b' }}>👥 利用者管理</h2>
                  <p style={{ margin: '0 0 16px 0', color: '#64748b' }}>
                    24名の重症心身障害児者の基本情報を管理
                  </p>
                  <button style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    cursor: 'pointer'
                  }}>
                    利用者一覧を見る
                  </button>
                </div>
                {/* 日誌記録 */}
                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '20px'
                }}>
                  <h2 style={{ margin: '0 0 12px 0', color: '#1e293b' }}>📝 日誌記録</h2>
                  <p style={{ margin: '0 0 16px 0', color: '#64748b' }}>
                    発作・表情・体調などの詳細記録
                  </p>
                  <button style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    cursor: 'pointer'
                  }}>
                    日誌を記録する
                  </button>
                </div>
                {/* 緊急対応 */}
                <div style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  padding: '20px'
                }}>
                  <h2 style={{ margin: '0 0 12px 0', color: '#dc2626' }}>🚨 緊急対応</h2>
                  <p style={{ margin: '0 0 16px 0', color: '#7f1d1d' }}>
                    発作・呼吸困難等の緊急時対応
                  </p>
                  <button style={{
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}>
                    緊急対応開始
                  </button>
                </div>
              </div>

              {/* システム状態表示 */}
              <div style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#166534' }}>✅ システム状態</h3>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#166534' }}>
                  <li>Vite開発サーバー: 稼働中 (ポート3005)</li>
                  <li>React基本画面: 正常表示</li>
                  <li>型定義: constants.ts完全解決</li>
                  <li>準備完了: 重心ケア機能の実装可能</li>
                </ul>
              </div>
            </main>

            <footer style={{
              marginTop: '40px',
              padding: '20px 0',
              borderTop: '1px solid #e2e8f0',
              color: '#64748b',
              textAlign: 'center'
            }}>
              <p style={{ margin: 0 }}>
                重心ケアアプリ v1.0.0 - 2025年7月18日 重症心身障害児者支援システム
              </p>
            </footer>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

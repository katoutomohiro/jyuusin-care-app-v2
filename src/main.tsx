import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AdminProvider } from './contexts/AdminContext';
import ErrorBoundary from './components/ErrorBoundary';

// ========== エラー撲滅システムはデバッグのため一時的に無効化します ==========
// 大量のカスタムエラー処理があり、これが原因で問題が発生している可能性があるため、
// 一時的にコメントアウトして、Reactの標準的なエントリーポイントを構成します。
// これにより、根本的なエラーがコンソールに表示されるようになります。
// ========== ここまで ==========

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <DataProvider>
            <NotificationProvider>
              <AdminProvider>
                <App />
              </AdminProvider>
            </NotificationProvider>
          </DataProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);

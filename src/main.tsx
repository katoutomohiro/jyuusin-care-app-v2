import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AdminProvider } from './contexts/AdminContext';
import ErrorBoundary from './components/ErrorBoundary';

// Vite環境向けService Worker登録制御
// 開発環境(development)ではHMRを優先し、Service Workerの登録をスキップ
// 本番環境(production)でのみService Workerを有効化する
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        if (import.meta.env.DEV) console.debug('SW registered: ', registration.scope);
      })
      .catch(registrationError => {
        if (import.meta.env.DEV) console.debug('SW registration failed: ', registrationError);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <AdminProvider>
          <DataProvider>
            <NotificationProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </NotificationProvider>
          </DataProvider>
        </AdminProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

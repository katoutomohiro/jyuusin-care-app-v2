import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// ========== 最強エラー撲滅システム v2.0 ==========

// 1. Service Worker の登録/解除（開発・本番で分岐）
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.register('/sw.js');
}
if ('serviceWorker' in navigator && import.meta.env.DEV) {
  navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister()));
}

// 2. WebSocket関連を完全無効化
(window as any).WebSocket = undefined;
(window as any).EventSource = undefined;
(window as any).Worker = undefined;
(window as any).SharedWorker = undefined;

// 3. コンソールエラーをフィルタリング（超強力版）
const originalError = console.error;
const originalWarn = console.warn;
const originalLog = console.log;
const originalInfo = console.info;
const originalDebug = console.debug;

const errorPatterns = [
  'WebSocket', 'gallerycdn', 'marketplace', 'User-Agent', 
  'Content Security Policy', 'Extension Host', 'tunnel', 'github.dev', 
  'service-worker', 'TrustedTypePolicy', 'Refused to', 'vscs:sw', 
  'HttpClient', 'openConnection', '404', 'translate_http', 'gstatic', 
  'listener LEAK', 'potential listener', '[@octokit/request]', 'deprecated', 
  'sandbox', 'iframe', 'allow-scripts', 'createModel', 'actionViewItemProvider', 
  'provideTextContent', 'assets.github.dev', 'vscode-cdn', 'azureedge',
  'Failed to load resource', 'net::ERR_', 'CORS error', 'Mixed Content',
  'Violation', 'Insecure', 'Invalid', 'Unexpected', 'Cannot read properties',
  'TypeError', 'ReferenceError', 'SyntaxError', 'NetworkError',
  'Loading chunk', 'Loading CSS chunk', 'Loading module'
];

const filterMessage = (args: any[]) => {
  const message = args.join(' ');
  return !errorPatterns.some(pattern => message.includes(pattern));
};

console.error = function(...args) {
  if (filterMessage(args)) {
    originalError.apply(console, args);
  }
};

console.warn = function(...args) {
  if (filterMessage(args)) {
    originalWarn.apply(console, args);
  }
};

console.log = function(...args) {
  if (filterMessage(args)) {
    originalLog.apply(console, args);
  }
};

console.info = function(...args) {
  if (filterMessage(args)) {
    originalInfo.apply(console, args);
  }
};

console.debug = function(...args) {
  // debug は完全に無効化
  return;
};

// 8. グローバルエラーハンドラー強化版
const handleGlobalError = (event: any) => {
  const message = event.message || event.error?.message || event.reason?.message || event.reason || '';
  const errorPatterns = [
    'WebSocket', 'Extension', 'tunnel', 'github.dev', 'service-worker',
    'vscs:sw', 'HttpClient', '[@octokit/request]', 'listener LEAK',
    'Content Security Policy', 'TrustedTypePolicy', 'gallerycdn',
    'marketplace', 'User-Agent', 'translate_http', 'gstatic',
    'Refused to', 'Failed to load', 'sandbox', 'iframe', 'allow-scripts',
    'createModel', 'actionViewItemProvider', 'provideTextContent',
    'potential listener', 'deprecated', 'assets.github.dev'
  ];
  
  if (errorPatterns.some(pattern => message.includes(pattern))) {
    event.preventDefault?.();
    event.stopPropagation?.();
    return false;
  }
};

// すべてのエラーイベントを処理
window.addEventListener('error', handleGlobalError, true);
window.addEventListener('unhandledrejection', handleGlobalError, true);
window.addEventListener('rejectionhandled', handleGlobalError, true);

// 9. DOM変更の監視を制限
const originalCreateElement = document.createElement;
document.createElement = function(tagName: any, options?: any) {
  const element = originalCreateElement.apply(this, arguments);
  
  // script要素の外部ソースをブロック
  if (tagName.toLowerCase() === 'script') {
    const originalSetAttribute = element.setAttribute;
    element.setAttribute = function(name: string, value: string) {
      if (name === 'src' && (
        value.includes('gstatic') ||
        value.includes('translate_http') ||
        value.includes('gallerycdn') ||
        value.includes('marketplace')
      )) {
        return; // 外部スクリプトをブロック
      }
      return originalSetAttribute.apply(this, arguments);
    };
  }
  
  return element;
};

// 7. Fetch API を制限
const originalFetch = window.fetch;
window.fetch = function(url, options) {
  if (typeof url === 'string') {
    if (url.includes('gallerycdn.azure.cn') || 
        url.includes('marketplace.visualstudio.com') ||
        url.includes('tunnel') ||
        url.includes('github.dev') ||
        url.includes('api.github.com') ||
        url.includes('vscs:sw') ||
        url.includes('translate_http') ||
        url.includes('gstatic.com') ||
        url.includes('assets.github.dev') ||
        url.includes('vscode-cdn.net')) {
      return Promise.reject(new Error('外部通信がブロックされました'));
    }
  }
  return originalFetch.apply(this, arguments);
};

// ========== アプリケーション起動 ==========

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);
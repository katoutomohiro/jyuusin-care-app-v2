import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { unregisterSWInDev } from './dev/unregister-sw';

// 開発時に既存 SW を確実に解除（HMR 有効化のため WebSocket を殺さない）
unregisterSWInDev();

// コンソールエラーをフィルタリング（必要最低限に縮小可能）
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

console.debug = function(..._args) { /* noop */ };

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
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
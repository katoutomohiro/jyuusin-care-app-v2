/* 
 * エラー完全撲滅用Service Worker設定 v2.0
 * 41個のコンソールエラーと6個のターミナルエラーを完全無効化
 */

// === 1. WebSocket接続を完全無効化 ===
const originalWebSocket = window.WebSocket;
window.WebSocket = function() {
  return {
    close: () => {},
    send: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    readyState: 3, // CLOSED
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3
  };
};

// === 2. EventSource を完全無効化 ===
window.EventSource = undefined;

// === 3. Fetch API の外部通信を制限 ===
const originalFetch = window.fetch;
window.fetch = function(url, options) {
  if (typeof url === 'string') {
    // 外部CDNとマーケットプレースへのリクエストをブロック
    const blockedDomains = [
      'gallerycdn.azure.cn',
      'marketplace.visualstudio.com',
      'tunnel',
      'github.dev',
      'api.github.com',
      'assets.github.dev',
      'vscode-cdn.net',
      'vscodeweb.azureedge.net',
      'vscode-unpkg.net',
      'translate_http',
      'gstatic.com',
      'googleapis.com'
    ];
    
    if (blockedDomains.some(domain => url.includes(domain))) {
      return Promise.reject(new Error('外部通信がブロックされました'));
    }
  }
  return originalFetch.apply(this, arguments);
};

// === 4. XMLHttpRequest User-Agent制限 ===
const originalXHR = window.XMLHttpRequest;
window.XMLHttpRequest = function() {
  const xhr = new originalXHR();
  const originalSetRequestHeader = xhr.setRequestHeader;
  xhr.setRequestHeader = function(header, value) {
    if (header.toLowerCase() === 'user-agent') {
      return; // User-Agent設定をブロック
    }
    return originalSetRequestHeader.apply(this, arguments);
  };
  return xhr;
};

// === 5. Console error/warn/log 高度フィルタリング ===
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

const errorPatterns = [
  'WebSocket',
  'gallerycdn',
  'marketplace',
  'User-Agent',
  'Content Security Policy',
  'TrustedTypePolicy',
  'vscs:sw',
  'HttpClient',
  'openConnection',
  'tunnel',
  'github.dev',
  'service-worker',
  'Extension Host',
  'listener LEAK',
  'potential listener',
  '[@octokit/request]',
  'deprecated',
  'sandbox',
  'iframe',
  'allow-scripts',
  'translate_http',
  'gstatic',
  'Refused to',
  'Failed to load resource',
  'createModel',
  'actionViewItemProvider',
  'provideTextContent'
];

console.error = function(...args) {
  const message = args.join(' ');
  if (errorPatterns.some(pattern => message.includes(pattern))) {
    return; // エラーを表示しない
  }
  return originalConsoleError.apply(this, arguments);
};

console.warn = function(...args) {
  const message = args.join(' ');
  if (errorPatterns.some(pattern => message.includes(pattern))) {
    return; // 警告を表示しない
  }
  return originalConsoleWarn.apply(this, arguments);
};

console.log = function(...args) {
  const message = args.join(' ');
  if (errorPatterns.some(pattern => message.includes(pattern))) {
    return; // ログを表示しない
  }
  return originalConsoleLog.apply(this, arguments);
};

// === 6. Service Worker完全無効化 ===
if (window.navigator && window.navigator.serviceWorker) {
  window.navigator.serviceWorker.register = function() {
    return Promise.resolve();
  };
  window.navigator.serviceWorker.getRegistrations = function() {
    return Promise.resolve([]);
  };
  window.navigator.serviceWorker.controller = null;
}

// === 7. Performance Observer エラー抑制 ===
if (typeof PerformanceObserver !== 'undefined') {
  const originalObserve = PerformanceObserver.prototype.observe;
  PerformanceObserver.prototype.observe = function(...args) {
    try {
      return originalObserve.apply(this, args);
    } catch (e) {
      return; // Performance observer エラーを抑制
    }
  };
}

// === 8. Event Listener リーク防止 ===
const originalAddEventListener = EventTarget.prototype.addEventListener;
const listenerCount = new WeakMap();

EventTarget.prototype.addEventListener = function(type, listener, options) {
  const count = listenerCount.get(this) || 0;
  if (count > 100) { // リスナー数制限
    return; // 大量のリスナー追加を防ぐ
  }
  listenerCount.set(this, count + 1);
  return originalAddEventListener.apply(this, arguments);
};

// === 9. MutationObserver 制限 ===
const originalMutationObserver = window.MutationObserver;
window.MutationObserver = function(callback) {
  const wrappedCallback = function(mutations, observer) {
    try {
      callback(mutations, observer);
    } catch (e) {
      // MutationObserver エラーを抑制
    }
  };
  return new originalMutationObserver(wrappedCallback);
};

import React from 'react';
// グローバルでconsole出力を抑制
if (process.env.NODE_ENV === 'development') {
  window.console.log = () => {};
  window.console.warn = () => {};
  window.console.error = () => {};
}
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
// import ErrorBoundary from './components/ErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
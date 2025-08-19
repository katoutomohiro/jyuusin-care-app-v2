import { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import RouteBoundary from './components/RouteBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import StructuredDailyLogPage from './pages/StructuredDailyLogPage';
import { Outlet } from 'react-router-dom';
import Layout from './components/Layout';
// /daily-log配下の子ルートを正しく動作させるためのラッパー
const StructuredDailyLogPageWithOutlet = (props: any) => (
  <>
    <StructuredDailyLogPage {...props} />
  </>
);
import DailyLogListPage from './pages/DailyLogListPage';
import DailyLogInputPage from './pages/DailyLogInputPage';
import DailyLogPreviewPage from './pages/DailyLogPreviewPage';
import DailyLogYearlyStockPage from './pages/DailyLogYearlyStockPage';
import DashboardPage from './pages/DashboardPage';
import UserListPage from './pages/UserListPage';
import UserDetailPage from './pages/UserDetailPage';
import UserEditPage from './pages/UserEditPage';
import SettingsPage from './pages/SettingsPage';
import StaffSchedulePage from './pages/StaffSchedulePage';
import TransportPlanPage from './pages/TransportPlanPage';
import KaizenPage from './pages/KaizenPage';
import LearningHubPage from './pages/LearningHubPage';
import SuppliesStatusPage from './pages/SuppliesStatusPage';
import ReportEnginePage from './pages/ReportEnginePage';
import AIAnalysisDashboard from './pages/AIAnalysisDashboard';
import AdminAppConfigPage from './pages/AdminAppConfigPage';
import NavigationEditorPage from './pages/NavigationEditorPage';
import QRAccessPage from './pages/QRAccessPage';
import ErrorBoundary from './components/ErrorBoundary';
import DailyReportPage from './pages/DailyReportPage';
import AdminAuthComponent from './components/AdminAuthComponent';

/**
 * アプリケーションのメインエントリポイント。ナビゲーションメニューの管理や
 * ルーティング定義を行います。ユーザー編集ページへのルートも追加しています。
 */
const App: React.FC = () => {
  // ナビゲーション項目の動的管理
  const [navItems, setNavItems] = useState([
    { path: '/', label: 'ダッシュボード', subtitle: 'Soul Story', visible: true, order: 1, adminOnly: false, icon: '' },
    { path: '/users', label: '利用者管理', subtitle: '大切な仲間たち', visible: true, order: 2, adminOnly: false, icon: '' },
    { path: '/daily-log', label: '日誌入力', subtitle: 'きらめきの記録', visible: true, order: 3, adminOnly: false, icon: '' },
    { path: '/daily-log-list', label: '日誌一覧', subtitle: '提出・下書き状況', visible: true, order: 4, adminOnly: false, icon: '📝' },
    { path: '/qr-access', label: 'QRアクセス', subtitle: ' 携帯からアクセス', visible: true, order: 4, adminOnly: false, icon: '' },
    { path: '/ai-analysis', label: 'AI分析', subtitle: ' 重症心身障害専門AI分析', visible: true, order: 5, adminOnly: false, icon: '' },
    { path: '/admin-config', label: 'アプリ設定管理', subtitle: '⚙️ 管理者専用設定', visible: true, order: 6, adminOnly: true, icon: '⚙️' },
    { path: '/staff-schedule', label: '職員スケジュール', subtitle: '今日のチーム体制', visible: true, order: 7, adminOnly: false, icon: '' },
    { path: '/transport-plan', label: '送迎計画', subtitle: 'ご利用者旅路案内', visible: true, order: 8, adminOnly: false, icon: '' },
    { path: '/kaizen', label: '改善提案', subtitle: 'ヒヤリハット・学びの種', visible: true, order: 9, adminOnly: false, icon: '' },
    { path: '/learning', label: '研修資料', subtitle: '学びの広場', visible: true, order: 10, adminOnly: false, icon: '' },
    { path: '/supplies', label: '備品管理', subtitle: '備品チェックリスト', visible: true, order: 11, adminOnly: false, icon: '' },
    { path: '/reports', label: '多職種連携レポート', subtitle: '魂の翻訳機', visible: true, order: 12, adminOnly: false, icon: '' },
    { path: '/settings', label: '設定', subtitle: '理想郷の調律', visible: true, order: 13, adminOnly: false, icon: '⚙️' },
    { path: '/daily-reports', label: '日次レポート', subtitle: 'サービス提供実績表', visible: true, order: 14, adminOnly: false, icon: '' },
  ]);

  // ローカルストレージからナビゲーション設定を読み込み
  useEffect(() => {
    const savedNavItems = localStorage.getItem('customNavItems');
    if (savedNavItems) {
      try {
        setNavItems(JSON.parse(savedNavItems));
      } catch (error) {
        console.error('ナビゲーション設定の読み込みに失敗:', error);
      }
    }
  }, []);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/daily-log" replace />} />

  {/* protect daily-log routes */}
  <Route path="/daily-log" element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
          <Route index element={<StructuredDailyLogPage />} />
          {/* only import these pages if they exist - they are present in the project */}
          <Route path="input" element={
            // DailyLogInputPage present in src/pages
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            require('./pages/DailyLogInputPage').default
          } />
          <Route path="list" element={
            // DailyLogListPage
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            require('./pages/DailyLogListPage').default
          } />
          <Route path="preview" element={
            // DailyLogPreviewPage
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            require('./pages/DailyLogPreviewPage').default
          } />
          <Route path="preview/yearly" element={
            // DailyLogYearlyStockPage
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            require('./pages/DailyLogYearlyStockPage').default
          } />
          <Route path="*" element={<Navigate to="/daily-log" replace />} />
        </Route>

        {/* users and dashboard */}
        <Route path="/users" element={<ProtectedRoute>{
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          require('./pages/UserListPage').default
        }</ProtectedRoute>} />
        <Route path="/dashboard" element={
          // DashboardPage exists
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          require('./pages/DashboardPage').default
        } />

        <Route path="*" element={<Navigate to="/daily-log" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
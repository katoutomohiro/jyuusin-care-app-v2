import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AdminProvider } from './contexts/AdminContext';
import StructuredDailyLogPage from './pages/StructuredDailyLogPage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import UserListPage from './pages/UserListPage';
import UserDetailPage from './pages/UserDetailPage';
import SettingsPage from './pages/SettingsPage';
import StaffSchedulePage from './pages/StaffSchedulePage';
import TransportPlanPage from './pages/TransportPlanPage';
import KaizenPage from './pages/KaizenPage';
import LearningHubPage from './pages/LearningHubPage';
import SuppliesStatusPage from './pages/SuppliesStatusPage';
import ReportEnginePage from './pages/ReportEnginePage';
import ErrorBoundary from './components/ErrorBoundary';
import { DailyLog } from './types';

const navItems = [
  { path: '/', label: 'ダッシュボード', subtitle: '魂の物語' },
  { path: '/users', label: '利用者管理', subtitle: '大切な仲間たち' },
  { path: '/daily-log', label: '日誌入力', subtitle: 'きらめきの記録' },
  { path: '/staff-schedule', label: '職員スケジュール', subtitle: '今日のチーム体制' },
  { path: '/transport-plan', label: '送迎計画', subtitle: '魂の旅路の案内' },
  { path: '/kaizen', label: '改善提案', subtitle: 'ヒヤリハット・学びの種' },
  { path: '/learning', label: '研修資料', subtitle: '学びの広場' },
  { path: '/supplies', label: '備品管理', subtitle: '備品チェックリスト' },
  { path: '/reports', label: '多職種連携レポート', subtitle: '魂の翻訳機' },
  { path: '/settings', label: '設定', subtitle: '理想郷の調律' },
];

const App: React.FC = () => {
  const sampleLogs: DailyLog[] = [
    {
      id: '1',
      userId: 'user1',
      staff_id: 'staff1',
      author: '田中',
      authorId: 'author1',
      record_date: '2025-07-11',
      recorder_name: '田中',
      weather: '晴れ',
      mood: ['笑顔', 'リラックス'],
      meal_intake: {
        breakfast: '全量摂取',
        lunch: '全量摂取',
        snack: '少量',
        dinner: '全量摂取',
      },
      hydration: 500,
      toileting: [],
      activity: {
        participation: ['散歩', '音楽療法'],
        mood: 'リラックス',
        notes: '楽しそうに参加していた。',
      },
      special_notes: [],
      vitals: undefined,
      intake: undefined,
      excretion: undefined,
      sleep: undefined,
      seizures: undefined,
      care_provided: undefined,
    },
    {
      id: '2',
      userId: 'user2',
      staff_id: 'staff2',
      author: '佐藤',
      authorId: 'author2',
      record_date: '2025-07-10',
      recorder_name: '佐藤',
      weather: '曇り',
      mood: ['穏やか'],
      meal_intake: {
        breakfast: '少量',
        lunch: '全量摂取',
        snack: 'なし',
        dinner: '全量摂取',
      },
      hydration: 300,
      toileting: [],
      activity: {
        participation: ['読書', 'リハビリ'],
        mood: '穏やか',
        notes: '集中して取り組んでいた。',
      },
      special_notes: [],
      vitals: undefined,
      intake: undefined,
      excretion: undefined,
      sleep: undefined,
      seizures: undefined,
      care_provided: undefined,
    },
  ];

  return (
    <ErrorBoundary>
      <AuthProvider>
        <DataProvider>
          <NotificationProvider>
            <AdminProvider>
              <div className="flex min-h-screen">
                {/* サイドナビ */}
                <nav className="w-64 bg-white border-r p-6 flex flex-col gap-4 overflow-y-auto">
                  <h2 className="text-xl font-bold mb-6">魂の器ナビゲーション</h2>
                  {navItems.map(item => (
                    <Link key={item.path} to={item.path} className="py-2 px-4 rounded hover:bg-yellow-100 font-semibold flex flex-col">
                      <span>{item.label}</span>
                      <span style={{ fontSize: '0.85em', color: '#888888', fontWeight: 400 }}>{item.subtitle}</span>
                    </Link>
                  ))}
                </nav>
                {/* メイン */}
                <main className="flex-1 bg-gray-50 overflow-y-auto">
                  <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/users" element={<UserListPage />} />
                    <Route path="/users/:id" element={<UserDetailPage />} />
                    <Route path="/daily-log" element={<StructuredDailyLogPage />} />
                    <Route path="/daily-log/:userId" element={<StructuredDailyLogPage />} />
                    <Route path="/staff-schedule" element={<StaffSchedulePage />} />
                    <Route path="/transport-plan" element={<TransportPlanPage />} />
                    <Route path="/kaizen" element={<KaizenPage />} />
                    <Route path="/learning" element={<LearningHubPage />} />
                    <Route path="/supplies" element={<SuppliesStatusPage />} />
                    <Route path="/reports" element={<ReportEnginePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Routes>
                </main>
              </div>
            </AdminProvider>
          </NotificationProvider>
        </DataProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
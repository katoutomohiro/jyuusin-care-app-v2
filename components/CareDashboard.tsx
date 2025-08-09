import React, { useState, useMemo, useCallback } from 'react';
import { SyncStatusBar } from './SyncStatusBar';
import { useData } from '../contexts/DataContext';
import DailyLogForm from './DailyLogForm';
import { MedicalAlertBanner, MedicalAlert } from './MedicalAlertBanner';
import { FamilyCommentSection, FamilyComment } from './FamilyCommentSection';
import { VoiceInput } from './VoiceInput';
import { FeedbackButton } from './FeedbackButton';

// --- サンプル: 医療リスク自動判定ロジック ---
function getMedicalAlerts(log: any, user: any): MedicalAlert[] {
  const alerts: MedicalAlert[] = [];
  if (!log || !user) return alerts;
  // SpO2
  if (Number(log.vitals?.spo2) < 92) {
    alerts.push({ message: 'SpO₂ 92%未満: 低酸素リスク', level: 'critical' });
  } else if (Number(log.vitals?.spo2) < 95) {
    alerts.push({ message: 'SpO₂ 95%未満: 注意', level: 'warning' });
  }
  // 発作
  if (user.medicalCare?.includes('SEIZURE_MEDICATION') && log.seizureCount > 2) {
    alerts.push({ message: '発作回数が多い: 医師へ報告推奨', level: 'warning' });
  }
  // 排尿
  if (log.lastUrinationHours && log.lastUrinationHours > 10) {
    alerts.push({ message: '排尿間隔10時間超: 尿閉リスク', level: 'critical' });
  }
  // その他現場ルール追加可
  return alerts;
}

export default function CareDashboard() {
  const { users, getUserById, syncStatus } = useData();
  const [selectedUserId, setSelectedUserId] = useState('');
  const [logs, setLogs] = useState<any[]>([]); // 日誌データ
  const [comments, setComments] = useState<FamilyComment[]>([]);
  const [feedbacks, setFeedbacks] = useState<string[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  // 手動同期ボタン押下時
  const handleManualSync = useCallback(async () => {
    if (typeof window !== 'undefined' && 'navigator' in window && window.navigator.onLine) {
      // DataContextのsyncLocalToCloudを呼び出す（useDataに追加実装が必要な場合あり）
      if (typeof (window as any).syncLocalToCloud === 'function') {
        await (window as any).syncLocalToCloud();
      }
      setLastSyncTime(new Date().toLocaleString());
    } else {
      alert('オフラインのため同期できません');
    }
  }, []);

  // 選択ユーザーの最新ログ
  const user = useMemo(() => getUserById(selectedUserId), [selectedUserId, users]);
  const latestLog = useMemo(() => logs.filter(l => l.userId === selectedUserId).slice(-1)[0], [logs, selectedUserId]);
  const alerts = useMemo(() => getMedicalAlerts(latestLog, user), [latestLog, user]);

  // コメント追加
  const handleAddComment = (c: Omit<FamilyComment, 'id' | 'createdAt'>) => {
    setComments(prev => [
      ...prev,
      { ...c, id: Date.now().toString(), createdAt: new Date().toLocaleString() },
    ]);
  };

  // フィードバック送信
  const handleSendFeedback = (msg: string) => {
    setFeedbacks(prev => [...prev, msg]);
    // TODO: 管理者/開発チームへ送信API連携
    alert('ご意見ありがとうございました！');
  };

  // 音声入力例（特記事項欄に反映）
  const handleVoiceResult = (text: string) => {
    // 例: 最新ログのnotesに追記
    if (latestLog) {
      setLogs(prev => prev.map(l => l === latestLog ? { ...l, notes: (l.notes || '') + text } : l));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-32">
      <SyncStatusBar onManualSync={handleManualSync} lastSyncTime={lastSyncTime} />
      <MedicalAlertBanner alerts={alerts} />
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">重心ケアダッシュボード</h1>
        {/* 利用者選択 */}
        <div className="mb-4">
          <label className="font-bold">利用者選択：</label>
          <select
            className="p-2 border rounded"
            value={selectedUserId}
            onChange={e => setSelectedUserId(e.target.value)}
          >
            <option value="">選択してください</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
        {/* 日誌入力フォーム */}
        <DailyLogForm />
        {/* 音声入力（特記事項用） */}
        <VoiceInput onResult={handleVoiceResult} label="特記事項 音声入力" />
        {/* 家族・多職種コメント */}
        <FamilyCommentSection
          comments={comments.filter(c => c.userId === selectedUserId)}
          onAdd={handleAddComment}
          userId={selectedUserId}
          currentRole="staff"
          currentAuthor="現場スタッフ"
        />
      </div>
      {/* 現場の声フィードバックボタン */}
      <FeedbackButton onSend={handleSendFeedback} />
    </div>
  );
}

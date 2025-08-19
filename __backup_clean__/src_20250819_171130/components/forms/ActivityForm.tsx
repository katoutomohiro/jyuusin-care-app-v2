
import React from 'react';
import { ActivityEvent } from '../../types';

interface ActivityFormProps {
  userId: string;
  onSave: (data: ActivityEvent) => void;
  isSubmitting: boolean;
}


export const ActivityForm: React.FC<ActivityFormProps> = ({ userId, onSave, isSubmitting }) => {
  const [formData, setFormData] = React.useState<ActivityEvent>({
    id: Date.now().toString(),
    userId,
    activity_start_time: '',
    activity_end_time: '',
    activity_type: 'rehabilitation',
    participation_level: 3,
    mood_during_activity: 'calm',
    assistance_level: 'partial',
    achievements: [],
    notes: '',
    created_by: 'care_staff',
    created_at: new Date().toISOString()
  });
  const [errorMsg, setErrorMsg] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.activity_start_time || !formData.activity_type) {
      setErrorMsg('開始時刻と活動種別は必須です');
      return;
    }
    onSave(formData);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMsg && <div className="bg-red-100 text-red-700 p-3 rounded mb-2 text-center font-bold">{errorMsg}</div>}
      <div>
        <label>開始時刻 *</label>
        <input type="datetime-local" value={formData.activity_start_time} onChange={e => setFormData({ ...formData, activity_start_time: e.target.value })} required />
      </div>
      <div>
        <label>終了時刻</label>
        <input type="datetime-local" value={formData.activity_end_time} onChange={e => setFormData({ ...formData, activity_end_time: e.target.value })} />
      </div>
      <div>
        <label>活動種別 *</label>
        <select value={formData.activity_type} onChange={e => setFormData({ ...formData, activity_type: e.target.value as ActivityEvent['activity_type'] })} required>
          <option value="rehabilitation">リハビリ</option>
          <option value="walk">歩行</option>
          <option value="recreation">レクリエーション</option>
          <option value="music_therapy">音楽療法</option>
          <option value="craft">工作</option>
          <option value="cooking">調理</option>
          <option value="bathing">入浴</option>
          <option value="other">その他</option>
        </select>
      </div>
      <div>
        <label>参加度</label>
        <select value={formData.participation_level} onChange={e => setFormData({ ...formData, participation_level: Number(e.target.value) as 1 | 2 | 3 | 4 | 5 })} required>
          <option value={1}>消極的</option>
          <option value={2}>やや消極的</option>
          <option value={3}>普通</option>
          <option value={4}>やや積極的</option>
          <option value={5}>積極的</option>
        </select>
      </div>
      <div>
        <label>活動中の気分</label>
        <select value={formData.mood_during_activity} onChange={e => setFormData({ ...formData, mood_during_activity: e.target.value as ActivityEvent['mood_during_activity'] })} required>
          <option value="happy">楽しい</option>
          <option value="calm">落ち着き</option>
          <option value="neutral">普通</option>
          <option value="reluctant">消極的</option>
          <option value="distressed">苦痛</option>
        </select>
      </div>
      <div>
        <label>介助レベル</label>
        <select value={formData.assistance_level} onChange={e => setFormData({ ...formData, assistance_level: e.target.value as ActivityEvent['assistance_level'] })} required>
          <option value="full">全介助</option>
          <option value="partial">部分介助</option>
          <option value="minimal">最小限</option>
          <option value="independent">自立</option>
        </select>
      </div>
      <div>
        <label>成果</label>
        <input type="text" value={formData.achievements?.join(',') ?? ''} onChange={e => setFormData({ ...formData, achievements: e.target.value.split(',') })} placeholder="例: 歩行,転倒なし" />
      </div>
      <div>
        <label>メモ</label>
        <textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
      </div>
      <button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 text-white py-4 rounded-xl font-semibold text-lg">{isSubmitting ? '保存中...' : '活動記録を保存'}</button>
    </form>
  );
}

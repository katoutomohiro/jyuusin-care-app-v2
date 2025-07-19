import React from 'react';
import { Play, Users, Smile } from 'lucide-react';
import { ActivityRecord } from '../../types';

interface ActivityInputProps {
  value?: ActivityRecord;
  onChange?: (value: ActivityRecord) => void;
  onSave?: (eventData: any) => Promise<void>;
  isSubmitting?: boolean;
}

const ActivityInput: React.FC<ActivityInputProps> = ({ value, onChange }) => {
  // 安全な値の取得
  const safeValue = value || {
    participation: [],
    mood: '',
    notes: ''
  };

  const handleChange = (field: keyof ActivityRecord, val: any) => {
    onChange({
      ...safeValue,
      [field]: val
    });
  };

  const toggleParticipation = (activity: string) => {
    const currentParticipation = safeValue.participation || [];
    const newParticipation = currentParticipation.includes(activity)
      ? currentParticipation.filter(a => a !== activity)
      : [...currentParticipation, activity];
    handleChange('participation', newParticipation);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Play className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-800">活動・気分</h3>
      </div>
      
      <div className="space-y-4">
        {/* 活動内容 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            参加した活動（複数選択可）
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {['音楽療法', '作業療法', '理学療法', '言語療法', '遊び', '散歩', '入浴', '食事', '休息', 'その他'].map((activity) => (
              <label key={activity} className="flex items-center gap-2 p-2 border border-gray-200 rounded-md hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={(safeValue.participation || []).includes(activity)}
                  onChange={() => toggleParticipation(activity)}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">{activity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 気分 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
            <Smile className="w-4 h-4 text-yellow-500" />
            気分
          </label>
          <select
            value={safeValue.mood || ''}
            onChange={(e) => handleChange('mood', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">選択してください</option>
            <option value="良好">良好</option>
            <option value="普通">普通</option>
            <option value="不安">不安</option>
            <option value="興奮">興奮</option>
            <option value="落ち着きがない">落ち着きがない</option>
            <option value="眠そう">眠そう</option>
            <option value="その他">その他</option>
          </select>
        </div>

        {/* 特記事項 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            特記事項
          </label>
          <textarea
            placeholder="活動や気分に関する特記事項があれば記録してください"
            value={safeValue.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="mt-4 p-3 bg-purple-50 rounded-md">
        <p className="text-sm text-purple-700">
          💡 重心児者の活動や気分の変化は、ケアの質を向上させる重要な情報です。
        </p>
      </div>
    </div>
  );
};

export default ActivityInput; 
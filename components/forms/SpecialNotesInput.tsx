import React, { useState } from 'react';
import { FileText, AlertTriangle, Star, Clock, User } from 'lucide-react';

interface SpecialNotesData {
  content: string;
  importance: string;
  category: string;
  time: string;
  author: string;
  tags: string[];
}

interface SpecialNotesInputProps {
  data: SpecialNotesData;
  onChange: (data: SpecialNotesData) => void;
}

const SpecialNotesInput: React.FC<SpecialNotesInputProps> = ({ data, onChange }) => {
  const [localData, setLocalData] = useState<SpecialNotesData>(data);

  const handleChange = (field: keyof SpecialNotesData, value: string | string[]) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    onChange(newData);
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = localData.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    handleChange('tags', newTags);
  };

  const importanceLevels = [
    { value: 'low', label: '低', color: 'bg-green-100 text-green-700', icon: '🟢' },
    { value: 'medium', label: '中', color: 'bg-yellow-100 text-yellow-700', icon: '🟡' },
    { value: 'high', label: '高', color: 'bg-orange-100 text-orange-700', icon: '🟠' },
    { value: 'urgent', label: '緊急', color: 'bg-red-100 text-red-700', icon: '🔴' }
  ];

  const categories = [
    { value: 'general', label: '一般', icon: FileText },
    { value: 'medical', label: '医療', icon: AlertTriangle },
    { value: 'behavior', label: '行動', icon: User },
    { value: 'family', label: '家族', icon: User },
    { value: 'staff', label: 'スタッフ', icon: User },
    { value: 'equipment', label: '設備', icon: AlertTriangle },
    { value: 'other', label: 'その他', icon: FileText }
  ];

  const commonTags = [
    '重要',
    '要確認',
    '継続観察',
    '家族連絡',
    '医師相談',
    '看護師相談',
    '療法士相談',
    '緊急対応',
    '予防',
    '改善',
    '悪化',
    '安定',
    '変化',
    '新規',
    '継続'
  ];

  const templatePhrases = {
    general: [
      '状態安定',
      '状態変化',
      '体調良好',
      '体調不良',
      '食欲良好',
      '食欲不振',
      '睡眠良好',
      '睡眠不足',
      '活動的',
      '活動不足'
    ],
    medical: [
      'バイタル安定',
      'バイタル異常',
      '発熱あり',
      '発熱なし',
      '発作なし',
      '発作あり',
      '投薬完了',
      '投薬拒否',
      '副作用なし',
      '副作用あり'
    ],
    behavior: [
      '機嫌良好',
      '機嫌不良',
      '協力的',
      '非協力的',
      '落ち着いている',
      '興奮している',
      '不安定',
      '安定している',
      '笑顔多い',
      '泣き声多い'
    ],
    family: [
      '家族来訪',
      '家族連絡',
      '家族相談',
      '家族要望',
      '家族不安',
      '家族理解',
      '家族協力',
      '家族負担',
      '家族支援',
      '家族教育'
    ],
    staff: [
      'スタッフ連携',
      'スタッフ相談',
      'スタッフ研修',
      'スタッフ配置',
      'スタッフ負担',
      'スタッフ支援',
      'チーム会議',
      '情報共有',
      '引き継ぎ',
      '記録確認'
    ]
  };

  const getTemplatePhrases = () => {
    const category = localData.category;
    return templatePhrases[category as keyof typeof templatePhrases] || templatePhrases.general;
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-800">特記事項</h3>
      </div>

      {/* 重要度 */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Star className="w-4 h-4 text-yellow-500" />
          重要度
        </label>
        <div className="grid grid-cols-4 gap-2">
          {importanceLevels.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => handleChange('importance', level.value)}
              className={`p-3 border rounded-lg transition-colors ${
                localData.importance === level.value
                  ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-lg">{level.icon}</div>
              <div className="text-sm font-medium">{level.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* カテゴリ */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">カテゴリ</label>
        <div className="grid grid-cols-4 gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.value}
                type="button"
                onClick={() => handleChange('category', category.value)}
                className={`p-3 border rounded-lg transition-colors ${
                  localData.category === category.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Icon className="w-4 h-4 mx-auto mb-1" />
                <div className="text-xs">{category.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 記録時間 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Clock className="w-4 h-4 text-gray-500" />
            記録時間
          </label>
          <input
            type="time"
            value={localData.time}
            onChange={(e) => handleChange('time', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <User className="w-4 h-4 text-gray-500" />
            記録者
          </label>
          <input
            type="text"
            value={localData.author}
            onChange={(e) => handleChange('author', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="記録者名"
          />
        </div>
      </div>

      {/* タグ */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">タグ（複数選択可）</label>
        <div className="flex flex-wrap gap-2">
          {commonTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagToggle(tag)}
              className={`px-3 py-1 text-sm border rounded-full transition-colors ${
                localData.tags?.includes(tag)
                  ? 'border-blue-500 bg-blue-100 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 定型文 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">定型文</label>
        <div className="flex flex-wrap gap-2">
          {getTemplatePhrases().map((phrase) => (
            <button
              key={phrase}
              type="button"
              onClick={() => {
                const currentContent = localData.content;
                const newContent = currentContent ? `${currentContent}、${phrase}` : phrase;
                handleChange('content', newContent);
              }}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              {phrase}
            </button>
          ))}
        </div>
      </div>

      {/* 特記事項内容 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">特記事項内容</label>
        <textarea
          value={localData.content}
          onChange={(e) => handleChange('content', e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="特記事項を詳しく記入してください..."
        />
      </div>

      {/* 重要度に応じた背景色 */}
      {localData.importance && (
        <div className={`p-4 rounded-lg ${
          localData.importance === 'urgent' ? 'bg-red-50 border border-red-200' :
          localData.importance === 'high' ? 'bg-orange-50 border border-orange-200' :
          localData.importance === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
          'bg-green-50 border border-green-200'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className={`w-4 h-4 ${
              localData.importance === 'urgent' ? 'text-red-600' :
              localData.importance === 'high' ? 'text-orange-600' :
              localData.importance === 'medium' ? 'text-yellow-600' :
              'text-green-600'
            }`} />
            <span className={`text-sm font-medium ${
              localData.importance === 'urgent' ? 'text-red-700' :
              localData.importance === 'high' ? 'text-orange-700' :
              localData.importance === 'medium' ? 'text-yellow-700' :
              'text-green-700'
            }`}>
              {importanceLevels.find(level => level.value === localData.importance)?.label}重要度
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {localData.importance === 'urgent' ? '緊急対応が必要な事項です。すぐに確認してください。' :
             localData.importance === 'high' ? '重要な事項です。優先的に確認してください。' :
             localData.importance === 'medium' ? '注意が必要な事項です。適切なタイミングで確認してください。' :
             '参考事項です。必要に応じて確認してください。'}
          </p>
        </div>
      )}

      {/* 文字数カウンター */}
      <div className="text-right">
        <span className={`text-sm ${
          localData.content.length > 500 ? 'text-red-600' : 'text-gray-500'
        }`}>
          {localData.content.length} / 1000文字
        </span>
      </div>
    </div>
  );
};

export default SpecialNotesInput; 
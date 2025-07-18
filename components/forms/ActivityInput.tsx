import React, { useState } from 'react';
import { Activity, Heart, Users, MapPin, Music, BookOpen } from 'lucide-react';

interface ActivityData {
  rehabilitation: {
    type: string;
    duration: string;
    intensity: string;
    therapist: string;
  };
  play: {
    type: string;
    duration: string;
    enjoyment: string;
    participants: string;
  };
  outing: {
    destination: string;
    duration: string;
    transportation: string;
    weather: string;
  };
  exercise: {
    type: string;
    duration: string;
    intensity: string;
    assistance: string;
  };
  social: {
    type: string;
    participants: string;
    duration: string;
    mood: string;
  };
  notes: string;
}

interface ActivityInputProps {
  data: ActivityData;
  onChange: (data: ActivityData) => void;
}

const ActivityInput: React.FC<ActivityInputProps> = ({ data, onChange }) => {
  const [localData, setLocalData] = useState<ActivityData>(data);

  const handleChange = (field: keyof ActivityData, value: string | any) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    onChange(newData);
  };

  const handleRehabilitationChange = (field: keyof ActivityData['rehabilitation'], value: string) => {
    const newRehabilitation = { ...localData.rehabilitation, [field]: value };
    handleChange('rehabilitation', newRehabilitation);
  };

  const handlePlayChange = (field: keyof ActivityData['play'], value: string) => {
    const newPlay = { ...localData.play, [field]: value };
    handleChange('play', newPlay);
  };

  const handleOutingChange = (field: keyof ActivityData['outing'], value: string) => {
    const newOuting = { ...localData.outing, [field]: value };
    handleChange('outing', newOuting);
  };

  const handleExerciseChange = (field: keyof ActivityData['exercise'], value: string) => {
    const newExercise = { ...localData.exercise, [field]: value };
    handleChange('exercise', newExercise);
  };

  const handleSocialChange = (field: keyof ActivityData['social'], value: string) => {
    const newSocial = { ...localData.social, [field]: value };
    handleChange('social', newSocial);
  };

  const rehabilitationTypes = [
    { value: 'pt', label: '理学療法' },
    { value: 'ot', label: '作業療法' },
    { value: 'st', label: '言語療法' },
    { value: 'sw', label: 'ソーシャルワーク' },
    { value: 'music', label: '音楽療法' },
    { value: 'art', label: '芸術療法' },
    { value: 'none', label: 'なし' }
  ];

  const intensities = [
    { value: 'light', label: '軽度', color: 'bg-green-100 text-green-700' },
    { value: 'moderate', label: '中等度', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'heavy', label: '重度', color: 'bg-red-100 text-red-700' }
  ];

  const durations = [
    { value: '15min', label: '15分' },
    { value: '30min', label: '30分' },
    { value: '45min', label: '45分' },
    { value: '60min', label: '60分' },
    { value: '90min', label: '90分' },
    { value: '120min', label: '120分' }
  ];

  const playTypes = [
    { value: 'toys', label: 'おもちゃ遊び' },
    { value: 'music', label: '音楽' },
    { value: 'books', label: '絵本' },
    { value: 'games', label: 'ゲーム' },
    { value: 'art', label: 'お絵かき' },
    { value: 'puzzle', label: 'パズル' },
    { value: 'none', label: 'なし' }
  ];

  const enjoymentLevels = [
    { value: 'none', label: '興味なし' },
    { value: 'little', label: '少し興味' },
    { value: 'moderate', label: '普通' },
    { value: 'good', label: '楽しそう' },
    { value: 'excellent', label: 'とても楽しそう' }
  ];

  const destinations = [
    { value: 'park', label: '公園' },
    { value: 'shopping', label: '買い物' },
    { value: 'hospital', label: '病院' },
    { value: 'family', label: '家族宅' },
    { value: 'event', label: 'イベント' },
    { value: 'other', label: 'その他' },
    { value: 'none', label: '外出なし' }
  ];

  const transportations = [
    { value: 'wheelchair', label: '車椅子' },
    { value: 'stroller', label: 'ベビーカー' },
    { value: 'car', label: '車' },
    { value: 'walk', label: '歩行' },
    { value: 'public', label: '公共交通' }
  ];

  const weathers = [
    { value: 'sunny', label: '晴れ' },
    { value: 'cloudy', label: '曇り' },
    { value: 'rainy', label: '雨' },
    { value: 'snowy', label: '雪' }
  ];

  const exerciseTypes = [
    { value: 'stretching', label: 'ストレッチ' },
    { value: 'walking', label: '歩行訓練' },
    { value: 'sitting', label: '座位訓練' },
    { value: 'standing', label: '立位訓練' },
    { value: 'swimming', label: '水泳' },
    { value: 'none', label: 'なし' }
  ];

  const assistanceLevels = [
    { value: 'independent', label: '自立' },
    { value: 'minimal', label: '最小介助' },
    { value: 'moderate', label: '中等度介助' },
    { value: 'maximal', label: '最大介助' },
    { value: 'dependent', label: '全介助' }
  ];

  const socialTypes = [
    { value: 'family', label: '家族交流' },
    { value: 'friends', label: '友達交流' },
    { value: 'staff', label: 'スタッフ交流' },
    { value: 'group', label: 'グループ活動' },
    { value: 'none', label: 'なし' }
  ];

  const moods = [
    { value: 'happy', label: '嬉しい', emoji: '😊' },
    { value: 'calm', label: '落ち着いている', emoji: '😌' },
    { value: 'excited', label: '興奮している', emoji: '😄' },
    { value: 'sad', label: '悲しい', emoji: '😢' },
    { value: 'angry', label: '怒っている', emoji: '😠' },
    { value: 'neutral', label: '普通', emoji: '😐' }
  ];

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-800">活動記録</h3>
      </div>

      {/* リハビリ */}
      <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-blue-600" />
          <h4 className="text-sm font-medium text-gray-700">リハビリ</h4>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">種類</label>
            <div className="grid grid-cols-1 gap-2">
              {rehabilitationTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleRehabilitationChange('type', type.value)}
                  className={`p-2 text-sm border rounded-md transition-colors ${
                    localData.rehabilitation.type === type.value
                      ? 'border-blue-500 bg-blue-100 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">時間</label>
              <div className="grid grid-cols-2 gap-2">
                {durations.map((duration) => (
                  <button
                    key={duration.value}
                    type="button"
                    onClick={() => handleRehabilitationChange('duration', duration.value)}
                    className={`p-2 text-xs border rounded-md transition-colors ${
                      localData.rehabilitation.duration === duration.value
                        ? 'border-blue-500 bg-blue-100 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {duration.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">強度</label>
              <div className="grid grid-cols-1 gap-2">
                {intensities.map((intensity) => (
                  <button
                    key={intensity.value}
                    type="button"
                    onClick={() => handleRehabilitationChange('intensity', intensity.value)}
                    className={`p-2 text-sm border rounded-md transition-colors ${
                      localData.rehabilitation.intensity === intensity.value
                        ? 'border-blue-500 bg-blue-100 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {intensity.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 遊び */}
      <div className="space-y-4 p-4 bg-yellow-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 text-yellow-600" />
          <h4 className="text-sm font-medium text-gray-700">遊び</h4>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">種類</label>
            <div className="grid grid-cols-1 gap-2">
              {playTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handlePlayChange('type', type.value)}
                  className={`p-2 text-sm border rounded-md transition-colors ${
                    localData.play.type === type.value
                      ? 'border-yellow-500 bg-yellow-100 text-yellow-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">時間</label>
              <div className="grid grid-cols-2 gap-2">
                {durations.map((duration) => (
                  <button
                    key={duration.value}
                    type="button"
                    onClick={() => handlePlayChange('duration', duration.value)}
                    className={`p-2 text-xs border rounded-md transition-colors ${
                      localData.play.duration === duration.value
                        ? 'border-yellow-500 bg-yellow-100 text-yellow-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {duration.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">楽しさ</label>
              <div className="grid grid-cols-1 gap-2">
                {enjoymentLevels.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => handlePlayChange('enjoyment', level.value)}
                    className={`p-2 text-sm border rounded-md transition-colors ${
                      localData.play.enjoyment === level.value
                        ? 'border-yellow-500 bg-yellow-100 text-yellow-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 外出 */}
      <div className="space-y-4 p-4 bg-green-50 rounded-lg">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-green-600" />
          <h4 className="text-sm font-medium text-gray-700">外出</h4>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">行き先</label>
            <div className="grid grid-cols-1 gap-2">
              {destinations.map((dest) => (
                <button
                  key={dest.value}
                  type="button"
                  onClick={() => handleOutingChange('destination', dest.value)}
                  className={`p-2 text-sm border rounded-md transition-colors ${
                    localData.outing.destination === dest.value
                      ? 'border-green-500 bg-green-100 text-green-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {dest.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">移動手段</label>
              <div className="grid grid-cols-1 gap-2">
                {transportations.map((transport) => (
                  <button
                    key={transport.value}
                    type="button"
                    onClick={() => handleOutingChange('transportation', transport.value)}
                    className={`p-2 text-sm border rounded-md transition-colors ${
                      localData.outing.transportation === transport.value
                        ? 'border-green-500 bg-green-100 text-green-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {transport.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">天気</label>
              <div className="grid grid-cols-2 gap-2">
                {weathers.map((weather) => (
                  <button
                    key={weather.value}
                    type="button"
                    onClick={() => handleOutingChange('weather', weather.value)}
                    className={`p-2 text-xs border rounded-md transition-colors ${
                      localData.outing.weather === weather.value
                        ? 'border-green-500 bg-green-100 text-green-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {weather.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 運動 */}
      <div className="space-y-4 p-4 bg-purple-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-600" />
          <h4 className="text-sm font-medium text-gray-700">運動</h4>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">種類</label>
            <div className="grid grid-cols-1 gap-2">
              {exerciseTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleExerciseChange('type', type.value)}
                  className={`p-2 text-sm border rounded-md transition-colors ${
                    localData.exercise.type === type.value
                      ? 'border-purple-500 bg-purple-100 text-purple-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">時間</label>
              <div className="grid grid-cols-2 gap-2">
                {durations.map((duration) => (
                  <button
                    key={duration.value}
                    type="button"
                    onClick={() => handleExerciseChange('duration', duration.value)}
                    className={`p-2 text-xs border rounded-md transition-colors ${
                      localData.exercise.duration === duration.value
                        ? 'border-purple-500 bg-purple-100 text-purple-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {duration.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">介助</label>
              <div className="grid grid-cols-1 gap-2">
                {assistanceLevels.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => handleExerciseChange('assistance', level.value)}
                    className={`p-2 text-sm border rounded-md transition-colors ${
                      localData.exercise.assistance === level.value
                        ? 'border-purple-500 bg-purple-100 text-purple-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 交流 */}
      <div className="space-y-4 p-4 bg-pink-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-pink-600" />
          <h4 className="text-sm font-medium text-gray-700">交流</h4>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">種類</label>
            <div className="grid grid-cols-1 gap-2">
              {socialTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleSocialChange('type', type.value)}
                  className={`p-2 text-sm border rounded-md transition-colors ${
                    localData.social.type === type.value
                      ? 'border-pink-500 bg-pink-100 text-pink-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">気分</label>
              <div className="grid grid-cols-1 gap-2">
                {moods.map((mood) => (
                  <button
                    key={mood.value}
                    type="button"
                    onClick={() => handleSocialChange('mood', mood.value)}
                    className={`p-2 text-sm border rounded-md transition-colors ${
                      localData.social.mood === mood.value
                        ? 'border-pink-500 bg-pink-100 text-pink-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <span className="mr-1">{mood.emoji}</span>
                    {mood.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 特記事項 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">特記事項</label>
        <textarea
          value={localData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="活動に関する特記事項があれば記入してください..."
        />
      </div>

      {/* 定型文ボタン */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">定型文</label>
        <div className="flex flex-wrap gap-2">
          {[
            '活動良好',
            '活動不足',
            'リハビリ実施',
            'リハビリ中止',
            '遊び楽しい',
            '遊び興味なし',
            '外出実施',
            '外出中止',
            '運動実施',
            '運動中止',
            '交流良好',
            '交流不足',
            '疲労感',
            '元気',
            '協力的',
            '非協力的'
          ].map((template) => (
            <button
              key={template}
              type="button"
              onClick={() => {
                const currentNotes = localData.notes;
                const newNotes = currentNotes ? `${currentNotes}、${template}` : template;
                handleChange('notes', newNotes);
              }}
              className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
            >
              {template}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityInput; 
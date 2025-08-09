import React from 'react';
import { FileText, AlertTriangle, Star } from 'lucide-react';
import { SpecialNote } from '../../../types';

interface SpecialNotesInputProps {
  value: SpecialNote[];
  onChange: (value: SpecialNote[]) => void;
}

const SpecialNotesInput: React.FC<SpecialNotesInputProps> = ({ value, onChange }) => {
  // 安全な値の取得
  const safeValue = value || [];

  const addNote = () => {
    const newNote: SpecialNote = {
      category: '',
      details: ''
    };
    onChange([...safeValue, newNote]);
  };

  const updateNote = (index: number, updatedNote: SpecialNote) => {
    const newNotes = [...safeValue];
    newNotes[index] = updatedNote;
    onChange(newNotes);
  };

  const removeNote = (index: number) => {
    const newNotes = safeValue.filter((_, i) => i !== index);
    onChange(newNotes);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-amber-600" />
        <h3 className="text-lg font-semibold text-gray-800">特記事項</h3>
      </div>
      
      <div className="space-y-4">
        {safeValue.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            特記事項は記録されていません
          </div>
        ) : (
          safeValue.map((note, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-800">特記事項 {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeNote(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  削除
                </button>
              </div>

              {/* カテゴリ */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  カテゴリ
                </label>
                <select
                  value={note.category || ''}
                  onChange={(e) => updateNote(index, { ...note, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="">選択してください</option>
                  <option value="健康状態">健康状態</option>
                  <option value="行動">行動</option>
                  <option value="家族連絡">家族連絡</option>
                  <option value="医療連絡">医療連絡</option>
                  <option value="施設連絡">施設連絡</option>
                  <option value="その他">その他</option>
                </select>
              </div>

              {/* 詳細 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  詳細
                </label>
                <textarea
                  placeholder="特記事項の詳細を記録してください"
                  value={note.details || ''}
                  onChange={(e) => updateNote(index, { ...note, details: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>
          ))
        )}

        <button
          type="button"
          onClick={addNote}
          className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors"
        >
          + 特記事項を追加
        </button>
      </div>

      <div className="mt-4 p-3 bg-amber-50 rounded-md">
        <p className="text-sm text-amber-700">
          💡 重要な情報や他の職員に伝えるべき事項があれば、必ず記録してください。
        </p>
      </div>
    </div>
  );
};

export default SpecialNotesInput; 
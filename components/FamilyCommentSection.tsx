import React, { useState } from 'react';

export interface FamilyComment {
  id: string;
  userId: string;
  author: string;
  role: 'family' | 'staff' | 'medical';
  comment: string;
  createdAt: string;
}

export const FamilyCommentSection: React.FC<{
  comments: FamilyComment[];
  onAdd: (comment: Omit<FamilyComment, 'id' | 'createdAt'>) => void;
  userId: string;
  currentRole: 'family' | 'staff' | 'medical';
  currentAuthor: string;
}> = ({ comments, onAdd, userId, currentRole, currentAuthor }) => {
  const [text, setText] = useState('');
  const handleAdd = () => {
    if (text.trim()) {
      onAdd({ userId, author: currentAuthor, role: currentRole, comment: text });
      setText('');
    }
  };
  return (
    <div className="bg-gray-50 rounded p-4 mt-4">
      <h2 className="font-bold text-lg mb-2">家族・多職種コメント</h2>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {comments.map((c) => (
          <div key={c.id} className="border-b pb-1 text-sm">
            <span className="font-semibold">[{c.role}] {c.author}：</span>
            <span>{c.comment}</span>
            <span className="ml-2 text-xs text-gray-400">{c.createdAt}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        <input
          className="flex-1 border rounded p-2"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="コメントを入力..."
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleAdd}>
          送信
        </button>
      </div>
    </div>
  );
};

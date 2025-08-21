import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSelectedUserId, setSelectedUserId } from "../store/selection";

export default function DailyLogInputPage(): JSX.Element | null {
  const nav = useNavigate();
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const id = getSelectedUserId();
    if (!id) {
      nav("/daily-log", { replace: true });
      return;
    }
    setUid(id);
  }, [nav]);

  if (uid === null) return null;

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-3">日誌入力（仮実装）</h1>

      <div className="mb-3 text-sm text-gray-600">
        選択中ユーザーID: <span className="font-mono">{uid}</span>
      </div>

      <div className="mb-4">
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white mr-2"
          onClick={() => {
            // 仮の開始処理
            alert("記録を開始（ダミー）");
          }}
        >
          記録を開始
        </button>

        <button
          className="px-4 py-2 rounded border"
          onClick={() => {
            setSelectedUserId(null);
            nav("/daily-log", { replace: true });
          }}
        >
          一覧に戻る
        </button>
      </div>
    </main>
  );
}

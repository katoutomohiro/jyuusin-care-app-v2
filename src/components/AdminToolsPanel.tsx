import React from "react";
import { featureFlags } from '../config/featureFlags';
import AdminRecoveryPanel from './AdminRecoveryPanel';

function PdfFontTestButton() {
  if (!featureFlags.enablePdfFont) return null;

  const handleClick = () => {
    try {
      const g = (globalThis as any);
      if (g && typeof g.pdfTest === 'function') {
        g.pdfTest();
        console.info('[PDF] pdfTest() invoked');
      } else {
        console.warn('[PDF] window.pdfTest is not available');
        alert('PDFテスト関数が見つかりません。開発用ユーティリティの読込みを確認してください。');
      }
    } catch (e) {
      console.error('[PDF] pdfTest failed:', e);
      alert('PDFテスト実行中にエラーが発生しました（詳細はコンソールを参照）');
    }
  };

  return (
    <button type="button" onClick={handleClick} style={{ marginLeft: 8 }}>
      📄 PDFフォントテスト
    </button>
  );
}

/**
 * AdminToolsPanel (開発用)
 * - featureFlags.enablePdfFont===true のときだけ PDFテストボタンを表示
 * - 既存UI/UXには一切干渉しない
 */
export const AdminToolsPanel: React.FC = () => {
  // どちらかのフラグがONならパネル表示
  if (!featureFlags.enablePdfFont && !featureFlags.enableAutoRecoverBtn) return null;
  return (
    <div style={{ padding: '1em', background: '#f9fafb', borderRadius: '8px', maxWidth: 400 }}>
      <h3 style={{ fontSize: '1.1em', marginBottom: '0.7em' }}>管理者ツール（開発用）</h3>
      <PdfFontTestButton />
      <div style={{ marginTop: 8 }}>
        <AdminRecoveryPanel />
      </div>
    </div>
  );
};

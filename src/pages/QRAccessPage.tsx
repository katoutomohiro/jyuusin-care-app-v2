import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

const QRAccessPage: React.FC = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [currentUrl, setCurrentUrl] = useState<string>('');

  useEffect(() => {
    // 現在のアプリURLを取得
    const appUrl = window.location.origin;
    setCurrentUrl(appUrl);
    
    // QRコードを生成
    generateQRCode(appUrl);
  }, []);

  const generateQRCode = async (url: string) => {
    try {
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      console.error('QRコード生成エラー:', error);
    }
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.download = 'jyuushin-care-app-qr.png';
    link.href = qrCodeUrl;
    link.click();
  };

  const printQRCode = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>重心ケアアプリ QRコード</title>
            <style>
              body { 
                font-family: 'Yu Gothic', 'Hiragino Sans', sans-serif;
                text-align: center; 
                padding: 20px;
              }
              .qr-container {
                border: 2px solid #333;
                padding: 20px;
                margin: 20px auto;
                width: fit-content;
              }
              img { margin: 20px 0; }
              h1 { color: #333; font-size: 24px; }
              p { font-size: 14px; color: #666; }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <h1>🏥 重心ケアアプリ</h1>
              <img src="${qrCodeUrl}" alt="QRコード" />
              <p>スマートフォンでQRコードを読み取ってアクセス</p>
              <p><strong>URL:</strong> ${currentUrl}</p>
              <p>印刷日時: ${new Date().toLocaleString('ja-JP')}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          📱 QRコードアクセス
          <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
            携帯アクセス対応
          </span>
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* QRコード表示 */}
          <div className="text-center">
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 p-6 rounded-lg">
              {qrCodeUrl ? (
                <img 
                  src={qrCodeUrl} 
                  alt="QRコード" 
                  className="mx-auto mb-4"
                  style={{ width: '256px', height: '256px' }}
                />
              ) : (
                <div className="w-64 h-64 bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-gray-500">QRコード生成中...</span>
                </div>
              )}
              
              <p className="text-lg font-semibold text-gray-800 mb-2">
                📱 スマホでQRコードを読み取り
              </p>
              <p className="text-sm text-gray-600">
                カメラアプリまたはQRコードリーダーで読み取ってください
              </p>
            </div>

            {/* アクション ボタン */}
            <div className="flex gap-3 mt-4 justify-center">
              <button
                onClick={downloadQRCode}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
                disabled={!qrCodeUrl}
              >
                💾 QRコード保存
              </button>
              <button
                onClick={printQRCode}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
                disabled={!qrCodeUrl}
              >
                🖨️ 印刷
              </button>
            </div>
          </div>

          {/* アクセス情報 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">📋 アクセス情報</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  アプリURL:
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={currentUrl}
                    readOnly
                    className="flex-1 p-2 border border-gray-300 rounded-l-lg bg-white"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(currentUrl)}
                    className="bg-gray-500 text-white px-3 py-2 rounded-r-lg hover:bg-gray-600"
                  >
                    📋
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">💡 使用方法</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• スマートフォンのカメラでQRコードを読み取り</li>
                  <li>• 表示されたリンクをタップしてアクセス</li>
                  <li>• Wi-Fi環境での使用を推奨</li>
                  <li>• 職員間でQRコードを共有可能</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">📱 対応機能</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• 📝 日誌入力（タッチ操作対応）</li>
                  <li>• 👥 利用者情報確認</li>
                  <li>• 📊 ダッシュボード閲覧</li>
                  <li>• 🚨 緊急時通知機能</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 使用例 */}
        <div className="mt-8 bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-4">
            🎯 活用シーン
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl mb-2">🏥</div>
              <p className="font-medium">施設内移動時</p>
              <p className="text-gray-600">タブレットが使えない時の代替手段</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">👨‍⚕️</div>
              <p className="font-medium">職員研修</p>
              <p className="text-gray-600">新人職員への操作説明時</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🚨</div>
              <p className="font-medium">緊急時対応</p>
              <p className="text-gray-600">迅速なアクセスが必要な場面</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRAccessPage;
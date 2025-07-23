import React, { useState, useEffect } from 'react';

const QRAccessPage: React.FC = () => {
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [localIP, setLocalIP] = useState<string>('192.168.1.100');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>('');

  // ローカルIPアドレス取得
  const getLocalIPAddress = async (): Promise<string> => {
    try {
      const savedIP = localStorage.getItem('manualIP');
      if (savedIP) {
        return savedIP;
      }
      // WebRTCでIP取得（失敗時はデフォルト）
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });
      pc.createDataChannel('');
      return new Promise((resolve) => {
        let resolved = false;
        pc.onicecandidate = (event) => {
          if (event.candidate && !resolved) {
            const candidate = event.candidate.candidate;
            const ipMatch = candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
            if (ipMatch) {
              const ip = ipMatch[1];
              if (ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
                resolved = true;
                pc.close();
                resolve(ip);
                return;
              }
            }
          }
        };
        pc.createOffer()
          .then(offer => pc.setLocalDescription(offer))
          .catch(() => {
            if (!resolved) {
              resolved = true;
              pc.close();
              resolve('192.168.1.100');
            }
          });
        setTimeout(() => {
          if (!resolved) {
            resolved = true;
            pc.close();
            resolve('192.168.1.100');
          }
        }, 5000);
      });
    } catch {
      return '192.168.1.100';
    }
  };

  // QRコード生成
  const generateQRCode = async () => {
    setIsGenerating(true);
    setError('');
    try {
      const ip = await getLocalIPAddress();
      setLocalIP(ip);
      const appUrl = `http://${ip}:3003`;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(appUrl)}&margin=10`;
      const testImage = new Image();
      testImage.onload = () => {
        setQrCodeData(qrCodeUrl);
      };
      testImage.onerror = () => {
        setError('QRコード画像の生成に失敗しました');
      };
      testImage.src = qrCodeUrl;
    } catch {
      setError('QRコードの生成に失敗しました');
    } finally {
      setIsGenerating(false);
    }
  };

  // 手動IP設定（初心者向けガイド付き）
  const handleManualIP = () => {
    const currentIP = localIP;
    const ipGuideText = `🔧 手動IPアドレス設定

現在のIP: ${currentIP}

【IPアドレス確認方法】
1. Windowsキー + R →「cmd」と入力してEnter
2. 黒い画面で「ipconfig」と入力してEnter
3. 「IPv4 アドレス」を探す（例: 193.168.2.7）

⚠️ PCとスマホが同じWi-Fiに接続されている必要があります

正しいIPアドレスを入力してください（例: 193.168.2.7）`;

    const manualIP = prompt(ipGuideText, currentIP);

    if (manualIP && manualIP !== currentIP) {
      const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (ipPattern.test(manualIP)) {
        localStorage.setItem('manualIP', manualIP);
        setLocalIP(manualIP);
        alert(`✅ IPアドレスを更新しました！\n新しいIP: ${manualIP}\n\nQRコードを再生成します`);
        generateQRCode();
      } else {
        alert(`❌ 無効なIPアドレス形式です\n例: 193.168.2.7`);
      }
    }
  };

  // URLコピー
  const copyToClipboard = async () => {
    const url = `http://${localIP}:3003`;
    try {
      await navigator.clipboard.writeText(url);
      alert('URLをコピーしました！\n\n' + url);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('URLをコピーしました！\n\n' + url);
    }
  };

  useEffect(() => {
    generateQRCode();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          📱 QRコードアクセス <span className="text-lg font-normal text-gray-600">携帯アクセス対応</span>
        </h1>
        {/* 接続状況表示 */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">🔗 接続情報</h3>
          <div className="text-sm text-blue-700">
            <p><strong>サーバーIP:</strong> {localIP}</p>
            <p><strong>ポート:</strong> 3003</p>
            <p><strong>アクセスURL:</strong> http://{localIP}:3003</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {/* QRコード表示エリア */}
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">📱 スマホでQRコード読み取り</h2>
            <div className="bg-gray-50 p-6 rounded-lg inline-block border-2 border-dashed border-gray-300">
              {isGenerating ? (
                <div className="w-96 h-96 flex items-center justify-center">
                  <div className="text-gray-500 text-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    QRコード生成中...
                  </div>
                </div>
              ) : error ? (
                <div className="w-96 h-96 flex flex-col items-center justify-center bg-red-50 rounded">
                  <div className="text-red-500 text-center">
                    <div className="text-4xl mb-4">⚠️</div>
                    <div className="text-sm mb-4">{error}</div>
                    <button 
                      onClick={generateQRCode}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
                    >
                      再試行
                    </button>
                  </div>
                </div>
              ) : qrCodeData ? (
                <img 
                  src={qrCodeData}
                  alt="QRコード - 重心ケアアプリアクセス用"
                  className="w-96 h-96 rounded border"
                  style={{ imageRendering: 'pixelated' }}
                  onError={() => setError('QRコード画像の読み込みに失敗しました')}
                />
              ) : (
                <div className="w-96 h-96 flex flex-col items-center justify-center bg-gray-200 rounded">
                  <span className="text-gray-500 text-center">
                    <div className="text-4xl mb-2">📱</div>
                    QRコードを生成中です...
                  </span>
                </div>
              )}
            </div>
            <div className="mt-4 space-y-2">
              <button
                onClick={generateQRCode}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors min-h-[60px] text-lg font-semibold block w-full"
                aria-label="QRコード再生成"
              >
                🔄 QRコード再生成
              </button>
              <button
                onClick={handleManualIP}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition-colors text-sm block w-full"
                aria-label="手動IP設定"
              >
                🔧 手動IP設定（重要）
              </button>
            </div>
          </div>
          {/* アクセス情報 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">📋 アクセス情報</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  アプリURL:
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={`http://${localIP}:3003`}
                    readOnly
                    className="flex-1 px-3 py-3 border rounded-l-lg bg-white text-sm font-mono"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-r-lg transition-colors min-w-[80px] font-semibold"
                    aria-label="URLをコピー"
                  >
                    📋 コピー
                  </button>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">💡 使用方法</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• スマートフォンのカメラでQRコードを読み取り</li>
                  <li>• 表示されたリンクをタップしてアクセス</li>
                  <li>• または上記URLを直接ブラウザに入力</li>
                  <li>• <strong>PCとスマホが同じWi-Fiに接続されている必要があります</strong></li>
                  <li>• アクセスできない場合は「手動IP設定」をお試しください</li>
                </ul>
              </div>
              <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-800 mb-2">🔧 トラブルシューティング</h3>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• アクセスできない場合：「手動IP設定」ボタンでIPを設定</li>
                  <li>• ターミナルで <code>ipconfig</code> を実行してIPアドレスを確認</li>
                  <li>• Wi-Fiネットワークが同一であることを確認</li>
                  <li>• ファイアウォールがブロックしていないか確認</li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">🔧 対応機能</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 📝 日誌入力（スマホ最適化対応）</li>
                  <li>• 👥 利用者情報閲覧</li>
                  <li>• 📊 ダッシュボード簡易表示</li>
                  <li>• 🚨 緊急時連絡機能</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* 活用シーン - 重心ケア特化 */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-green-50 rounded-lg border-2 border-green-200">
            <div className="text-4xl mb-3">🏥</div>
            <h3 className="font-semibold text-green-800 text-lg mb-2">院内移動時</h3>
            <p className="text-sm text-green-600">
              タブレットがない時も<br />スマホで迅速入力
            </p>
          </div>
          <div className="text-center p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
            <div className="text-4xl mb-3">🚗</div>
            <h3 className="font-semibold text-blue-800 text-lg mb-2">送迎時報告</h3>
            <p className="text-sm text-blue-600">
              移動中の状況変化や<br />到着時の状況報告
            </p>
          </div>
          <div className="text-center p-6 bg-red-50 rounded-lg border-2 border-red-200">
            <div className="text-4xl mb-3">🚨</div>
            <h3 className="font-semibold text-red-800 text-lg mb-2">緊急時対応</h3>
            <p className="text-sm text-red-600">
              発作・誤嚥などの<br />緊急事態時の迅速記録
            </p>
          </div>
        </div>
        {/* 重心ケア専用注意事項 */}
        <div className="mt-8 bg-orange-50 border-2 border-orange-200 p-6 rounded-lg">
          <h3 className="font-semibold text-orange-800 mb-3 text-lg">🔒 重心ケア施設での使用上の注意</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-orange-700">
            <div>
              <h4 className="font-semibold mb-2">医療安全面</h4>
              <ul className="space-y-1">
                <li>• 発作・誤嚥時の記録は必須</li>
                <li>• バイタル変化は即座に報告</li>
                <li>• 吸引・経管栄養の実施記録</li>
                <li>• 緊急時は記録より対応優先</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">プライバシー保護</h4>
              <ul className="space-y-1">
                <li>• 個人情報の画面表示に注意</li>
                <li>• 使用後はブラウザを閉じる</li>
                <li>• 家族への情報開示は要確認</li>
                <li>• 他利用者の情報閲覧禁止</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRAccessPage;
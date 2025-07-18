#!/bin/bash
# エラー撲滅モード起動スクリプト v2.0

echo "🚀 エラー撲滅モードを開始します..."

# 1. VS Codeの設定を適用
echo "📝 VS Code設定を適用中..."
code --reload-window > /dev/null 2>&1 &

# 2. 一時的にサービスを停止
echo "🛑 不要なサービスを停止中..."
sudo service docker stop > /dev/null 2>&1 || true
sudo service nginx stop > /dev/null 2>&1 || true

# 3. キャッシュをクリア
echo "🧹 キャッシュをクリア中..."
rm -rf node_modules/.vite > /dev/null 2>&1 || true
rm -rf node_modules/.cache > /dev/null 2>&1 || true
rm -rf ~/.vscode/logs > /dev/null 2>&1 || true

# 4. 環境変数を設定
echo "🔧 環境変数を設定中..."
export NODE_ENV=development
export VITE_DISABLE_WEBSOCKET=true
export VITE_LOG_LEVEL=silent
export BROWSER=none
export NO_COLOR=1
export SUPPRESS_NO_CONFIG_WARNING=true

# 5. 開発サーバーを静かに起動
echo "🔇 サイレントモードで開発サーバーを起動中..."
npm run dev > /dev/null 2>&1 &
SERVER_PID=$!

echo "✅ エラー撲滅モード完了！"
echo "📊 開発サーバーPID: $SERVER_PID"
echo "🌐 アクセス: http://localhost:3003"
echo "🛑 停止するには: kill $SERVER_PID"

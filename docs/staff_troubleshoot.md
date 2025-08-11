# 職員向けトラブルシュート手順書

## 1. 画面が真っ白・何も表示されない
- ブラウザをリロード（Ctrl+F5）
- Service Worker解除: DevTools > Application > Service Workers > Unregister
- キャッシュクリア: 設定 > 履歴 > キャッシュ削除

## 2. PDF出力ができない・日本語が文字化け
- PDFフォント機能が有効か確認（管理者に依頼）
- `public/fonts/ShipporiMincho-Regular.ttf` が存在するか確認
- 管理者画面の「PDFフォントテスト」ボタンで動作確認

## 3. ポート競合・起動できない
- コマンドでポート解放:
  ```bash
  npm run port:free
  ```
- その後、通常通り `npm run dev` で再起動

## 4. キャッシュ・SW問題で最新が表示されない
- ブラウザのキャッシュクリア
- Service Worker解除
- 必要ならPC再起動

## 5. 問題報告時に必要な情報
1. エラーの赤い最初の1行
2. `git status --porcelain` の要約
3. `git rev-list --left-right --count HEAD...origin/$(git rev-parse --abbrev-ref HEAD)` の出力
4. 実行したコマンド（例: npm run port:free）

## 6. その他
- 何か困ったら「管理者ツール」画面のPDFテストボタンで動作確認
- それでも解決しない場合は、上記情報を添えて開発担当に連絡

---

この手順書は現場でのトラブル再現率を高め、迅速な復旧を支援します。

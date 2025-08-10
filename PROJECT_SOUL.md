# Project Soul

## 安定運用ガードレール（必須）
- 新機能はデフォルトOFFの **featureFlags** で導入。既存UIを壊さない。
- 作業前に `npm run backup:zip` と `npm run snapshot` を実施し、いつでも戻れる状態を確保。
- 1コミット＝1ファイル。破壊的変更は禁止。型エラー/白画面は即ロールバック。
- フォントは glyf付きTTFのみ。PDFは registerFonts.ts の共通ロジックを使用。
- ストレージはバージョン管理（`src/utils/storage.ts`）を通す。マイグレーションで後方互換を守る。
- ポートは 3005 固定。Vite 設定・スクリプトでぶれさせない。

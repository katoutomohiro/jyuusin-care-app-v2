# PDFフォント導入・セットアップ手順

## 1. フォント入手・ライセンス
- 推奨: Shippori Mincho (Google Fonts)
- ダウンロード: https://fonts.google.com/specimen/Shippori+Mincho
- ファイル名: ShipporiMincho-Regular.ttf
- ライセンス: SIL Open Font License 1.1
- 詳細は LICENSES/FONTS.md も参照

## 2. 配置手順
1. ダウンロードした ShipporiMincho-Regular.ttf を `public/fonts/` ディレクトリに配置
2. フォント名・拡張子は変更しない（コードと一致させる）

## 3. featureFlags.enablePdfFont の有効化
- `src/config/featureFlags.ts` の `enablePdfFont` を `true` に変更
- デフォルトは `false`（本番環境では必ず OFF）

## 4. PDFテストボタンの使い方
- 管理者画面（AdminToolsPanel）に「📄 PDFフォントテスト」ボタンが表示される
- クリックすると window.pdfTest() が呼ばれ、日本語埋め込みPDFがダウンロードされる
- フォント埋め込み・日本語表示が正しく行われているか Adobe Reader/Chrome/Edge で確認

## 5. トラブルシュート
- ボタンが表示されない: featureFlags.enablePdfFont が true か確認
- PDFが文字化け: フォント配置パス・ファイル名・ライセンスを再確認
- window.pdfTest が undefined: `src/pdf/devConsolePdfTest.ts` が正しく読み込まれているか確認

## 6. 参考
- 詳細設計・運用ガイド: docs/pdf_font_guide.md
- ライセンス管理: LICENSES/FONTS.md

---

この手順で PDF日本語フォント埋め込みの検証・導入が安全に行えます。

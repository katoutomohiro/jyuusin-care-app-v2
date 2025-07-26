# Jyushin Care App PWAテストチェックリスト

## 基本動作
- [ ] manifest.jsonの内容が正しく反映されている（name, icons, theme_color, display, start_url）
- [ ] Service Workerが登録されている（chrome://serviceworker-internals で確認可）
- [ ] ホーム画面追加・インストールボタンが表示される
- [ ] インストール後、アプリ風のUIで起動する

## オフライン動作
- [ ] オフライン状態（Wi-Fi切断）でも主要画面が表示される
- [ ] 編集・保存がオフラインでも可能
- [ ] キャッシュされたファイル（index.html, CSS, JS, アイコン等）が正しく読み込まれる

## データ管理
- [ ] localStorageにデータが保存されている
- [ ] オフライン編集後、オンライン復帰時に同期できる
- [ ] バックアップ・エクスポート機能が動作する

## マルチデバイス対応
- [ ] PC/スマホ/iPadでインストール・オフライン利用が可能
- [ ] 各端末でアイコン・UIが正しく表示される

## その他
- [ ] manifest.jsonのscope, orientation, langが要件通り
- [ ] Service Workerのfetchイベントがキャッシュ優先・APIはネットワーク優先
- [ ] 施設スタッフ・家族が迷わず使えるUI/UX

---

テスト結果・改善点はこのファイルに記録してください。

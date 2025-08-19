import React from 'react';

const PWAInstallGuide: React.FC = () => (
  <section className="bg-blue-50 p-6 rounded-lg shadow-md max-w-xl mx-auto my-8">
    <h2 className="text-xl font-bold mb-2 text-blue-700">ホーム画面追加・オフライン利用ガイド</h2>
    <ul className="list-disc pl-6 text-gray-800">
      <li>PC/スマホ/iPadで <span className="font-mono">http://[PCのIPアドレス]:3003/</span> にアクセス</li>
      <li>画面右上またはメニューの「<b>ホーム画面に追加</b>」「<b>アプリとしてインストール</b>」を選択</li>
      <li>アイコンがホーム画面に追加され、オフラインでも利用可能</li>
      <li>Wi-Fiを切断してもアプリが起動・編集できることを確認</li>
      <li>データは端末のlocalStorageに安全に保存されます</li>
      <li>同期・バックアップは「設定」画面から実行できます</li>
    </ul>
    <div className="mt-4 text-sm text-gray-500">※端末ごとに案内が異なる場合は、画面下部の「インストールガイド」をご参照ください。</div>
  </section>
);

export default PWAInstallGuide;

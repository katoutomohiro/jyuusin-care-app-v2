# プロジェクトソウル - バイタル管理システム拡張

## 全利用者共通バイタル基準値システム

### 概要
重心ケアアプリに全利用者共通のバイタルサイン基準値システムを実装しました。これにより、ケア記録の一貫性と効率性を向上させることができます。

### 実装内容

#### 1. 基準値設定 (`src/config/vitalsDefaults.ts`)
```typescript
export const VITAL_DEFAULTS = {
  tempC: 36.5,    // 体温（摂氏）
  hr: 80,         // 心拍数（bpm）
  spo2: 90,       // 酸素飽和度（%）
  bpSys: 120,     // 収縮期血圧（mmHg）
  bpDia: 70,      // 拡張期血圧（mmHg）
  rr: 20          // 呼吸数（/min）
};
```

#### 2. 安全範囲定義 (`src/config/vitalsDefaults.ts`)
```typescript
export const VITAL_LIMITS = {
  tempC: { min: 30, max: 45 },
  hr: { min: 0, max: 250 },
  spo2: { min: 50, max: 100 },
  bpSys: { min: 50, max: 250 },
  bpDia: { min: 30, max: 150 },
  rr: { min: 5, max: 60 }
};
```

#### 3. RR（呼吸数）追加対応
- バイタルフォームにRRフィールドを追加
- PDF出力にRRカラムを追加
- 基準値として20回/分を設定
- 安全範囲として5-60回/分を設定

### N・Sさん専用仕様システム

#### 患者プロファイル管理 (`src/config/patientProfiles.ts`)
個別利用者の特殊な医療ニーズに対応するため、患者専用プロファイルシステムを実装：

```typescript
export interface PatientCaseSpec {
  patientId: string;
  patientName: string;
  vitalDefaults?: Partial<VitalSigns>;
  vitalLimits?: Partial<Record<keyof VitalSigns, { min: number; max: number }>>;
  specialNotes?: string[];
}

export const PATIENT_PROFILES: PatientCaseSpec[] = [
  {
    patientId: "ns-001",
    patientName: "N・S",
    vitalDefaults: {
      tempC: 36.0,
      hr: 75,
      spo2: 92,
      bpSys: 110,
      bpDia: 65,
      rr: 18
    },
    specialNotes: [
      "低体温傾向のため体温管理に注意",
      "SpO2低下時は即座に医療職に報告"
    ]
  }
];
```

### UI/UX改善

#### 1. バイタルタイル化
- 従来のフォーム直接入力からタイル→モーダル形式に変更
- 視覚的にわかりやすいアイコン表示
- ワンタッチで基準値入力可能

#### 2. レイアウト最適化
タイル配置順序を医療現場の実践に合わせて調整：
1. バイタル（最優先）
2. 発作
3. その他のケア記録

#### 3. 認知負荷軽減機能
- 「いま」ボタンで現在時刻を自動入力
- 基準値ボタンで標準値を一括設定
- バリデーション強化で入力ミス防止

### 技術仕様

#### ファイル構成
```
src/
  config/
    vitalsDefaults.ts      # バイタル基準値・制限値
    patientProfiles.ts     # 患者専用プロファイル
  components/
    tiles/
      VitalsTile.tsx       # バイタル入力タイル
    DailyLogPdfDoc.tsx     # PDF出力（RR対応）
  pages/
    StructuredDailyLogPage.tsx  # メイン記録画面
```

#### PDF出力対応
- RRカラムを追加（12%幅）
- テーブルレイアウトを調整
- A4用紙に最適化された印刷レイアウト

### 今後の拡張予定

#### 1. AIによる異常値検知
- 基準値からの乖離度を自動計算
- 緊急度に応じたアラート表示
- トレンド分析による予兆検知

#### 2. 患者プロファイル拡張
- より多くの利用者に対応
- 時系列での基準値変更履歴
- 医師指示による個別設定

#### 3. 家族向け情報共有
- 基準値と実測値の比較表示
- 視覚的なグラフ表示
- わかりやすい説明文自動生成

### 開発原則

本システムは重心ケアアプリの基本理念「AIが左脳（データ・分析）を担当し、人間が右脳（思いやりのあるケア）に集中できる」に基づいて開発されています。

- **効率性**: 基準値の自動設定で入力時間短縮
- **安全性**: バリデーションによるミス防止
- **個別化**: 患者専用設定による質の高いケア
- **可視化**: 直感的なUI/UXでストレス軽減

### 法的準拠

本システムは障害者総合支援法に基づく適切な記録管理を支援し、利用者の尊厳と生活の質向上を第一に考慮して設計されています。

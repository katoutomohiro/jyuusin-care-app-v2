# 重心ケアアプリ - AI エージェント開発ガイド

## 1. プロジェクト理解

### 基本概念
- **重心 (Jyushin)**: 重症心身障害児者の略称
- **生活介護**: 日中活動支援サービス（成人対象）
- **重心型放課後等デイサービス**: 学校終了後の支援（児童対象）
- **多機能型**: 複数サービスを同一事業所で提供

### ユーザー構成
- **24名の利用者**: 生活介護14名 + 放課後等デイサービス10名
- **各利用者の特徴**: 重度の身体・知的障害、医療的ケア需要

## 2. 技術スタック理解

### コア技術
```typescript
// React 18 + TypeScript + Vite
// Port: 3003 (固定)
// HMR: 無効 (パフォーマンス最適化)
// エラー抑制: 集中力向上のため意図的
```

### 主要ディレクトリ
```
src/
├── pages/StructuredDailyLogPage.tsx    # 中核ページ (505行)
├── contexts/DataContext.tsx           # 24名の利用者データ (569行)
├── types.ts                          # 型定義 (904行)
└── components/forms/                 # 専門フォーム群

services/                             # 40+サービス (.js/.ts混在)
├── AIPredictionService.ts            # AI予測機能
├── MedicationManagementService.ts    # 薬物管理
└── RehabilitationManagementService.ts # リハビリ管理
```

## 3. 開発原則

### PROJECT_SOUL.md の理念
> "AIがデータ分析（左脳）を担当し、人間が思いやりのあるケア（右脳）に集中する"

### 必須考慮事項
1. **認知負荷の軽減**: 介護職員の負担を最小化
2. **直感的UI**: 複雑な操作を避ける
3. **エラー抑制**: 集中力を妨げる要素を除去
4. **オフライン対応**: 安定したデータ保存

## 4. 実装パターン

### ケアイベント処理
```typescript
// 15種類のケアイベント
const CARE_EVENTS = [
  'seizure', 'expression', 'hydration', 'positioning',
  'activity', 'excretion', 'skin_oral_care', 'illness',
  'sleep', 'cough_choke', 'tube_feeding', 'medication',
  'vitals', 'behavioral', 'communication'
];

// 標準的な保存パターン
const handleSaveEvent = async (eventData: any) => {
  const newEvent = {
    id: Date.now().toString(),
    user_id: user.id,
    event_type: activeEventType,
    created_at: new Date().toISOString(),
    ...eventData
  };
  
  // localStorage への保存
  const storageKey = `dailyLogs_${user.id}_${today}`;
  const existingData = JSON.parse(localStorage.getItem(storageKey) || '[]');
  existingData.push(newEvent);
  localStorage.setItem(storageKey, JSON.stringify(existingData));
  
  // 今日のカウント更新
  updateTodayEventCounts(activeEventType);
};
```

### データコンテキスト活用
```typescript
// 必須パターン
const { users, getUserById } = useData();
const user = getUserById(userId);

// 医療的ケア確認
const hasSeizureHistory = user.medicalCare.includes(MedicalCare.SEIZURE_MEDICATION);
const requiresSuctioning = user.medicalCare.includes(MedicalCare.SUCTION);
```

## 5. 専門領域の特殊性

### 医療的ケア種別
```typescript
enum MedicalCare {
  TUBE_FEEDING = 'tube_feeding',      // 経管栄養
  SUCTION = 'suction',                // 吸引
  OXYGEN = 'oxygen',                  // 酸素吸入
  VENTILATOR = 'ventilator',          // 人工呼吸器
  TRACHEOSTOMY = 'tracheostomy',      // 気管切開
  SEIZURE_MEDICATION = 'seizure_medication' // 抗てんかん薬
}
```

### 発作管理の重要性
```typescript
interface SeizureEvent {
  type: SeizureType;
  duration: number;
  intensity: 'mild' | 'moderate' | 'severe';
  triggers?: string[];
  medication_given?: boolean;
  recovery_time?: number;
  notes: string;
}
```

## 6. AI機能の活用

### 予測分析
```typescript
// 発作リスク予測
const seizureRisk = await AIPredictionService.predictSeizureRisk(user, recentLogs);

// バイタルサイン異常検知
const vitalAlert = await AIPredictionService.detectVitalAnomaly(user, currentVitals);
```

### レポート生成
```typescript
// 医師向け専門レポート
const medicalReport = await AdvancedReportingService.generateMedicalReport(
  userId, 'monthly', period, data
);

// 家族向けレポート
const familyReport = await AdvancedReportingService.generateFamilyReport(
  userId, 'weekly', period, data
);
```

## 7. 品質保証

### テスト戦略
```bash
# サイレントモード実行
npm run test:silent

# 基本レポーターのみ
vitest --reporter=basic
```

### エラーハンドリング
```typescript
// 医療データ保存の安全性
const saveMedicalData = async (data: any) => {
  try {
    await StorageService.save(data);
    addNotification({ type: 'success', message: 'データが保存されました' });
  } catch (error) {
    console.error('医療データ保存エラー:', error);
    addNotification({
      type: 'error',
      message: 'データ保存に失敗しました。再試行してください。',
      actions: [{ label: '再試行', handler: () => saveMedicalData(data) }]
    });
  }
};
```

## 8. 日本語対応

### 用語統一
- **利用者**: `user` (患者ではない)
- **職員**: `staff`
- **医療的ケア**: `medical_care`
- **発作**: `seizure`
- **体位変換**: `positioning`

### UI表記
```typescript
// 日本語主体、英語併記
const SEIZURE_TYPES = {
  'tonic_clonic': '強直間代発作',
  'absence': '欠神発作',
  'partial': '部分発作'
};
```

## 9. パフォーマンス最適化

### 大量データ処理
```typescript
// 仮想化による効率化
const VirtualizedLogList = ({ logs }: { logs: StructuredDailyLog[] }) => {
  const [visibleLogs, setVisibleLogs] = useState<StructuredDailyLog[]>([]);
  
  useEffect(() => {
    // 最新100件のみ表示
    setVisibleLogs(logs.slice(-100));
  }, [logs]);
  
  return <div className="log-list">{/* ... */}</div>;
};
```

### ローカルストレージ管理
```typescript
// 圧縮保存
const saveCompressedData = (key: string, data: any) => {
  const compressed = LZString.compress(JSON.stringify(data));
  localStorage.setItem(key, compressed);
};
```

## 10. 開発環境

### 必須スクリプト
```bash
npm run dev              # 開発サーバー (port 3003)
npm run dev:silent       # サイレントモード
npm run dev:ultra-silent # 完全サイレント
npm run build           # 本番ビルド
```

### VS Code 設定
```json
{
  "telemetry.telemetryLevel": "off",
  "extensions.autoUpdate": false,
  "workbench.enableExperiments": false,
  "editor.minimap.enabled": false,
  "breadcrumbs.enabled": false
}
```

## 11. 禁止事項

### やってはいけないこと
1. **console.log の乱用**: エラー抑制システムを破壊
2. **HMR の有効化**: パフォーマンス劣化
3. **不必要な外部通信**: セキュリティリスク
4. **複雑なUI**: 認知負荷増大
5. **医療用語の誤用**: 専門性の欠如

### 必須チェック
1. 24名の利用者データ構造を理解する
2. 15種類のケアイベントを把握する
3. 医療的ケアの重要性を認識する
4. PROJECT_SOUL.md の理念に沿う
5. エラー抑制の意図を理解する

## 12. 最終確認

コード生成時は以下を確認：
- [ ] 利用者の尊厳を保つ実装
- [ ] 介護職員の負担軽減
- [ ] 医療安全性の確保
- [ ] 家族の安心感向上
- [ ] 法令遵守（障害者総合支援法等）

この重心ケアアプリは、社会的に重要な役割を担う専門システムです。AIエージェントには、技術的な正確性だけでなく、人間の尊厳と生活の質の向上を最優先に考えた開発を求めます。

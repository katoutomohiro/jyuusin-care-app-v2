# AI コーディングパターン - 重心ケアアプリ

## 専門領域コーディング指針

### 1. 重心ケア専門用語とパターン

#### 医療ケア用語（MedicalCare enum）
```typescript
// 医療的ケアの種類
enum MedicalCare {
  TUBE_FEEDING = 'tube_feeding',    // 経管栄養
  SUCTION = 'suction',              // 吸引
  OXYGEN = 'oxygen',                // 酸素吸入
  VENTILATOR = 'ventilator',        // 人工呼吸器
  TRACHEOSTOMY = 'tracheostomy',    // 気管切開
  SEIZURE_MEDICATION = 'seizure_medication' // 抗てんかん薬
}
```

#### 利用者プロファイル生成パターン
```typescript
// 重心利用者の基本構造
interface JyushinUser {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  serviceType: ServiceType[];
  medicalCare: MedicalCare[];
  disabilityLevel: string;
  communicationLevel: CommunicationLevel;
  seizureHistory: SeizureHistory;
  mobilityLevel: MobilityLevel;
}
```

### 2. ケアイベント処理パターン

#### 標準的なイベント保存パターン
```typescript
const handleSaveEvent = async (eventData: any) => {
  const newEvent = {
    id: Date.now().toString(),
    user_id: user.id,
    event_type: activeEventType,
    created_at: new Date().toISOString(),
    ...eventData
  };
  
  // localStorage保存
  const storageKey = `dailyLogs_${user.id}_${today}`;
  const existingData = JSON.parse(localStorage.getItem(storageKey) || '[]');
  existingData.push(newEvent);
  localStorage.setItem(storageKey, JSON.stringify(existingData));
  
  // 今日のイベントカウント更新
  updateTodayEventCounts(activeEventType);
};
```

#### 発作イベント特化パターン
```typescript
interface SeizureEvent {
  type: SeizureType;           // 発作種類
  duration: number;            // 持続時間
  intensity: 'mild' | 'moderate' | 'severe';
  triggers?: string[];         // 誘発要因
  medication_given?: boolean;  // 薬剤投与
  recovery_time?: number;      // 回復時間
  notes: string;
}
```

### 3. AI予測・分析パターン

#### 発作予測アルゴリズム
```typescript
class SeizurePredictionService {
  static predictSeizureRisk(user: JyushinUser, logs: StructuredDailyLog[]): SeizureRiskAssessment {
    const recentLogs = logs.filter(log => 
      new Date(log.created_at) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );
    
    // パターン分析
    const seizurePattern = this.analyzeSeizurePattern(recentLogs);
    const triggers = this.identifyTriggers(recentLogs);
    
    return {
      riskLevel: this.calculateRiskLevel(seizurePattern, triggers),
      probability: this.calculateProbability(seizurePattern, triggers),
      preventiveMeasures: this.generatePreventiveMeasures(seizurePattern, triggers)
    };
  }
}
```

#### バイタルサイン異常検知
```typescript
class VitalSignsAnomalyDetection {
  static detectAnomaly(vitals: VitalSigns, userProfile: JyushinUser): AnomalyAlert {
    const thresholds = this.getUserSpecificThresholds(userProfile);
    
    if (vitals.temperature > thresholds.temperature.high) {
      return {
        type: 'temperature',
        severity: 'high',
        message: '体温異常：即座の対応が必要です',
        recommendations: ['解熱剤の投与検討', '水分補給', '医師への報告']
      };
    }
    
    // SpO2, 脈拍等の他のチェック...
  }
}
```

### 4. コンテキスト管理パターン

#### データコンテキストアクセス
```typescript
// 必須：データコンテキストの使用
const { users, getUserById, updateUserData } = useData();

// 利用者情報の取得
const user = getUserById(userId);
if (!user) {
  return <div>利用者が見つかりません</div>;
}

// 医療的ケアの確認
const hasSeizureHistory = user.medicalCare.includes(MedicalCare.SEIZURE_MEDICATION);
const needsSuctioning = user.medicalCare.includes(MedicalCare.SUCTION);
```

#### 通知システム統合
```typescript
const { addNotification } = useNotification();

// 重要なイベント時の通知
const handleSeizureEvent = (seizureData: SeizureEvent) => {
  if (seizureData.intensity === 'severe') {
    addNotification({
      type: 'emergency',
      title: '重度発作発生',
      message: `${user.name}さんに重度発作が発生しました`,
      urgency: 'critical',
      requiresAcknowledgment: true
    });
  }
};
```

### 5. フォーム生成パターン

#### 専門フォームコンポーネント
```typescript
// 発作記録フォーム
<SeizureForm 
  onSave={handleSaveEvent}
  userProfile={user}
  previousSeizures={getRecentSeizures(user.id)}
/>

// 水分摂取フォーム
<HydrationForm 
  onSave={handleSaveEvent}
  dailyTarget={user.hydrationTarget}
  currentIntake={todayHydrationTotal}
/>

// 体位変換フォーム
<PositioningForm 
  onSave={handleSaveEvent}
  mobilityLevel={user.mobilityLevel}
  lastPositioning={getLastPositioning(user.id)}
/>
```

### 6. レポート生成パターン

#### 医師向けレポート
```typescript
class MedicalReportGenerator {
  static generateMonthlyReport(user: JyushinUser, logs: StructuredDailyLog[]): MedicalReport {
    return {
      patientInfo: this.formatPatientInfo(user),
      seizureAnalysis: this.analyzeSeizureData(logs),
      vitalTrends: this.analyzeVitalTrends(logs),
      careEffectiveness: this.assessCareEffectiveness(logs),
      recommendations: this.generateRecommendations(user, logs)
    };
  }
}
```

#### 家族向けレポート
```typescript
class FamilyReportGenerator {
  static generateWeeklyReport(user: JyushinUser, logs: StructuredDailyLog[]): FamilyReport {
    return {
      summary: this.generateFamilyFriendlySummary(logs),
      achievements: this.highlightPositiveEvents(logs),
      concerns: this.identifyGentleConcerns(logs),
      nextWeekFocus: this.suggestFocusAreas(logs)
    };
  }
}
```

### 7. エラーハンドリングパターン

#### 医療データ保存エラー
```typescript
const saveMedicalData = async (data: any) => {
  try {
    await StorageService.save(data);
    addNotification({
      type: 'success',
      message: 'データが正常に保存されました'
    });
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

### 8. コード品質指針

#### 命名規則
- 医療用語は英語併記：`seizure_発作`
- 利用者は常に`user`、職員は`staff`
- イベントタイプは小文字アンダースコア：`seizure_event`

#### コメント規則
```typescript
/**
 * 発作リスク評価
 * @param user 重心利用者情報
 * @param logs 過去7日間のケアログ
 * @returns 発作リスクレベルと推奨対応
 */
const assessSeizureRisk = (user: JyushinUser, logs: StructuredDailyLog[]) => {
  // 発作パターンの分析
  const pattern = analyzeSeizurePattern(logs);
  
  // 誘発要因の特定
  const triggers = identifyTriggers(logs);
  
  return calculateRisk(pattern, triggers);
};
```

#### TypeScript活用
```typescript
// 型安全性を最大限活用
type SeizureIntensity = 'mild' | 'moderate' | 'severe';
type ServiceType = 'life_care' | 'day_service';

// 条件付き型での安全性確保
type UserWithSeizureHistory<T> = T extends { seizureHistory: SeizureHistory } 
  ? T & { seizureRisk: SeizureRiskLevel }
  : T;
```

### 9. パフォーマンス最適化

#### 大量データ処理
```typescript
// 仮想化による大量ログ表示
const VirtualizedLogList = ({ logs }: { logs: StructuredDailyLog[] }) => {
  const [visibleLogs, setVisibleLogs] = useState<StructuredDailyLog[]>([]);
  
  useEffect(() => {
    // 最新100件のみ表示
    setVisibleLogs(logs.slice(-100));
  }, [logs]);
  
  return (
    <div className="log-list">
      {visibleLogs.map(log => (
        <LogItem key={log.id} log={log} />
      ))}
    </div>
  );
};
```

#### ローカルストレージ最適化
```typescript
// 圧縮保存による容量削減
const saveCompressedData = (key: string, data: any) => {
  const compressed = LZString.compress(JSON.stringify(data));
  localStorage.setItem(key, compressed);
};

const loadCompressedData = (key: string) => {
  const compressed = localStorage.getItem(key);
  return compressed ? JSON.parse(LZString.decompress(compressed)) : null;
};
```

### 10. アクセシビリティ配慮

#### 介護職員向けUI
```typescript
// 大きなボタンとクリアな表示
const EmergencyButton = ({ onClick }: { onClick: () => void }) => (
  <button 
    className="bg-red-500 text-white text-2xl p-6 rounded-lg min-h-[80px] min-w-[200px]"
    onClick={onClick}
    aria-label="緊急時対応ボタン"
  >
    🚨 緊急対応
  </button>
);

// 音声読み上げ対応
const AnnouncementText = ({ text }: { text: string }) => (
  <div 
    role="alert" 
    aria-live="polite"
    className="sr-only"
  >
    {text}
  </div>
);
```

これらのパターンを活用することで、重心ケア領域の専門性を活かした高品質なコードを生成できます。

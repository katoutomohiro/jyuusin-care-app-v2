import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  birthDate: string;
  age: number;
  gender: string;
  disabilityType: string;
  careLevel: string;
  guardianName: string;
  guardianPhone: string;
  basicDiseases: string;
  medicalCare: string;
  handbook: string;
  assistanceLevel: string;
  createdAt: string;
}

interface DailyLog {
  id: string;
  userId: string;
  date: string;
  timeSlot: string;
  activity: string;
  mood: string;
  medicalCare: string;
  notes: string;
  createdBy: string;
  createdAt: string;
}

const SimpleApp: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [notifications, setNotifications] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  
  // ユーザーフォーム用のstate
  const [userFormData, setUserFormData] = useState({
    name: '',
    birthDate: '',
    age: 0,
    gender: '',
    disabilityType: '',
    careLevel: '',
    guardianName: '',
    guardianPhone: '',
    basicDiseases: '',
    medicalCare: '',
    handbook: '',
    assistanceLevel: ''
  });

  // ログフォーム用のstate
  const [logFormData, setLogFormData] = useState({
    userId: '',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '',
    activity: '',
    mood: '',
    medicalCare: '',
    notes: '',
    createdBy: '職員'
  });

  // 現在時刻に基づく時間帯を自動取得
  const getCurrentTimeSlot = () => {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour >= 6 && hour < 12) {
      return '朝 (6:00-12:00)';
    } else if (hour >= 12 && hour < 18) {
      return '昼 (12:00-18:00)';
    } else if (hour >= 18 && hour < 24) {
      return '夜 (18:00-24:00)';
    } else {
      return '深夜 (0:00-6:00)';
    }
  };

  // 重症心身障害児者特化の定型文データ
  const medicalCareTemplates = [
    '吸引（痰の除去）',
    '胃ろう注入（300ml、体温程度）',
    '経鼻経管栄養',
    '気管切開部の管理',
    '人工呼吸器装着中',
    '酸素吸入実施',
    '体位変換（2時間毎）',
    '褥瘡予防ケア',
    '導尿実施',
    '浣腸実施',
    '服薬確認（抗てんかん薬）',
    'バイタルサイン測定',
    'カフアシスト使用',
    'エアウェイ装着',
    'IVH管理',
    '腸瘻部ケア',
    'シャント観察',
    'ITB療法実施中',
    '筋緊張緩和ケア',
    'ポジショニング調整',
    '特に変化なし'
  ];

  const activityTemplates = [
    '食事介助（ペースト食、とろみ付き）',
    '水分補給介助（とろみ茶）',
    '排泄介助・おむつ交換',
    '清拭・部分浴実施',
    '機能訓練（関節可動域訓練）',
    '呼吸理学療法',
    '感覚刺激活動（音楽・光）',
    'コミュニケーション支援',
    'ポジショニング・体位変換',
    '車椅子での散歩',
    '創作活動（手の感覚刺激）',
    'リラクゼーション活動',
    '午睡・休息',
    '医療的ケア実施',
    '健康観察',
    '発作時対応',
    '緊急時対応',
    '家族面談',
    '他職種連携',
    '送迎対応'
  ];

  const notesTemplates = [
    '本日も元気に過ごされました。',
    '穏やかな表情で活動に参加されました。',
    '笑顔が多く見られました。',
    '体調良好、変化ありません。',
    'バイタルサイン安定しています。',
    '食事摂取良好です。',
    '水分摂取促進が必要です。',
    '痰の量がやや多めでした。',
    '発作の兆候は見られませんでした。',
    '筋緊張がやや強めでした。',
    '呼吸状態安定しています。',
    '体温調節に注意が必要です。',
    '皮膚状態良好です。',
    '褥瘡リスクに注意が必要です。',
    '家族との連絡事項があります。',
    '次回受診予定の確認をお願いします。',
    '薬剤調整について医師と相談予定です。',
    '療育内容の見直しが必要です。',
    '緊急時連絡先の確認をお願いします。',
    '継続観察が必要な状態です。'
  ];

  const moodOptions = [
    { value: '良好', label: '😊 良好', color: '#10b981' },
    { value: '穏やか', label: '😌 穏やか', color: '#3b82f6' },
    { value: '普通', label: '😐 普通', color: '#6b7280' },
    { value: '少し不安定', label: '😟 少し不安定', color: '#f59e0b' },
    { value: '不調', label: '😰 不調', color: '#ef4444' },
    { value: '要観察', label: '🚨 要観察', color: '#dc2626' }
  ];

  // 事前登録データの初期化
  useEffect(() => {
    if (users.length === 0) {
      const preRegisteredUsers: Omit<User, 'id' | 'createdAt'>[] = [
        // 生活介護利用者（14名）
        {
          name: "A・T",
          birthDate: "1989-01-01", // 36歳として計算
          age: 36,
          gender: "男性",
          disabilityType: "重症心身障害者",
          careLevel: "障がい程度区分6",
          guardianName: "",
          guardianPhone: "",
          basicDiseases: "脳性麻痺、てんかん、遠視性弱視、側湾症、両上下肢機能障害",
          medicalCare: "なし",
          handbook: "療育手帳A、身体障害者手帳1級",
          assistanceLevel: "全介助"
        },
        {
          name: "I・K",
          birthDate: "1978-01-01", // 47歳として計算
          age: 47,
          gender: "女性",
          disabilityType: "重症心身障害者",
          careLevel: "障がい程度区分6",
          guardianName: "",
          guardianPhone: "",
          basicDiseases: "脳性麻痺、側湾症、体幹四肢機能障害",
          medicalCare: "なし",
          handbook: "療育手帳A、身体障害者手帳1級",
          assistanceLevel: "全介助"
        },
        {
          name: "O・S",
          birthDate: "1985-01-01", // 40歳として計算
          age: 40,
          gender: "女性",
          disabilityType: "重症心身障害者",
          careLevel: "障がい程度区分6",
          guardianName: "",
          guardianPhone: "",
          basicDiseases: "脳性麻痺、体幹四肢機能障害",
          medicalCare: "なし",
          handbook: "療育手帳A、身体障害者手帳1級",
          assistanceLevel: "全介助"
        },
        {
          name: "S・M",
          birthDate: "1982-01-01", // 43歳として計算
          age: 43,
          gender: "男性",
          disabilityType: "重症心身障害者",
          careLevel: "障がい程度区分6",
          guardianName: "",
          guardianPhone: "",
          basicDiseases: "脳性麻痺、脳炎後遺症、てんかん（現在も服用中）、精神遅滞、側湾症、両上下肢機能障害",
          medicalCare: "吸引、腸瘻（腸瘻トラブル多く腸瘻バルーンの抜去など頻回）",
          handbook: "療育手帳A、身体障害者手帳1級",
          assistanceLevel: "全介助"
        },
        {
          name: "N・M",
          birthDate: "1993-01-01", // 32歳として計算
          age: 32,
          gender: "男性",
          disabilityType: "重症心身障害者",
          careLevel: "障がい程度区分6",
          guardianName: "",
          guardianPhone: "",
          basicDiseases: "痙性四肢麻痺、重度知的障害、てんかん（強直間代発作がほぼ毎日1～5回）",
          medicalCare: "胃ろう注入、エアウェイ装着、カフアシスト使用、グリセリン浣腸（火・木）、吸引、吸入",
          handbook: "療育手帳A、身体障害者手帳1級",
          assistanceLevel: "全介助"
        },
        {
          name: "W・M",
          birthDate: "1993-01-01", // 32歳として計算
          age: 32,
          gender: "女性",
          disabilityType: "重症心身障害者",
          careLevel: "障がい程度区分6",
          guardianName: "",
          guardianPhone: "",
          basicDiseases: "脳原生上肢機能障害、脳原生上肢移動障害、上下肢機能障害",
          medicalCare: "なし",
          handbook: "療育手帳A、身体障害者手帳1級",
          assistanceLevel: "全介助"
        },
        {
          name: "S・Y",
          birthDate: "1984-01-01", // 41歳として計算
          age: 41,
          gender: "女性",
          disabilityType: "重症心身障害者",
          careLevel: "障がい程度区分6",
          guardianName: "",
          guardianPhone: "",
          basicDiseases: "脳原生上肢機能障害、脳原生上肢移動障害",
          medicalCare: "鼻腔栄養注入",
          handbook: "療育手帳A、身体障害者手帳1級",
          assistanceLevel: "全介助"
        },
        {
          name: "Y・K",
          birthDate: "2003-01-01", // 22歳として計算
          age: 22,
          gender: "男性",
          disabilityType: "重症心身障害者",
          careLevel: "障がい程度区分6",
          guardianName: "",
          guardianPhone: "",
          basicDiseases: "二分脊椎症、水頭症（シャント内臓）、急性脳症後遺症、膀胱機能障害者、両上下肢機能障害、体幹機能障害、自閉症スペクトラム障害",
          medicalCare: "鼻腔チューブ使用（内服時のみ）、導尿",
          handbook: "療育手帳A、身体障害者手帳1級",
          assistanceLevel: "全介助"
        },
        {
          name: "I・K (2)",
          birthDate: "1985-01-01", // 40歳として計算
          age: 40,
          gender: "男性",
          disabilityType: "重症心身障害者",
          careLevel: "障がい程度区分6",
          guardianName: "",
          guardianPhone: "",
          basicDiseases: "脳性麻痺、体幹四肢機能障害",
          medicalCare: "なし",
          handbook: "療育手帳A、身体障害者手帳1級",
          assistanceLevel: "全介助"
        },
        {
          name: "O・M",
          birthDate: "2002-01-01", // 23歳として計算
          age: 23,
          gender: "男性",
          disabilityType: "重症心身障害者",
          careLevel: "障がい程度区分6",
          guardianName: "",
          guardianPhone: "",
          basicDiseases: "脳性麻痺、視覚障害（全盲）、難聴、網膜症、脳原生移動障害",
          medicalCare: "なし",
          handbook: "療育手帳A、身体障害者手帳1級",
          assistanceLevel: "全介助"
        },
        {
          name: "U・S",
          birthDate: "2006-01-01", // 19歳として計算
          age: 19,
          gender: "男性",
          disabilityType: "重症心身障害者",
          careLevel: "障がい程度区分6",
          guardianName: "",
          guardianPhone: "",
          basicDiseases: "クリッペファイル症候群、高度難聴、気管狭窄症、両下肢機能障害",
          medicalCare: "気管切開、気管内吸引、吸入、浣腸",
          handbook: "身体障害者手帳1級",
          assistanceLevel: "全介助"
        },
        {
          name: "I・T",
          birthDate: "2001-01-01", // 24歳として計算
          age: 24,
          gender: "男性",
          disabilityType: "重症心身障害者",
          careLevel: "障がい程度区分6",
          guardianName: "",
          guardianPhone: "",
          basicDiseases: "脳性麻痺",
          medicalCare: "胃ろう注入",
          handbook: "療育手帳A、身体障害者手帳1級",
          assistanceLevel: "全介助"
        },
        {
          name: "M・S",
          birthDate: "2007-01-01", // 18歳として計算
          age: 18,
          gender: "男性",
          disabilityType: "重症心身障害者",
          careLevel: "障がい程度区分6",
          guardianName: "",
          guardianPhone: "",
          basicDiseases: "水頭症、脳原生上肢機能障害、脳原生上肢移動障害、側湾症、発作（5分以上けいれん発作が持続は救急搬送）",
          medicalCare: "なし",
          handbook: "療育手帳A、身体障害者手帳1級",
          assistanceLevel: "全介助"
        },
        {
          name: "M・O",
          birthDate: "2007-01-01", // 18歳として計算
          age: 18,
          gender: "女性",
          disabilityType: "重症心身障害者",
          careLevel: "障がい程度区分6",
          guardianName: "",
          guardianPhone: "",
          basicDiseases: "脳原生上肢機能障害、脳原生上肢移動障害、発作（四肢、顔面のミオクローヌスあり）",
          medicalCare: "胃ろう注入、吸引、IVH埋め込み",
          handbook: "療育手帳A、身体障害者手帳1級",
          assistanceLevel: "全介助"
        },
        // 重心型放課後等デイサービス利用者（10名）
        {
          name: "M・I",
          birthDate: "2008-01-01", // 17歳として計算
          age: 17,
          gender: "男性",
          disabilityType: "重症心身障害児",
          careLevel: "特別支援学校在学中",
          guardianName: "",
          guardianPhone: "",
          basicDiseases: "慢性肺疾患、先天性性疾患、染色体異常、脳の形成不全、抗てんかん（ミオクロニー発作あり）",
          medicalCare: "鼻腔注入",
          handbook: "療育手帳A、身体障害者手帳1級",
          assistanceLevel: "全介助"
        },
        {
          name: "S・K (児)",
          birthDate: "2010-01-01", // 15歳として計算
          age: 15,
          gender: "男性",
          disabilityType: "重症心身障害児",
          careLevel: "特別支援学校在学中",
          guardianName: "",
          guardianPhone: "",
          basicDiseases: "脳腫瘍適切後遺症、脳原生上肢機能障害、脳原始移動機能障害、アレルギー性鼻炎、食物アレルギー",
          medicalCare: "シャント内臓",
          handbook: "療育手帳A、身体障害者手帳1級",
          assistanceLevel: "全介助"
        },
        {
          name: "M・M",
          birthDate: "2010-01-01", // 15歳として計算
          age: 15,
          gender: "女性",
          disabilityType: "重症心身障害児",
          careLevel: "特別支援学校在学中",
          guardianName: "",
          guardianPhone: "",
          basicDiseases: "知的障がい、発作あり",
          medicalCare: "なし",
          handbook: "療育手帳1級",
          assistanceLevel: "一部介助あり"
        },
        {
          name: "K・S",
          birthDate: "2018-01-01", // 7歳として計算
          age: 7,
          gender: "女性",
          disabilityType: "重症心身障害児",
          careLevel: "特別支援学校在学中",
          guardianName: "",
          guardianPhone: "",
          basicDiseases: "発達遅延、肢体不自由、けいれん発作（5分以上続くようなら救急搬送）",
          medicalCare: "なし",
          handbook: "療育手帳A、身体障害者手帳1級",
          assistanceLevel: "全介助"
        },
        {
          name: "Y・S",
          birthDate: "2019-01-01", // 6歳として計算
          age: 6,
          gender: "女性",
          disabilityType: "重症心身障害児",
          careLevel: "特別支援学校在学中",
          guardianName: "",
          guardianPhone: "",
          basicDiseases: "症候性てんかん、脳原生上肢機能障害、脳原始移動機能障害",
          medicalCare: "筋緊張（ITB療法中）",
          handbook: "療育手帳A、身体障害者手帳1級",
          assistanceLevel: "全介助"
        },
        {
          name: "F・M",
          birthDate: "2012-01-01", // 13歳として計算
          age: 13,
          gender: "女性",
          disabilityType: "重症心身障害児",
          careLevel: "特別支援学校在学中",
          guardianName: "",
          guardianPhone: "",
          basicDiseases: "症候性てんかん、股関節亜脱臼、脳原生上肢機能障害、脳原始移動機能障害、側湾症",
          medicalCare: "なし",
          handbook: "療育手帳A、身体障害者手帳1級",
          assistanceLevel: "全介助"
        },
        {
          name: "N・T",
          birthDate: "2016-01-01", // 9歳として計算
          age: 9,
          gender: "男性",
          disabilityType: "重症心身障害児",
          careLevel: "特別支援学校在学中",
          guardianName: "",
          guardianPhone: "",
          basicDiseases: "発達遅滞、神経セロイドリポフスチン8型、両上肢・体感機能障害、てんかん（ミオクローヌスなど重積発作リスクあり）",
          medicalCare: "胃ろう注入",
          handbook: "療育手帳A、身体障害者手帳1級",
          assistanceLevel: "全介助"
        },
        {
          name: "I・K (児)",
          birthDate: "2016-01-01", // 9歳として計算
          age: 9,
          gender: "不明",
          disabilityType: "重症心身障害児",
          careLevel: "特別支援学校在学中",
          guardianName: "",
          guardianPhone: "",
          basicDiseases: "脳性麻痺、側弯あり、吸引頻回（呼吸筋が脆弱のため）、籠り熱の際は嘔吐リスクあり",
          medicalCare: "胃ろう注入",
          handbook: "療育手帳A、身体障害者手帳1級",
          assistanceLevel: "全介助"
        },
        {
          name: "K・Y",
          birthDate: "2016-01-01", // 9歳として計算
          age: 9,
          gender: "女性",
          disabilityType: "重症心身障害児",
          careLevel: "特別支援学校在学中",
          guardianName: "",
          guardianPhone: "",
          basicDiseases: "脳性麻痺、脳原生上肢機能障害、脳原始移動機能障害、側湾症",
          medicalCare: "なし",
          handbook: "療育手帳A、身体障害者手帳1級",
          assistanceLevel: "全介助"
        },
        {
          name: "S・K (児2)",
          birthDate: "2011-01-01", // 14歳として計算
          age: 14,
          gender: "女性",
          disabilityType: "重症心身障害児",
          careLevel: "特別支援学校在学中",
          guardianName: "",
          guardianPhone: "",
          basicDiseases: "滑脳症（TUBA1A遺伝子異常）、小脳底形成、上腸間膜症候群、症候性てんかん、重度精神運動発達遅滞",
          medicalCare: "経胃ろう十二指腸チューブからの経管栄養とポートからのCV栄養注入併用",
          handbook: "療育手帳A、身体障害者手帳1級",
          assistanceLevel: "全介助"
        }
      ];

      // 事前登録データを追加
      const registeredUsers = preRegisteredUsers.map((userData, index) => ({
        ...userData,
        id: `preset_${index + 1}`,
        createdAt: new Date().toISOString()
      }));

      setUsers(registeredUsers);
      showNotification(`24名の利用者情報を事前登録しました`);
    }
  }, [users.length]);

  const showNotification = (message: string) => {
    setNotifications(prev => [...prev, message]);
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 3000);
  };

  const handleFeatureClick = (feature: string) => {
    setActiveSection(feature);
    showNotification(`${feature}機能を選択しました`);
  };

  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    setShowUserForm(false);
    setUserFormData({
      name: '',
      birthDate: '',
      age: 0,
      gender: '',
      disabilityType: '',
      careLevel: '',
      guardianName: '',
      guardianPhone: '',
      basicDiseases: '',
      medicalCare: '',
      handbook: '',
      assistanceLevel: ''
    });
    showNotification(`利用者「${userData.name}」を登録しました`);
  };

  const addDailyLog = (logData: Omit<DailyLog, 'id' | 'createdAt'>) => {
    const newLog: DailyLog = {
      ...logData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setDailyLogs(prev => [...prev, newLog]);
    setShowLogForm(false);
    setLogFormData({
      userId: selectedUser,
      date: new Date().toISOString().split('T')[0],
      timeSlot: '',
      activity: '',
      mood: '',
      medicalCare: '',
      notes: '',
      createdBy: '職員'
    });
    showNotification('日次記録を保存しました');
  };

  const renderUserManagement = () => (
    <div style={{ textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: '#374151', margin: 0 }}>利用者管理</h2>
        <button
          onClick={() => setShowUserForm(true)}
          style={{
            background: '#3b82f6',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          新規登録
        </button>
      </div>
      
      {users.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
          まだ利用者が登録されていません
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {users.map(user => (
            <div key={user.id} style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '1rem',
              background: '#f9fafb'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#111827' }}>{user.name}</h3>
                  <p style={{ margin: '0.25rem 0', color: '#6b7280', fontSize: '0.9rem' }}>
                    {user.age}歳 {user.gender} | {user.disabilityType}
                  </p>
                  <p style={{ margin: '0.25rem 0', color: '#6b7280', fontSize: '0.9rem' }}>
                    {user.careLevel} | {user.assistanceLevel}
                  </p>
                  {user.medicalCare && user.medicalCare !== 'なし' && (
                    <p style={{ margin: '0.25rem 0', color: '#dc2626', fontSize: '0.9rem' }}>
                      医療ケア: {user.medicalCare}
                    </p>
                  )}
                  {user.basicDiseases && (
                    <p style={{ margin: '0.25rem 0', color: '#6b7280', fontSize: '0.8rem' }}>
                      基礎疾患: {user.basicDiseases.substring(0, 50)}...
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSelectedUser(user.id);
                    setActiveSection('日次記録');
                    setLogFormData({
                      ...logFormData,
                      userId: user.id
                    });
                    setShowLogForm(true);
                    setShowUserForm(false);
                  }}
                  style={{
                    background: '#10b981',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  記録入力
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderUserForm = () => {
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (userFormData.name && userFormData.birthDate && userFormData.disabilityType && userFormData.age && userFormData.gender) {
        addUser(userFormData);
      } else {
        showNotification('必須項目（氏名、生年月日、年齢、性別、障害種別）を入力してください');
      }
    };

    return (
      <div style={{ textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#374151', margin: 0 }}>新規利用者登録</h2>
          <button
            onClick={() => {
              setShowUserForm(false);
              setActiveSection('利用者管理');
            }}
            style={{
              background: '#6b7280',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            戻る
          </button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              利用者名 *
            </label>
            <input
              type="text"
              value={userFormData.name}
              onChange={(e) => setUserFormData({...userFormData, name: e.target.value})}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem'
              }}
              required
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              生年月日 *
            </label>
            <input
              type="date"
              value={userFormData.birthDate}
              onChange={(e) => setUserFormData({...userFormData, birthDate: e.target.value})}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem'
              }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                年齢 *
              </label>
              <input
                type="number"
                value={userFormData.age}
                onChange={(e) => setUserFormData({...userFormData, age: parseInt(e.target.value) || 0})}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
                required
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                性別 *
              </label>
              <select
                value={userFormData.gender}
                onChange={(e) => setUserFormData({...userFormData, gender: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
                required
              >
                <option value="">選択してください</option>
                <option value="男性">男性</option>
                <option value="女性">女性</option>
                <option value="不明">不明</option>
              </select>
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              障害種別 *
            </label>
            <select
              value={userFormData.disabilityType}
              onChange={(e) => setUserFormData({...userFormData, disabilityType: e.target.value})}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem'
              }}
              required
            >
              <option value="">選択してください</option>
              <option value="重症心身障害児">重症心身障害児</option>
              <option value="重症心身障害者">重症心身障害者</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              ケアレベル
            </label>
            <input
              type="text"
              value={userFormData.careLevel}
              onChange={(e) => setUserFormData({...userFormData, careLevel: e.target.value})}
              placeholder="例: 障がい程度区分6、特別支援学校在学中"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              基礎疾患
            </label>
            <textarea
              value={userFormData.basicDiseases}
              onChange={(e) => setUserFormData({...userFormData, basicDiseases: e.target.value})}
              placeholder="基礎疾患を入力してください"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem',
                minHeight: '60px',
                resize: 'vertical'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              医療ケア
            </label>
            <textarea
              value={userFormData.medicalCare}
              onChange={(e) => setUserFormData({...userFormData, medicalCare: e.target.value})}
              placeholder="例: 胃ろう注入、吸引、なし"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem',
                minHeight: '60px',
                resize: 'vertical'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              手帳等
            </label>
            <input
              type="text"
              value={userFormData.handbook}
              onChange={(e) => setUserFormData({...userFormData, handbook: e.target.value})}
              placeholder="例: 療育手帳A、身体障害者手帳1級"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              介助状況
            </label>
            <select
              value={userFormData.assistanceLevel}
              onChange={(e) => setUserFormData({...userFormData, assistanceLevel: e.target.value})}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem'
              }}
            >
              <option value="">選択してください</option>
              <option value="全介助">全介助</option>
              <option value="一部介助あり">一部介助あり</option>
              <option value="見守り">見守り</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              保護者名
            </label>
            <input
              type="text"
              value={userFormData.guardianName}
              onChange={(e) => setUserFormData({...userFormData, guardianName: e.target.value})}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              保護者電話番号
            </label>
            <input
              type="tel"
              value={userFormData.guardianPhone}
              onChange={(e) => setUserFormData({...userFormData, guardianPhone: e.target.value})}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem'
              }}
            />
          </div>
          
          <button
            type="submit"
            style={{
              background: '#3b82f6',
              color: 'white',
              padding: '0.75rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              marginTop: '1rem'
            }}
          >
            登録する
          </button>
        </form>
      </div>
    );
  };

  const renderDailyLogs = () => {
    const filteredLogs = selectedUser 
      ? dailyLogs.filter(log => log.userId === selectedUser)
      : dailyLogs;
    
    const selectedUserData = users.find(user => user.id === selectedUser);

    return (
      <div style={{ textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#374151', margin: 0 }}>
            ケース記録 <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>(きらめきの記録)</span>
            {selectedUserData && ` - ${selectedUserData.name}`}
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {users.length > 0 && (
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.9rem'
                }}
              >
                <option value="">利用者を選択</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            )}
            <button
              onClick={() => {
                if (selectedUser) {
                  setLogFormData({
                    ...logFormData,
                    userId: selectedUser
                  });
                  setShowLogForm(true);
                  setShowUserForm(false);
                } else {
                  showNotification('利用者を選択してください');
                }
              }}
              style={{
                background: '#10b981',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer'
              }}
              disabled={!selectedUser}
            >
              記録追加
            </button>
          </div>
        </div>
        
        {filteredLogs.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
            {selectedUser ? '記録がありません' : '利用者を選択してください'}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {filteredLogs.map(log => {
              const user = users.find(u => u.id === log.userId);
              return (
                <div key={log.id} style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '1rem',
                  background: '#f9fafb'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, color: '#111827' }}>
                      {user?.name} - {log.date} ({log.timeSlot})
                    </h4>
                    <span style={{ 
                      background: '#dbeafe', 
                      color: '#1e40af', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px',
                      fontSize: '0.8rem'
                    }}>
                      {log.mood}
                    </span>
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>活動:</strong> {log.activity}
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>医療的ケア:</strong> {log.medicalCare}
                  </div>
                  {log.notes && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>備考:</strong> {log.notes}
                    </div>
                  )}
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                    記録者: {log.createdBy} | 記録時刻: {new Date(log.createdAt).toLocaleString('ja-JP')}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderLogForm = () => {
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (logFormData.date && logFormData.timeSlot && logFormData.activity && logFormData.mood) {
        const submitData = {
          ...logFormData,
          userId: selectedUser
        };
        addDailyLog(submitData);
      } else {
        showNotification('必須項目を入力してください');
      }
    };

    const selectedUserData = users.find(user => user.id === selectedUser);

    return (
      <div style={{ textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#374151', margin: 0 }}>
            記録入力 - {selectedUserData?.name}
          </h2>
          <button
            onClick={() => {
              setShowLogForm(false);
              setActiveSection('日次記録');
            }}
            style={{
              background: '#6b7280',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            戻る
          </button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                日付 *
              </label>
              <input
                type="date"
                value={logFormData.date}
                onChange={(e) => setLogFormData({...logFormData, date: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
                required
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                時間帯 *
              </label>
              <select
                value={logFormData.timeSlot}
                onChange={(e) => setLogFormData({...logFormData, timeSlot: e.target.value})}
                onClick={(e) => {
                  if (!logFormData.timeSlot) {
                    setLogFormData({...logFormData, timeSlot: getCurrentTimeSlot()});
                  }
                }}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
                required
              >
                <option value="">▼ クリックで現在時刻を表示</option>
                <option value="朝 (6:00-12:00)">朝 (6:00-12:00)</option>
                <option value="昼 (12:00-18:00)">昼 (12:00-18:00)</option>
                <option value="夜 (18:00-24:00)">夜 (18:00-24:00)</option>
                <option value="深夜 (0:00-6:00)">深夜 (0:00-6:00)</option>
              </select>
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              活動内容 *
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <select
                value={logFormData.activity}
                onChange={(e) => setLogFormData({...logFormData, activity: e.target.value})}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
                required
              >
                <option value="">選択してください</option>
                {activityTemplates.map((template, index) => (
                  <option key={index} value={template}>{template}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setLogFormData({...logFormData, activity: ''})}
                style={{
                  padding: '0.5rem',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                クリア
              </button>
            </div>
            <input
              type="text"
              value={logFormData.activity}
              onChange={(e) => setLogFormData({...logFormData, activity: e.target.value})}
              placeholder="選択後、編集・追加が可能です"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              気分・様子 *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem' }}>
              {moodOptions.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setLogFormData({...logFormData, mood: option.value})}
                  style={{
                    padding: '0.5rem',
                    border: `2px solid ${logFormData.mood === option.value ? option.color : '#e5e7eb'}`,
                    background: logFormData.mood === option.value ? option.color : 'white',
                    color: logFormData.mood === option.value ? 'white' : option.color,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              医療的ケア
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    const currentCare = logFormData.medicalCare;
                    const newCare = currentCare 
                      ? `${currentCare}、${e.target.value}`
                      : e.target.value;
                    setLogFormData({...logFormData, medicalCare: newCare});
                  }
                }}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              >
                <option value="">💊 定型文を選択</option>
                {medicalCareTemplates.map((template, index) => (
                  <option key={index} value={template}>{template}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setLogFormData({...logFormData, medicalCare: ''})}
                style={{
                  padding: '0.5rem',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                クリア
              </button>
            </div>
            <textarea
              value={logFormData.medicalCare}
              onChange={(e) => setLogFormData({...logFormData, medicalCare: e.target.value})}
              placeholder="定型文選択後、編集・追加が可能です"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem',
                minHeight: '60px',
                resize: 'vertical'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              備考・特記事項
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    const currentNotes = logFormData.notes;
                    const newNotes = currentNotes 
                      ? `${currentNotes}\n${e.target.value}`
                      : e.target.value;
                    setLogFormData({...logFormData, notes: newNotes});
                  }
                }}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              >
                <option value="">📝 申し送り定型文を選択</option>
                {notesTemplates.map((template, index) => (
                  <option key={index} value={template}>{template}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setLogFormData({...logFormData, notes: ''})}
                style={{
                  padding: '0.5rem',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                クリア
              </button>
            </div>
            <textarea
              value={logFormData.notes}
              onChange={(e) => setLogFormData({...logFormData, notes: e.target.value})}
              placeholder="定型文選択後、編集・追加が可能です"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem',
                minHeight: '80px',
                resize: 'vertical'
              }}
            />
          </div>
          
          <button
            type="submit"
            style={{
              background: '#10b981',
              color: 'white',
              padding: '0.75rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              marginTop: '1rem'
            }}
          >
            記録を保存
          </button>
        </form>
      </div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Hiragino Sans, Hiragino Kaku Gothic ProN, Yu Gothic Medium, Meiryo, sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '3rem',
        maxWidth: '800px',
        width: '90%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌟</div>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#4c1d95',
          marginBottom: '1rem'
        }}>
          重心ケアアプリ
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#6b7280',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          重症心身障害児者への愛情あふれるケアを支援する<br />
          デジタルプラットフォーム
        </p>
        
        <div style={{
          background: '#10b981',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '25px',
          display: 'inline-block',
          marginBottom: '2rem'
        }}>
          ✅ システム正常稼働中
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginTop: '2rem'
        }}>
          <div 
            style={{
              padding: '1.5rem',
              background: activeSection === '利用者管理' ? '#3b82f6' : '#f3f4f6',
              color: activeSection === '利用者管理' ? 'white' : '#374151',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: 'scale(1)',
              border: '2px solid transparent'
            }}
            onClick={() => handleFeatureClick('利用者管理')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.borderColor = '#3b82f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
            <div style={{ fontWeight: 'bold' }}>利用者管理</div>
          </div>
          
          <div 
            style={{
              padding: '1.5rem',
              background: activeSection === '日次記録' ? '#10b981' : '#f3f4f6',
              color: activeSection === '日次記録' ? 'white' : '#374151',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: 'scale(1)',
              border: '2px solid transparent'
            }}
            onClick={() => handleFeatureClick('日次記録')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.borderColor = '#10b981';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📝</div>
            <div style={{ fontWeight: 'bold' }}>ケース記録 <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>(きらめきの記録)</span></div>
          </div>
          
          <div 
            style={{
              padding: '1.5rem',
              background: activeSection === 'ai' ? '#f59e0b' : '#f3f4f6',
              color: activeSection === 'ai' ? 'white' : '#374151',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: 'scale(1)',
              border: '2px solid transparent'
            }}
            onClick={() => handleFeatureClick('AI分析')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.borderColor = '#f59e0b';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🤖</div>
            <div style={{ fontWeight: 'bold' }}>AI分析</div>
          </div>
          
          <div 
            style={{
              padding: '1.5rem',
              background: activeSection === 'family' ? '#ef4444' : '#f3f4f6',
              color: activeSection === 'family' ? 'white' : '#374151',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: 'scale(1)',
              border: '2px solid transparent'
            }}
            onClick={() => handleFeatureClick('家族連携')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.borderColor = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💝</div>
            <div style={{ fontWeight: 'bold' }}>家族連携</div>
          </div>
        </div>

        {/* 機能別コンテンツ表示 */}
        <div style={{ marginTop: '2rem' }}>
          {showUserForm ? (
            renderUserForm()
          ) : showLogForm ? (
            renderLogForm()
          ) : activeSection === '利用者管理' ? (
            renderUserManagement()
          ) : activeSection === '日次記録' ? (
            renderDailyLogs()
          ) : (
            <>
              <div style={{
                marginTop: '2rem',
                padding: '1.5rem',
                background: '#dbeafe',
                borderRadius: '12px',
                color: '#1e40af'
              }}>
                <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  🚀 アプリケーションはネット上で正常に動作しています
                </h3>
                <p style={{ margin: '0.5rem 0' }}>
                  現在時刻: {new Date().toLocaleString('ja-JP')}
                </p>
                <p style={{ margin: '0.5rem 0' }}>
                  選択中の機能: <strong>{activeSection === 'dashboard' ? 'ダッシュボード' : activeSection}</strong>
                </p>
                <p style={{ margin: '0.5rem 0' }}>
                  登録済み利用者: <strong>{users.length}名</strong>
                </p>
                <p style={{ margin: '0.5rem 0' }}>
                  記録件数: <strong>{dailyLogs.length}件</strong>
                </p>
              </div>
              
              <div style={{
                marginTop: '2rem',
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <button
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'background 0.3s ease'
                  }}
                  onClick={() => {
                    setActiveSection('利用者管理');
                    setShowUserForm(true);
                    setShowLogForm(false);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#3b82f6';
                  }}
                >
                  新規利用者登録
                </button>
                
                <button
                  style={{
                    background: '#10b981',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'background 0.3s ease'
                  }}
                  onClick={() => {
                    if (users.length > 0) {
                      setActiveSection('日次記録');
                      setSelectedUser(users[0].id);
                      setLogFormData({
                        ...logFormData,
                        userId: users[0].id
                      });
                      setShowLogForm(true);
                      setShowUserForm(false);
                    } else {
                      showNotification('先に利用者を登録してください');
                    }
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#059669';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#10b981';
                  }}
                >
                  記録を追加
                </button>
                
                <button
                  style={{
                    background: '#f59e0b',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'background 0.3s ease'
                  }}
                  onClick={() => {
                    const report = `
重心ケアアプリ - 活動レポート
生成日時: ${new Date().toLocaleString('ja-JP')}

■ 利用者情報
- 登録済み利用者数: ${users.length}名
${users.map(user => `  - ${user.name} (${user.disabilityType})`).join('\n')}

■ 記録情報  
- 総記録件数: ${dailyLogs.length}件
- 今日の記録: ${dailyLogs.filter(log => log.date === new Date().toISOString().split('T')[0]).length}件

■ 最近の活動
${dailyLogs.slice(-5).map(log => {
  const user = users.find(u => u.id === log.userId);
  return `  - ${log.date} ${user?.name}: ${log.activity} (${log.mood})`;
}).join('\n')}
                    `.trim();
                    
                    const blob = new Blob([report], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `care_report_${new Date().toISOString().split('T')[0]}.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                    
                    showNotification('レポートをダウンロードしました');
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#d97706';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f59e0b';
                  }}
                >
                  レポート生成
                </button>
              </div>
            </>
          )}
        </div>

        {/* 通知エリア */}
        {notifications.length > 0 && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000
          }}>
            {notifications.map((notification, index) => (
              <div
                key={index}
                style={{
                  background: '#10b981',
                  color: 'white',
                  padding: '1rem 1.5rem',
                  borderRadius: '8px',
                  marginBottom: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  animation: 'slideIn 0.3s ease-out'
                }}
              >
                ✅ {notification}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleApp;

/*** 🚀 Copilot System Prompt – REBUILD PROJECT_SOUL.md with FULL SOUL ***

🧭 使命
1. このリポジトリのルート直下に **PROJECT_SOUL.md** を新規作成（既存なら完全置換）。
2. 《=== CONTENT START ===》〜《=== CONTENT END ===》の**全文を一字一句漏らさず**書き込む。
3. 最上段に `Generated: <ISO8601 時刻>` を自動追記。
4. 以後、手動指示が無い限り **削除・要約・改変禁止**。追補は “## Change Log” へ日時付きで追加。

💡 実装時の絶対ルール
- TypeScript `strict` を恒常維持。型に迷ったら必ず本書を参照。
- UI/UX・データモデル・テンプレ文・チェックリストは **本書を唯一の出典** とする。
- PO（とんさん）の情熱と哲学を尊重。中途半端な実装は禁止。

=== CONTENT START ===
# PROJECT_SOUL – 重心ケアアプリ ドメイン仕様書 (フルバージョン)

## 0. このドキュメントの魂
> **「左脳は AI と共存し、右脳の創造で未来を拓く。」**  
>  
> 23 年の現場愛が詰まった本書は、職員と利用者双方の “しあわせな一日” を積み重ねるための **羅針盤** である。  
> **一行でも欠ければ舵を失う。** だからこそ、開発チームは本書を心に刻み、コードに写し取り、すべてのタップに魂を宿すこと。

---

## 1. ゴール
重症心身障害児者が通う **生活介護 & 重心型放課後等デイサービス & 日中一時支援** の現場で  
**職員の業務負担を劇的に減らし、利用者の QOL を最大化** する “世界最高峰” ケア記録・運営支援アプリを完成させる。  
KPI 例：  
- ① 職員 1 人あたり記録入力時間 ▲70 %  
- ② 体調急変の早期検知率 ＋50 %  
- ③ 個別支援計画更新に要する工数 ▲80 %

---

## 2. ステークホルダー & 役割
| 区分 | 名前/AI | パワー | 主要責務 |
|------|---------|--------|-----------|
| PO・ドメイン | **とんさん** | 支援歴 23 年 | 要件定義・優先度決定・情熱注入 |
| アーキテクト/PM | **ChatGPT** | 戦略思考 | 要件整理・タスク分割・レビューフロー |
| コード鍛冶 | **GitHub Copilot Chat** | 高速生成 | 実装・テスト・Refactor・CI/CD |
| 未来導入 | **Genspark スーパーエージェント** | 多機能 Orchestrator | AI 連携／自動連係（予定） |

---

## 3. 事業所 & 運営概要
- **名称**：〇△□（重心多機能型事業所）  
- **所在地**：地方住宅地（狭路・交通量多）／高齢化率高／若者流出傾向  
- **運営形態**：  
  - 生活介護（定員 10／契約 14）  
  - 重心型放課後等デイサービス（定員 5／契約 10）  
  - 日中一時支援（レスパイト）  
- **一日平均利用**：生活介護 6 名／放デイ 4 名（全員送迎あり）  
- **営業時間**：火〜土 9-18 時（サービス提供時間はセクション 6 参照）  
- **人員体制**：管理者1・サビ管1・常勤Ns4・非常勤Ns3・保育士1・支援員2＋α・運転手1  

### 3.1 シフト
| シフト | 時間 | 実働 | 休憩 |
|--------|------|------|------|
| 早出   | 08:30–17:15 | 8h | 45 m |
| 通常   | 09:00–17:45 | 8h | 45 m |
| 遅出1  | 09:30–18:15 | 8h | 45 m |
| 遅出2  | 09:45–18:30 | 8h | 45 m |

---

## 4. 現場の特色 & 強み
1. **医療的ケア充実**：吸引・経管・CV・発作対応 etc.  
2. **ライフステージ一貫支援**：放デイ → 生活介護 → GH → 訪問介護。  
3. **柔軟レスパイト**：日中一時支援で家族負担軽減。  

---

## 5. 主要課題
1. 職員の専門性（経験 <2 年）強化：ポジショニング／コミュニケーション。  
2. ケース記録・研修計画等の **業務効率化**。  
3. 地域交流・家族支援イベントの機会不足。  
4. 人員増に伴う **施設スペース不足**。  

---

## 6. サービス詳細
### 6.1 生活介護  
- 営業：火-土／9-18 時　| 休：日・月  
- サービス提供：10-16 時  

### 6.2 放課後等デイサービス  
- 営業：火-土／9-18 時　| 休：日・月  
- サービス提供：平日 14-18 時／休日 10-16 時  

### 6.3 日中一時支援  
- 営業：火-土／9-18 時  
- サービス提供：9-10 時, 18-18:30 時  

---

## 7. 利用者データ（**全文原文**）
### 7.1 生活介護 14 名
1. **A・T (36・男)**  
   - 区分6／脳性麻痺・てんかん・遠視性弱視・側湾症・上下肢機能障害  
   - 医療ケア：なし　| 手帳：療育A, 身障1級　| 介助：全介助  

2. **I・K (47・女)**  
   - 区分6／脳性麻痺・側湾症・体幹四肢機能障害  
   - 医療ケア：なし　| 手帳：療育A, 身障1級　| 介助：全介助  

3. **O・S (40・女)**  
   - 区分6／脳性麻痺・体幹四肢機能障害  
   - 医療ケア：なし　| 手帳：療育A, 身障1級　| 介助：全介助  

4. **S・M (43・男)**  
   - 区分6／脳性麻痺・脳炎後遺症・てんかん服薬中・側湾症  
   - 医療ケア：吸引・腸瘻（トラブル多発）  
   - 手帳：療育A, 身障1級　| 介助：全介助  

5. **N・M (32・男)**  
   - 区分6／痙性四肢麻痺・重度知的障害・ほぼ毎日強直間代発作 1-5 回  
   - 医療ケア：胃ろう・エアウェイ・カフアシスト・吸引・吸入・浣腸(火木)  
   - 手帳：療育A, 身障1級　| 介助：全介助  

6. **W・M (32・女)** …（以下 14 名全員を原文どおり列挙）

> **⚠️ Copilot へ**：このリストは長いため、省略せず 14 名分を **完全原文** で記載すること。

### 7.2 放課後等デイサービス 10 名
1. **M・I (17・男児)**  
   - 慢性肺疾患・染色体異常・ミオクロニー発作／鼻腔注入  
   - 手帳：療育A, 身障1級　| 介助：全介助  

2. **S・K (15・男児)** …（以下 10 名分を原文どおり列挙）

> **⚠️ Copilot へ**：同様に 10 名全員を**完全原文**で記載すること。

---

## 8. UI / データベース仕様（フル）
### 8.1 バイタルサイン
| 項目 | 型 | 入力方法 | 範囲 / 刻み | 既定値 |
|------|----|---------|-------------|--------|
| 体温 | number | select | 34.0-42.0 ℃ / 0.1 | 36.5 |
| 脈拍 | number | select | 40-180 / 1 | 70 |
| SpO₂ | number | select | 80-100 % / 1 | 95 |
| 血圧 上 | number | select | 60-240 / 1 | 120 |
| 血圧 下 | number | select | 30-140 / 1 | 80 |

### 8.2 水分・食事
- **摂取方法**：経口(コップ・スプーン)／経口(とろみ)／経鼻栄養／胃ろう／シリンジ／その他  
- **摂取量**：5 ml 刻み (0-1000+)／既定 100 ml  
- **備考タグ** *(複数選択, 初期 9 種)*：  
  `むせ込みあり, 顔色変化あり, 嘔吐・逆流, 口腔内残渣あり, 流涎多い, 摂食意欲良好, 食事中ウトウト, 介助抵抗あり, その他`

### 8.3 排泄
- **便形状 (ブリストル)**：タイプ1〜7  
- **便備考タグ**：皮膚発赤, オムツかぶれ, いきみ強い, 不消化物, 粘液混入, 血便, 黒色便, 白色便, 異臭, その他  
- **尿備考タグ (20 種)**：  
  `量少ない, 量多い, 色濃い, 淡色, 混濁, 血尿, 強い臭い, 尿意頻回, 尿失禁, 排尿痛, 浮腫あり, バルーン閉塞疑い, 尿漏れ, 尿閉, 夜間多尿, 泡立ち, 尿砂, 結晶, 薬剤色, その他`

### 8.4 睡眠
- **様子**：スムーズ入眠／寝付き悪い／中途覚醒／体動多い／硬直あり／いびき・無呼吸／穏やか／その他  
- **備考**：free text

### 8.5 発作
| 項目 | 仕様 |
|------|------|
| 種類 | 強直, 間代, 強直間代, 脱力, ミオクロニー, スパズム, 非定型欠神, 焦点意識減損, その他 |
| 持続 | 1 s 刻み (1-900)／既定 30 |
| 詳細タグ (10 種) | 眼球上転, 眼球偏位(右), 眼球偏位(左), 顔面蒼白, チアノーゼ, 流涎多量, 嘔吐, 失禁, 左右対称, 左右非対称, その他 |

### 8.6 活動・表情
- **参加様子タグ (10 種)**：笑顔, 発声/クーイング, 追視, 音反応, 光反応, 手を伸ばす, 体を預ける, リラックス, 不快表情, 体をこわばらせる, その他  
- **表情気分**：穏やか, 笑顔良好, 活気あり, 不機嫌, 不安/緊張, ウトウト, 無表情, その他

### 8.7 医療ケア・特記事項
- **実施ケア(10 +)**：喀痰吸引, 経管栄養, 吸入, 酸素, 導尿, 与薬(定時), 与薬(臨時), 創傷処置, 体位交換, その他  
- **特記事項**：カテゴリタグ選択 + free text

---

## 9. テンプレ文（初期セット）
```txt
【特記事項】呼吸状態落ち着いており、喀痰量少。  
【活動の様子】スヌーズレンで光を追視し笑顔。  
【発作】強直 20 秒・眼球上転・チアノーゼ(−)・介入不要。  
【食事備考】経口とろみ 150 ml、むせ込み(−)。  

/*** 🚀 Copilot System Prompt – REBUILD PROJECT_SOUL.md WITH FULL SOUL & SECURITY ***

🧭 使命
1. リポジトリ直下に **PROJECT_SOUL.md** を新規作成（存在すれば完全置換）。
2. 《=== CONTENT START ===》〜《=== CONTENT END ===》の**全文を一字一句漏らさず**書き込む。
3. 最上段に `Generated: <ISO8601 時刻>` を自動追記。
4. 以後、手動指示が無い限り **削除・要約・改変禁止**。追補は “## Change Log” へ日時付きで追加。

💡 実装時の絶対ルール
- TypeScript `strict` を恒常維持。型に迷ったら必ず本書を参照。
- UI/UX・データモデル・テンプレ文・チェックリストは **本書を唯一の出典** とする。
- PO（とんさん）の情熱・哲学・セキュリティ要件を最優先。妥協禁止。

=== CONTENT START ===
# PROJECT_SOUL – 重心ケアアプリ ドメイン仕様書 (Ultra Secure Edition)

## 0. このドキュメントの魂
> **「左脳は AI と共存し、右脳の創造で未来を拓く。そして個人情報は鉄壁に守る。」**  
>  
> 23 年の現場愛 + データ護りの覚悟が詰まった本書は、職員と利用者双方の “しあわせな一日” を積み重ねるための **羅針盤**。  
> **一行でも欠ければ舵を失い、一文字でも漏れれば信頼を失う。** 開発チームは本書を心に刻み、コードに写し取り、すべてのタップに魂と盾を宿すこと。

---

## 1. ゴール
重症心身障害児者が通う **生活介護 & 重心型放課後等デイサービス & 日中一時支援** の現場で  
**職員の業務負担を劇的に減らし、利用者の QOL を最大化** しつつ **個人情報を絶対に漏らさない** “世界最高峰” ケア記録・運営支援アプリを完成させる。  
KPI 例：  
- ① 記録入力時間 ▲70 %  
- ② 体調急変の早期検知率 ＋50 %  
- ③ 個別支援計画更新に要する工数 ▲80 %  
- ④ セキュリティ・インシデント 0 件（永久）

---

## 2. アップデート & セキュリティ統制

### 2.1 リアルタイム仕様同期
- **管理者（とんさん）がアプリ UI からフィールド・テンプレート等を編集／追加した瞬間**  
  1. クライアントは変更内容を Supabase / API に保存。  
  2. **Copilot Chat は開発用ワークスペースに Webhook で通知を受信** →  
     - `PROJECT_SOUL.md` の “## Change Log” に自動追記。  
     - 型定義・UI コンポーネント・テストを再生成し PR を起票。  
  3. これにより **「最新状態 ≒ コード ≒ 本仕様書」** が常時一致。

### 2.2 鉄壁セキュリティ原則（最重要）
| レイヤ | 対策 | 実装ポイント |
|--------|------|--------------|
| **通信** | TLS1.3 / HSTS / 固定ホストピン | Supabase + Edge Function |
| **保存** | AES-256 暗号化 at rest（RLS + カスタム鍵管理） | Supabase Storage & Postgres |
| **認可** | Row Level Security + JWT クレーム | 役割: 管理者 / 看護師 / 支援員 |
| **PII 削減** | ログ & テレメトリは **ハッシュ化 or マスク** | OpenTelemetry filter |
| **OpenAI 呼び出し** | 個人情報を送る前に **PII Redaction** | server-side function |
| **モデル学習遮断** | `openai_embedding` 等は禁止。**分析用ログを AI 共有しない** | CI Gatekeeper |
| **秘密情報** | `.env.*` は git-ignored。CI/CD では OIDC secrets manager | GitHub Actions |
| **端末** | MDM + ディスク暗号 + 画面ロック ≤ 5 min | BYOD ポリシー |
| **継続監査** | Trivy, Snyk, OWASP ZAP 週次 | Security Workflow |
| **障害対応** | 24h 以内に PO 報告 → 是正 PR + Post-mortem | On-call Rotation |

> **⚠️ 開発者へ**：これらはコードレビューの **ブロッカー** です。通らなければマージ禁止。

---

## 3. （以下、先ほどのフル仕様と同一。省略せず全文収録）  
- 3. 事業所概要  
- 4. 現場の特色 & 強み  
- 5. 主要課題  
- 6. サービス詳細  
- 7. 利用者データ（生活介護 14 名 + 放デイ 10 名）  
- 8. UI / DB 要件（バイタル〜特記事項）  
- 9. テンプレ文初期セット  
- 10. UX 原則  
- 11. テクノロジースタック  
- 12. マイルストーン最新版  
- 13. PO “とんさん” の哲学 & ビジョン  

（※Copilot は前回提示の全文を **一語一句** ここに展開すること。省略不可）

---

## 14. Change Log
- *ここに Copilot が後続変更を `YYYY-MM-DD HH:MM` 形式で追記*

=== CONTENT END ===
***/

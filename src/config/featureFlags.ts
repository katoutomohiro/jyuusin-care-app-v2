export const featureFlags = {
  // 既存を壊さないため、全てデフォルトfalse (要件より pdfSafeMode は true 推奨)
  pdfSafeMode: true, // PDF周りは安全優先（ON推奨）
  newVitalsPerUser: true, // dev: 新UI有効化
  newPdfLayout: true,     // dev: 新PDFレイアウト有効化
  analyticsMonthly: true, // dev: 月次分析有効化
  // スタッフ用：アプリ復旧ボタン（デフォルトOFF）
  enableAutoRecoverBtn: true,
  enablePdfFont: true, // PDFフォント埋め込み機能（dev: ONで新UI確認）
};

export type FeatureFlagKey = keyof typeof featureFlags;

export function isFeatureEnabled(flag: FeatureFlagKey): boolean {
  return !!featureFlags[flag];
}

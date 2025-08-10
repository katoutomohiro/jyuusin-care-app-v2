export const featureFlags = {
  // 既存を壊さないため、全てデフォルトfalse (要件より pdfSafeMode は true 推奨)
  pdfSafeMode: true, // PDF周りは安全優先（ON推奨）
  newVitalsPerUser: false,
  newPdfLayout: false,
  analyticsMonthly: false,
};

export type FeatureFlagKey = keyof typeof featureFlags;

export function isFeatureEnabled(flag: FeatureFlagKey): boolean {
  return !!featureFlags[flag];
}

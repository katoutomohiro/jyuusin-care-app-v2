import { VITAL_DEFAULTS } from "./vitalsDefaults";

export type PatientCaseSpec = {
  id: string;           // 例: "ns"（内部ID）
  displayName: string;  // 例: "N・S"
  overrides?: {
    vitals?: Partial<typeof VITAL_DEFAULTS>;
    // 将来: 入力タイルの有無、PDFの項目有無などをここで個別上書き
  };
};

export const PATIENT_PROFILES: PatientCaseSpec[] = [
  {
    id: "ns",
    displayName: "N・S",
    overrides: {
      // 今回はデフォルトのまま（必要に応じて項目の有無や初期値を上書き可能）
      vitals: { /* e.g., hr: 85 */ },
    },
  },
];

export function getPatientSpecById(id?: string): PatientCaseSpec | undefined {
  if (!id) return undefined;
  return PATIENT_PROFILES.find(p => p.id === id);
}

// 年間ストック画面の型定義（他画面でも流用可）
export type YearlyStockSummary = {
  month: number;
  count: number;
  categoryCounts: Record<string, number>;
};

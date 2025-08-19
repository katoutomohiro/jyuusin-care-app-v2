import dynamic from "next/dynamic";

// 既存の React 画面（src/pages/DailyLogYearlyStockPage.tsx）をそのまま表示
const Inner = dynamic(() => import("../../../DailyLogYearlyStockPage"), { ssr: false });

export default function Page() {
  return <Inner />;
}

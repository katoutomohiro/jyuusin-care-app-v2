import dynamic from "next/dynamic";

// 既存の React 画面（src/pages/DailyLogPreviewPage.tsx）をそのまま表示
const Inner = dynamic(() => import("../../DailyLogPreviewPage"), { ssr: false });

export default function Page() {
  return <Inner />;
}

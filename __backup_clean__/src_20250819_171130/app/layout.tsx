import type { Metadata } from "next";
import "../globals.css";
import Sidebar from "../components/Sidebar";

export const metadata: Metadata = {
  title: "重心ケアアプリ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <div style={{display:"flex", minHeight:"100vh"}}>
          <Sidebar />
          <main style={{flex:1, padding:16}}>{children}</main>
        </div>
      </body>
    </html>
  );
}

import React from "react";
import { NavLink } from "react-router-dom";
import { useAdmin } from "../contexts/AdminContext";

type Item = { label: string; href: string; desc?: string };
const groups: { title: string; items: Item[] }[] = [
  {
    title: "ナビゲーション",
    items: [
      { label: "ダッシュボード", href: "/dashboard", desc: "全体状況" },
      { label: "利用者管理",     href: "/users",      desc: "利用者一覧・編集" },
    ],
  },
  {
    title: "構造化日誌",
    items: [
      { label: "日誌（ホーム）", href: "/daily-log",                desc: "タイル" },
      { label: "日誌入力",       href: "/daily-log/input",          desc: "新規記録" },
      { label: "日誌一覧",       href: "/daily-log/list",           desc: "履歴" },
      { label: "A4プレビュー",   href: "/daily-log/preview",        desc: "本日A4" },
      { label: "年間ストック",   href: "/daily-log/preview/yearly", desc: "年別集計" },
    ],
  },
];

export default function Sidebar() {
  const { isAdmin, toggle } = useAdmin();
  return (
    <aside className="w-64 border-r bg-white/70 backdrop-blur min-h-screen">
      <div className="p-3 text-sm font-semibold text-gray-600">魂の器ナビゲーション</div>

      <div className="px-2 mb-4">
        <button
          onClick={toggle}
          className={"w-full rounded px-3 py-2 text-sm border transition " +
            (isAdmin ? "bg-amber-50 border-amber-300 text-amber-700" : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100")}
          aria-pressed={isAdmin}
        >
          {isAdmin ? "🔓 管理者モード中" : "🔒 一般モード（管理者モード開始）"}
        </button>
      </div>

      <nav className="px-2 space-y-5">
        {groups.map((g) => (
          <div key={g.title}>
            <div className="px-2 mb-2 text-xs tracking-wide text-gray-400">{g.title}</div>
            <ul className="space-y-1">
              {g.items.map((it) => (
                <li key={it.href}>
                  <NavLink
                    to={it.href}
                    className={({ isActive }) =>
                      "block rounded px-3 py-2 text-sm transition " +
                      (isActive ? "bg-blue-100 text-blue-700" : "hover:bg-gray-50 text-gray-700")
                    }
                  >
                    <div className="leading-tight">{it.label}</div>
                    {it.desc && <div className="text-xs text-gray-400">{it.desc}</div>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

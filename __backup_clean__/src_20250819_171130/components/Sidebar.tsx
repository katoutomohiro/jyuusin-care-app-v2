"use client";
import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Users, FileText, BarChart3, Plus } from "lucide-react";

type NavItem = { name:string; subtitle?:string; href:string; icon:any };

const navigation: NavItem[] = [
  { name: "ダッシュボード", subtitle: "全体状況", href: "/", icon: Home },
  { name: "利用者管理",   subtitle: "利用者一覧", href: "/users", icon: Users },
  { name: "日誌一覧",     subtitle: "記録一覧",   href: "/daily-log", icon: FileText },
  { name: "日誌入力",     subtitle: "新規記録",   href: "/daily-log/input", icon: Plus },

  // ★ ダミーメニュー（A4プレビュー / 年間ストック）
  { name: "A4プレビュー", subtitle: "本日のA4日誌（ダミー）", href: "/daily-log/preview", icon: FileText },
  { name: "年間ストック", subtitle: "年別集計（ダミー）",     href: "/daily-log/preview/yearly", icon: BarChart3 },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <nav className="mt-8">
        <div className="px-4 space-y-1">
          {navigation.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors " +
                  (isActive
                    ? "bg-primary-100 text-primary-900"
                    : "text-gray-700 hover:bg-gray-50")
                }
              >
                <Icon className="mr-3 h-5 w-5" />
                <div className="flex flex-col">
                  <span>{item.name}</span>
                  {item.subtitle && <span className="text-xs text-gray-400">{item.subtitle}</span>}
                </div>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

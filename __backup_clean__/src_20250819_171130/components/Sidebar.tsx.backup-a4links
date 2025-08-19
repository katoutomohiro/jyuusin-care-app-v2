import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  FileText, 
  Plus,
  BarChart3
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navigation = [
    { name: 'ダッシュボード', subtitle: '魂の物語', href: '/', icon: Home },
    { name: '利用者一覧', subtitle: '大切な仲間たち', href: '/users', icon: Users },
    { name: '構造化日誌入力', subtitle: '現場記録の本丸', href: '/daily-log', icon: FileText },
    { name: '日誌入力', subtitle: 'きらめきの記録', href: '/daily-log/input', icon: Plus },
    { name: '日誌一覧', subtitle: '日々のきらめき', href: '/daily-log/list', icon: FileText },
    { name: 'レポート', subtitle: '魂の分析', href: '/reports', icon: BarChart3 },
  ];

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <nav className="mt-8">
        <div className="px-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <Icon className="mr-3 h-5 w-5" />
                <div className="flex flex-col">
                  <span>{item.name}</span>
                  <span className="text-xs text-gray-400">{item.subtitle}</span>
                </div>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar; 
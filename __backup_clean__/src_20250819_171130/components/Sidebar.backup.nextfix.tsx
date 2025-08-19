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
    { name: '繝繝・す繝･繝懊・繝・, subtitle: '鬲ゅ・迚ｩ隱・, href: '/', icon: Home },
    { name: '蛻ｩ逕ｨ閠・ｸ隕ｧ', subtitle: '螟ｧ蛻・↑莉ｲ髢薙◆縺｡', href: '/users', icon: Users },
    { name: '讒矩蛹匁律隱悟・蜉・, subtitle: '迴ｾ蝣ｴ險倬鹸縺ｮ譛ｬ荳ｸ', href: '/daily-log', icon: FileText },
    { name: '譌･隱悟・蜉・, subtitle: '縺阪ｉ繧√″縺ｮ險倬鹸', href: '/daily-log/input', icon: Plus },
    { name: '譌･隱御ｸ隕ｧ', subtitle: '譌･縲・・縺阪ｉ繧√″', href: '/daily-log/list', icon: FileText },
    { name: '繝ｬ繝昴・繝・, subtitle: '鬲ゅ・蛻・梵', href: '/reports', icon: BarChart3 },
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
      // --- A4プレビュー / 年間ストック（ダミー）へのショートカット（強制表示） ---
<div style={{marginTop:12, paddingTop:12, borderTop:'1px solid #eee'}}>
  <div style={{fontSize:12, color:'#888', marginBottom:6}}>プレビュー</div>
  <NavLink to="/daily-log/preview" style={{display:'flex', alignItems:'center', gap:8, padding:'6px 8px', borderRadius:8, textDecoration:'none'}}>
    <FileText size={16} /> <span>A4プレビュー</span>
  </NavLink>
  <NavLink to="/daily-log/preview/yearly" style={{display:'flex', alignItems:'center', gap:8, padding:'6px 8px', borderRadius:8, textDecoration:'none'}}>
    <BarChart3 size={16} /> <span>年間ストック</span>
  </NavLink>
</div>
// --- end: 強制表示ブロック ---
</nav>
    </div>
  );
};

export default Sidebar; 

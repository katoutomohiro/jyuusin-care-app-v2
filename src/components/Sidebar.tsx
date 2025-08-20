import React from 'react';
import { NavLink } from 'react-router-dom';
import { navigation } from '../../constants';

type NavItem = { name: string; subtitle?: string; href: string; icon?: any };

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <nav className="mt-8">
        <div className="px-4 space-y-1">
          {navigation.map((item: NavItem) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ' +
                  (isActive ? 'bg-primary-100 text-primary-900' : 'text-gray-700 hover:bg-gray-50')
                }
              >
                {Icon && <Icon className="mr-3 h-5 w-5" />}
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
};

export default Sidebar;
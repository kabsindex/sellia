import React, { cloneElement } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Zap,
  BarChart2,
  Settings,
  Bell } from
'lucide-react';
interface DashboardLayoutProps {
  children: React.ReactNode;
}
export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const navItems = [
  {
    path: '/dashboard',
    icon: <LayoutDashboard size={24} />,
    label: 'Aperçu'
  },
  {
    path: '/dashboard/orders',
    icon: <ShoppingBag size={24} />,
    label: 'Commandes'
  },
  {
    path: '/dashboard/products',
    icon: <Package size={24} />,
    label: 'Produits'
  },
  {
    path: '/dashboard/customers',
    icon: <Users size={24} />,
    label: 'Clients'
  },
  {
    path: '/dashboard/automations',
    icon: <Zap size={24} />,
    label: 'Auto'
  },
  {
    path: '/dashboard/analytics',
    icon: <BarChart2 size={24} />,
    label: 'Stats'
  },
  {
    path: '/dashboard/settings',
    icon: <Settings size={24} />,
    label: 'Config'
  }];

  // Get current page title based on path
  const currentTitle =
  navItems.find((item) => item.path === location.pathname)?.label ||
  'Dashboard';
  return (
    <div className="min-h-screen bg-sellia-bg flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-sellia-border fixed h-full z-20">
        <div className="p-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-sellia-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <span className="text-xl font-bold text-sellia-primary tracking-tight">
            SELLIA
          </span>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) =>
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-colors ${isActive ? 'bg-sellia-accent/10 text-sellia-accent' : 'text-sellia-muted hover:bg-slate-50 hover:text-sellia-text'}`
            }>
            
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          )}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 pb-20 md:pb-0 min-h-screen flex flex-col">
        {/* Mobile Header */}
        <header className="bg-white border-b border-sellia-border px-4 py-4 flex items-center justify-between sticky top-0 z-10 md:px-8">
          <div className="md:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-sellia-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
          </div>
          <h1 className="text-xl font-bold text-sellia-text md:text-2xl">
            {currentTitle}
          </h1>
          <button className="p-2 text-sellia-muted hover:bg-slate-100 rounded-full relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sellia-error rounded-full"></span>
          </button>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <div className="max-w-5xl mx-auto w-full">{children}</div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-sellia-border pb-safe z-50">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) =>
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-sellia-accent' : 'text-sellia-muted'}`
            }>
            
              {cloneElement(item.icon as React.ReactElement, {
              size: 22
            })}
              <span className="text-[10px] font-medium truncate w-full text-center px-1">
                {item.label}
              </span>
            </NavLink>
          )}
        </div>
      </nav>
    </div>);

}
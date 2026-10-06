import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ScanSearch,
  History,
  BarChart3,
  LogOut,
} from 'lucide-react';
import { useScan } from '../context/ScanContext';
import { cn } from '../utils';

const Sidebar = () => {
  const { stats } = useScan();

  const navItems = [
    { to: "/", label: "Overview", icon: LayoutDashboard },
    { to: "/scanner", label: "Scanner", icon: ScanSearch },
    { to: "/history", label: "History", icon: History, badge: stats?.totalScans || 0 },
    { to: "/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <aside className="w-[240px] shrink-0 hidden md:flex flex-col border-r border-cyber-border bg-cyber-dark h-full">
      {/* Brand Header */}
      <div className="flex items-center px-5 h-14 border-b border-cyber-border shrink-0">
        <h1 className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
          PhishGaurds
          <span className="bg-cyber-cyan/10 px-1.5 py-0.5 rounded text-[10px] font-mono text-cyber-cyan border border-cyber-cyan/20">
            AI
          </span>
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <div className="px-2 pb-2 text-[11px] font-medium text-cyber-dim">
          Workspace
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                "flex items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium transition-colors duration-150",
                isActive 
                  ? "bg-cyber-cardHover text-white" 
                  : "text-cyber-muted hover:bg-cyber-card hover:text-white"
              )}
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-2.5">
                    <Icon
                      size={16}
                      className={cn(
                        "transition-colors",
                        isActive ? "text-cyber-cyan" : "text-cyber-dim group-hover:text-cyber-muted"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="rounded bg-cyber-black px-1.5 py-0.5 text-[10px] font-mono text-cyber-muted border border-cyber-border">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Area */}
      <div className="p-3 border-t border-cyber-border space-y-1">
        <div className="px-2 py-2 flex flex-col gap-1">
          <span className="text-[10px] text-cyber-dim font-medium uppercase tracking-wider">Engine Status</span>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyber-mint" />
            <span className="text-xs font-mono text-cyber-muted">Operational</span>
          </div>
        </div>
        <NavLink
          to="/login"
          className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm font-medium text-cyber-dim transition-colors hover:bg-cyber-card hover:text-white"
        >
          <LogOut size={16} />
          <span>Log out</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;

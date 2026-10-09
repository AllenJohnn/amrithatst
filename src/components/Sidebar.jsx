import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ScanSearch,
  History,
  BarChart3,
  LogOut,
  Shield,
} from 'lucide-react';
import { useScan } from '../context/ScanContext';
import { cn } from '../utils';

export default function Sidebar() {
  const { stats } = useScan();

  const navItems = [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/scanner", label: "Scanner", icon: ScanSearch },
    { to: "/history", label: "Audit Log", icon: History, badge: stats?.totalScans || 0 },
    { to: "/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <aside className="w-[240px] shrink-0 hidden md:flex flex-col border-r border-cyber-border bg-cyber-black h-full z-20">
      {/* Brand Header */}
      <div className="flex items-center px-6 h-14 border-b border-cyber-border shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-cyber-card rounded-[4px] p-1 border border-cyber-border">
            <Shield className="h-4 w-4 text-sage-400" />
          </div>
          <h1 className="text-sm font-semibold tracking-tight text-cyber-white flex items-center gap-1.5">
            PhishGaurds
            <span className="text-sage-500 font-mono text-[9px] px-1 py-0.5 rounded-sm bg-sage-500/10 border border-sage-500/20 uppercase tracking-widest leading-none">
              Pro
            </span>
          </h1>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="px-2 pb-2 text-[10px] font-semibold text-cyber-textMuted uppercase tracking-widest">
          Platform
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                "flex items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium transition-colors duration-150 relative",
                isActive 
                  ? "bg-cyber-cardHover text-cyber-white" 
                  : "text-cyber-textMuted hover:bg-cyber-card hover:text-cyber-white"
              )}
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon
                      size={16}
                      className={cn(
                        "transition-colors",
                        isActive ? "text-sage-400" : "text-cyber-textMuted"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-mono border", isActive ? "bg-cyber-cardHover text-cyber-white border-transparent" : "bg-transparent text-cyber-textMuted border-cyber-border")}>
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
      <div className="p-4 border-t border-cyber-border space-y-1 bg-cyber-dark">
        <div className="px-2 py-2 flex flex-col gap-1.5">
          <span className="text-[10px] text-cyber-textMuted font-semibold uppercase tracking-widest">Model Endpoint</span>
          <div className="flex items-center justify-between border border-cyber-border bg-cyber-cardHover rounded-md px-2 py-1.5">
            <div className="flex items-center gap-2">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-success"></span>
              </div>
              <span className="text-xs font-mono text-cyber-white">US-East (Active)</span>
            </div>
          </div>
        </div>
        <NavLink
          to="/login"
          className="flex w-full mt-2 items-center gap-2.5 rounded-md px-2 py-1.5 text-sm font-medium text-cyber-textMuted transition-colors hover:bg-cyber-danger/10 hover:text-cyber-danger"
        >
          <LogOut size={16} />
          <span>Log out</span>
        </NavLink>
      </div>
    </aside>
  );
}

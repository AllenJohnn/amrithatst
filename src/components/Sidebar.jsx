import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ScanSearch,
  History,
  BarChart3,
  ShieldAlert,
  LogOut,
  Cpu,
} from 'lucide-react';
import { useScan } from '../context/ScanContext';
import { cn } from '../utils';

const Sidebar = () => {
  const { stats } = useScan();

  const navItems = [
    { to: "/", label: "Overview", icon: LayoutDashboard },
    { to: "/scanner", label: "Scanner", icon: ScanSearch, highlight: true },
    { to: "/history", label: "History", icon: History, badge: stats?.totalScans || 0 },
    { to: "/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 hidden md:flex h-screen w-64 flex-col border-r border-cyber-border bg-cyber-dark/80 backdrop-blur-xl">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 py-8">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyber-cyan to-cyber-blue shadow-[0_0_20px_rgba(0,229,255,0.3)]">
          <ShieldAlert className="h-5 w-5 text-cyber-black" strokeWidth={2.5} />
          {/* Subtle inner glow */}
          <div className="absolute inset-0 rounded-xl ring-1 ring-white/20 inset-ring pointer-events-none" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
            PhishGaurds
            <span className="rounded bg-cyber-cyan/10 px-1.5 py-0.5 text-[9px] font-black text-cyber-cyan border border-cyber-cyan/20 uppercase tracking-widest">
              AI
            </span>
          </h1>
          <p className="text-[10px] font-mono text-cyber-muted tracking-wider uppercase">Command Center</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 px-4 mt-2">
        <div className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-widest text-cyber-dim font-mono">
          Main Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                "group relative flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-cyber-cyan/10 text-cyber-cyan shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]" 
                  : "text-cyber-muted hover:bg-white/5 hover:text-white"
              )}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-cyber-cyan shadow-[0_0_10px_#00E5FF]" />
                  )}
                  <div className="flex items-center gap-3 ml-1">
                    <Icon
                      size={18}
                      className={cn(
                        "transition-colors",
                        isActive ? "text-cyber-cyan" : "text-cyber-muted group-hover:text-white"
                      )}
                    />
                    <span className="tracking-wide">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="rounded-md bg-cyber-card px-2 py-0.5 text-[10px] font-mono text-cyber-muted border border-cyber-border">
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && !isActive && (
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyber-cyan opacity-50"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-cyber-cyan"></span>
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Area */}
      <div className="mt-auto px-4 pb-6 space-y-4">
        {/* System Status */}
        <div className="rounded-xl border border-cyber-border/50 bg-cyber-card/50 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu size={14} className="text-cyber-dim" />
            <span className="text-xs font-medium text-cyber-muted">Engine Status</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyber-mint opacity-75"></span>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyber-mint"></span>
            </span>
            <span className="text-[10px] font-mono font-medium text-cyber-mint uppercase tracking-wider">
              Online
            </span>
          </div>
        </div>

        {/* Exit Session */}
        <NavLink
          to="/login"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-cyber-dim transition-colors hover:bg-cyber-danger/10 hover:text-cyber-danger"
        >
          <LogOut size={16} />
          <span>Log out</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;

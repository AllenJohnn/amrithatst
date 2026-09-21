import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ScanSearch,
  History,
  BarChart3,
  Shield,
  LogOut,
  Cpu,
  Sparkles,
} from 'lucide-react';
import { useScan } from '../context/ScanContext';

const Sidebar = () => {
  const { stats } = useScan();

  const navItems = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/scanner", label: "URL Scanner", icon: ScanSearch, highlight: true },
    { to: "/history", label: "Scan History", icon: History, badge: stats.totalScans },
    { to: "/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-cyber-border bg-cyber-dark/95 backdrop-blur-xl p-5">
      {/* Brand Header */}
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 p-[1px] shadow-glow">
          <div className="flex h-full w-full items-center justify-center rounded-2xl bg-cyber-dark">
            <Shield className="h-6 w-6 text-cyber-cyan" />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
            <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              PhishGaurds
            </span>
            <span className="rounded-md bg-gradient-to-r from-cyan-400 to-blue-500 px-1.5 py-0.5 text-[10px] font-black text-slate-950 shadow-sm">
              AI
            </span>
          </h1>
          <p className="text-[11px] font-mono text-cyber-dim tracking-wide">Threat Intel Matrix</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-cyber-dim font-mono">
          Security Console
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group relative flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'border-l-2 border-cyber-cyan bg-gradient-to-r from-cyan-500/15 via-blue-500/5 to-transparent text-cyan-300 font-semibold shadow-glow/40'
                    : 'text-cyber-muted hover:bg-cyber-card/80 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon
                      size={18}
                      className={isActive ? 'text-cyber-cyan' : 'text-cyber-muted group-hover:text-cyber-cyan transition-colors'}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="rounded-full bg-cyber-card px-2 py-0.5 text-xs font-mono text-cyber-muted border border-cyber-border">
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && (
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyber-cyan opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-cyber-cyan"></span>
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* AI Telemetry Footprint */}
      <div className="mb-4 rounded-2xl border border-cyber-border/80 bg-cyber-card/90 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-medium text-cyber-muted">
            <Cpu size={14} className="text-cyber-cyan" /> Neural RF Core
          </span>
          <span className="flex items-center gap-1 text-[11px] font-mono font-medium text-cyber-cyan">
            <span className="h-1.5 w-1.5 rounded-full bg-cyber-cyan animate-pulse"></span>
            v2.4 Online
          </span>
        </div>
        <div className="mt-2 text-xs text-cyber-dim">
          Benchmark precision: <span className="text-white font-semibold font-mono">94.7%</span>
        </div>
      </div>

      {/* Session Exit */}
      <div className="border-t border-cyber-border pt-4">
        <NavLink
          to="/login"
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-cyber-muted transition-colors hover:bg-cyber-danger/10 hover:text-cyber-danger"
        >
          <LogOut size={18} />
          <span>Exit Session</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;

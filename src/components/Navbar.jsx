import React from 'react';
import { useLocation } from 'react-router-dom';
import { User, Search, Menu, X, LayoutDashboard, ScanSearch, History, BarChart3, LogOut, Shield, Sun, Moon } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(true);

  const applyTheme = (isDark) => {
    document.documentElement.classList.toggle('dark', isDark);
  };

  React.useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    applyTheme(isDark);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    applyTheme(nextDark);
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Overview';
      case '/scanner': return 'Scanner';
      case '/history': return 'History';
      case '/analytics': return 'Analytics';
      default: return 'Workspace';
    }
  };

  return (
    <>
    <header className="flex h-14 w-full items-center justify-between border-b border-cyber-border bg-cyber-black px-4 md:px-6 shrink-0 z-10 sticky top-0">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-1 text-cyber-textMuted hover:text-cyber-white" onClick={() => setMobileMenuOpen(true)}>
          <Menu size={20} />
        </button>
        <h2 className="text-sm font-semibold text-cyber-white">
          {getPageTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-4 text-sm">
        
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-cyber-dark border border-cyber-border rounded-md text-cyber-textMuted cursor-text hover:border-sage-500/50 transition-colors mr-4" onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}>
          <Search className="w-3.5 h-3.5" />
          <span className="text-xs">Search...</span>
          <kbd className="ml-4 font-sans text-[10px] px-1.5 py-0.5 bg-cyber-cardHover rounded border border-cyber-border">⌘K</kbd>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-cyber-textMuted mr-2">
          <span className="text-xs">Model: <span className="font-mono text-cyber-white">v2.4</span></span>
          <span className="w-px h-3 bg-cyber-border" />
          <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-cyber-success/10 text-cyber-success font-medium">System Optimal</span>
        </div>

        <button 
          onClick={toggleTheme} 
          className="flex h-7 w-7 items-center justify-center rounded-md bg-cyber-dark border border-cyber-border text-cyber-textMuted hover:text-cyber-white hover:border-sage-500/50 transition-colors ml-2"
          title="Toggle Light/Dark Mode"
        >
          {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        <div className="flex items-center gap-2 text-cyber-textMuted hover:text-cyber-white transition-colors cursor-pointer ml-2">
          <span className="text-xs hidden sm:block font-medium">{user?.email || 'analyst@phishguards.sec'}</span>
          <div className="flex h-7 w-7 items-center justify-center rounded bg-cyber-dark border border-cyber-border">
            <User size={14} />
          </div>
        </div>
      </div>
    </header>

    <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-cyber-black/95 backdrop-blur-md md:hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-6 h-14 border-b border-cyber-border">
              <div className="flex items-center gap-2">
                <div className="bg-cyber-card rounded-[4px] p-1 border border-cyber-border">
                  <Shield className="h-4 w-4 text-sage-400" />
                </div>
                <h1 className="text-sm font-semibold tracking-tight text-cyber-white">PhishGuards</h1>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-cyber-textMuted hover:text-cyber-white">
                <X size={20} />
              </button>
            </div>
            
            <nav className="flex-1 px-4 py-6 space-y-2">
              <div className="px-2 pb-2 text-[10px] font-semibold text-cyber-textMuted uppercase tracking-widest">Platform</div>
              {[
                { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
                { to: "/scanner", label: "Scanner", icon: ScanSearch },
                { to: "/history", label: "Audit Log", icon: History },
                { to: "/analytics", label: "Analytics", icon: BarChart3 }
              ].map(item => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-3 text-base font-medium transition-colors ${isActive ? "bg-cyber-cardHover text-cyber-white" : "text-cyber-textMuted hover:bg-cyber-card"}`}
                  >
                    <Icon size={18} className="text-cyber-textMuted" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
              
              <div className="pt-6 mt-6 border-t border-cyber-border px-2">
                <NavLink to="/login" onClick={() => { logout(); setMobileMenuOpen(false); }} className="flex items-center gap-3 text-cyber-danger text-base font-medium">
                  <LogOut size={18} />
                  <span>Log out</span>
                </NavLink>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

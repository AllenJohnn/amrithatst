import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import URLScanner from './pages/URLScanner';
import ScanHistory from './pages/ScanHistory';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import SecurityReport from './pages/SecurityReport';
import { ScanProvider } from './context/ScanContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';
import CommandPalette from './components/CommandPalette';
import { AnimatePresence } from 'framer-motion';

function AppLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login' || location.pathname === '/';
  const isReportPage = location.pathname.startsWith('/report');

  if (isLoginPage) {
    return <Login />;
  }

  if (isReportPage) {
    return (
      <div className="w-full min-h-screen bg-cyber-black text-cyber-white selection:bg-cyber-accent/30 selection:text-cyber-white font-sans overflow-auto print:bg-white print:text-black">
        <Routes location={location} key={location.pathname}>
          <Route path="/report/:id" element={<SecurityReport />} />
        </Routes>
        <Toaster theme="dark" position="bottom-right" className="cyber-toaster print:hidden" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-cyber-black text-cyber-white selection:bg-cyber-accent/30 selection:text-cyber-white font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8 bg-cyber-black">
          <div className="max-w-7xl mx-auto h-full relative">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/scanner" element={<URLScanner />} />
                <Route path="/history" element={<ScanHistory />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/report/:id" element={<SecurityReport />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </AnimatePresence>
          </div>
        </main>
      </div>
      <CommandPalette />
      <Toaster position="bottom-right" className="cyber-toaster" toastOptions={{
        style: {
          background: 'var(--color-surface-1)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text-primary)',
        }
      }}/>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ScanProvider>
        <AppLayout />
      </ScanProvider>
    </AuthProvider>
  );
}

export default App;

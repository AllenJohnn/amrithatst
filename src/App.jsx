import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import URLScanner from './pages/URLScanner';
import ScanHistory from './pages/ScanHistory';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import { ScanProvider } from './context/ScanContext';

function AppLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return <Login />;
  }

  return (
    <div className="flex h-screen w-full bg-cyber-black text-cyber-white selection:bg-cyber-cyan/30 selection:text-white font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8 bg-cyber-black">
          <div className="max-w-7xl mx-auto h-full">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/scanner" element={<URLScanner />} />
              <Route path="/history" element={<ScanHistory />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ScanProvider>
      <AppLayout />
    </ScanProvider>
  );
}

export default App;

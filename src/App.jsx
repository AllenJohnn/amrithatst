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
    <div className="min-h-screen bg-cyber-black text-white selection:bg-cyber-green selection:text-black">
      <Sidebar />
      <div className="ml-64 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/scanner" element={<URLScanner />} />
            <Route path="/history" element={<ScanHistory />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
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

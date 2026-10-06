import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import URLScanner from './pages/URLScanner';
import ScanHistory from './pages/ScanHistory';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import { ScanProvider } from './context/ScanContext';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -10 }
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.25
};

const AnimatedPage = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
};

function AppLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
        </Routes>
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-black text-white selection:bg-cyber-cyan selection:text-black font-sans">
      <Sidebar />
      <div className="md:ml-64 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-4 md:p-8 lg:p-10 relative">
          {/* subtle noise/grid effect can be added here if needed */}
          <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
                <Route path="/scanner" element={<AnimatedPage><URLScanner /></AnimatedPage>} />
                <Route path="/history" element={<AnimatedPage><ScanHistory /></AnimatedPage>} />
                <Route path="/analytics" element={<AnimatedPage><Analytics /></AnimatedPage>} />
                <Route path="*" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
              </Routes>
            </AnimatePresence>
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

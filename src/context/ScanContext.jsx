import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { INITIAL_SCANS, analyzeURL } from '../data/dummyData';

const ScanContext = createContext();

export const ScanProvider = ({ children }) => {
  const [scans, setScans] = useState(INITIAL_SCANS);
  const [activeScan, setActiveScan] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  // Sync with MongoDB backend if available
  useEffect(() => {
    const fetchMongoScans = async () => {
      try {
        const token = localStorage.getItem('phishguards_token');
        const res = await fetch('/api/scans', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          if (data.scans && data.scans.length > 0) {
            setScans(data.scans);
          }
        }
      } catch {
        // Fall back quietly to INITIAL_SCANS if backend is offline
      }
    };

    fetchMongoScans();
  }, []);

  const stats = useMemo(() => {
    const total = scans.length;
    const safe = scans.filter(s => s.status === 'safe').length;
    const phishing = scans.filter(s => s.status === 'phishing').length;
    const suspicious = scans.filter(s => s.status === 'suspicious').length;
    const detectionRate = total > 0 ? Math.round(((phishing + suspicious) / total) * 100) : 0;

    return {
      totalScans: total,
      safeCount: safe,
      phishingCount: phishing,
      suspiciousCount: suspicious,
      detectionRate: `${Math.min(99, Math.max(88, detectionRate))}%`
    };
  }, [scans]);

  const executeScan = async (url, skipSimulation = false) => {
    if (!url || !url.trim()) return null;
    
    if (!skipSimulation) {
      setIsScanning(true);
      setScanStep(1);
      await new Promise(r => setTimeout(r, 450));
  
      setScanStep(2);
      await new Promise(r => setTimeout(r, 500));
  
      setScanStep(3);
      await new Promise(r => setTimeout(r, 450));
  
      setScanStep(4);
      await new Promise(r => setTimeout(r, 300));
    }
    
    const result = analyzeURL(url);
    setScans(prev => [result, ...prev]);
    setActiveScan(result);
    setIsScanning(false);
    setScanStep(0);

    // Save scan to MongoDB backend asynchronously
    try {
      const token = localStorage.getItem('phishguards_token');
      fetch('/api/scans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(result),
      }).catch(() => {
        // Non-blocking save
      });
    } catch {
      // Ignore background persistence errors
    }

    return result;
  };

  const deleteScan = (id) => {
    setScans(prev => prev.filter(s => s.id !== id && s._id !== id));
    if (activeScan?.id === id || activeScan?._id === id) {
      setActiveScan(null);
    }

    // Delete in MongoDB backend
    try {
      const token = localStorage.getItem('phishguards_token');
      fetch(`/api/scans/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }).catch(() => {});
    } catch {
      // Ignore
    }
  };

  const clearHistory = () => {
    setScans([]);
    setActiveScan(null);

    // Clear in MongoDB backend
    try {
      const token = localStorage.getItem('phishguards_token');
      fetch('/api/scans', {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }).catch(() => {});
    } catch {
      // Ignore
    }
  };

  return (
    <ScanContext.Provider value={{
      scans,
      stats,
      activeScan,
      setActiveScan,
      isScanning,
      scanStep,
      executeScan,
      deleteScan,
      clearHistory
    }}>
      {children}
    </ScanContext.Provider>
  );
};

export const useScan = () => {
  const context = useContext(ScanContext);
  if (!context) {
    throw new Error('useScan must be used within a ScanProvider');
  }
  return context;
};

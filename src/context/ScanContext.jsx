import React, { createContext, useContext, useState, useMemo } from 'react';
import { INITIAL_SCANS, analyzeURL } from '../data/dummyData';

const ScanContext = createContext();

export const ScanProvider = ({ children }) => {
  const [scans, setScans] = useState(INITIAL_SCANS);
  const [activeScan, setActiveScan] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);

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
    return result;
  };

  const deleteScan = (id) => {
    setScans(prev => prev.filter(s => s.id !== id));
    if (activeScan?.id === id) {
      setActiveScan(null);
    }
  };

  const clearHistory = () => {
    setScans([]);
    setActiveScan(null);
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

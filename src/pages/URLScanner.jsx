import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Terminal,
  ArrowRight,
  Globe,
  Loader2,
  Activity,
  Cpu,
  Clock,
  History,
  FileText,
  X,
  Target,
  Search,
  Lock,
  Unlock,
  CornerDownRight,
  Gauge
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScan } from '../context/ScanContext';
import PageTransition from '../components/PageTransition';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { cn } from '../utils';

export default function URLScanner() {
  const { activeScan, scans, executeScan: contextExecuteScan } = useScan();
  const [url, setUrl] = useState('');
  const [scanState, setScanState] = useState('IDLE'); // IDLE, VALIDATING, ANALYZING, RESULT
  const [analyzingStep, setAnalyzingStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const recentScans = scans.slice(0, 4);

  const steps = [
    "Parsing URL structure",
    "Extracting lexical features",
    "Evaluating domain characteristics",
    "Running classification model",
    "Calculating confidence score"
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'phishing': return 'text-cyber-danger';
      case 'suspicious': return 'text-cyber-warning';
      case 'safe': return 'text-cyber-success';
      default: return 'text-cyber-textMuted';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'phishing': return 'bg-cyber-danger/10 border-cyber-danger/20';
      case 'suspicious': return 'bg-cyber-warning/10 border-cyber-warning/20';
      case 'safe': return 'bg-cyber-success/10 border-cyber-success/20';
      default: return 'bg-cyber-cardHover border-cyber-border';
    }
  };

  const executeScan = (targetUrl) => {
    if (!targetUrl.trim()) return;
    setUrl(targetUrl);
    setScanState('VALIDATING');
    setAnalyzingStep(0);

    // Simulate validation
    setTimeout(() => {
      setScanState('ANALYZING');
      
      // Simulate analyzing steps
      let step = 0;
      const interval = setInterval(() => {
        step++;
        setAnalyzingStep(step);
        if (step >= steps.length) {
          clearInterval(interval);
          setTimeout(() => {
            contextExecuteScan(targetUrl, true);
            setScanState('RESULT');
          }, 300);
        }
      }, 400); // 400ms per step
    }, 600);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeScan?.url || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (activeScan && scanState === 'IDLE') {
      setUrl(activeScan.url);
      setScanState('RESULT');
    }
  }, [activeScan, scanState]);

  return (
    <PageTransition>
      <div className="flex flex-col lg:flex-row gap-6 max-w-[1400px] mx-auto min-h-[calc(100vh-140px)] pb-12">
        
        {/* LEFT COLUMN - WORKSPACE */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-cyber-dark rounded-lg border border-cyber-border/60 p-6 sm:p-8 flex-shrink-0 shadow-sm">
            <h1 className="text-2xl font-semibold text-cyber-white tracking-tight flex items-center gap-3 mb-2">
              <Search className="text-cyber-textMuted" size={24} />
              URL Analysis
            </h1>
            <p className="text-sm text-cyber-textMuted mb-6">
              Submit a URL for real-time lexical analysis and threat classification.
            </p>
            
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-cyber-textMuted group-focus-within:text-cyber-white transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-12 py-4 bg-cyber-card border-2 border-[#222] rounded-lg text-cyber-white font-mono text-sm placeholder:text-[#555] placeholder:font-sans focus:ring-0 focus:border-[#444] transition-all outline-none"
                placeholder="Enter URL to scan (e.g., https://paypal-login-update.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && scanState !== 'ANALYZING' && scanState !== 'VALIDATING' && executeScan(url)}
                disabled={scanState === 'ANALYZING' || scanState === 'VALIDATING'}
              />
              {url && scanState !== 'ANALYZING' && scanState !== 'VALIDATING' && (
                <button 
                  className="absolute inset-y-0 right-14 flex items-center pr-2 text-cyber-textMuted hover:text-cyber-white transition-colors"
                  onClick={() => {
                    setUrl('');
                    setScanState('IDLE');
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <div className="absolute inset-y-0 right-2 flex items-center">
                <Button 
                  onClick={() => executeScan(url)}
                  disabled={!url || scanState === 'ANALYZING' || scanState === 'VALIDATING'}
                  className="h-10 px-4 bg-cyber-white text-cyber-black hover:opacity-90 transition-colors rounded"
                >
                  {(scanState === 'ANALYZING' || scanState === 'VALIDATING') ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            {scanState === 'IDLE' && (
              <div className="mt-8 flex gap-3 flex-wrap">
                <span className="text-[10px] text-cyber-textMuted font-semibold uppercase tracking-widest mt-2 mr-2">Try a sample</span>
                <Button variant="outline" size="sm" className="text-xs border-cyber-border hover:border-cyber-borderSubtle bg-cyber-card" onClick={() => executeScan('https://github.com')}>github.com</Button>
                <Button variant="outline" size="sm" className="text-xs border-cyber-border hover:border-cyber-borderSubtle bg-cyber-card" onClick={() => executeScan('http://paypal-security-update.account-verification-login.xyz')}>paypal-security-update.xyz</Button>
              </div>
            )}
          </div>

          <div className="flex-1 bg-cyber-dark rounded-lg border border-cyber-border/60 p-6 sm:p-8 shadow-sm flex flex-col relative overflow-hidden">
            <AnimatePresence mode="wait">
              {scanState === 'IDLE' && (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center flex-1 text-cyber-textMuted opacity-50"
                >
                  <Terminal className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-sm font-medium">Awaiting Input Payload</p>
                </motion.div>
              )}

              {(scanState === 'VALIDATING' || scanState === 'ANALYZING') && (
                <motion.div 
                  key="analyzing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col flex-1 max-w-lg mx-auto w-full pt-12"
                >
                  <div className="text-sm font-mono text-cyber-white mb-8 truncate">{url}</div>
                  
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-cyber-border/50 before:to-transparent">
                    {steps.map((step, idx) => {
                      const isActive = analyzingStep === idx;
                      const isComplete = analyzingStep > idx;
                      return (
                        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className={cn(
                            "flex items-center justify-center w-5 h-5 rounded-full border-2 bg-cyber-dark shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors duration-300 z-10",
                            isActive ? "border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]" : isComplete ? "border-sage-500" : "border-cyber-borderSubtle"
                          )}>
                            {isComplete && <CheckCircle2 className="w-3 h-3 text-sage-500" />}
                            {isActive && <motion.div animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                          </div>
                          <div className={cn(
                            "w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-3 rounded border transition-all duration-300",
                            isActive ? "border-blue-500/30 bg-blue-500/5 text-cyber-white" : isComplete ? "border-sage-500/20 bg-sage-500/5 text-cyber-dim" : "border-transparent text-cyber-textMuted"
                          )}>
                            <span className="text-xs font-mono">{step}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {scanState === 'RESULT' && activeScan && (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col flex-1"
                >
                  <div className="flex flex-col sm:flex-row gap-6 mb-8">
                    <div className={cn(
                      "flex-shrink-0 flex flex-col items-center justify-center p-6 rounded-lg border w-full sm:w-[240px]",
                      getStatusBgColor(activeScan.status)
                    )}>
                      <div className="text-[10px] font-semibold uppercase tracking-widest text-cyber-textMuted mb-2">Risk Score</div>
                      <div className="relative flex items-center justify-center mb-2">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-black/20" />
                          <motion.circle 
                            cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" 
                            strokeDasharray="251.2"
                            initial={{ strokeDashoffset: 251.2 }}
                            animate={{ strokeDashoffset: 251.2 - (251.2 * activeScan.riskScore) / 100 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className={getStatusColor(activeScan.status)}
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                          <span className={cn("text-3xl font-mono font-medium tracking-tighter", getStatusColor(activeScan.status))}>
                            {activeScan.riskScore}
                          </span>
                        </div>
                      </div>
                      <div className={cn("text-sm font-semibold uppercase tracking-widest", getStatusColor(activeScan.status))}>
                        {activeScan.status}
                      </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center gap-4">
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-widest text-cyber-textMuted mb-1">Target URL</div>
                        <div className="flex items-center gap-2">
                          {activeScan.features.hasHttps ? <Lock size={14} className="text-sage-500" /> : <Unlock size={14} className="text-cyber-danger" />}
                          <span className="text-base text-cyber-white font-mono break-all">{activeScan.url}</span>
                          <button onClick={handleCopy} className="p-1.5 hover:bg-cyber-cardActive rounded transition-colors text-cyber-textMuted hover:text-cyber-white" title="Copy URL">
                            {copied ? <CheckCircle2 size={14} className="text-sage-500" /> : <Copy size={14} />}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                        <div>
                          <div className="text-[10px] font-semibold uppercase tracking-widest text-cyber-textMuted mb-1">Domain</div>
                          <div className="text-xs text-cyber-white font-mono truncate">{activeScan.domain}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold uppercase tracking-widest text-cyber-textMuted mb-1">Confidence</div>
                          <div className="text-xs text-cyber-white font-mono">{activeScan.confidence}%</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold uppercase tracking-widest text-cyber-textMuted mb-1">IP Target</div>
                          <div className="text-xs text-cyber-white font-mono">{activeScan.features.hasIp ? 'Yes' : 'No'}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold uppercase tracking-widest text-cyber-textMuted mb-1">TLD</div>
                          <div className="text-xs text-cyber-white font-mono">{activeScan.features.tldRisk}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-[10px] font-semibold uppercase tracking-widest text-cyber-textMuted border-b border-cyber-border/50 pb-2 mb-3">Analysis Explanation</h3>
                      <p className="text-sm text-cyber-dim leading-relaxed font-medium">
                        {activeScan.aiExplanation}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-cyber-textMuted border-b border-cyber-border/50 pb-2 mb-3">Extracted Features</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center bg-cyber-card p-2.5 rounded border border-cyber-border">
                            <span className="text-xs text-cyber-textMuted">URL Length</span>
                            <span className={cn("text-xs font-mono font-medium", activeScan.features.urlLength > 65 ? "text-amber-400" : "text-cyber-white")}>{activeScan.features.urlLength} chars</span>
                          </div>
                          <div className="flex justify-between items-center bg-cyber-card p-2.5 rounded border border-cyber-border">
                            <span className="text-xs text-cyber-textMuted">Subdomains</span>
                            <span className={cn("text-xs font-mono font-medium", activeScan.features.subdomainsCount > 2 ? "text-amber-400" : "text-cyber-white")}>{activeScan.features.subdomainsCount}</span>
                          </div>
                          <div className="flex justify-between items-center bg-cyber-card p-2.5 rounded border border-cyber-border">
                            <span className="text-xs text-cyber-textMuted">Suspicious Tokens</span>
                            <span className={cn("text-xs font-mono font-medium", activeScan.features.suspiciousWords?.length > 0 ? "text-cyber-danger" : "text-cyber-white")}>
                              {activeScan.features.suspiciousWords?.length > 0 ? activeScan.features.suspiciousWords.join(", ") : "None"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center bg-cyber-card p-2.5 rounded border border-cyber-border">
                            <span className="text-xs text-cyber-textMuted">Special Characters</span>
                            <span className="text-xs font-mono font-medium text-cyber-white">{activeScan.features.dotsCount + activeScan.features.hyphensCount}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col h-full">
                        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-cyber-textMuted border-b border-cyber-border/50 pb-2 mb-3">Recommendation</h3>
                        <div className={cn(
                          "flex-1 rounded-md p-4 flex flex-col justify-center border",
                          activeScan.status === 'phishing' ? "bg-cyber-danger/5 border-cyber-danger/20" :
                          activeScan.status === 'suspicious' ? "bg-cyber-warning/5 border-cyber-warning/20" :
                          "bg-cyber-success/5 border-cyber-success/20"
                        )}>
                          <div className="flex items-start gap-3">
                            {activeScan.status === 'phishing' ? <ShieldAlert className="text-cyber-danger mt-0.5 shrink-0" size={18} /> :
                             activeScan.status === 'suspicious' ? <AlertTriangle className="text-cyber-warning mt-0.5 shrink-0" size={18} /> :
                             <ShieldCheck className="text-cyber-success mt-0.5 shrink-0" size={18} />}
                            <p className="text-sm font-medium text-cyber-white leading-relaxed">
                              {activeScan.recommendation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT COLUMN - SIDEBAR */}
        <div className="w-full lg:w-[320px] flex flex-col gap-6 flex-shrink-0">
          <Card className="bg-cyber-dark border-cyber-border/60 shadow-sm">
            <CardHeader className="p-5 pb-3 border-b border-cyber-border/30">
              <CardTitle className="text-xs uppercase tracking-widest font-semibold flex items-center gap-2 text-cyber-textMuted">
                <History size={14} />
                Recent Analyses
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col divide-y divide-cyber-border/30">
                {recentScans.length > 0 ? recentScans.map(scan => (
                  <div 
                    key={scan.id} 
                    onClick={() => {
                      setUrl(scan.url);
                      setScanState('IDLE');
                      setTimeout(() => executeScan(scan.url), 50);
                    }}
                    className="flex flex-col gap-2 p-4 hover:bg-cyber-cardHover transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-cyber-dim truncate max-w-[180px] group-hover:text-cyber-white transition-colors">{scan.domain}</span>
                      <span className={cn("text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border", getStatusBgColor(scan.status), getStatusColor(scan.status))}>
                        {scan.riskScore}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-cyber-textMuted uppercase tracking-widest">{scan.status}</span>
                      <span className="text-[10px] text-cyber-textMuted font-mono">{scan.timestamp}</span>
                    </div>
                  </div>
                )) : (
                  <div className="p-6 text-center text-xs text-cyber-textMuted">No recent scans.</div>
                )}
              </div>
            </CardContent>
          </Card>

          {scanState === 'RESULT' && activeScan && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-6"
            >
              <Card className="bg-cyber-dark border-cyber-border/60 shadow-sm">
                <CardContent className="p-5 flex flex-col gap-4">
                  <h2 className="text-[10px] font-semibold text-cyber-white uppercase tracking-widest border-l-2 border-[#3b82f6] pl-2">System Telemetry</h2>
                  <div className="flex flex-col gap-3 text-xs mt-1">
                    <div className="flex justify-between items-center pb-2 border-b border-cyber-border/30">
                      <span className="text-cyber-textMuted">Engine</span>
                      <span className="text-cyber-white font-mono">RF v2.4</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-cyber-border/30">
                      <span className="text-cyber-textMuted">Vector Dimensions</span>
                      <span className="text-cyber-white font-mono">24</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-cyber-textMuted">Inference Latency</span>
                      <span className="text-cyber-white font-mono">34ms</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Button className="w-full text-xs font-medium bg-cyber-cardHover hover:bg-cyber-cardActive border border-cyber-border text-cyber-white transition-colors" onClick={() => {
                navigate('/report/' + activeScan.id);
              }}>
                <FileText className="mr-2 h-3.5 w-3.5" />
                Open Full Report
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

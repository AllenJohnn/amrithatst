import React, { useState } from 'react';
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
  Loader2
} from 'lucide-react';
import { useScan } from '../context/ScanContext';
import { cn } from '../utils';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';
import { toast } from 'sonner';
import PageTransition from '../components/PageTransition';

export default function URLScanner() {
  const { activeScan, executeScan, isScanning, scanStep } = useScan();
  const [url, setUrl] = useState('');

  const handleScan = async (e) => {
    e.preventDefault();
    if (!url) return;
    
    // reset url after slight delay if needed, or keep it.
    await executeScan(url);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('URL copied to clipboard');
  };

  const scanStages = [
    { step: 1, label: "Resolving DNS & IP" },
    { step: 2, label: "Lexical Extraction" },
    { step: 3, label: "Evaluating Model" },
    { step: 4, label: "Synthesizing Report" }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'phishing': return 'text-red-400';
      case 'suspicious': return 'text-amber-400';
      default: return 'text-green-400';
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'phishing': return 'destructive';
      case 'suspicious': return 'warning';
      default: return 'success';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'phishing': return <ShieldAlert className="h-5 w-5" />;
      case 'suspicious': return <AlertTriangle className="h-5 w-5" />;
      default: return <ShieldCheck className="h-5 w-5" />;
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto h-full">
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex flex-col gap-2 mb-2">
            <h1 className="text-2xl font-semibold tracking-tight text-white">Security Scanner</h1>
            <p className="text-sm text-cyber-textMuted max-w-xl">
              Evaluate URLs for malicious patterns using our machine-learning engine.
            </p>
          </div>

          <form onSubmit={handleScan} className="relative group">
            <div className="flex items-center gap-2 p-1.5 rounded-lg border border-cyber-border bg-[#0F0F0F] transition-all focus-within:border-sage-500 focus-within:ring-1 focus-within:ring-sage-500/50 shadow-sm">
              <Globe className="h-5 w-5 text-cyber-textMuted ml-3 shrink-0" />
              <input
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isScanning}
                className="flex-1 bg-transparent border-0 py-2.5 px-2 text-sm text-white placeholder:text-cyber-textMuted focus:outline-none focus:ring-0 disabled:opacity-50"
              />
              <Button type="submit" disabled={isScanning || !url} className="h-9 px-4 shrink-0 transition-all">
                {isScanning ? (
                  <Loader2 className="h-4 w-4 animate-spin text-[#090909]" />
                ) : (
                  <>
                    Scan <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>

          <AnimatePresence mode="popLayout">
            {isScanning && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="rounded-lg border border-cyber-border bg-[#0F0F0F] p-6 shadow-sm overflow-hidden relative"
              >
                <div className="absolute top-0 left-0 h-1 bg-sage-500/20 w-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-sage-500" 
                    initial={{ width: "0%" }}
                    animate={{ width: `${(scanStep / 4) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="flex flex-col gap-5 mt-2">
                  {scanStages.map((stage) => {
                    const isDone = scanStep > stage.step;
                    const isCurrent = scanStep === stage.step;
                    const isPending = scanStep < stage.step;
                    
                    return (
                      <div key={stage.step} className={cn(
                        "flex items-center gap-4 text-sm transition-all duration-300",
                        isPending ? "opacity-40" : "opacity-100"
                      )}>
                        <div className="shrink-0 flex items-center justify-center w-6 h-6">
                          {isDone ? (
                            <CheckCircle2 className="h-5 w-5 text-sage-500" />
                          ) : isCurrent ? (
                            <Loader2 className="h-5 w-5 text-white animate-spin" />
                          ) : (
                            <div className="h-2 w-2 rounded-full bg-cyber-border" />
                          )}
                        </div>
                        <span className={cn("font-medium", isCurrent ? "text-white" : "text-cyber-textMuted")}>
                          {stage.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {!isScanning && activeScan && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-6"
              >
                <Card className="overflow-hidden border-cyber-border bg-[#0F0F0F]">
                  <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start gap-8 border-b border-cyber-border bg-[#0F0F0F]">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Badge variant={getStatusBadgeVariant(activeScan.status)} className="px-3 py-1 uppercase tracking-widest text-[10px]">
                          {activeScan.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-3 bg-[#1A1A1A] border border-cyber-border rounded-md px-3 py-2 max-w-xl group">
                        <span className="font-mono text-sm text-white truncate flex-1 selection:bg-sage-500/30">
                          {activeScan.url}
                        </span>
                        <button
                          onClick={() => handleCopy(activeScan.url)}
                          className="p-1.5 text-cyber-textMuted hover:text-white transition-colors rounded hover:bg-[#2A2A2A] opacity-0 group-hover:opacity-100"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-xs text-cyber-textMuted font-mono uppercase tracking-wider mb-2 block">Risk Score</span>
                      <div className="flex items-baseline gap-1">
                        <span className={cn("text-5xl font-semibold tracking-tighter", getStatusColor(activeScan.status))}>
                          {activeScan.riskScore}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8 bg-[#0F0F0F]">
                    <div className="space-y-3">
                      <span className="text-xs font-semibold text-white uppercase tracking-wider">Analysis</span>
                      <p className="text-sm text-cyber-textMuted leading-relaxed">
                        {activeScan.aiExplanation}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <span className="text-xs font-semibold text-white uppercase tracking-wider">Recommendation</span>
                      <div className="flex items-start gap-3 text-sm text-cyber-textMuted bg-[#1A1A1A] p-4 rounded-md border border-cyber-border">
                        <Terminal size={16} className="mt-0.5 shrink-0" />
                        <p className="leading-relaxed">{activeScan.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-[320px] flex flex-col gap-6">
          <AnimatePresence>
            {!isScanning && activeScan && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col gap-6"
              >
                <Card className="bg-[#0F0F0F]">
                  <CardContent className="p-5 flex flex-col gap-4">
                    <h2 className="text-xs font-semibold text-white uppercase tracking-wider">Analysis Metadata</h2>
                    <div className="flex justify-between items-center py-2 border-b border-cyber-border/50 text-sm">
                      <span className="text-cyber-textMuted">Engine</span>
                      <span className="text-white">Random Forest (v2.4)</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-cyber-border/50 text-sm">
                      <span className="text-cyber-textMuted">Confidence</span>
                      <span className="text-white font-mono">{activeScan.confidence}%</span>
                    </div>
                    <div className="flex justify-between items-center py-2 text-sm">
                      <span className="text-cyber-textMuted">Latency</span>
                      <span className="text-white font-mono">124ms</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#0F0F0F]">
                  <CardContent className="p-5 flex flex-col gap-4">
                    <h2 className="text-xs font-semibold text-white uppercase tracking-wider">Extracted Features</h2>
                    
                    <div className="flex flex-col gap-2.5 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-cyber-textMuted">URL Length</span>
                        <span className="text-white font-mono">{activeScan.features.urlLength}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-cyber-textMuted">Entropy</span>
                        <span className="text-white font-mono">{activeScan.riskScore > 50 ? 'High' : 'Normal'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-cyber-textMuted">HTTPS</span>
                        <span className={activeScan.features.hasHttps ? "text-green-400" : "text-red-400"}>
                          {activeScan.features.hasHttps ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-cyber-textMuted">Suspicious Tokens</span>
                        <span className="text-white font-mono">{activeScan.features.suspiciousWords?.length || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-cyber-textMuted">Host Pattern</span>
                        <span className={activeScan.features.hasIp ? "text-red-400 font-mono" : "text-white font-mono"}>
                          {activeScan.features.hasIp ? 'IP Address' : 'Domain'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}

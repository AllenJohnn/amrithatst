import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Copy,
  Sparkles,
  Terminal,
  Layers,
  Globe,
  Radio,
} from 'lucide-react';
import { useScan } from '../context/ScanContext';
import URLInput from '../components/URLInput';
import ThreatBadge from '../components/ThreatBadge';
import { cn } from '../utils';

const URLScanner = () => {
  const { activeScan, executeScan, isScanning, scanStep } = useScan();
  const [copied, setCopied] = useState(false);

  const handleScan = async (url) => {
    await executeScan(url);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scanStages = [
    { step: 1, label: "Resolving DNS & Host IP" },
    { step: 2, label: "Extracting Lexical Features" },
    { step: 3, label: "Running RF Classifier" },
    { step: 4, label: "Synthesizing Report" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-5xl mx-auto pb-12"
    >
      {/* Header */}
      <div className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 rounded border border-cyber-cyan/30 bg-cyber-cyan/10 px-3 py-1 text-[10px] uppercase font-mono tracking-widest text-cyber-cyan">
          <Sparkles size={14} />
          <span>Neural Analysis Engine</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
          Deep URL Scanner
        </h1>
        <p className="text-sm text-cyber-muted max-w-2xl mx-auto leading-relaxed">
          Deconstruct untrusted hyperlinks. Our multi-stage pipeline executes lexical analysis, reputation scoring, and Random Forest probability inference.
        </p>
      </div>

      {/* Input Section */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-cyan/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <URLInput onScan={handleScan} isScanning={isScanning} />
      </div>

      <AnimatePresence mode="wait">
        {isScanning && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-panel rounded-2xl p-10 text-center space-y-8 relative overflow-hidden border-cyber-cyan/30"
          >
            <div className="absolute inset-0 bg-cyber-cyan/5 animate-pulse" />
            
            <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-dashed border-cyber-cyan/50 shadow-[0_0_30px_rgba(0,229,255,0.2)]">
              <div className="absolute inset-2 rounded-full border border-cyber-cyan/30 animate-[spin_4s_linear_infinite]" />
              <Radio className="h-10 w-10 text-cyber-cyan animate-pulse" />
            </div>

            <div className="space-y-2 relative">
              <h3 className="text-lg font-bold text-white font-mono tracking-wider">
                ANALYZING TARGET
              </h3>
              <p className="text-sm text-cyber-cyan font-mono">
                {scanStages.find(s => s.step === scanStep)?.label || "Evaluating threat vectors"}...
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto relative">
              {scanStages.map((stage) => {
                const isDone = scanStep > stage.step;
                const isCurrent = scanStep === stage.step;
                return (
                  <div
                    key={stage.step}
                    className={cn(
                      "rounded-lg border p-4 text-left transition-all duration-500 flex flex-col justify-between h-24",
                      isDone ? "border-cyber-cyan/40 bg-cyber-cyan/10" : 
                      isCurrent ? "border-cyber-cyan shadow-[0_0_15px_rgba(0,229,255,0.2)] bg-cyber-cyan/5 scale-105" : 
                      "border-cyber-border/50 bg-cyber-dark/30 opacity-50"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {isDone ? (
                        <CheckCircle2 size={16} className="text-cyber-cyan" />
                      ) : (
                        <span className={cn("text-xs font-mono font-bold", isCurrent ? "text-cyber-cyan" : "text-cyber-dim")}>0{stage.step}</span>
                      )}
                    </div>
                    <div className={cn(
                      "text-xs font-medium font-mono leading-tight",
                      isDone || isCurrent ? "text-white" : "text-cyber-dim"
                    )}>
                      {stage.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {!isScanning && activeScan && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="space-y-6"
          >
            {/* Verdict Card */}
            <div className={cn(
              "relative overflow-hidden rounded-2xl border p-8 backdrop-blur-xl transition-all duration-500",
              activeScan.status === 'phishing'
                ? "border-cyber-danger/50 bg-cyber-danger/5 shadow-[0_0_30px_rgba(244,63,94,0.1)]"
                : activeScan.status === 'suspicious'
                ? "border-cyber-warning/50 bg-cyber-warning/5 shadow-[0_0_30px_rgba(245,158,11,0.1)]"
                : "border-cyber-mint/50 bg-cyber-mint/5 shadow-[0_0_30px_rgba(16,185,129,0.1)]"
            )}>
              <div className="flex flex-col md:flex-row gap-8 justify-between">
                <div className="space-y-6 flex-1">
                  <div className="flex items-center gap-3">
                    <ThreatBadge status={activeScan.status} />
                    <span className="text-[10px] text-cyber-muted font-mono uppercase tracking-wider">REF: {activeScan.id}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    {activeScan.status === 'phishing' ? (
                      <ShieldAlert className="text-cyber-danger h-12 w-12 shrink-0" />
                    ) : activeScan.status === 'suspicious' ? (
                      <AlertTriangle className="text-cyber-warning h-12 w-12 shrink-0" />
                    ) : (
                      <ShieldCheck className="text-cyber-mint h-12 w-12 shrink-0" />
                    )}
                    <h2 className={cn(
                      "text-3xl md:text-4xl font-bold tracking-tight",
                      activeScan.status === 'phishing' ? "text-cyber-danger" : 
                      activeScan.status === 'suspicious' ? "text-cyber-warning" : "text-cyber-mint"
                    )}>
                      {activeScan.status === 'phishing' ? "PHISHING DETECTED" : 
                       activeScan.status === 'suspicious' ? "SUSPICIOUS TARGET" : "VERIFIED SAFE"}
                    </h2>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-cyber-border/80 bg-cyber-dark/80 p-3 shadow-inner max-w-2xl">
                    <Globe size={18} className="text-cyber-muted shrink-0 ml-1" />
                    <span className="font-mono text-sm text-slate-200 truncate flex-1">
                      {activeScan.url}
                    </span>
                    <button
                      onClick={() => handleCopy(activeScan.url)}
                      className="p-2 text-cyber-muted hover:text-cyber-cyan transition-colors rounded-lg hover:bg-white/5 relative"
                      title="Copy URL"
                    >
                      <Copy size={16} />
                      {copied && (
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-cyber-cyan text-black text-[10px] px-2 py-1 rounded font-bold">
                          COPIED
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center rounded-2xl border border-cyber-border/80 bg-cyber-dark/80 p-6 min-w-[200px] shadow-lg shrink-0 relative overflow-hidden">
                  <div className={cn(
                    "absolute top-0 left-0 w-full h-1",
                    activeScan.riskScore > 70 ? "bg-cyber-danger" : 
                    activeScan.riskScore > 35 ? "bg-cyber-warning" : "bg-cyber-mint"
                  )} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-cyber-dim font-mono mb-2">
                    RISK SCORE
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className={cn(
                      "font-mono text-5xl font-bold tracking-tighter",
                      activeScan.riskScore > 70 ? "text-cyber-danger" : 
                      activeScan.riskScore > 35 ? "text-cyber-warning" : "text-cyber-mint"
                    )}>
                      {activeScan.riskScore}
                    </span>
                    <span className="text-lg text-cyber-muted font-mono">/100</span>
                  </div>
                  <div className="text-[11px] text-cyber-muted mt-2 font-mono uppercase tracking-wider">
                    Confidence: <span className="text-white font-bold">{activeScan.confidence}%</span>
                  </div>
                </div>
              </div>

              {/* Recommendation Banner */}
              <div className={cn(
                "mt-8 rounded-xl border p-4 text-xs font-mono flex items-start sm:items-center gap-3",
                activeScan.status === 'phishing'
                  ? "border-cyber-danger/30 bg-cyber-danger/10 text-cyber-danger"
                  : activeScan.status === 'suspicious'
                  ? "border-cyber-warning/30 bg-cyber-warning/10 text-cyber-warning"
                  : "border-cyber-mint/30 bg-cyber-mint/10 text-cyber-mint"
              )}>
                <Terminal size={18} className="shrink-0 mt-0.5 sm:mt-0" />
                <span><strong className="tracking-wider">DIRECTIVE:</strong> {activeScan.recommendation}</span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Explainable AI */}
              <div className="glass-panel rounded-2xl p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyber-violet/10 text-cyber-violet border border-cyber-violet/20">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">AI Explainability</h3>
                    <p className="text-[11px] text-cyber-muted uppercase tracking-wider font-mono mt-0.5">Model Reasoning</p>
                  </div>
                </div>

                <div className="rounded-xl border border-cyber-border/50 bg-cyber-dark/50 p-4 text-sm leading-relaxed text-slate-300">
                  {activeScan.aiExplanation}
                </div>

                <div className="space-y-3 text-xs pt-2">
                  <p className="font-semibold text-cyber-dim uppercase tracking-wider font-mono text-[10px]">Behavioral Flags</p>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-center gap-3 bg-white/5 p-2 rounded-lg border border-white/5">
                      {activeScan.features.hasIp ? (
                        <XCircle size={16} className="text-cyber-danger shrink-0" />
                      ) : (
                        <CheckCircle2 size={16} className="text-cyber-mint shrink-0" />
                      )}
                      <span>{activeScan.features.hasIp ? "Raw IP address used (High Risk)" : "Standard Domain Host"}</span>
                    </li>
                    <li className="flex items-center gap-3 bg-white/5 p-2 rounded-lg border border-white/5">
                      {!activeScan.features.hasHttps ? (
                        <XCircle size={16} className="text-cyber-danger shrink-0" />
                      ) : (
                        <CheckCircle2 size={16} className="text-cyber-mint shrink-0" />
                      )}
                      <span>{activeScan.features.hasHttps ? "HTTPS TLS Encrypted" : "Insecure Plaintext HTTP"}</span>
                    </li>
                    <li className="flex items-center gap-3 bg-white/5 p-2 rounded-lg border border-white/5">
                      {activeScan.features.hasSuspiciousWords ? (
                        <XCircle size={16} className="text-cyber-danger shrink-0" />
                      ) : (
                        <CheckCircle2 size={16} className="text-cyber-mint shrink-0" />
                      )}
                      <span>
                        Tokens: {activeScan.features.suspiciousWords?.length > 0
                          ? <span className="text-cyber-warning">{activeScan.features.suspiciousWords.join(", ")}</span>
                          : "None detected"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Extracted Features */}
              <div className="glass-panel rounded-2xl p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20">
                    <Layers size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Extracted Features</h3>
                    <p className="text-[11px] text-cyber-muted uppercase tracking-wider font-mono mt-0.5">Heuristic Inputs</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-cyber-muted uppercase tracking-wider text-[10px]">URL Length</span>
                    <span className="text-white font-semibold">{activeScan.features.urlLength} chars</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-cyber-muted uppercase tracking-wider text-[10px]">Dots (.)</span>
                    <span className="text-white font-semibold">{activeScan.features.dotsCount}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-cyber-muted uppercase tracking-wider text-[10px]">Hyphens (-)</span>
                    <span className="text-white font-semibold">{activeScan.features.hyphensCount}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-cyber-muted uppercase tracking-wider text-[10px]">Subdomains</span>
                    <span className="text-white font-semibold">{activeScan.features.subdomainsCount}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-cyber-muted uppercase tracking-wider text-[10px]">TLD</span>
                    <span className="text-cyber-cyan font-semibold">{activeScan.features.tldRisk}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-cyber-muted uppercase tracking-wider text-[10px]">Host</span>
                    <span className="text-white font-semibold truncate max-w-[150px]">{activeScan.domain}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default URLScanner;

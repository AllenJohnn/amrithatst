import React, { useState } from 'react';
import {
  ScanSearch,
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
    { step: 1, label: "Resolving DNS & Host IP..." },
    { step: 2, label: "Extracting 16 Lexical & Domain Features..." },
    { step: 3, label: "Running Random Forest ML Classifier..." },
    { step: 4, label: "Synthesizing Explainable AI Report..." }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Page Title & Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-mono text-cyan-300 shadow-sm">
          <Sparkles size={14} className="text-cyan-400" />
          <span>NEURAL PHISHING RADAR</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          Deep URL Threat Scanner
        </h1>
        <p className="text-sm sm:text-base text-cyber-muted max-w-2xl mx-auto leading-relaxed">
          Inspect and deconstruct untrusted hyperlinks. Our multi-stage pipeline executes lexical entropy analysis, TLD reputation scoring, and Random Forest probability inference.
        </p>
      </div>

      {/* Input Card */}
      <div className="rounded-3xl border border-cyber-border/90 bg-cyber-card/85 p-7 shadow-glow backdrop-blur-xl">
        <URLInput onScan={handleScan} isScanning={isScanning} />
      </div>

      {/* Scanning In-Progress Hologram / Radar */}
      {isScanning && (
        <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-cyber-card/95 p-10 shadow-glow-lg text-center space-y-7 backdrop-blur-xl">
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl" />
          
          <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-cyan-400 bg-cyan-500/10 shadow-glow">
            <Radio className="h-12 w-12 text-cyan-300 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white font-mono tracking-wider">
              [ANALYZING TARGET HYPERLINK]
            </h3>
            <p className="text-sm font-semibold text-cyan-300 font-mono">
              {scanStages.find(s => s.step === scanStep)?.label || "Evaluating threat vectors..."}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {scanStages.map((stage) => {
              const isDone = scanStep > stage.step;
              const isCurrent = scanStep === stage.step;
              return (
                <div
                  key={stage.step}
                  className={`rounded-2xl border p-3.5 text-left font-mono text-xs transition-all duration-300 ${
                    isDone
                      ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                      : isCurrent
                      ? 'border-cyan-400 bg-cyan-500/20 text-white shadow-glow'
                      : 'border-cyber-border bg-cyber-dark/40 text-cyber-dim'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    {isDone ? <CheckCircle2 size={14} /> : <span>0{stage.step}.</span>}
                    <span>Stage {stage.step}</span>
                  </div>
                  <div className="truncate text-[11px] text-cyber-muted">{stage.label.split(" ")[0]}...</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Scanner Result Display */}
      {!isScanning && activeScan && (
        <div className="space-y-6">
          {/* Main Verdict Card */}
          <div className={`relative overflow-hidden rounded-3xl border p-8 backdrop-blur-xl transition-all ${
            activeScan.status === 'phishing'
              ? 'border-cyber-danger/60 bg-gradient-to-b from-rose-950/30 to-cyber-card shadow-glow-danger'
              : activeScan.status === 'suspicious'
              ? 'border-cyber-warning/50 bg-gradient-to-b from-amber-950/20 to-cyber-card'
              : 'border-cyber-mint/50 bg-gradient-to-b from-emerald-950/25 to-cyber-card shadow-glow-mint/30'
          }`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3.5 flex-1">
                <div className="flex items-center gap-2.5">
                  <ThreatBadge status={activeScan.status} />
                  <span className="text-xs text-cyber-muted font-mono">SCAN_REF: {activeScan.id}</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
                  {activeScan.status === 'phishing' ? (
                    <>
                      <ShieldAlert className="text-cyber-danger" size={36} />
                      <span className="text-cyber-danger">PHISHING DETECTED</span>
                    </>
                  ) : activeScan.status === 'suspicious' ? (
                    <>
                      <AlertTriangle className="text-cyber-warning" size={36} />
                      <span className="text-cyber-warning">SUSPICIOUS URL DETECTED</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="text-cyber-mint" size={36} />
                      <span className="text-cyber-mint">VERIFIED SAFE URL</span>
                    </>
                  )}
                </h2>

                {/* Scanned URL Pill */}
                <div className="flex items-center gap-2 rounded-2xl border border-cyber-border bg-slate-950/60 p-3 max-w-2xl shadow-inner">
                  <Globe size={16} className="text-cyber-muted shrink-0" />
                  <span className="font-mono text-xs text-slate-200 truncate flex-1">
                    {activeScan.url}
                  </span>
                  <button
                    onClick={() => handleCopy(activeScan.url)}
                    className="p-1.5 text-cyber-muted hover:text-cyan-400 transition-colors rounded-lg hover:bg-cyber-card"
                    title="Copy URL"
                  >
                    <Copy size={15} />
                  </button>
                </div>
                {copied && <p className="text-[11px] text-cyan-300 font-mono">Copied to clipboard!</p>}
              </div>

              {/* Threat Gauge */}
              <div className="flex flex-col items-center justify-center rounded-3xl border border-cyber-border/80 bg-slate-950/80 px-8 py-6 min-w-[210px] text-center shadow-lg">
                <span className="text-xs font-bold uppercase tracking-wider text-cyber-dim font-mono">
                  RISK INDEX
                </span>
                <div className="my-2 flex items-baseline gap-1">
                  <span className={`font-mono text-5xl font-black ${
                    activeScan.riskScore > 70 ? 'text-cyber-danger' : activeScan.riskScore > 35 ? 'text-cyber-warning' : 'text-cyber-mint'
                  }`}>
                    {activeScan.riskScore}
                  </span>
                  <span className="text-lg text-cyber-muted font-mono">/100</span>
                </div>
                <div className="text-xs text-cyber-muted font-mono">
                  ML Confidence: <span className="text-white font-bold">{activeScan.confidence}%</span>
                </div>
              </div>
            </div>

            {/* Recommendation Banner */}
            <div className={`mt-7 rounded-2xl border p-4 text-xs font-mono flex items-center gap-3 ${
              activeScan.status === 'phishing'
                ? 'border-cyber-danger/30 bg-cyber-danger/10 text-rose-300'
                : activeScan.status === 'suspicious'
                ? 'border-cyber-warning/30 bg-cyber-warning/10 text-amber-300'
                : 'border-cyber-mint/30 bg-cyber-mint/10 text-emerald-300'
            }`}>
              <Terminal size={17} className="shrink-0" />
              <span><strong>DEFENSIVE DIRECTIVE:</strong> {activeScan.recommendation}</span>
            </div>
          </div>

          {/* Explainable AI & Feature Inspector Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Explainable AI */}
            <div className="rounded-3xl border border-cyber-border/80 bg-cyber-card/80 p-6 space-y-4 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/30">
                  <Sparkles size={17} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">AI Detection Explainability</h3>
                  <p className="text-xs text-cyber-muted">Why did the model reach this verdict?</p>
                </div>
              </div>

              <div className="rounded-2xl border border-cyber-border/80 bg-slate-950/60 p-4 text-sm leading-relaxed text-slate-200">
                <p>{activeScan.aiExplanation}</p>
              </div>

              <div className="space-y-2 text-xs">
                <p className="font-semibold text-cyber-muted uppercase tracking-wider font-mono">Key Behavioral Flags:</p>
                <ul className="space-y-2 text-cyber-muted">
                  <li className="flex items-center gap-2">
                    {activeScan.features.hasIp ? (
                      <XCircle size={15} className="text-cyber-danger shrink-0" />
                    ) : (
                      <CheckCircle2 size={15} className="text-cyber-mint shrink-0" />
                    )}
                    <span>Hostname Format: {activeScan.features.hasIp ? "Raw IP address (High Risk)" : "Standard Domain Host"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {!activeScan.features.hasHttps ? (
                      <XCircle size={15} className="text-cyber-danger shrink-0" />
                    ) : (
                      <CheckCircle2 size={15} className="text-cyber-mint shrink-0" />
                    )}
                    <span>Transport Protocol: {activeScan.features.hasHttps ? "HTTPS TLS Encrypted" : "Insecure Plaintext HTTP"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {activeScan.features.hasSuspiciousWords ? (
                      <XCircle size={15} className="text-cyber-danger shrink-0" />
                    ) : (
                      <CheckCircle2 size={15} className="text-cyber-mint shrink-0" />
                    )}
                    <span>
                      Deceptive Tokens: {activeScan.features.suspiciousWords?.length > 0
                        ? activeScan.features.suspiciousWords.join(", ")
                        : "None detected"}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Extracted Lexical Features */}
            <div className="rounded-3xl border border-cyber-border/80 bg-cyber-card/80 p-6 space-y-4 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Layers size={17} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Extracted URL Features</h3>
                  <p className="text-xs text-cyber-muted">Heuristic inputs fed to model</p>
                </div>
              </div>

              <div className="divide-y divide-cyber-border/60 text-xs font-mono">
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-cyber-muted">Total URL Length</span>
                  <span className="text-white font-semibold">{activeScan.features.urlLength} characters</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-cyber-muted">Dots (.) Count</span>
                  <span className="text-white font-semibold">{activeScan.features.dotsCount}</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-cyber-muted">Hyphens (-) Count</span>
                  <span className="text-white font-semibold">{activeScan.features.hyphensCount}</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-cyber-muted">Subdomains Count</span>
                  <span className="text-white font-semibold">{activeScan.features.subdomainsCount}</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-cyber-muted">Top-Level Domain (TLD)</span>
                  <span className="text-cyan-400 font-semibold">{activeScan.features.tldRisk}</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-cyber-muted">Target Hostname</span>
                  <span className="text-white font-semibold truncate max-w-[200px]">{activeScan.domain}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default URLScanner;

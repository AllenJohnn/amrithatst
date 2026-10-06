import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Copy,
  Terminal,
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
    { step: 1, label: "Resolving DNS & IP" },
    { step: 2, label: "Lexical Extraction" },
    { step: 3, label: "RF Classifier" },
    { step: 4, label: "Synthesizing Report" }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto h-full">
      {/* Left Column: Input and Main Result */}
      <div className="flex-1 flex flex-col gap-6">
        
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-white">URL Analysis</h1>
          <p className="text-sm text-cyber-muted">
            Enter a URL to evaluate its security characteristics using the analysis engine.
          </p>
        </div>

        <div className="panel p-5">
          <URLInput onScan={handleScan} isScanning={isScanning} />
        </div>

        {!isScanning && activeScan && (
          <div className="panel flex flex-col divide-y divide-cyber-border">
            <div className="p-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-cyber-muted font-mono uppercase tracking-wider mb-1 block">Verdict</span>
                  <div className="flex items-center gap-3">
                    {activeScan.status === 'phishing' ? (
                      <ShieldAlert className="text-cyber-danger h-6 w-6" />
                    ) : activeScan.status === 'suspicious' ? (
                      <AlertTriangle className="text-cyber-warning h-6 w-6" />
                    ) : (
                      <ShieldCheck className="text-cyber-mint h-6 w-6" />
                    )}
                    <h2 className={cn(
                      "text-2xl font-bold tracking-tight",
                      activeScan.status === 'phishing' ? "text-cyber-danger" : 
                      activeScan.status === 'suspicious' ? "text-cyber-warning" : "text-cyber-mint"
                    )}>
                      {activeScan.status === 'phishing' ? "PHISHING" : 
                       activeScan.status === 'suspicious' ? "SUSPICIOUS" : "SAFE"}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-cyber-card border border-cyber-border rounded px-3 py-1.5 max-w-xl">
                  <span className="font-mono text-sm text-white truncate flex-1">
                    {activeScan.url}
                  </span>
                  <button
                    onClick={() => handleCopy(activeScan.url)}
                    className="p-1 text-cyber-muted hover:text-white transition-colors rounded hover:bg-cyber-dark"
                    title="Copy URL"
                  >
                    <Copy size={14} />
                  </button>
                  {copied && <span className="text-[10px] text-cyber-cyan font-mono">Copied</span>}
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <span className="text-xs text-cyber-muted font-mono uppercase tracking-wider mb-1 block">Risk Score</span>
                <div className="flex items-baseline gap-1">
                  <span className={cn(
                    "text-4xl font-bold font-mono tracking-tighter",
                    activeScan.riskScore > 70 ? "text-cyber-danger" : 
                    activeScan.riskScore > 35 ? "text-cyber-warning" : "text-cyber-mint"
                  )}>
                    {activeScan.riskScore}
                  </span>
                  <span className="text-sm text-cyber-muted font-mono">/100</span>
                </div>
                
                {/* Visual bar */}
                <div className="w-full h-1 bg-cyber-card mt-2 rounded-full overflow-hidden">
                  <div className={cn(
                    "h-full rounded-full",
                    activeScan.riskScore > 70 ? "bg-cyber-danger" : 
                    activeScan.riskScore > 35 ? "bg-cyber-warning" : "bg-cyber-mint"
                  )} style={{ width: `${activeScan.riskScore}%`}} />
                </div>
              </div>
            </div>

            <div className="p-6 space-y-3">
              <span className="text-xs font-semibold text-white uppercase tracking-wider">Analysis Explanation</span>
              <p className="text-sm text-cyber-muted leading-relaxed">
                {activeScan.aiExplanation}
              </p>
            </div>

            <div className="p-6 space-y-3">
              <span className="text-xs font-semibold text-white uppercase tracking-wider">Directive</span>
              <div className="flex items-start gap-3 text-sm text-cyber-muted">
                <Terminal size={16} className="mt-0.5 shrink-0" />
                <p>{activeScan.recommendation}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Status & Features */}
      <div className="w-full lg:w-[340px] flex flex-col gap-6">
        
        {/* Status Panel */}
        <div className="panel p-5 flex flex-col gap-4">
          <h2 className="text-xs font-semibold text-white uppercase tracking-wider">Analysis Status</h2>
          
          <div className="flex flex-col gap-3">
            {isScanning ? (
              scanStages.map((stage) => {
                const isDone = scanStep > stage.step;
                const isCurrent = scanStep === stage.step;
                return (
                  <div key={stage.step} className="flex items-center gap-3 text-sm">
                    {isDone ? (
                      <CheckCircle2 size={16} className="text-cyber-mint" />
                    ) : isCurrent ? (
                      <div className="h-4 w-4 rounded-full border-2 border-cyber-cyan border-t-transparent animate-spin" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-cyber-border" />
                    )}
                    <span className={isCurrent ? "text-white" : "text-cyber-muted"}>{stage.label}</span>
                  </div>
                );
              })
            ) : activeScan ? (
              <>
                <div className="flex justify-between items-center py-1.5 border-b border-cyber-border/50 text-sm">
                  <span className="text-cyber-muted">Status</span>
                  <span className="text-cyber-mint font-medium">Complete</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-cyber-border/50 text-sm">
                  <span className="text-cyber-muted">Engine</span>
                  <span className="text-white">Random Forest</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-cyber-border/50 text-sm">
                  <span className="text-cyber-muted">Confidence</span>
                  <span className="text-white font-mono">{activeScan.confidence}%</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-cyber-border/50 text-sm">
                  <span className="text-cyber-muted">Latency</span>
                  <span className="text-white font-mono">34ms</span>
                </div>
              </>
            ) : (
              <div className="text-sm text-cyber-muted">Ready for analysis.</div>
            )}
          </div>
        </div>

        {/* Evidence Panel */}
        {!isScanning && activeScan && (
          <div className="panel p-5 flex flex-col gap-4">
            <h2 className="text-xs font-semibold text-white uppercase tracking-wider">Feature Evidence</h2>
            
            <div className="flex flex-col gap-2.5 text-sm font-mono">
              <div className="flex justify-between items-center bg-cyber-card px-2.5 py-1.5 rounded">
                <span className="text-cyber-muted">URL Length</span>
                <span className="text-white">{activeScan.features.urlLength}</span>
              </div>
              <div className="flex justify-between items-center bg-cyber-card px-2.5 py-1.5 rounded">
                <span className="text-cyber-muted">Entropy</span>
                <span className="text-white">{activeScan.riskScore > 50 ? 'High' : 'Normal'}</span>
              </div>
              <div className="flex justify-between items-center bg-cyber-card px-2.5 py-1.5 rounded">
                <span className="text-cyber-muted">TLD Risk</span>
                <span className="text-white">{activeScan.features.tldRisk}</span>
              </div>
              <div className="flex justify-between items-center bg-cyber-card px-2.5 py-1.5 rounded">
                <span className="text-cyber-muted">HTTPS</span>
                <span className={activeScan.features.hasHttps ? "text-cyber-mint" : "text-cyber-danger"}>
                  {activeScan.features.hasHttps ? 'Present' : 'Missing'}
                </span>
              </div>
              <div className="flex justify-between items-center bg-cyber-card px-2.5 py-1.5 rounded">
                <span className="text-cyber-muted">Suspicious Tokens</span>
                <span className="text-white">{activeScan.features.suspiciousWords?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center bg-cyber-card px-2.5 py-1.5 rounded">
                <span className="text-cyber-muted">Host Pattern</span>
                <span className={activeScan.features.hasIp ? "text-cyber-danger" : "text-white"}>
                  {activeScan.features.hasIp ? 'IP' : 'Domain'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default URLScanner;

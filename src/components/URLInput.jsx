import React, { useState } from 'react';
import { ScanSearch, Globe, ArrowRight, Loader2, X, TerminalSquare } from 'lucide-react';
import { SAMPLE_URLS } from '../data/dummyData';
import { cn } from '../utils';

const URLInput = ({ onScan, isScanning, defaultValue = "" }) => {
  const [url, setUrl] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim() && !isScanning) {
      onScan(url.trim());
    }
  };

  const handleSelectSample = (sampleUrl) => {
    setUrl(sampleUrl);
    onScan(sampleUrl);
  };

  return (
    <div className="w-full space-y-5">
      <form onSubmit={handleSubmit} className="relative group">
        {/* Glow effect on focus */}
        <div className={cn(
          "absolute -inset-0.5 rounded-xl blur-md transition-all duration-500",
          isFocused ? "bg-cyber-cyan/30 opacity-100" : "bg-cyber-border opacity-0 group-hover:opacity-100"
        )} />
        
        <div className="relative flex flex-col sm:flex-row bg-cyber-dark rounded-xl border border-cyber-border/80 p-1">
          <div className="relative flex-1 flex items-center">
            <div className="pl-4 text-cyber-cyan/70">
              <TerminalSquare size={18} />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="https://suspicious-target.xyz/login"
              disabled={isScanning}
              className="w-full bg-transparent py-3 pl-3 pr-10 font-mono text-sm text-white placeholder-cyber-dim outline-none disabled:opacity-50"
            />
            {url && !isScanning && (
              <button
                type="button"
                onClick={() => setUrl("")}
                className="absolute right-3 p-1 rounded-md text-cyber-muted hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={!url.trim() || isScanning}
            className="mt-1 sm:mt-0 flex items-center justify-center gap-2 rounded-lg bg-cyber-cyan px-6 py-3 font-bold text-black transition-all hover:bg-white hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-cyber-cyan disabled:hover:shadow-none shrink-0"
          >
            {isScanning ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Executing...</span>
              </>
            ) : (
              <>
                <span>Initiate Scan</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Preset Demo Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-cyber-dim">Quick Vectors:</span>
        {SAMPLE_URLS.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelectSample(sample.url)}
            disabled={isScanning}
            className={cn(
              "rounded-md border px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider transition-all duration-300 hover:-translate-y-0.5",
              sample.type === 'phishing'
                ? "border-cyber-danger/30 bg-cyber-danger/10 text-cyber-danger hover:border-cyber-danger hover:shadow-[0_0_10px_rgba(244,63,94,0.2)]"
                : sample.type === 'suspicious'
                ? "border-cyber-warning/30 bg-cyber-warning/10 text-cyber-warning hover:border-cyber-warning hover:shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                : "border-cyber-mint/30 bg-cyber-mint/10 text-cyber-mint hover:border-cyber-mint hover:shadow-[0_0_10px_rgba(16,185,129,0.2)]"
            )}
          >
            {sample.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default URLInput;

import React, { useState } from 'react';
import { ScanSearch, Globe, ArrowRight, Loader2, X } from 'lucide-react';
import { SAMPLE_URLS } from '../data/dummyData';

const URLInput = ({ onScan, isScanning, defaultValue = "" }) => {
  const [url, setUrl] = useState(defaultValue);

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
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-cyber-muted">
              <Globe size={18} />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter suspicious or legitimate URL (e.g., https://paypal-security-verify.xyz)"
              disabled={isScanning}
              className="w-full rounded-2xl border border-cyber-border bg-cyber-dark/90 py-4 pl-12 pr-10 font-mono text-sm text-white placeholder-cyber-dim outline-none transition-all duration-200 focus:border-cyan-400 focus:shadow-glow disabled:opacity-50"
            />
            {url && !isScanning && (
              <button
                type="button"
                onClick={() => setUrl("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-cyber-muted hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={!url.trim() || isScanning}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 px-8 py-4 font-bold text-slate-950 transition-all duration-200 hover:opacity-95 hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isScanning ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Scanning...</span>
              </>
            ) : (
              <>
                <ScanSearch size={18} />
                <span>Analyze URL</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Preset Demo Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs font-medium text-cyber-dim">Quick Test Samples:</span>
        {SAMPLE_URLS.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelectSample(sample.url)}
            disabled={isScanning}
            className={`rounded-xl border px-3 py-1 text-xs font-mono transition-all duration-200 hover:scale-105 ${
              sample.type === 'phishing'
                ? 'border-cyber-danger/30 bg-cyber-danger/10 text-rose-300 hover:border-cyber-danger hover:shadow-glow-danger/20'
                : sample.type === 'suspicious'
                ? 'border-cyber-warning/30 bg-cyber-warning/10 text-amber-300 hover:border-cyber-warning'
                : 'border-cyber-mint/30 bg-cyber-mint/10 text-emerald-300 hover:border-cyber-mint'
            }`}
          >
            {sample.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default URLInput;

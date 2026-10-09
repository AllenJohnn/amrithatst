import React, { useState } from 'react';
import { Loader2, ArrowRight, X, Globe } from 'lucide-react';
import { SAMPLE_URLS } from '../data/dummyData';
import { Button } from './ui/Button';

export default function URLInput({ onScan, isScanning, defaultValue = "" }) {
  const [url, setUrl] = useState(defaultValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim() && !isScanning) {
      onScan(url.trim());
    }
  };

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="flex items-center gap-2 p-1.5 rounded-lg border border-cyber-border bg-cyber-dark transition-all focus-within:border-sage-500 focus-within:ring-1 focus-within:ring-sage-500/50 shadow-sm">
          <Globe className="h-4 w-4 text-cyber-textMuted ml-3 shrink-0" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            disabled={isScanning}
            className="flex-1 bg-transparent border-0 py-2 px-2 text-sm text-cyber-white placeholder:text-cyber-textMuted focus:outline-none focus:ring-0 disabled:opacity-50"
          />
          {url && !isScanning && (
            <button
              type="button"
              onClick={() => setUrl("")}
              className="p-1 mr-1 text-cyber-textMuted hover:text-cyber-white transition-colors rounded-full hover:bg-cyber-cardHover"
            >
              <X size={14} />
            </button>
          )}
          <Button type="submit" disabled={!url.trim() || isScanning} className="h-8 px-4 shrink-0 transition-all text-xs">
            {isScanning ? (
              <Loader2 className="h-3 w-3 animate-spin text-[currentColor]" />
            ) : (
              <>
                Scan <ArrowRight className="h-3 w-3 ml-1.5" />
              </>
            )}
          </Button>
        </div>
      </form>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="text-[10px] uppercase tracking-widest font-semibold text-cyber-textMuted">Test Payloads:</span>
        {SAMPLE_URLS.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setUrl(sample.url);
              onScan(sample.url);
            }}
            disabled={isScanning}
            className="text-[11px] text-cyber-textMuted hover:text-cyber-white transition-colors underline-offset-4 hover:underline disabled:opacity-50"
          >
            {sample.label}
          </button>
        ))}
      </div>
    </div>
  );
}

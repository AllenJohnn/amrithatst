import React, { useState } from 'react';
import { Loader2, ArrowRight, X } from 'lucide-react';
import { SAMPLE_URLS } from '../data/dummyData';
import { cn } from '../utils';

const URLInput = ({ onScan, isScanning, defaultValue = "" }) => {
  const [url, setUrl] = useState(defaultValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim() && !isScanning) {
      onScan(url.trim());
    }
  };

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              disabled={isScanning}
              className="w-full bg-cyber-card border border-cyber-border rounded-md py-2 pl-3 pr-8 font-mono text-sm text-cyber-white placeholder-cyber-dim outline-none focus:border-cyber-accent transition-colors disabled:opacity-50"
            />
            {url && !isScanning && (
              <button
                type="button"
                onClick={() => setUrl("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-cyber-dim hover:text-cyber-white transition-colors rounded"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={!url.trim() || isScanning}
            className="flex items-center justify-center gap-2 rounded-md bg-cyber-accent text-[#10120E] px-4 py-2 font-medium text-sm transition-all hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {isScanning ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Analyzing</span>
              </>
            ) : (
              <>
                <span>Analyze</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-cyber-muted">Presets:</span>
        {SAMPLE_URLS.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setUrl(sample.url);
              onScan(sample.url);
            }}
            disabled={isScanning}
            className="text-xs text-cyber-dim hover:text-cyber-white transition-colors"
          >
            {sample.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default URLInput;

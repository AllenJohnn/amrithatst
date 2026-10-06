import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History,
  Search,
  Download,
  Trash2,
  X,
  AlertCircle
} from 'lucide-react';
import { useScan } from '../context/ScanContext';
import ThreatBadge from '../components/ThreatBadge';
import { cn } from '../utils';

const ScanHistory = () => {
  const { scans, clearHistory, deleteScan } = useScan();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedScan, setSelectedScan] = useState(null);

  const filteredScans = useMemo(() => {
    return scans.filter((scan) => {
      const matchesSearch =
        scan.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scan.domain.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || scan.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [scans, searchTerm, filterStatus]);

  const handleExportCSV = () => {
    if (scans.length === 0) return;
    const headers = ["ID", "URL", "Domain", "Status", "RiskScore", "Confidence", "Date"];
    const rows = scans.map(s => [
      s.id,
      `"${s.url.replace(/"/g, '""')}"`,
      `"${s.domain}"`,
      s.status,
      s.riskScore,
      s.confidence,
      `"${s.date}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `phishgaurds_audit_log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-full w-full relative overflow-hidden">
      <div className={cn("flex-1 flex flex-col space-y-4 transition-all duration-300", selectedScan ? "pr-[400px]" : "pr-0")}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-medium text-white flex items-center gap-2">
              <History className="text-cyber-muted" size={20} />
              Audit Log
            </h1>
            <p className="mt-1 text-sm text-cyber-muted">
              Chronological registry of analyzed web hyperlinks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              disabled={scans.length === 0}
              className="flex items-center gap-2 rounded-md border border-cyber-border bg-cyber-card px-3 py-1.5 text-xs font-medium text-white hover:bg-cyber-cardHover transition-colors disabled:opacity-40"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
            <button
              onClick={clearHistory}
              disabled={scans.length === 0}
              className="flex items-center gap-2 rounded-md border border-cyber-danger/30 bg-cyber-danger/10 px-3 py-1.5 text-xs font-medium text-cyber-danger hover:bg-cyber-danger/20 transition-colors disabled:opacity-40"
            >
              <Trash2 size={14} />
              <span>Clear Log</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-lg border border-cyber-border bg-cyber-dark p-3">
          <div className="relative w-full md:w-80">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-muted" />
            <input
              type="text"
              placeholder="Search domain or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-cyber-borderSubtle bg-cyber-card py-1.5 pl-9 pr-3 text-sm font-mono text-white placeholder-cyber-dim outline-none focus:border-cyber-cyan transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto scrollbar-hide">
            {['all', 'phishing', 'suspicious', 'safe'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider font-medium transition-colors whitespace-nowrap",
                  filterStatus === status
                    ? "bg-white text-cyber-black"
                    : "bg-cyber-card text-cyber-muted border border-cyber-border hover:bg-cyber-cardHover hover:text-white"
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-hidden rounded-lg border border-cyber-border bg-cyber-dark flex flex-col">
          {filteredScans.length > 0 ? (
            <div className="overflow-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 z-10 bg-cyber-dark border-b border-cyber-border">
                  <tr className="text-[11px] font-medium text-cyber-muted">
                    <th className="py-2.5 px-4 font-normal">Target Payload</th>
                    <th className="py-2.5 px-4 font-normal">Classification</th>
                    <th className="py-2.5 px-4 text-center font-normal">Risk</th>
                    <th className="py-2.5 px-4 text-center font-normal">Confidence</th>
                    <th className="py-2.5 px-4 text-right font-normal">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyber-borderSubtle text-sm">
                  {filteredScans.map((scan) => (
                    <tr 
                      key={scan.id} 
                      onClick={() => setSelectedScan(scan)}
                      className={cn(
                        "group transition-colors cursor-pointer",
                        selectedScan?.id === scan.id ? "bg-cyber-cardHover" : "hover:bg-cyber-card"
                      )}
                    >
                      <td className="py-3 px-4 max-w-sm">
                        <div className="font-mono text-xs text-white truncate transition-colors group-hover:text-cyber-cyan">
                          {scan.url}
                        </div>
                        <div className="text-[11px] text-cyber-dim mt-0.5 truncate">{scan.domain}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <ThreatBadge status={scan.status} size="small" />
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className={cn(
                          "font-mono text-xs px-2 py-0.5 rounded",
                          scan.riskScore > 70 ? 'text-cyber-danger' : 
                          scan.riskScore > 35 ? 'text-cyber-warning' : 'text-cyber-mint'
                        )}>
                          {scan.riskScore}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap text-xs font-mono text-cyber-muted">
                        {scan.confidence}%
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-xs text-cyber-dim text-right">
                        {scan.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="h-12 w-12 rounded-full border border-cyber-borderSubtle bg-cyber-card flex items-center justify-center mb-3">
                <AlertCircle size={20} className="text-cyber-dim" />
              </div>
              <h3 className="text-sm font-medium text-white mb-1">No Records Found</h3>
              <p className="text-xs text-cyber-muted">No scan logs match your current filters.</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedScan && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute top-0 right-0 h-full w-[400px] border-l border-cyber-border bg-cyber-dark z-20 flex flex-col"
          >
            <div className="flex items-center justify-between border-b border-cyber-border p-4">
              <h3 className="text-sm font-medium text-white">Scan Details</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    deleteScan(selectedScan.id);
                    setSelectedScan(null);
                  }}
                  className="rounded p-1.5 text-cyber-muted hover:text-cyber-danger hover:bg-cyber-danger/10 transition-colors"
                  title="Delete record"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={() => setSelectedScan(null)}
                  className="rounded p-1.5 text-cyber-muted hover:text-white hover:bg-cyber-card transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div className="space-y-3">
                <div>
                  <span className="text-[11px] text-cyber-dim uppercase tracking-wider font-medium mb-1.5 block">Verdict</span>
                  <ThreatBadge status={selectedScan.status} />
                </div>
                
                <div>
                  <span className="text-[11px] text-cyber-dim uppercase tracking-wider font-medium mb-1.5 block">Target URL</span>
                  <div className="rounded-md border border-cyber-borderSubtle bg-cyber-card p-3">
                    <span className="text-white break-all text-xs font-mono">{selectedScan.url}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md border border-cyber-borderSubtle bg-cyber-card p-3">
                  <span className="text-[11px] text-cyber-dim uppercase tracking-wider font-medium block mb-1">Risk Score</span>
                  <span className={cn(
                    "text-xl font-medium font-mono",
                    selectedScan.riskScore > 70 ? 'text-cyber-danger' : 
                    selectedScan.riskScore > 35 ? 'text-cyber-warning' : 'text-cyber-mint'
                  )}>{selectedScan.riskScore}</span>
                </div>
                <div className="rounded-md border border-cyber-borderSubtle bg-cyber-card p-3">
                  <span className="text-[11px] text-cyber-dim uppercase tracking-wider font-medium block mb-1">Confidence</span>
                  <span className="text-xl font-medium text-white font-mono">{selectedScan.confidence}%</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-cyber-dim uppercase tracking-wider font-medium mb-1.5 block">AI Analysis</span>
                <div className="rounded-md border border-cyber-borderSubtle bg-cyber-card p-3">
                  <p className="text-cyber-muted text-xs leading-relaxed">{selectedScan.aiExplanation}</p>
                </div>
              </div>
              
              <div>
                <span className="text-[11px] text-cyber-dim uppercase tracking-wider font-medium mb-1.5 block">Recommended Action</span>
                <div className={cn(
                  "rounded-md border p-3 text-xs",
                  selectedScan.status === 'phishing' ? "border-cyber-danger/20 bg-cyber-danger/10 text-cyber-danger" :
                  selectedScan.status === 'suspicious' ? "border-cyber-warning/20 bg-cyber-warning/10 text-cyber-warning" :
                  "border-cyber-mint/20 bg-cyber-mint/10 text-cyber-mint"
                )}>
                  {selectedScan.recommendation}
                </div>
              </div>

              <div>
                <span className="text-[11px] text-cyber-dim uppercase tracking-wider font-medium mb-1.5 block">Metadata</span>
                <div className="rounded-md border border-cyber-borderSubtle bg-cyber-card p-3 font-mono text-[11px] text-cyber-muted space-y-2">
                  <div className="flex justify-between">
                    <span>ID:</span>
                    <span className="text-white">{selectedScan.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domain:</span>
                    <span className="text-white">{selectedScan.domain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Timestamp:</span>
                    <span className="text-white">{selectedScan.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScanHistory;

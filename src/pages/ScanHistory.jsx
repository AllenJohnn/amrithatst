import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History,
  Search,
  Download,
  Trash2,
  Eye,
  X,
  ServerCrash
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="rounded bg-cyber-cyan/10 px-2 py-0.5 text-[10px] font-mono font-semibold tracking-wider text-cyber-cyan border border-cyber-cyan/20">
              AUDIT LOG
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <History className="text-cyber-cyan" size={28} />
            Scan History
          </h1>
          <p className="mt-1 text-sm text-cyber-muted">
            Chronological registry of analyzed web hyperlinks and threat classifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            disabled={scans.length === 0}
            className="flex items-center gap-2 rounded-lg border border-cyber-border bg-cyber-card px-4 py-2 text-xs font-semibold text-white hover:border-cyber-cyan hover:bg-cyber-cyan/10 transition-all disabled:opacity-40 disabled:hover:border-cyber-border disabled:hover:bg-cyber-card"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={clearHistory}
            disabled={scans.length === 0}
            className="flex items-center gap-2 rounded-lg border border-cyber-danger/30 bg-cyber-danger/10 px-4 py-2 text-xs font-semibold text-cyber-danger hover:bg-cyber-danger hover:text-white hover:border-cyber-danger transition-all disabled:opacity-40 disabled:hover:bg-cyber-danger/10 disabled:hover:text-cyber-danger"
          >
            <Trash2 size={14} />
            <span>Clear Log</span>
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="glass-panel flex flex-col md:flex-row items-center justify-between gap-4 rounded-xl p-4">
        <div className="relative w-full md:w-96">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyber-muted" />
          <input
            type="text"
            placeholder="Search domain or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-cyber-border bg-cyber-dark py-2.5 pl-10 pr-4 text-xs font-mono text-white placeholder-cyber-dim outline-none transition-colors focus:border-cyber-cyan focus:bg-cyber-card shadow-[inset_0_1px_4px_rgba(0,0,0,0.5)]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {['all', 'phishing', 'suspicious', 'safe'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                "rounded-lg px-4 py-2 text-[11px] font-mono uppercase tracking-wider font-semibold transition-all whitespace-nowrap",
                filterStatus === status
                  ? "bg-cyber-cyan text-black shadow-[0_0_10px_rgba(0,229,255,0.3)]"
                  : "bg-cyber-card text-cyber-muted border border-cyber-border hover:bg-white/5 hover:text-white"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="glass-panel overflow-hidden rounded-xl">
        {filteredScans.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-cyber-border bg-cyber-dark/80 text-[10px] font-semibold uppercase tracking-widest text-cyber-dim font-mono">
                  <th className="py-4 px-6">Target Payload</th>
                  <th className="py-4 px-4">Classification</th>
                  <th className="py-4 px-4 text-center">Threat Risk</th>
                  <th className="py-4 px-4 text-center">Confidence</th>
                  <th className="py-4 px-4 text-right">Timestamp</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-border/40 text-sm">
                {filteredScans.map((scan) => (
                  <tr key={scan.id} className="group transition-colors hover:bg-white/5">
                    <td className="py-4 px-6 max-w-sm">
                      <div className="font-mono text-xs font-medium text-white truncate group-hover:text-cyber-cyan transition-colors">
                        {scan.url}
                      </div>
                      <div className="text-[10px] text-cyber-dim font-mono mt-1 truncate">{scan.domain}</div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <ThreatBadge status={scan.status} size="small" />
                    </td>
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <span className={cn(
                        "font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-cyber-dark border border-cyber-border",
                        scan.riskScore > 70 ? 'text-cyber-danger border-cyber-danger/30' : 
                        scan.riskScore > 35 ? 'text-cyber-warning border-cyber-warning/30' : 'text-cyber-mint border-cyber-mint/30'
                      )}>
                        {scan.riskScore}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center whitespace-nowrap text-xs font-mono text-cyber-muted">
                      {scan.confidence}%
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-xs font-mono text-cyber-dim text-right">
                      {scan.timestamp}
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setSelectedScan(scan)}
                          className="rounded-md border border-cyber-border bg-cyber-dark p-2 text-cyber-muted hover:border-cyber-cyan hover:text-cyber-cyan transition-all"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => deleteScan(scan.id)}
                          className="rounded-md border border-cyber-border bg-cyber-dark p-2 text-cyber-muted hover:border-cyber-danger hover:text-cyber-danger transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="h-16 w-16 rounded-full bg-cyber-dark border border-cyber-border flex items-center justify-center mb-4">
              <ServerCrash size={24} className="text-cyber-dim" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">No Records Found</h3>
            <p className="text-sm text-cyber-muted">No scan logs match your current filters.</p>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {selectedScan && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-2xl rounded-2xl border border-cyber-border bg-cyber-dark p-6 shadow-[0_0_50px_rgba(0,0,0,0.5)] space-y-6"
            >
              <div className="flex items-center justify-between border-b border-cyber-border pb-4">
                <div className="flex items-center gap-4">
                  <ThreatBadge status={selectedScan.status} />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Scan Details</h3>
                </div>
                <button
                  onClick={() => setSelectedScan(null)}
                  className="rounded-lg p-2 text-cyber-muted hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="rounded-xl border border-cyber-border bg-cyber-card p-4">
                  <span className="text-cyber-dim block mb-1.5 uppercase font-bold tracking-wider text-[10px]">Target URL:</span>
                  <span className="text-white break-all text-sm">{selectedScan.url}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-cyber-border bg-cyber-card p-4 text-center">
                    <span className="text-cyber-dim block mb-1 uppercase tracking-wider text-[10px]">Risk Index</span>
                    <span className={cn(
                      "text-2xl font-bold",
                      selectedScan.riskScore > 70 ? 'text-cyber-danger' : 
                      selectedScan.riskScore > 35 ? 'text-cyber-warning' : 'text-cyber-mint'
                    )}>{selectedScan.riskScore}</span>
                  </div>
                  <div className="rounded-xl border border-cyber-border bg-cyber-card p-4 text-center">
                    <span className="text-cyber-dim block mb-1 uppercase tracking-wider text-[10px]">Confidence</span>
                    <span className="text-2xl font-bold text-white">{selectedScan.confidence}%</span>
                  </div>
                </div>

                <div className="rounded-xl border border-cyber-border bg-cyber-card p-4 space-y-2">
                  <span className="text-cyber-dim block uppercase tracking-wider text-[10px]">AI Reasoning:</span>
                  <p className="text-slate-300 leading-relaxed font-sans">{selectedScan.aiExplanation}</p>
                </div>
                
                <div className={cn(
                  "rounded-xl border p-4 font-sans text-sm",
                  selectedScan.status === 'phishing' ? "border-cyber-danger/30 bg-cyber-danger/10 text-rose-200" :
                  selectedScan.status === 'suspicious' ? "border-cyber-warning/30 bg-cyber-warning/10 text-amber-200" :
                  "border-cyber-mint/30 bg-cyber-mint/10 text-emerald-200"
                )}>
                  <span className="font-bold mr-2">DIRECTIVE:</span> {selectedScan.recommendation}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ScanHistory;

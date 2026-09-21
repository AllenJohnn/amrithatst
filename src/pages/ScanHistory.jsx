import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Download,
  Trash2,
  Eye,
  X,
} from 'lucide-react';
import { useScan } from '../context/ScanContext';
import ThreatBadge from '../components/ThreatBadge';

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-cyber-green/30 bg-cyber-green/10 px-2.5 py-0.5 text-xs font-mono font-medium text-cyber-green">
              SECURITY AUDIT LOG
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <History className="text-cyber-green" size={28} />
            Scan History
          </h1>
          <p className="mt-1 text-xs text-cyber-muted">
            Chronological registry of analyzed web hyperlinks and threat classifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            disabled={scans.length === 0}
            className="flex items-center gap-1.5 rounded-xl border border-cyber-border bg-cyber-card px-3.5 py-2 text-xs font-semibold text-cyber-muted hover:border-cyber-green/40 hover:text-white transition-all disabled:opacity-40"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={clearHistory}
            disabled={scans.length === 0}
            className="flex items-center gap-1.5 rounded-xl border border-cyber-danger/30 bg-cyber-danger/10 px-3.5 py-2 text-xs font-semibold text-cyber-danger hover:bg-cyber-danger hover:text-white transition-all disabled:opacity-40"
          >
            <Trash2 size={14} />
            <span>Clear Log</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-cyber-border bg-cyber-card p-4">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyber-muted" />
          <input
            type="text"
            placeholder="Search domain or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-cyber-border bg-cyber-dark py-2 pl-9 pr-4 text-xs font-mono text-white placeholder-cyber-dim outline-none focus:border-cyber-green"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
          {['all', 'phishing', 'suspicious', 'safe'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                filterStatus === status
                  ? 'border border-cyber-green/40 bg-cyber-green/10 text-cyber-green'
                  : 'text-cyber-muted hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-cyber-border bg-cyber-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-cyber-border bg-cyber-dark/60 text-[11px] font-semibold uppercase tracking-wider text-cyber-dim">
                <th className="py-3.5 px-5">Target URL</th>
                <th className="py-3.5 px-4">Classification</th>
                <th className="py-3.5 px-4 text-center">Threat Risk</th>
                <th className="py-3.5 px-4 text-center">Confidence</th>
                <th className="py-3.5 px-4">Date / Time</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-border/40 text-sm">
              {filteredScans.map((scan) => (
                <tr key={scan.id} className="group transition-colors hover:bg-cyber-dark/40">
                  <td className="py-3.5 px-5 max-w-sm">
                    <div className="font-mono text-xs font-medium text-white truncate group-hover:text-cyber-green transition-colors">
                      {scan.url}
                    </div>
                    <div className="text-[11px] text-cyber-dim font-mono">{scan.domain}</div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <ThreatBadge status={scan.status} size="small" />
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span className={`font-mono text-xs font-bold ${
                      scan.riskScore > 70 ? 'text-cyber-danger' : scan.riskScore > 35 ? 'text-cyber-warning' : 'text-cyber-green'
                    }`}>
                      {scan.riskScore}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap text-xs font-mono text-cyber-muted">
                    {scan.confidence}%
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs font-mono text-cyber-muted">
                    {scan.timestamp}
                  </td>
                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedScan(scan)}
                        className="rounded-lg border border-cyber-border p-1.5 text-cyber-muted hover:border-cyber-green hover:text-cyber-green transition-all"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => deleteScan(scan.id)}
                        className="rounded-lg border border-cyber-border p-1.5 text-cyber-muted hover:border-cyber-danger hover:text-cyber-danger transition-all"
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
      </div>

      {selectedScan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-cyber-border bg-cyber-dark p-6 shadow-glow space-y-5">
            <div className="flex items-center justify-between border-b border-cyber-border pb-4">
              <div className="flex items-center gap-3">
                <ThreatBadge status={selectedScan.status} />
                <h3 className="text-base font-bold text-white">Scan Record Details</h3>
              </div>
              <button
                onClick={() => setSelectedScan(null)}
                className="rounded-lg p-1.5 text-cyber-muted hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="rounded-xl border border-cyber-border bg-cyber-card p-3.5">
                <span className="text-cyber-dim block mb-1">TARGET URL:</span>
                <span className="text-white break-all">{selectedScan.url}</span>
              </div>
              <div className="rounded-xl border border-cyber-border bg-cyber-card p-4 space-y-2">
                <span className="text-cyber-dim block uppercase font-bold text-[10px]">AI EXPLANATION:</span>
                <p className="text-gray-300 leading-relaxed font-sans text-xs">{selectedScan.aiExplanation}</p>
              </div>
              <div className="rounded-xl border border-cyber-green/20 bg-cyber-green/5 p-3.5 text-cyber-green">
                <span className="font-bold">RECOMMENDATION:</span> {selectedScan.recommendation}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedScan(null)}
                className="rounded-xl bg-cyber-card border border-cyber-border px-5 py-2 text-xs font-semibold text-white hover:border-cyber-green"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanHistory;

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Search,
  Download,
  Trash2,
  X,
  AlertCircle,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ExternalLink,
  FileText,
  History,
  CheckCircle2,
  Lock,
  Unlock,
  SplitSquareHorizontal
} from 'lucide-react';
import { useScan } from '../context/ScanContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { cn } from '../utils';
import PageTransition from '../components/PageTransition';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

export default function ScanHistory() {
  const { scans, clearHistory, deleteScan } = useScan();
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedScan, setSelectedScan] = useState(null);
  
  const [compareMode, setCompareMode] = useState(false);
  const [compareSelection, setCompareSelection] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('search');
    const filter = params.get('filter');
    const compare = params.get('compare');
    if (q) setGlobalFilter(q);
    if (filter) setGlobalFilter(filter);
    if (compare === 'true') setCompareMode(true);
  }, [location.search]);

  const toggleCompare = (scan) => {
    setCompareSelection(prev => {
      const isSelected = prev.find(s => s.id === scan.id);
      if (isSelected) return prev.filter(s => s.id !== scan.id);
      if (prev.length >= 2) {
        toast("You can only compare 2 scans at a time.");
        return prev;
      }
      return [...prev, scan];
    });
  };

  const columns = useMemo(() => {
    const baseCols = [
      {
        accessorKey: 'url',
        header: 'Target Payload',
        cell: info => (
          <div className="flex flex-col">
            <span className="font-mono text-cyber-white text-[13px] truncate max-w-[280px] md:max-w-[400px] hover:text-sage-400 transition-colors cursor-pointer" onClick={() => navigate('/scanner?url=' + encodeURIComponent(info.getValue()))}>{info.getValue()}</span>
            <span className="text-[11px] text-cyber-textMuted mt-0.5">{info.row.original.domain}</span>
          </div>
        )
      },
      {
        accessorKey: 'status',
        header: 'Classification',
        cell: info => {
          const status = info.getValue();
          return (
            <Badge 
              variant={status === 'phishing' ? 'destructive' : status === 'suspicious' ? 'warning' : 'success'}
              className="px-2 py-0.5 uppercase tracking-widest text-[9px]"
            >
              {status}
            </Badge>
          );
        }
      },
      {
        accessorKey: 'riskScore',
        header: () => <div className="text-right">Risk Score</div>,
        cell: info => {
          const val = info.getValue();
          return (
            <div className={`text-right font-mono text-sm font-medium ${val > 70 ? 'text-cyber-danger' : val > 35 ? 'text-cyber-warning' : 'text-cyber-success'}`}>
              {val}
            </div>
          );
        }
      },
      {
        accessorKey: 'date',
        header: () => <div className="text-right">Timestamp</div>,
        cell: info => <div className="text-right text-cyber-textMuted text-xs font-mono">{info.getValue()}</div>
      }
    ];

    if (compareMode) {
      return [
        {
          id: 'select',
          header: 'Compare',
          cell: info => (
            <input 
              type="checkbox"
              className="w-4 h-4 rounded border-cyber-border bg-cyber-cardHover text-sage-500 focus:ring-sage-500/20"
              checked={compareSelection.some(s => s.id === info.row.original.id)}
              onChange={() => toggleCompare(info.row.original)}
            />
          )
        },
        ...baseCols
      ];
    }
    return baseCols;
  }, [compareMode, compareSelection, navigate]);

  const table = useReactTable({
    data: scans,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 12 } }
  });

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,URL,Domain,Status,Risk Score,Confidence\n"
      + scans.map(row => `${row.date},${row.url},${row.domain},${row.status},${row.riskScore},${row.confidence}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "phishgaurds_audit_log.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <PageTransition>
      <div className="flex-1 p-6 sm:p-8 flex flex-col relative h-[calc(100vh-140px)] max-w-[1600px] mx-auto">
        
        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-cyber-white tracking-tight flex items-center gap-3">
              <History className="text-cyber-textMuted" size={28} />
              Investigation Log
            </h1>
            <p className="text-sm text-cyber-textMuted mt-2 max-w-xl">
              {compareMode ? 'Select two operational records to perform a differential signature analysis.' : 'Comprehensive audit trail of all payload scanning operations.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {compareMode && (
              <Button variant="ghost" onClick={() => {
                setCompareMode(false);
                setCompareSelection([]);
              }} className="text-xs bg-cyber-cardHover hover:bg-cyber-cardActive border border-cyber-border">
                <X className="mr-2 h-3.5 w-3.5"/> Cancel Comparison
              </Button>
            )}
            {!compareMode && scans.length >= 2 && (
              <Button variant="outline" onClick={() => setCompareMode(true)} className="text-xs">
                <ArrowUpDown className="mr-2 h-3.5 w-3.5" />
                Compare Scans
              </Button>
            )}
            <Button variant="outline" onClick={() => clearHistory()} className="text-xs text-cyber-danger hover:text-cyber-danger hover:bg-cyber-danger/10 border-cyber-danger/30">
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Clear Log
            </Button>
          </div>
        </div>

        {compareMode && compareSelection.length === 2 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-lg border border-cyber-border bg-cyber-dark p-6 shadow-xl"
          >
            <div className="flex items-center gap-2 mb-6 border-b border-cyber-border/30 pb-4">
              <SplitSquareHorizontal className="text-sage-500" size={18} />
              <h2 className="text-sm font-semibold text-cyber-white uppercase tracking-widest">Differential Signature Analysis</h2>
            </div>
            
            <div className="grid grid-cols-[auto_1fr_1fr] gap-x-6 gap-y-4 text-sm">
              <div className="text-[10px] text-cyber-textMuted uppercase tracking-widest font-semibold flex items-center">Vector</div>
              <div className="font-mono text-cyber-textMuted truncate bg-cyber-cardHover px-3 py-1.5 rounded">{compareSelection[0].url}</div>
              <div className="font-mono text-cyber-textMuted truncate bg-cyber-cardHover px-3 py-1.5 rounded">{compareSelection[1].url}</div>

              <div className="text-[10px] text-cyber-textMuted uppercase tracking-widest font-semibold flex items-center border-t border-cyber-border/30 pt-4">Classification</div>
              <div className="border-t border-cyber-border/30 pt-4">
                <Badge variant={compareSelection[0].status === 'phishing' ? 'destructive' : compareSelection[0].status === 'suspicious' ? 'warning' : 'success'} className="uppercase tracking-widest text-[9px]">{compareSelection[0].status}</Badge>
              </div>
              <div className="border-t border-cyber-border/30 pt-4">
                <Badge variant={compareSelection[1].status === 'phishing' ? 'destructive' : compareSelection[1].status === 'suspicious' ? 'warning' : 'success'} className="uppercase tracking-widest text-[9px]">{compareSelection[1].status}</Badge>
              </div>

              <div className="text-[10px] text-cyber-textMuted uppercase tracking-widest font-semibold flex items-center border-t border-cyber-border/30 pt-4">Risk Score</div>
              <div className="font-mono text-lg border-t border-cyber-border/30 pt-4 text-cyber-white">{compareSelection[0].riskScore} <span className="text-xs text-cyber-textMuted">/ 100</span></div>
              <div className="font-mono text-lg border-t border-cyber-border/30 pt-4 text-cyber-white">{compareSelection[1].riskScore} <span className="text-xs text-cyber-textMuted">/ 100</span></div>

              <div className="text-[10px] text-cyber-textMuted uppercase tracking-widest font-semibold flex items-center border-t border-cyber-border/30 pt-4">Confidence</div>
              <div className="font-mono border-t border-cyber-border/30 pt-4 text-cyber-white">{compareSelection[0].confidence}%</div>
              <div className="font-mono border-t border-cyber-border/30 pt-4 text-cyber-white">{compareSelection[1].confidence}%</div>

              <div className="text-[10px] text-cyber-textMuted uppercase tracking-widest font-semibold flex items-center border-t border-cyber-border/30 pt-4">Target IP</div>
              <div className="font-mono border-t border-cyber-border/30 pt-4 text-cyber-white">{compareSelection[0].features.hasIp ? 'Detected' : 'None'}</div>
              <div className="font-mono border-t border-cyber-border/30 pt-4 text-cyber-white">{compareSelection[1].features.hasIp ? 'Detected' : 'None'}</div>
              
              <div className="text-[10px] text-cyber-textMuted uppercase tracking-widest font-semibold flex items-center border-t border-cyber-border/30 pt-4">Suspicious Tokens</div>
              <div className="font-mono border-t border-cyber-border/30 pt-4 text-cyber-danger">{compareSelection[0].features.suspiciousWords?.join(", ") || "None"}</div>
              <div className="font-mono border-t border-cyber-border/30 pt-4 text-cyber-danger">{compareSelection[1].features.suspiciousWords?.join(", ") || "None"}</div>
            </div>
          </motion.div>
        )}

        <div className="flex-1 flex flex-col bg-cyber-dark rounded-lg border border-cyber-border/60 shadow-sm overflow-hidden min-h-0">
          <div className="p-4 border-b border-cyber-border/50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-cyber-card">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyber-textMuted" />
              <Input
                placeholder="Search payloads, domains..."
                value={globalFilter}
                onChange={e => setGlobalFilter(e.target.value)}
                className="pl-9 h-9 text-xs bg-cyber-dark border-cyber-border focus:border-sage-500/50"
              />
            </div>
            <Button variant="outline" className="text-xs h-9" onClick={exportCSV}>
              <Download className="mr-2 h-3.5 w-3.5" />
              Export CSV
            </Button>
          </div>

          <div className="flex-1 overflow-auto">
            {scans.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-cyber-textMuted p-8">
                <AlertCircle className="h-12 w-12 mb-4 opacity-20" />
                <p className="text-sm">Audit log is currently empty.</p>
              </div>
            ) : (
              <div className="min-w-[800px]">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="sticky top-0 bg-cyber-cardHover z-10 shadow-sm">
                    {table.getHeaderGroups().map(headerGroup => (
                      <tr key={headerGroup.id} className="border-b border-cyber-border/50">
                        {headerGroup.headers.map(header => (
                          <th key={header.id} className="px-6 py-4 font-semibold text-[10px] text-cyber-textMuted uppercase tracking-widest">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody className="divide-y divide-cyber-border/30">
                    {table.getRowModel().rows.map(row => (
                      <tr 
                        key={row.id} 
                        onClick={() => !compareMode && setSelectedScan(row.original)}
                        className={cn(
                          "transition-colors hover:bg-cyber-cardHover",
                          compareMode ? "" : "cursor-pointer",
                          selectedScan?.id === row.original.id ? "bg-cyber-cardHover border-l-2 border-l-sage-500" : "border-l-2 border-l-transparent"
                        )}
                      >
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id} className="px-6 py-3.5">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-cyber-border/50 bg-cyber-dark sticky bottom-0">
                  <div className="text-xs text-cyber-textMuted">
                    Showing <span className="font-mono text-cyber-white">{(table.getState().pagination.pageIndex * table.getState().pagination.pageSize) + 1}</span> to <span className="font-mono text-cyber-white">{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)}</span> of <span className="font-mono text-cyber-white">{table.getFilteredRowModel().rows.length}</span> records
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                      className="bg-cyber-cardHover border-cyber-border hover:bg-cyber-cardActive"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                      className="bg-cyber-cardHover border-cyber-border hover:bg-cyber-cardActive"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right slide-in drawer */}
        <AnimatePresence>
          {selectedScan && !compareMode && (
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 250 }}
              className="absolute top-0 right-0 h-full w-full sm:w-[480px] border-l border-cyber-border/60 bg-cyber-dark z-20 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-cyber-border/60 p-6 bg-cyber-card">
                <h3 className="text-sm font-semibold text-cyber-white flex items-center gap-2 uppercase tracking-widest"><ShieldCheck size={16} className="text-cyber-textMuted"/> Analysis Inspector</h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      deleteScan(selectedScan.id);
                      setSelectedScan(null);
                      toast.success("Log record deleted");
                    }}
                    className="h-8 w-8 text-cyber-textMuted hover:text-cyber-danger hover:bg-cyber-danger/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedScan(null)}
                    className="h-8 w-8 text-cyber-textMuted hover:text-cyber-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                
                {/* Actions */}
                <div className="flex gap-3">
                  <Button variant="secondary" className="flex-1 text-xs h-9 bg-cyber-cardHover hover:bg-cyber-cardActive border-cyber-border text-cyber-white" onClick={() => navigate('/scanner?url=' + encodeURIComponent(selectedScan.url))}>
                    <ExternalLink className="mr-2 h-3.5 w-3.5" />
                    Open in Scanner
                  </Button>
                  <Button variant="outline" className="flex-1 text-xs h-9" onClick={() => navigate(`/report/${selectedScan.id}`)}>
                    <FileText className="mr-2 h-3.5 w-3.5" />
                    Generate Report
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] text-cyber-textMuted uppercase tracking-widest font-semibold mb-2 block">Verdict</span>
                    <Badge 
                      variant={selectedScan.status === 'phishing' ? 'destructive' : selectedScan.status === 'suspicious' ? 'warning' : 'success'}
                      className="px-3 py-1.5 uppercase tracking-widest text-[10px]"
                    >
                      {selectedScan.status}
                    </Badge>
                  </div>
                  
                  <div>
                    <span className="text-[10px] text-cyber-textMuted uppercase tracking-widest font-semibold mb-2 block">Target Payload</span>
                    <div className="rounded-md border border-cyber-border/60 bg-cyber-card p-4">
                      <span className="text-cyber-white break-all text-sm font-mono selection:bg-sage-500/30 leading-relaxed">{selectedScan.url}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-md border border-cyber-border/60 bg-cyber-card p-5 flex flex-col items-center text-center">
                    <span className="text-[10px] text-cyber-textMuted uppercase tracking-widest font-semibold block mb-2">Risk Score</span>
                    <span className={cn(
                      "text-5xl font-medium font-mono tracking-tighter mt-1",
                      selectedScan.riskScore > 70 ? 'text-cyber-danger' : 
                      selectedScan.riskScore > 35 ? 'text-cyber-warning' : 'text-cyber-success'
                    )}>{selectedScan.riskScore}</span>
                  </div>
                  <div className="rounded-md border border-cyber-border/60 bg-cyber-card p-5 flex flex-col items-center text-center">
                    <span className="text-[10px] text-cyber-textMuted uppercase tracking-widest font-semibold block mb-2">Confidence</span>
                    <span className="text-5xl font-medium text-cyber-white font-mono tracking-tighter mt-1">{selectedScan.confidence}<span className="text-2xl text-cyber-textMuted">%</span></span>
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-semibold text-cyber-white uppercase tracking-widest border-l-2 border-cyber-accent pl-2 mb-3">AI Analysis</h3>
                  <div className="rounded-md border border-cyber-border/60 bg-cyber-card p-5">
                    <p className="text-cyber-dim text-sm leading-relaxed font-medium">{selectedScan.aiExplanation}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-semibold text-cyber-white uppercase tracking-widest border-l-2 border-cyber-accent pl-2 mb-3">Technical Evidence</h3>
                  <div className="flex flex-col gap-1 text-sm text-cyber-textMuted">
                    <div className="flex justify-between items-center py-2 border-b border-cyber-border/30">
                      <span>URL Length</span><span className="text-cyber-white font-mono">{selectedScan.features.urlLength} chars</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-cyber-border/30">
                      <span>HTTPS Encrypted</span><span className={selectedScan.features.hasHttps ? "text-cyber-success" : "text-cyber-danger"}>{selectedScan.features.hasHttps ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-cyber-border/30">
                      <span>Raw IP Host</span><span className={selectedScan.features.hasIp ? "text-cyber-danger" : "text-cyber-white"}>{selectedScan.features.hasIp ? "Detected" : "None"}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-cyber-border/30">
                      <span>TLD Reputation</span><span className="text-cyber-white font-mono">{selectedScan.features.tldRisk}</span>
                    </div>
                    {selectedScan.features.suspiciousWords?.length > 0 && (
                      <div className="flex justify-between items-start py-2">
                        <span>Suspicious Tokens</span>
                        <span className="text-cyber-danger font-mono text-right">{selectedScan.features.suspiciousWords.join(", ")}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-[10px] font-semibold text-cyber-white uppercase tracking-widest border-l-2 border-cyber-accent pl-2 mb-3">Recommendation</h3>
                  <div className={cn(
                    "rounded-md border p-5 text-sm font-medium leading-relaxed flex gap-3",
                    selectedScan.status === 'phishing' ? "border-cyber-danger/30 bg-cyber-danger/5 text-cyber-white" :
                    selectedScan.status === 'suspicious' ? "border-cyber-warning/30 bg-cyber-warning/5 text-cyber-white" :
                    "border-cyber-success/30 bg-cyber-success/5 text-cyber-white"
                  )}>
                    {selectedScan.status === 'phishing' ? <ShieldAlert className="text-cyber-danger mt-0.5 shrink-0" size={18} /> : 
                     selectedScan.status === 'suspicious' ? <AlertTriangle className="text-cyber-warning mt-0.5 shrink-0" size={18} /> : 
                     <ShieldCheck className="text-cyber-success mt-0.5 shrink-0" size={18} />}
                    {selectedScan.recommendation}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}

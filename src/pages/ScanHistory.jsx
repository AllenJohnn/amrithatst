import React, { useState, useMemo } from 'react';
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
  History,
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
} from 'lucide-react';
import { useScan } from '../context/ScanContext';
import { cn } from '../utils';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import PageTransition from '../components/PageTransition';

export default function ScanHistory() {
  const { scans, clearHistory, deleteScan } = useScan();
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedScan, setSelectedScan] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredScans = useMemo(() => {
    if (filterStatus === 'all') return scans;
    return scans.filter(s => s.status === filterStatus);
  }, [scans, filterStatus]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'url',
        header: 'Target Payload',
        cell: ({ row }) => {
          return (
            <div className="flex flex-col max-w-[200px] md:max-w-[300px]">
              <span className="font-mono text-sm text-white truncate group-hover:text-sage-400 transition-colors">
                {row.original.url}
              </span>
              <span className="text-xs text-cyber-textMuted truncate">
                {row.original.domain}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Classification',
        cell: ({ row }) => {
          const status = row.original.status;
          let variant = 'success';
          if (status === 'phishing') variant = 'destructive';
          if (status === 'suspicious') variant = 'warning';
          
          return (
            <Badge variant={variant} className="uppercase tracking-widest text-[10px] px-2 py-0.5">
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'riskScore',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="p-0 hover:bg-transparent h-auto"
            >
              Risk
              <ArrowUpDown className="ml-2 h-3 w-3" />
            </Button>
          )
        },
        cell: ({ row }) => {
          const score = row.original.riskScore;
          let color = 'text-green-400';
          if (score > 70) color = 'text-red-400';
          else if (score > 35) color = 'text-amber-400';
          return (
            <span className={cn("font-mono text-sm font-medium", color)}>
              {score}
            </span>
          );
        },
      },
      {
        accessorKey: 'confidence',
        header: 'Confidence',
        cell: ({ row }) => (
          <span className="font-mono text-sm text-cyber-textMuted">
            {row.original.confidence}%
          </span>
        ),
      },
      {
        accessorKey: 'timestamp',
        header: ({ column }) => {
          return (
            <div className="text-right">
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="p-0 hover:bg-transparent h-auto"
              >
                Timestamp
                <ArrowUpDown className="ml-2 h-3 w-3" />
              </Button>
            </div>
          )
        },
        cell: ({ row }) => (
          <div className="text-right text-xs text-cyber-textMuted whitespace-nowrap">
            {row.original.timestamp}
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredScans,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      }
    }
  });

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
    <PageTransition>
      <div className="flex h-full w-full relative overflow-hidden max-w-7xl mx-auto">
        <div className={cn("flex-1 flex flex-col space-y-6 transition-all duration-300", selectedScan ? "pr-[400px]" : "pr-0")}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-white mb-1">
                Audit Log
              </h1>
              <p className="text-sm text-cyber-textMuted">
                Chronological registry of analyzed web payloads.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                disabled={scans.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={clearHistory}
                disabled={scans.length === 0}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Log
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0F0F0F] p-4 rounded-lg border border-cyber-border">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyber-textMuted" />
              <Input
                placeholder="Filter domains or URLs..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-9 bg-[#1A1A1A] border-transparent focus-visible:border-sage-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto">
              {['all', 'phishing', 'suspicious', 'safe'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={cn(
                    "rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wider transition-colors border",
                    filterStatus === status
                      ? "bg-white text-[#090909] border-white"
                      : "bg-[#1A1A1A] text-cyber-textMuted border-cyber-border hover:bg-[#2A2A2A] hover:text-white"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-cyber-border bg-[#0F0F0F] flex-1 flex flex-col overflow-hidden shadow-sm">
            <div className="flex-1 overflow-auto">
              <Table>
                <TableHeader className="bg-[#141414]">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        onClick={() => setSelectedScan(row.original)}
                        className={cn(
                          "cursor-pointer group hover:bg-[#1A1A1A]",
                          selectedScan?.id === row.original.id && "bg-[#1A1A1A]"
                        )}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center text-cyber-textMuted">
                          <AlertCircle className="h-8 w-8 mb-2 opacity-50" />
                          <p>No results found.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-cyber-border bg-[#141414]">
              <div className="text-sm text-cyber-textMuted">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right slide-in drawer */}
        <AnimatePresence>
          {selectedScan && (
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 h-full w-[400px] border-l border-cyber-border bg-[#0F0F0F] z-20 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-cyber-border p-5">
                <h3 className="text-sm font-medium text-white">Analysis Inspector</h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      deleteScan(selectedScan.id);
                      setSelectedScan(null);
                      toast.success("Log record deleted");
                    }}
                    className="h-8 w-8 text-cyber-textMuted hover:text-red-400 hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedScan(null)}
                    className="h-8 w-8 text-cyber-textMuted hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] text-cyber-textMuted uppercase tracking-widest font-semibold mb-2 block">Verdict</span>
                    <Badge 
                      variant={selectedScan.status === 'phishing' ? 'destructive' : selectedScan.status === 'suspicious' ? 'warning' : 'success'}
                      className="px-3 py-1 uppercase tracking-widest text-[10px]"
                    >
                      {selectedScan.status}
                    </Badge>
                  </div>
                  
                  <div>
                    <span className="text-[10px] text-cyber-textMuted uppercase tracking-widest font-semibold mb-2 block">Target Payload</span>
                    <div className="rounded-md border border-cyber-border bg-[#1A1A1A] p-3">
                      <span className="text-white break-all text-sm font-mono selection:bg-sage-500/30">{selectedScan.url}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-md border border-cyber-border bg-[#1A1A1A] p-4">
                    <span className="text-[10px] text-cyber-textMuted uppercase tracking-widest font-semibold block mb-2">Risk Score</span>
                    <span className={cn(
                      "text-3xl font-semibold font-mono tracking-tight",
                      selectedScan.riskScore > 70 ? 'text-red-400' : 
                      selectedScan.riskScore > 35 ? 'text-amber-400' : 'text-green-400'
                    )}>{selectedScan.riskScore}</span>
                  </div>
                  <div className="rounded-md border border-cyber-border bg-[#1A1A1A] p-4">
                    <span className="text-[10px] text-cyber-textMuted uppercase tracking-widest font-semibold block mb-2">Confidence</span>
                    <span className="text-3xl font-semibold text-white font-mono tracking-tight">{selectedScan.confidence}%</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-cyber-textMuted uppercase tracking-widest font-semibold mb-2 block">AI Analysis</span>
                  <div className="rounded-md border border-cyber-border bg-[#1A1A1A] p-4">
                    <p className="text-cyber-textMuted text-sm leading-relaxed">{selectedScan.aiExplanation}</p>
                  </div>
                </div>
                
                <div>
                  <span className="text-[10px] text-cyber-textMuted uppercase tracking-widest font-semibold mb-2 block">Recommendation</span>
                  <div className={cn(
                    "rounded-md border p-4 text-sm font-medium",
                    selectedScan.status === 'phishing' ? "border-red-900/50 bg-red-900/10 text-red-400" :
                    selectedScan.status === 'suspicious' ? "border-amber-900/50 bg-amber-900/10 text-amber-400" :
                    "border-green-900/50 bg-green-900/10 text-green-400"
                  )}>
                    {selectedScan.recommendation}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-cyber-textMuted uppercase tracking-widest font-semibold mb-2 block">System Metadata</span>
                  <div className="rounded-md border border-cyber-border bg-[#1A1A1A] p-4 font-mono text-xs text-cyber-textMuted space-y-3">
                    <div className="flex justify-between border-b border-cyber-border/50 pb-2">
                      <span>Ref ID</span>
                      <span className="text-white">{selectedScan.id}</span>
                    </div>
                    <div className="flex justify-between border-b border-cyber-border/50 pb-2">
                      <span>Engine</span>
                      <span className="text-white">Random Forest</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Timestamp</span>
                      <span className="text-white">{selectedScan.timestamp}</span>
                    </div>
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

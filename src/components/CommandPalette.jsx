import React, { useEffect, useState } from "react"
import { Command } from "cmdk"
import { Search, ShieldAlert, Clock, BarChart2, Activity, Download, FileText, SplitSquareHorizontal } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useScan } from "../context/ScanContext"
import { toast } from "sonner"
import { Badge } from "./ui/Badge"
import "./CommandPalette.css" // We'll add some specific css for cmdk

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { scans } = useScan()

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  if (!open) return null

  const runCommand = (command) => {
    setOpen(false)
    command()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="fixed left-[50%] top-[20%] w-full max-w-2xl -translate-x-[50%]">
        <Command
          className="overflow-hidden rounded-xl border border-cyber-border bg-cyber-dark shadow-2xl"
          label="Global Command Menu"
          shouldFilter={true}
        >
          <div className="flex items-center border-b border-cyber-border px-3" cmdk-input-wrapper="">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 text-cyber-text" />
            <Command.Input 
              autoFocus
              placeholder="Type a command or search..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-cyber-textMuted disabled:cursor-not-allowed disabled:opacity-50 text-cyber-white" 
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2 text-cyber-text">
            <Command.Empty className="py-6 text-center text-sm text-cyber-textMuted">
              No results found.
            </Command.Empty>
            
            <Command.Group heading="Navigation" className="px-2 py-1.5 text-xs font-medium text-cyber-textMuted">
              <Command.Item
                onSelect={() => runCommand(() => navigate('/dashboard'))}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-cyber-cardHover aria-selected:text-cyber-white"
              >
                <Activity className="mr-2 h-4 w-4 text-sage-500" />
                Dashboard Overview
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/scanner'))}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-cyber-cardHover aria-selected:text-cyber-white"
              >
                <ShieldAlert className="mr-2 h-4 w-4 text-amber-500" />
                New Scan
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/history'))}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-cyber-cardHover aria-selected:text-cyber-white"
              >
                <Clock className="mr-2 h-4 w-4 text-sage-500" />
                Scan History
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/analytics'))}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-cyber-cardHover aria-selected:text-cyber-white"
              >
                <BarChart2 className="mr-2 h-4 w-4 text-sage-500" />
                Threat Analytics
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Actions" className="px-2 py-1.5 text-xs font-medium text-cyber-textMuted">
              <Command.Item
                onSelect={() => {
                  runCommand(() => {
                    const headers = ["ID", "URL", "Status", "RiskScore", "Confidence", "Date"];
                    const rows = scans.map(s => [s.id, `"${s.url}"`, s.status, s.riskScore, s.confidence, `"${s.date}"`]);
                    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", `phishgaurds_audit_log_${Date.now()}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    toast.success("Audit log exported");
                  });
                }}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-cyber-cardHover aria-selected:text-cyber-white"
              >
                <Download className="mr-2 h-4 w-4 text-cyber-textMuted" />
                Export Full Audit Log (CSV)
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/history?compare=true'))}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-cyber-cardHover aria-selected:text-cyber-white"
              >
                <SplitSquareHorizontal className="mr-2 h-4 w-4 text-sage-500" />
                Compare Scans
              </Command.Item>
            </Command.Group>

            {scans.length > 0 && (
              <Command.Group heading="Recent Scans" className="px-2 py-1.5 text-xs font-medium text-cyber-textMuted">
                {scans.slice(0, 5).map(scan => (
                  <Command.Item
                    key={scan.id}
                    onSelect={() => runCommand(() => navigate(`/report/${scan.id}`))}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-cyber-cardHover aria-selected:text-cyber-white"
                  >
                    <FileText className="mr-2 h-4 w-4 text-cyber-textMuted" />
                    <span className="truncate max-w-[400px]">Generate Report: {scan.url}</span>
                    <Badge variant={scan.status === 'phishing' ? 'destructive' : scan.status === 'suspicious' ? 'warning' : 'success'} className="ml-auto text-[9px] px-1.5 py-0">
                      {scan.status}
                    </Badge>
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>
        </Command>
      </div>
    </div>
  )
}

import React, { useEffect, useState } from "react"
import { Command } from "cmdk"
import { Search, ShieldAlert, Clock, BarChart2, Activity } from "lucide-react"
import { useNavigate } from "react-router-dom"
import "./CommandPalette.css" // We'll add some specific css for cmdk

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

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
          className="overflow-hidden rounded-xl border border-cyber-border bg-[#0F0F0F] shadow-2xl"
          label="Global Command Menu"
          shouldFilter={true}
        >
          <div className="flex items-center border-b border-cyber-border px-3" cmdk-input-wrapper="">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 text-cyber-text" />
            <Command.Input 
              autoFocus
              placeholder="Type a command or search..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-cyber-textMuted disabled:cursor-not-allowed disabled:opacity-50 text-white" 
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2 text-cyber-text">
            <Command.Empty className="py-6 text-center text-sm text-cyber-textMuted">
              No results found.
            </Command.Empty>
            
            <Command.Group heading="Navigation" className="px-2 py-1.5 text-xs font-medium text-cyber-textMuted">
              <Command.Item
                onSelect={() => runCommand(() => navigate('/'))}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-cyber-cardHover aria-selected:text-white"
              >
                <Activity className="mr-2 h-4 w-4 text-sage-500" />
                Dashboard Overview
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/scanner'))}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-cyber-cardHover aria-selected:text-white"
              >
                <ShieldAlert className="mr-2 h-4 w-4 text-amber-500" />
                New Scan
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/history'))}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-cyber-cardHover aria-selected:text-white"
              >
                <Clock className="mr-2 h-4 w-4 text-sage-500" />
                Scan History
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/analytics'))}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-cyber-cardHover aria-selected:text-white"
              >
                <BarChart2 className="mr-2 h-4 w-4 text-sage-500" />
                Threat Analytics
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  )
}

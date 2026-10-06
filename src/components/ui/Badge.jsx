import * as React from "react"
import { cn } from "../../utils"

function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "border-transparent bg-cyber-card text-cyber-text hover:bg-cyber-cardHover",
    secondary: "border-transparent bg-cyber-dark text-cyber-text hover:bg-cyber-card",
    destructive: "border-transparent bg-red-900/30 text-red-400 hover:bg-red-900/50",
    outline: "text-cyber-text border-cyber-border",
    success: "border-transparent bg-green-900/30 text-green-400 hover:bg-green-900/50",
    warning: "border-transparent bg-amber-900/30 text-amber-400 hover:bg-amber-900/50",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2 focus:ring-offset-[#090909]",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }

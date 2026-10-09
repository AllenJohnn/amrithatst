import * as React from "react"
import { cn } from "../../utils"

function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "border-transparent bg-cyber-card text-cyber-text hover:bg-cyber-cardHover",
    secondary: "border-transparent bg-cyber-dark text-cyber-text hover:bg-cyber-card",
    destructive: "border-transparent bg-cyber-danger/10 text-cyber-danger hover:bg-cyber-danger/15",
    outline: "text-cyber-text border-cyber-border",
    success: "border-transparent bg-cyber-success/10 text-cyber-success hover:bg-cyber-success/15",
    warning: "border-transparent bg-cyber-warning/10 text-cyber-warning hover:bg-cyber-warning/15",
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

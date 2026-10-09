import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "../../utils"

const Button = React.forwardRef(({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  
  const variants = {
    default: "bg-cyber-accent text-cyber-black hover:brightness-95",
    destructive: "bg-cyber-danger/10 text-cyber-danger hover:bg-cyber-danger/15 border border-cyber-danger/25",
    outline: "border border-cyber-border bg-transparent hover:bg-cyber-cardHover text-cyber-text",
    secondary: "bg-cyber-card text-cyber-text hover:bg-cyber-cardHover border border-cyber-border",
    ghost: "hover:bg-cyber-cardHover text-cyber-text hover:text-cyber-white",
    link: "text-sage-500 underline-offset-4 hover:underline",
  }

  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-10 rounded-md px-8",
    icon: "h-9 w-9",
  }

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage-500 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }

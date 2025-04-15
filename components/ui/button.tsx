import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, children, variant = "default", size = "default", asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none ring-offset-background focus-visible:ring-offset-0",
        variant === "ghost"
          ? "bg-transparent hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-transparent"
          : variant === "secondary"
            ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            : variant === "destructive"
              ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              : "bg-primary text-primary-foreground hover:bg-primary/90",
        size === "sm" ? "h-8 px-2 rounded-md" : size === "lg" ? "h-10 px-8 rounded-md" : "h-9 px-4",
        className,
      )}
      ref={ref}
      {...props}
    >
      {children}
    </Comp>
  )
})
Button.displayName = "Button"

export { Button }

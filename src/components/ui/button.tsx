import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 crypto-glow-primary hover-lift",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 crypto-glow-danger hover-lift",
        outline: "border border-border glass hover:bg-primary/10 hover:text-primary hover:border-primary/50 hover-glow",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover-lift",
        ghost: "hover:bg-accent/10 hover:text-accent hover-scale",
        link: "text-primary underline-offset-4 hover:underline transition-smooth",
        accent: "gradient-accent text-accent-foreground crypto-glow-accent hover-lift",
        success: "bg-success text-success-foreground crypto-glow-success hover-lift",
        warning: "bg-warning text-warning-foreground crypto-glow-warning hover-lift",
        glass: "glass hover:glass-strong hover-glow transition-smooth",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-13 rounded-lg px-8 text-base",
        xl: "h-16 rounded-xl px-10 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

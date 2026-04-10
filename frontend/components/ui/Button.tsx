import { ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger"
  size?: "sm" | "md"
}

const variantClasses = {
  primary: "bg-accent text-white hover:bg-accent/90",
  ghost:   "bg-transparent text-text-muted hover:bg-elevated hover:text-text-primary border border-border",
  danger:  "bg-transparent text-score-low hover:bg-score-low/10 border border-score-low/30",
}

const sizeClasses = {
  sm: "h-7 px-3 text-xs rounded-md",
  md: "h-9 px-4 text-sm rounded-lg",
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        font-medium transition-colors duration-100
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}

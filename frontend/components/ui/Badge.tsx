interface BadgeProps {
  label: string
  variant?: "default" | "accent" | "success" | "warning" | "danger"
}

const variantClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-elevated text-text-muted",
  accent:  "bg-accent/15 text-accent",
  success: "bg-score-high/15 text-score-high",
  warning: "bg-score-mid/15 text-score-mid",
  danger:  "bg-score-low/15 text-score-low",
}

export function Badge({ label, variant = "default" }: BadgeProps) {
  return (
    <span className={`
      inline-flex items-center px-2 py-0.5 rounded-full
      text-xs font-medium whitespace-nowrap
      ${variantClasses[variant]}
    `}>
      {label}
    </span>
  )
}

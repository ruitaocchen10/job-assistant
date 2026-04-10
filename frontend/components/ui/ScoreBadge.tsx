interface ScoreBadgeProps {
  score: number | null
}

export function ScoreBadge({ score }: ScoreBadgeProps) {
  if (score == null) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
        <span className="w-1.5 h-1.5 rounded-full bg-border" />
        Unscored
      </span>
    )
  }

  const color =
    score >= 70 ? "bg-score-high text-score-high" :
    score >= 40 ? "bg-score-mid text-score-mid" :
                  "bg-score-low text-score-low"

  const dot =
    score >= 70 ? "bg-score-high" :
    score >= 40 ? "bg-score-mid" :
                  "bg-score-low"

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${color.split(" ")[1]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {Math.round(score)}
    </span>
  )
}

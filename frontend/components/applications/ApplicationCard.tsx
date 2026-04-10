"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Application } from "@/lib/types"
import { ScoreBadge } from "@/components/ui/ScoreBadge"

interface ApplicationCardProps {
  application: Application
}

function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: application.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="
        flex flex-col gap-2 p-3
        bg-surface border border-border rounded-lg
        cursor-grab active:cursor-grabbing
        hover:border-accent/40 transition-colors duration-100
        touch-none select-none
      "
    >
      {/* Title + score */}
      <div className="flex items-start justify-between gap-2">
        <a
          href={application.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="text-sm font-medium text-text-primary hover:text-accent line-clamp-2 leading-snug"
        >
          {application.job_title}
        </a>
        <div className="shrink-0 mt-0.5">
          <ScoreBadge score={application.llm_score} />
        </div>
      </div>

      {/* Company */}
      <p className="text-xs text-text-muted">{application.company}</p>

      {/* Salary */}
      {application.salary && (
        <p className="text-xs text-score-high font-medium">{application.salary}</p>
      )}

      {/* Notes */}
      {application.notes && (
        <p className="text-xs text-text-muted line-clamp-2 border-t border-border pt-2">
          {application.notes}
        </p>
      )}

      {/* Applied date */}
      {application.applied_at && (
        <p className="text-xs text-text-muted">
          Applied {formatDate(application.applied_at)}
        </p>
      )}
    </div>
  )
}

"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Application, ApplicationStatus } from "@/lib/types"
import { ApplicationCard } from "./ApplicationCard"

interface ColumnConfig {
  status: ApplicationStatus
  label: string
  color: string
}

interface KanbanColumnProps {
  column: ColumnConfig
  applications: Application[]
}

export function KanbanColumn({ column, applications }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.status })

  return (
    <div className="flex flex-col min-w-[17rem] w-[17rem] flex-shrink-0">
      {/* Column header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className={`text-xs font-semibold uppercase tracking-wider ${column.color}`}>
          {column.label}
        </span>
        <span className="text-xs text-text-muted bg-elevated border border-border rounded-full px-2 py-0.5">
          {applications.length}
        </span>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`
          flex flex-col gap-2 flex-1 p-2 rounded-xl min-h-[8rem]
          border border-dashed transition-colors duration-100
          ${isOver ? "border-accent/60 bg-accent/5" : "border-border/50 bg-base/50"}
        `}
      >
        <SortableContext
          items={applications.map(a => a.id)}
          strategy={verticalListSortingStrategy}
        >
          {applications.map(app => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </SortableContext>

        {applications.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs text-text-muted/50">Drop here</p>
          </div>
        )}
      </div>
    </div>
  )
}

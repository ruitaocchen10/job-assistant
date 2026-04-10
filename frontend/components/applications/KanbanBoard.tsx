"use client"

import { useState } from "react"
import { DndContext, DragEndEvent, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { Application, ApplicationStatus } from "@/lib/types"
import { updateApplication } from "@/lib/api"
import { KanbanColumn } from "./KanbanColumn"
import { ApplicationCard } from "./ApplicationCard"

const COLUMNS: { status: ApplicationStatus; label: string; color: string }[] = [
  { status: "saved",        label: "Saved",        color: "text-accent" },
  { status: "applied",      label: "Applied",      color: "text-score-mid" },
  { status: "interviewing", label: "Interviewing", color: "text-text-primary" },
  { status: "offered",      label: "Offered",      color: "text-score-high" },
  { status: "rejected",     label: "Rejected",     color: "text-score-low" },
  { status: "discarded",    label: "Discarded",    color: "text-text-muted" },
]

interface KanbanBoardProps {
  initialApplications: Application[]
}

export function KanbanBoard({ initialApplications }: KanbanBoardProps) {
  const [applications, setApplications] = useState(initialApplications)
  const [activeId, setActiveId] = useState<number | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const byStatus = (status: ApplicationStatus) =>
    applications.filter(a => a.status === status)

  const activeApp = activeId != null ? applications.find(a => a.id === activeId) : null

  function findStatus(id: number): ApplicationStatus | null {
    return applications.find(a => a.id === id)?.status ?? null
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)
    if (!over) return

    const appId = active.id as number
    const overId = over.id

    // Determine destination status — over.id is either a status string or another app's id
    const destStatus = COLUMNS.find(c => c.status === overId)?.status
      ?? findStatus(overId as number)

    if (!destStatus) return

    const srcStatus = findStatus(appId)
    if (srcStatus === destStatus) return

    // Optimistic update
    setApplications(prev =>
      prev.map(a => a.id === appId ? { ...a, status: destStatus } : a)
    )

    try {
      await updateApplication(appId, { status: destStatus })
    } catch (e) {
      // Revert on failure
      console.error(e)
      setApplications(prev =>
        prev.map(a => a.id === appId ? { ...a, status: srcStatus! } : a)
      )
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={e => setActiveId(e.active.id as number)}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hidden">
        {COLUMNS.map(col => (
          <KanbanColumn
            key={col.status}
            column={col}
            applications={byStatus(col.status)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeApp && (
          <div className="rotate-1 shadow-xl">
            <ApplicationCard application={activeApp} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

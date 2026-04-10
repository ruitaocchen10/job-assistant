"use client"

import { useEffect, useState } from "react"
import { Application } from "@/lib/types"
import { getApplications } from "@/lib/api"
import { KanbanBoard } from "@/components/applications/KanbanBoard"

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getApplications()
      .then(setApplications)
      .catch(() => setError("Could not reach the API. Is the backend running?"))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 h-full">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-text-primary tracking-tight">Applications</h1>
        <p className="text-sm text-text-muted mt-0.5">
          {applications.length > 0
            ? `${applications.length} application${applications.length === 1 ? "" : "s"} tracked`
            : "Drag cards between columns to update status"}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-score-low/30 bg-score-low/10 px-4 py-3 text-sm text-score-low">
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && !error && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="min-w-[17rem] w-[17rem] flex-shrink-0">
              <div className="h-4 w-20 bg-surface rounded mb-3 animate-pulse" />
              <div className="h-48 bg-surface border border-border rounded-xl animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && applications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-2">
          <p className="text-text-primary font-medium">No applications yet</p>
          <p className="text-sm text-text-muted">Save a job from the Jobs page to get started</p>
        </div>
      )}

      {/* Board */}
      {!loading && !error && applications.length > 0 && (
        <KanbanBoard initialApplications={applications} />
      )}
    </div>
  )
}

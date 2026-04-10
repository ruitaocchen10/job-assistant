"use client"

import { useEffect, useRef, useState } from "react"
import { Job } from "@/lib/types"
import { getJobs } from "@/lib/api"
import { JobCard } from "@/components/jobs/JobCard"
import { JobFilters } from "@/components/jobs/JobFilters"
import { AddJobModal } from "@/components/jobs/AddJobModal"
import { Button } from "@/components/ui/Button"

interface Filters {
  keyword: string
  score_min: number
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filters, setFilters] = useState<Filters>({ keyword: "", score_min: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const keywordDebounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  function fetchJobs(f: Filters) {
    setLoading(true)
    setError(null)
    getJobs({ keyword: f.keyword || undefined, score_min: f.score_min || undefined })
      .then(setJobs)
      .catch(() => setError("Could not reach the API. Is the backend running?"))
      .finally(() => setLoading(false))
  }

  // Initial load
  useEffect(() => { fetchJobs(filters) }, [])

  function handleFilterChange(next: Filters) {
    setFilters(next)
    if (keywordDebounce.current) clearTimeout(keywordDebounce.current)
    // Debounce keyword, apply score_min immediately
    if (next.keyword !== filters.keyword) {
      keywordDebounce.current = setTimeout(() => fetchJobs(next), 300)
    } else {
      fetchJobs(next)
    }
  }

  function handleSaved(jobId: number) {
    setJobs(prev =>
      prev.map(j => j.id === jobId ? { ...j, application_status: "saved" } : j)
    )
  }

  function handleHidden(jobId: number) {
    setJobs(prev => prev.filter(j => j.id !== jobId))
  }

  function handleJobAdded(job: Job) {
    setJobs(prev => [job, ...prev])
    setShowAddModal(false)
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full">

      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-text-primary tracking-tight">Jobs</h1>
          <p className="text-sm text-text-muted mt-0.5">Browse and save remote job listings</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowAddModal(true)}
        >
          + Add Job
        </Button>
      </div>

      {/* Filters */}
      <JobFilters
        filters={filters}
        total={jobs.length}
        onChange={handleFilterChange}
      />

      {/* States */}
      {error && (
        <div className="rounded-xl border border-score-low/30 bg-score-low/10 px-4 py-3 text-sm text-score-low">
          {error}
        </div>
      )}

      {loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 rounded-xl bg-surface border border-border animate-pulse" />
          ))}
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-2">
          <p className="text-text-primary font-medium">No jobs found</p>
          <p className="text-sm text-text-muted">Try adjusting your filters or run the fetcher</p>
        </div>
      )}

      {/* Job grid */}
      {!loading && !error && jobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {jobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              onSaved={handleSaved}
              onHidden={handleHidden}
            />
          ))}
        </div>
      )}

      {/* Add Job Modal */}
      {showAddModal && (
        <AddJobModal
          onSuccess={handleJobAdded}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  )
}

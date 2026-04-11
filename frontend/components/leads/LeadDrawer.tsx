"use client"

import { useEffect, useState } from "react"
import { Lead, JobLead, LEAD_RELATIONSHIPS, Job } from "@/lib/types"
import {
  getLeadJobs,
  linkLeadToJob,
  unlinkLeadFromJob,
  getJobs,
} from "@/lib/api"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"

interface LeadDrawerProps {
  lead: Lead
  onClose: () => void
  onEdit: (lead: Lead) => void
  onDelete: (lead: Lead) => void
}

export function LeadDrawer({
  lead,
  onClose,
  onEdit,
  onDelete,
}: LeadDrawerProps) {
  const [jobLeads, setJobLeads] = useState<JobLead[]>([])
  const [loadingJobs, setLoadingJobs] = useState(false)
  const [showLinkForm, setShowLinkForm] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])
  const [linkForm, setLinkForm] = useState({
    job_id: "",
    relationship: "",
    notes: "",
  })
  const [linking, setLinking] = useState(false)
  const [linkError, setLinkError] = useState<string | null>(null)

  // Fetch linked jobs on mount
  useEffect(() => {
    setLoadingJobs(true)
    getLeadJobs(lead.id)
      .then(setJobLeads)
      .catch(() => setJobLeads([]))
      .finally(() => setLoadingJobs(false))
  }, [lead.id])

  // Fetch available jobs when link form opens
  useEffect(() => {
    if (showLinkForm && jobs.length === 0) {
      getJobs()
        .then(setJobs)
        .catch(() => setJobs([]))
    }
  }, [showLinkForm, jobs.length])

  function handleLinkFormChange(
    field: keyof typeof linkForm
  ): React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> {
    return (e) => {
      setLinkForm((prev) => ({ ...prev, [field]: e.target.value }))
    }
  }

  async function handleLinkSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLinking(true)
    setLinkError(null)

    try {
      const jobId = parseInt(linkForm.job_id, 10)
      if (!jobId) {
        setLinkError("Please select a job")
        setLinking(false)
        return
      }

      const newJobLead = await linkLeadToJob(lead.id, {
        job_id: jobId,
        relationship: linkForm.relationship,
        notes: linkForm.notes || undefined,
      })

      setJobLeads((prev) => [newJobLead, ...prev])
      setLinkForm({ job_id: "", relationship: "", notes: "" })
      setShowLinkForm(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ""
      if (msg.includes("409")) {
        setLinkError("This lead is already linked to that job")
      } else {
        setLinkError("Failed to link job. Please try again.")
      }
    } finally {
      setLinking(false)
    }
  }

  async function handleUnlink(jobLeadId: number) {
    try {
      await unlinkLeadFromJob(lead.id, jobLeadId)
      setJobLeads((prev) => prev.filter((jl) => jl.id !== jobLeadId))
    } catch {
      // Error handling could be enhanced here
    }
  }

  const inputCls = `
    w-full px-3 text-sm
    bg-elevated border border-border rounded-lg
    text-text-primary placeholder:text-text-muted
    focus:outline-none focus:border-accent
    transition-colors
  `

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-30 bg-black/40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-[420px] bg-surface border-l border-border flex flex-col shadow-2xl z-40">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h2 className="text-base font-semibold text-text-primary">
            {lead.name}
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(lead)}
            >
              Edit
            </Button>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-primary transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Contact Info */}
          <div className="px-5 py-4 border-b border-border">
            <dl className="grid grid-cols-[100px_1fr] gap-x-4 gap-y-3">
              {lead.email && (
                <>
                  <dt className="text-xs text-text-muted">Email</dt>
                  <dd className="text-sm">
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-accent hover:underline"
                    >
                      {lead.email}
                    </a>
                  </dd>
                </>
              )}
              {lead.linkedin_url && (
                <>
                  <dt className="text-xs text-text-muted">LinkedIn</dt>
                  <dd className="text-sm">
                    <a
                      href={lead.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      Open ↗
                    </a>
                  </dd>
                </>
              )}
              {lead.company && (
                <>
                  <dt className="text-xs text-text-muted">Company</dt>
                  <dd className="text-sm text-text-primary">{lead.company}</dd>
                </>
              )}
              {lead.title && (
                <>
                  <dt className="text-xs text-text-muted">Title</dt>
                  <dd className="text-sm text-text-primary">{lead.title}</dd>
                </>
              )}
            </dl>
          </div>

          {/* Notes */}
          {lead.notes && (
            <div className="px-5 py-4 border-b border-border">
              <dt className="text-xs font-medium text-text-muted mb-1">
                Notes
              </dt>
              <dd className="text-sm text-text-muted leading-relaxed">
                {lead.notes}
              </dd>
            </div>
          )}

          {/* Linked Jobs */}
          <div className="px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                Linked Jobs
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLinkForm(!showLinkForm)}
              >
                + Link Job
              </Button>
            </div>

            {/* Link Job Form */}
            {showLinkForm && (
              <form
                onSubmit={handleLinkSubmit}
                className="rounded-lg border border-border bg-elevated p-3 mb-3"
              >
                {/* Job Select */}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-text-muted mb-1">
                    Job
                  </label>
                  <select
                    value={linkForm.job_id}
                    onChange={handleLinkFormChange("job_id")}
                    className={`${inputCls} h-9`}
                  >
                    <option value="">— select a job —</option>
                    {jobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title} – {job.company}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Relationship Select */}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-text-muted mb-1">
                    Relationship
                  </label>
                  <select
                    value={linkForm.relationship}
                    onChange={handleLinkFormChange("relationship")}
                    className={`${inputCls} h-9`}
                  >
                    <option value="">— select —</option>
                    {LEAD_RELATIONSHIPS.map((rel) => (
                      <option key={rel.value} value={rel.value}>
                        {rel.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Notes */}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-text-muted mb-1">
                    Notes
                  </label>
                  <textarea
                    value={linkForm.notes}
                    onChange={handleLinkFormChange("notes")}
                    placeholder="Optional notes…"
                    className={`${inputCls} min-h-[60px] py-2 resize-none`}
                  />
                </div>

                {/* Error */}
                {linkError && (
                  <p className="text-xs text-score-low mb-3">{linkError}</p>
                )}

                {/* Actions */}
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowLinkForm(false)
                      setLinkError(null)
                      setLinkForm({ job_id: "", relationship: "", notes: "" })
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={linking}
                  >
                    {linking ? "Linking…" : "Link"}
                  </Button>
                </div>
              </form>
            )}

            {/* Linked Job Cards */}
            {loadingJobs ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-20 rounded-lg bg-elevated border border-border animate-pulse"
                  />
                ))}
              </div>
            ) : jobLeads.length === 0 ? (
              <p className="text-sm text-text-muted">
                No linked jobs yet.
              </p>
            ) : (
              <div className="space-y-2">
                {jobLeads.map((jobLead) => (
                  <div
                    key={jobLead.id}
                    className="rounded-lg border border-border bg-elevated p-3 flex flex-col gap-1.5"
                  >
                    <a
                      href={jobLead.job_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-text-primary hover:text-accent transition-colors"
                    >
                      {jobLead.job_title}
                    </a>
                    <p className="text-xs text-text-muted">
                      {jobLead.company}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge
                        label={
                          LEAD_RELATIONSHIPS.find(
                            (r) => r.value === jobLead.relationship
                          )?.label || jobLead.relationship || "Unknown"
                        }
                        variant="accent"
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleUnlink(jobLead.id)}
                      >
                        Unlink
                      </Button>
                    </div>
                    {jobLead.notes && (
                      <p className="text-xs text-text-muted italic pt-1 border-t border-border">
                        {jobLead.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Delete Button Footer */}
        <div className="px-5 py-4 border-t border-border shrink-0">
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(lead)}
            className="w-full"
          >
            Delete Lead
          </Button>
        </div>
      </div>
    </>
  )
}

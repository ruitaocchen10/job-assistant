"use client"

import { useState } from "react"
import { Job } from "@/lib/types"
import { saveJob, hideJob } from "@/lib/api"
import { Badge } from "@/components/ui/Badge"
import { ScoreBadge } from "@/components/ui/ScoreBadge"
import { Button } from "@/components/ui/Button"

interface JobCardProps {
  job: Job
  onSaved: (jobId: number) => void
  onHidden: (jobId: number) => void
}

function CompanyLogo({ name, logo }: { name: string; logo: string | null }) {
  const [errored, setErrored] = useState(false)
  const initials = name.slice(0, 2).toUpperCase()

  if (!logo || errored) {
    return (
      <div className="w-10 h-10 rounded-lg bg-elevated border border-border flex items-center justify-center shrink-0">
        <span className="text-xs font-semibold text-text-muted">{initials}</span>
      </div>
    )
  }

  return (
    <img
      src={logo}
      alt={name}
      onError={() => setErrored(true)}
      className="w-10 h-10 rounded-lg object-contain bg-elevated border border-border shrink-0"
    />
  )
}

function timeAgo(dateStr: string): string {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

const JOB_TYPE_LABELS: Record<string, string> = {
  full_time:   "Full-time",
  contract:    "Contract",
  part_time:   "Part-time",
  freelance:   "Freelance",
  internship:  "Internship",
}

export function JobCard({ job, onSaved, onHidden }: JobCardProps) {
  const [loading, setLoading] = useState<"save" | "hide" | null>(null)
  const isSaved = job.application_status != null

  async function handleSave() {
    setLoading("save")
    try {
      await saveJob(job.id)
      onSaved(job.id)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(null)
    }
  }

  async function handleHide() {
    setLoading("hide")
    try {
      await hideJob(job.id)
      onHidden(job.id)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(null)
    }
  }

  return (
    <article className="
      flex flex-col gap-4 p-4 md:p-5
      bg-surface border border-border rounded-xl
      hover:bg-elevated transition-colors duration-100
    ">
      {/* Header */}
      <div className="flex items-start gap-3">
        <CompanyLogo name={job.company} logo={job.company_logo} />
        <div className="flex-1 min-w-0">
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-text-primary hover:text-accent transition-colors line-clamp-2 leading-snug"
          >
            {job.title}
          </a>
          <p className="text-xs text-text-muted mt-0.5 truncate">{job.company}</p>
        </div>
        <ScoreBadge score={job.llm_score} />
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-1.5">
        {job.job_type && (
          <Badge label={JOB_TYPE_LABELS[job.job_type] ?? job.job_type} variant="accent" />
        )}
        {job.location && (
          <Badge label={job.location} />
        )}
        {job.salary && (
          <Badge label={job.salary} variant="success" />
        )}
      </div>

      {/* Tags */}
      {job.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {job.tags.slice(0, 5).map(tag => (
            <span
              key={tag}
              className="text-xs text-text-muted bg-base px-2 py-0.5 rounded-full border border-border"
            >
              {tag}
            </span>
          ))}
          {job.tags.length > 5 && (
            <span className="text-xs text-text-muted px-1">+{job.tags.length - 5}</span>
          )}
        </div>
      )}

      {/* LLM notes */}
      {job.llm_notes && (
        <p className="text-xs text-text-muted leading-relaxed border-t border-border pt-3">
          {job.llm_notes}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-border">
        <span className="text-xs text-text-muted">{timeAgo(job.posted_at)}</span>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHide}
            disabled={loading !== null}
          >
            Hide
          </Button>
          {isSaved ? (
            <Button variant="ghost" size="sm" disabled>
              Saved ✓
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={loading !== null}
            >
              {loading === "save" ? "Saving…" : "Save"}
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}

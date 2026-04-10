"use client"

import { useState } from "react"
import { Job } from "@/lib/types"
import { addJob, JobCreate } from "@/lib/api"
import { Button } from "@/components/ui/Button"

interface AddJobModalProps {
  onSuccess: (job: Job) => void
  onClose: () => void
}

const JOB_TYPE_OPTIONS = [
  { value: "", label: "— select —" },
  { value: "full_time", label: "Full-time" },
  { value: "contract", label: "Contract" },
  { value: "part_time", label: "Part-time" },
  { value: "freelance", label: "Freelance" },
  { value: "internship", label: "Internship" },
]

export function AddJobModal({ onSuccess, onClose }: AddJobModalProps) {
  const [form, setForm] = useState({
    url: "",
    title: "",
    company: "",
    location: "",
    salary: "",
    job_type: "",
    tags: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const payload: JobCreate = {
      url: form.url.trim(),
      title: form.title.trim(),
      company: form.company.trim(),
      location: form.location.trim() || undefined,
      salary: form.salary.trim() || undefined,
      job_type: form.job_type || undefined,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    }

    try {
      const job = await addJob(payload)
      onSuccess(job)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ""
      if (msg.includes("409")) {
        setError("A job with this URL already exists.")
      } else {
        setError("Something went wrong. Please try again.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  const inputCls = `
    w-full h-9 px-3 text-sm
    bg-elevated border border-border rounded-lg
    text-text-primary placeholder:text-text-muted
    focus:outline-none focus:border-accent
    transition-colors
  `

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-lg bg-surface border border-border rounded-xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-text-primary">Add Job</h2>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 py-5">
          {/* URL — required */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-muted">
              URL <span className="text-score-low">*</span>
            </label>
            <input
              type="url"
              required
              placeholder="https://…"
              value={form.url}
              onChange={set("url")}
              className={inputCls}
            />
          </div>

          {/* Title — required */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-muted">
              Job Title <span className="text-score-low">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Senior Engineer"
              value={form.title}
              onChange={set("title")}
              className={inputCls}
            />
          </div>

          {/* Company — required */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-muted">
              Company <span className="text-score-low">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Acme Corp"
              value={form.company}
              onChange={set("company")}
              className={inputCls}
            />
          </div>

          {/* Location + Salary — side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-muted">
                Location
              </label>
              <input
                type="text"
                placeholder="Remote"
                value={form.location}
                onChange={set("location")}
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-muted">
                Salary
              </label>
              <input
                type="text"
                placeholder="$120k – $160k"
                value={form.salary}
                onChange={set("salary")}
                className={inputCls}
              />
            </div>
          </div>

          {/* Job Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-muted">
              Job Type
            </label>
            <select
              value={form.job_type}
              onChange={set("job_type")}
              className={inputCls}
            >
              {JOB_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-muted">
              Tags
              <span className="ml-1 font-normal text-text-muted/70">
                (comma-separated)
              </span>
            </label>
            <input
              type="text"
              placeholder="React, TypeScript, Remote"
              value={form.tags}
              onChange={set("tags")}
              className={inputCls}
            />
          </div>

          {/* Error */}
          {error && <p className="text-xs text-score-low">{error}</p>}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={submitting}>
              {submitting ? "Adding…" : "Add Job"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

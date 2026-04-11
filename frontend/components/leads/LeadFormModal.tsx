"use client"

import { useState } from "react"
import { Lead } from "@/lib/types"
import { createLead, updateLead, LeadCreate, LeadPatch } from "@/lib/api"
import { Button } from "@/components/ui/Button"

interface LeadFormModalProps {
  initial?: Lead
  onSuccess: (lead: Lead) => void
  onClose: () => void
}

export function LeadFormModal({
  initial,
  onSuccess,
  onClose,
}: LeadFormModalProps) {
  const isEditMode = !!initial
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    email: initial?.email ?? "",
    linkedin_url: initial?.linkedin_url ?? "",
    company: initial?.company ?? "",
    title: initial?.title ?? "",
    notes: initial?.notes ?? "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set(field: keyof typeof form) {
    return (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      let lead: Lead
      if (isEditMode) {
        const patch: LeadPatch = {
          name: form.name.trim() || undefined,
          email: form.email.trim() || undefined,
          linkedin_url: form.linkedin_url.trim() || undefined,
          company: form.company.trim() || undefined,
          title: form.title.trim() || undefined,
          notes: form.notes.trim() || undefined,
        }
        lead = await updateLead(initial!.id, patch)
      } else {
        const payload: LeadCreate = {
          name: form.name.trim(),
          email: form.email.trim() || undefined,
          linkedin_url: form.linkedin_url.trim() || undefined,
          company: form.company.trim() || undefined,
          title: form.title.trim() || undefined,
          notes: form.notes.trim() || undefined,
        }
        lead = await createLead(payload)
      }
      onSuccess(lead)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ""
      setError("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-lg bg-surface border border-border rounded-xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-text-primary">
            {isEditMode ? "Edit Lead" : "Add Lead"}
          </h2>
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
          {/* Name — required */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-muted">
              Name <span className="text-score-low">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="John Doe"
              value={form.name}
              onChange={set("name")}
              className={`${inputCls} h-9`}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-muted">
              Email
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={set("email")}
              className={`${inputCls} h-9`}
            />
          </div>

          {/* LinkedIn URL */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-muted">
              LinkedIn URL
            </label>
            <input
              type="url"
              placeholder="https://linkedin.com/in/john"
              value={form.linkedin_url}
              onChange={set("linkedin_url")}
              className={`${inputCls} h-9`}
            />
          </div>

          {/* Company + Title — side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-muted">
                Company
              </label>
              <input
                type="text"
                placeholder="Acme Corp"
                value={form.company}
                onChange={set("company")}
                className={`${inputCls} h-9`}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-muted">
                Title
              </label>
              <input
                type="text"
                placeholder="Senior Recruiter"
                value={form.title}
                onChange={set("title")}
                className={`${inputCls} h-9`}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-muted">
              Notes
            </label>
            <textarea
              placeholder="Any notes about this contact…"
              value={form.notes}
              onChange={set("notes")}
              className={`${inputCls} min-h-[80px] py-2 resize-none`}
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
              {submitting
                ? isEditMode
                  ? "Saving…"
                  : "Adding…"
                : isEditMode
                  ? "Save"
                  : "Add Lead"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

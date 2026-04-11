"use client"

import { useState } from "react"
import { Lead } from "@/lib/types"
import { Button } from "@/components/ui/Button"

interface DeleteLeadConfirmProps {
  lead: Lead
  onConfirm: () => Promise<void>
  onCancel: () => void
}

export function DeleteLeadConfirm({
  lead,
  onConfirm,
  onCancel,
}: DeleteLeadConfirmProps) {
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      await onConfirm()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <div className="w-full max-w-sm bg-surface border border-border rounded-xl shadow-xl">
        {/* Content */}
        <div className="px-5 py-5">
          <h2 className="text-sm font-semibold text-text-primary mb-2">
            Delete lead?
          </h2>
          <p className="text-sm text-text-muted mb-5">
            This will permanently remove {lead.name} and all job links.
          </p>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

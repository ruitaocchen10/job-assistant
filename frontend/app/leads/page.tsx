"use client"

import { useEffect, useState } from "react"
import { Lead } from "@/lib/types"
import { getLeads, deleteLead } from "@/lib/api"
import { Button } from "@/components/ui/Button"
import { LeadsTable } from "@/components/leads/LeadsTable"
import { LeadDrawer } from "@/components/leads/LeadDrawer"
import { LeadFormModal } from "@/components/leads/LeadFormModal"
import { DeleteLeadConfirm } from "@/components/leads/DeleteLeadConfirm"

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null)

  // Initial load
  useEffect(() => {
    setLoading(true)
    setError(null)
    getLeads()
      .then(setLeads)
      .catch(() =>
        setError("Could not reach the API. Is the backend running?")
      )
      .finally(() => setLoading(false))
  }, [])

  function handleLeadAdded(lead: Lead) {
    setLeads((prev) => [lead, ...prev])
    setShowAddModal(false)
  }

  function handleLeadUpdated(updated: Lead) {
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)))
    if (selectedLead?.id === updated.id) {
      setSelectedLead(updated)
    }
    setEditingLead(null)
  }

  async function handleLeadDeleted(leadId: number) {
    try {
      await deleteLead(leadId)
      setLeads((prev) => prev.filter((l) => l.id !== leadId))
      if (selectedLead?.id === leadId) {
        setSelectedLead(null)
      }
      setDeletingLead(null)
    } catch (err) {
      // Could show error toast here
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-text-primary tracking-tight">
            Leads
          </h1>
          <p className="text-sm text-text-muted mt-0.5">
            {leads.length > 0
              ? `${leads.length} contact${leads.length === 1 ? "" : "s"}`
              : "Track contacts from your job search"}
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowAddModal(true)}
        >
          + Add Lead
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-xl border border-score-low/30 bg-score-low/10 px-4 py-3 text-sm text-score-low">
          {error}
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && !error && (
        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          <div className="space-y-2 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-12 rounded-xl bg-elevated border border-border animate-pulse"
              />
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <LeadsTable
          leads={leads}
          selectedLeadId={selectedLead?.id ?? null}
          onSelect={setSelectedLead}
          onEdit={setEditingLead}
          onDelete={setDeletingLead}
        />
      )}

      {/* Lead Drawer */}
      {selectedLead && (
        <LeadDrawer
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onEdit={setEditingLead}
          onDelete={setDeletingLead}
        />
      )}

      {/* Add / Edit Modal */}
      {(showAddModal || editingLead) && (
        <LeadFormModal
          initial={editingLead ?? undefined}
          onSuccess={editingLead ? handleLeadUpdated : handleLeadAdded}
          onClose={() => {
            setShowAddModal(false)
            setEditingLead(null)
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingLead && (
        <DeleteLeadConfirm
          lead={deletingLead}
          onConfirm={() => handleLeadDeleted(deletingLead.id)}
          onCancel={() => setDeletingLead(null)}
        />
      )}
    </div>
  )
}

"use client"

import { Lead } from "@/lib/types"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"

interface LeadsTableProps {
  leads: Lead[]
  selectedLeadId: number | null
  onSelect: (lead: Lead) => void
  onEdit: (lead: Lead) => void
  onDelete: (lead: Lead) => void
}

export function LeadsTable({
  leads,
  selectedLeadId,
  onSelect,
  onEdit,
  onDelete,
}: LeadsTableProps) {
  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                Name
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                Company / Title
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                Email
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                LinkedIn
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                Jobs
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                Added
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colSpan={7}
                className="text-center py-16 text-sm text-text-muted"
              >
                No leads yet. Add your first contact.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
              Name
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
              Company / Title
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
              Email
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
              LinkedIn
            </th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
              Jobs
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
              Added
            </th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr
              key={lead.id}
              className={`
                border-b border-border hover:bg-elevated transition-colors duration-100 group cursor-pointer
                ${selectedLeadId === lead.id ? "bg-elevated" : ""}
              `}
            >
              {/* Name */}
              <td
                className="px-4 py-3 font-medium text-text-primary"
                onClick={() => onSelect(lead)}
              >
                {lead.name}
              </td>

              {/* Company / Title */}
              <td
                className="px-4 py-3"
                onClick={() => onSelect(lead)}
              >
                <div className="text-text-primary">{lead.company || "—"}</div>
                <div className="text-xs text-text-muted">
                  {lead.title || ""}
                </div>
              </td>

              {/* Email */}
              <td
                className="px-4 py-3 max-w-[160px] truncate"
                onClick={() => onSelect(lead)}
              >
                {lead.email ? (
                  <a
                    href={`mailto:${lead.email}`}
                    className="text-accent hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {lead.email}
                  </a>
                ) : (
                  <span className="text-text-muted">—</span>
                )}
              </td>

              {/* LinkedIn */}
              <td
                className="px-4 py-3"
                onClick={() => onSelect(lead)}
              >
                {lead.linkedin_url ? (
                  <a
                    href={lead.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    ↗
                  </a>
                ) : (
                  <span className="text-text-muted">—</span>
                )}
              </td>

              {/* Jobs */}
              <td
                className="px-4 py-3 text-right"
                onClick={() => onSelect(lead)}
              >
                {lead.linked_jobs_count > 0 ? (
                  <Badge
                    label={String(lead.linked_jobs_count)}
                    variant="accent"
                  />
                ) : (
                  <span className="text-text-muted">—</span>
                )}
              </td>

              {/* Added */}
              <td
                className="px-4 py-3 text-text-muted text-xs"
                onClick={() => onSelect(lead)}
              >
                {new Date(lead.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>

              {/* Actions */}
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(lead)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(lead)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

"use client"

interface Filters {
  keyword: string
  score_min: number
}

interface JobFiltersProps {
  filters: Filters
  total: number
  onChange: (filters: Filters) => void
}

const SCORE_OPTIONS = [
  { label: "All scores", value: 0 },
  { label: "40+",        value: 40 },
  { label: "70+",        value: 70 },
]

export function JobFilters({ filters, total, onChange }: JobFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center flex-1">

        {/* Keyword search */}
        <div className="relative flex-1 max-w-xs">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search titles…"
            value={filters.keyword}
            onChange={e => onChange({ ...filters, keyword: e.target.value })}
            className="
              w-full h-9 pl-9 pr-3 text-sm
              bg-elevated border border-border rounded-lg
              text-text-primary placeholder:text-text-muted
              focus:outline-none focus:border-accent
              transition-colors
            "
          />
        </div>

        {/* Score filter */}
        <div className="flex gap-1">
          {SCORE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...filters, score_min: opt.value })}
              className={`
                h-9 px-3 text-xs font-medium rounded-lg border transition-colors
                ${filters.score_min === opt.value
                  ? "bg-accent/15 border-accent/40 text-accent"
                  : "bg-elevated border-border text-text-muted hover:text-text-primary hover:border-border/80"
                }
              `}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <span className="text-xs text-text-muted shrink-0">
        {total} {total === 1 ? "job" : "jobs"}
      </span>
    </div>
  )
}

# Job Assistant — Full Plan

**Status Legend:** ✅ Built | 🔲 Planned

## Vision

A local, self-hosted productivity tool for the job search. The system automatically sources and filters jobs, surfaces them in a clean UI, tracks applications and leads, and connects to Claude Cowork (Claude Desktop) for natural language queries and a daily brief.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Backend (Python)                     │
│                                                             │
│  Fetchers/Normalize ──► LLM Filter ──► SQLite DB            │
│  (APIs / scrapers)           (jobs, companies, applications,│
│                               leads, job_leads)             │
└───────────────────────────┬─────────────────────────────────┘
                            │ REST API (FastAPI or similar)
┌───────────────────────────▼─────────────────────────────────┐
│                      Frontend (Next.js)                     │
│                                                             │
│  Job Browser ──► Application Tracker (Kanban)               │
│  Lead Tracker                                               │
│                                                             │
└───────────────────────────┬─────────────────────────────────┘
                            │ MCP / Claude Cowork integration
┌───────────────────────────▼─────────────────────────────────┐
│                    Claude Cowork (Desktop)                  │
│                                                             │
│  Daily Brief  |  Natural Language DB queries                │
└─────────────────────────────────────────────────────────────┘
```

## Ideas

### Job Ingestion Pipeline (Backend)

**Goal:** Reliably populate the DB with relevant, scored jobs on demand or on a schedule.

- ✅ **Remotive fetcher** — Implemented and working; fetches from `software-development` and `ai-ml` categories with 28-day age filter and deduplication
- 🔲 **More fetchers** — Add sources beyond Remotive:
  - Arbeitnow API (free, no key)
  - Adzuna API (free tier)
  - Lightweight scrapers for a target company careers page
  - Potential scrapers for other job boards without APIs? (gray area legally...)
- ✅ **LLM filter/scorer** (`scorer.py`) — Fetches new unscored jobs and runs through LLM to:
  - Score relevance (0–100) and write brief notes → stored in `jobs.llm_score` / `jobs.llm_notes`
  - Model: `claude-haiku-4-5-20251001`
  - Current: Manual CLI script; not yet integrated into fetch pipeline
- ✅ **Memory** - User profile stored in `backend/user_profile.md`; used to contextualize LLM scoring (currently empty template)
- 🔲 **Scheduler** — Run the full pipeline on a cron (e.g., every day) or via a CLI flag; currently `main.py` and `scorer.py` are manual scripts

### Backend API

**Goal:** Expose the SQLite data to the frontend and Claude Cowork via a lightweight REST API.

- ✅ **FastAPI server** (`backend/apis/api.py`) — All core routes implemented:
  - ✅ `GET /jobs` — filterable (keyword, score_min, source); returns all matching rows (no pagination yet)
  - ✅ `POST /jobs` — create job manually
  - ✅ `POST /jobs/{id}/save` — move a job into applications (`status = saved`)
  - ✅ `DELETE /jobs/{id}` — soft-delete / hide a job
  - ✅ `DELETE /jobs/hidden` — purge old hidden jobs
  - ✅ `GET /applications` — list with status
  - ✅ `PATCH /applications/{id}` — update status, notes
  - ✅ `GET /leads` / `POST /leads` / `PATCH /leads/{id}` / `DELETE /leads/{id}` — full CRUD
  - ✅ `GET /leads/{id}/jobs` / `POST /leads/{id}/jobs` / `DELETE /leads/{id}/jobs/{job_lead_id}` — manage job↔lead links
  - 🔲 `POST /query` — natural language → SQL via LLM (for Claude Cowork; not yet implemented)
- ✅ **CORS** configured for localhost:3000 frontend

### Frontend

**Goal:** A clean UI to browse, act on, and track jobs and leads.

- ✅ **Job Browser** (`/jobs`)
  - ✅ Responsive grid of fetched jobs (1-2-3 columns) with LLM score badge
  - ✅ Filters: keyword search (debounced 300ms), score threshold (All / 40+ / 70+)
  - ✅ Actions per job: Save (→ applications), Hide, view posted time
  - ✅ Add Job modal for manual entry
  - 🔲 Pagination — currently returns all matching jobs
  - 🔲 Additional filters: source, job type (partially shown in meta badges)
- ✅ **Application Tracker** (`/applications`) — Kanban board
  - ✅ Columns: `saved → applied → interviewing → offered → rejected → discarded`
  - ✅ Drag-drop status changes with optimistic updates
  - 🔲 Card click → sidebar with notes, applied date, salary, linked leads (not yet clickable)
- ✅ **Lead Tracker** (`/leads`)
  - ✅ Sortable table of all leads with columns: name, company/title, email, LinkedIn, linked jobs count
  - ✅ Lead detail drawer: contact info, notes, linked jobs
  - ✅ Add/edit lead form (modal)
  - ✅ Link/unlink jobs with relationship type (recruiter, hiring_manager, referral, other) and notes
  - ✅ Delete lead with confirmation
- ✅ **Global nav sidebar** — Jobs | Applications | Leads (collapses on mobile)

### Claude Cowork Integration

**Goal:** Let Claude Desktop interact with the job DB naturally.

- 🔲 **MCP server** (`backend/mcp_server.py`) — Not yet implemented; would expose tools:
  - `get_jobs(filters)` — query jobs by any field
  - `update_application(id, status, notes)` — change application state
  - `get_leads(job_id?)` — list leads, optionally filtered by job
  - `natural_language_query(prompt)` — LLM → SQL → results
  - `daily_brief()` — summarize: new jobs since yesterday, pending applications, upcoming follow-ups
- 🔲 Register the MCP server in Claude Desktop config
- 🔲 Daily brief prompt template that pulls live data

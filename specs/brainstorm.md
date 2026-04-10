# Job Assistant — Full Plan

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

- **More fetchers** — Add sources beyond Remotive:
  - Arbeitnow API (free, no key)
  - Adzuna API (free tier)
  - Lightweight scrapers for a target company careers page
  - Potential scrapers for other job boards without APIs? (gray area legally...)
- **LLM filter/scorer** — After fetching, run each new job through an LLM call to:
  - Score relevance (0–100) and write brief notes → stored in `jobs.llm_score` / `jobs.llm_notes`
  - Filter out obvious mismatches and flag them to be deleted through the UI
  - Model: Unknown so far, but probably a cheap one
- **Memory** - We save an .md file with information about the user and to help the LLM grade jobs for them
- **Scheduler** — Run the full pipeline on a cron (e.g., every day) or via a CLI flag

### Backend API

**Goal:** Expose the SQLite data to the frontend and Claude Cowork via a lightweight REST API.

- **FastAPI server** (`backend/api.py`)
  - `GET /jobs` — paginated, filterable (status, score, keyword, source)
  - `POST /jobs/{id}/save` — move a job into applications (`status = saved`)
  - `DELETE /jobs/{id}` — soft-delete / hide a job
  - `GET /applications` — list with status
  - `PATCH /applications/{id}` — update status, notes
  - `GET /leads` / `POST /leads` / `PATCH /leads/{id}`
  - `GET /jobs/{id}/leads` / `POST /jobs/{id}/leads` — manage job↔lead links
  - `POST /query` — natural language → SQL via LLM (for Claude Cowork)
- **CORS** configured for localhost frontend

### Frontend

**Goal:** A clean UI to browse, act on, and track jobs and leads.

- **Job Browser** (`/jobs`)
  - Paginated list/grid of fetched jobs with LLM score badge
  - Filter sidebar: source, score threshold, job type, keyword search
  - Actions per job: Save (→ applications), Hide, Open original URL
- **Application Tracker** (`/applications`) — Kanban board
  - Columns: `saved → applied → interviewing → offered → rejected → withdrawn`
  - Drag-drop status changes
  - Card click → sidebar with notes, applied date, salary, linked leads
- **Lead Tracker** (`/leads`)
  - Table of all leads
  - Lead detail panel: contact info, notes, linked jobs
  - Add/edit lead form
  - Link lead to job(s)
- **Global nav sidebar ** — Jobs | Applications | Leads

### Claude Cowork Integration

**Goal:** Let Claude Desktop interact with the job DB naturally.

- **MCP server** (`backend/mcp_server.py`) exposing tools:
  - `get_jobs(filters)` — query jobs by any field
  - `update_application(id, status, notes)` — change application state
  - `get_leads(job_id?)` — list leads, optionally filtered by job
  - `natural_language_query(prompt)` — LLM → SQL → results
  - `daily_brief()` — summarize: new jobs since yesterday, pending applications, upcoming follow-ups
- Register the MCP server in Claude Desktop config
- Daily brief prompt template that pulls live data

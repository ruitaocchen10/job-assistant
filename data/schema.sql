PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS companies (
    id         INTEGER PRIMARY KEY,
    name       TEXT NOT NULL,
    logo_url   TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE TABLE IF NOT EXISTS jobs (
    id         INTEGER PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id),
    title      TEXT NOT NULL,
    location   TEXT,
    url        TEXT NOT NULL UNIQUE,
    salary     TEXT,
    job_type   TEXT,
    tags        TEXT,
    description TEXT,
    source      TEXT NOT NULL,
    source_id  TEXT NOT NULL,
    posted_at  TEXT NOT NULL,
    llm_score  REAL,
    llm_notes  TEXT,
    hidden     INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE TABLE IF NOT EXISTS applications (
    id         INTEGER PRIMARY KEY,
    job_id     INTEGER NOT NULL UNIQUE REFERENCES jobs(id),
    status     TEXT NOT NULL DEFAULT 'saved',
    notes      TEXT,
    applied_at TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE TABLE IF NOT EXISTS leads (
    id           INTEGER PRIMARY KEY,
    name         TEXT NOT NULL,
    email        TEXT,
    linkedin_url TEXT,
    company      TEXT,
    title        TEXT,
    notes        TEXT,
    created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    updated_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE TABLE IF NOT EXISTS job_leads (
    id           INTEGER PRIMARY KEY,
    job_id       INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    lead_id      INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    relationship TEXT,
    notes        TEXT,
    created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

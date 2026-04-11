""" Populates database with information gotten from the job fetchers """

import json
import os
import sqlite3

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "jobs.db")


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def _get_or_create_company(cur: sqlite3.Cursor, name: str, logo_url: str | None) -> int:
    cur.execute("SELECT id FROM companies WHERE name = ?", (name,))
    row = cur.fetchone()
    if row:
        return row[0]
    cur.execute(
        "INSERT INTO companies (name, logo_url) VALUES (?, ?)",
        (name, logo_url),
    )
    return cur.lastrowid


def save_jobs(jobs: list[dict]) -> int:
    """Save normalized job dicts to the database, skipping duplicates by URL.
    Returns the number of newly inserted jobs."""
    conn = get_connection()
    cur = conn.cursor()
    inserted = 0

    for job in jobs:
        company_id = _get_or_create_company(cur, job["company"], job.get("company_logo"))

        try:
            cur.execute(
                """
                INSERT INTO jobs
                    (company_id, title, location, url, salary, job_type,
                     tags, description, source, source_id, posted_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    company_id,
                    job["title"],
                    job.get("location"),
                    job["url"],
                    job.get("salary"),
                    job.get("job_type"),
                    json.dumps(job.get("tags", [])),
                    job.get("description", ""),
                    job["source"],
                    job["source_id"],
                    job["posted_at"],
                ),
            )
            inserted += 1
        except sqlite3.IntegrityError:
            pass  # duplicate URL — already in DB, skip

    conn.commit()
    conn.close()
    return inserted


def cleanup_hidden_jobs(days: int = 30) -> int:
    """Delete hidden jobs older than `days` days. Returns count of deleted rows."""
    conn = get_connection()
    result = conn.execute(
        "DELETE FROM jobs WHERE hidden = 1 AND hidden_at < datetime('now', ? || ' days')",
        (f"-{days}",),
    )
    conn.commit()
    conn.close()
    return result.rowcount

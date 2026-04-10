import json
import sqlite3
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from db import get_connection

router = APIRouter()

VALID_STATUSES = {"saved", "applied", "interviewing", "offered", "rejected", "discarded"}


class JobOut(BaseModel):
    id: int
    title: str
    company: str
    company_logo: str | None
    location: str | None
    salary: str | None
    job_type: str | None
    tags: list[str]
    llm_score: float | None
    llm_notes: str | None
    posted_at: str
    source: str
    url: str
    application_status: str | None


class ApplicationOut(BaseModel):
    id: int
    job_id: int
    status: str
    notes: str | None
    applied_at: str | None
    created_at: str
    updated_at: str


class JobCreate(BaseModel):
    url: str
    title: str
    company: str
    location: str | None = None
    salary: str | None = None
    job_type: str | None = None
    tags: list[str] = []


@router.get("", response_model=list[JobOut])
def list_jobs(score_min: float = 0, keyword: str = None, source: str = None):
    conn = get_connection()
    conn.row_factory = __import__("sqlite3").Row

    query = """
        SELECT
            jobs.id, jobs.title, companies.name AS company,
            companies.logo_url AS company_logo, jobs.location, jobs.salary,
            jobs.job_type, jobs.tags, jobs.llm_score, jobs.llm_notes,
            jobs.posted_at, jobs.source, jobs.url,
            applications.status AS application_status
        FROM jobs
        JOIN companies ON jobs.company_id = companies.id
        LEFT JOIN applications ON applications.job_id = jobs.id
        WHERE jobs.hidden = 0
          AND (jobs.llm_score IS NULL OR jobs.llm_score >= ?)
    """
    params: list = [score_min]

    if keyword:
        query += " AND jobs.title LIKE ?"
        params.append(f"%{keyword}%")

    if source:
        query += " AND jobs.source = ?"
        params.append(source)

    query += " ORDER BY jobs.llm_score DESC, jobs.posted_at DESC"

    rows = conn.execute(query, params).fetchall()
    conn.close()

    return [
        JobOut(**{**dict(row), "tags": json.loads(row["tags"] or "[]")})
        for row in rows
    ]


@router.post("", response_model=JobOut, status_code=201)
def create_job(body: JobCreate):
    from db import save_jobs

    job_dict = {
        "url": body.url,
        "title": body.title,
        "company": body.company,
        "location": body.location,
        "salary": body.salary,
        "job_type": body.job_type,
        "tags": body.tags,
        "source": "manual",
        "source_id": body.url,
        "posted_at": datetime.now(timezone.utc).isoformat(),
    }

    if save_jobs([job_dict]) == 0:
        raise HTTPException(status_code=409, detail="A job with this URL already exists")

    conn = get_connection()
    conn.row_factory = __import__("sqlite3").Row
    row = conn.execute(
        """
        SELECT
            jobs.id, jobs.title, companies.name AS company,
            companies.logo_url AS company_logo, jobs.location, jobs.salary,
            jobs.job_type, jobs.tags, jobs.llm_score, jobs.llm_notes,
            jobs.posted_at, jobs.source, jobs.url,
            applications.status AS application_status
        FROM jobs
        JOIN companies ON jobs.company_id = companies.id
        LEFT JOIN applications ON applications.job_id = jobs.id
        WHERE jobs.url = ?
        """,
        (body.url,),
    ).fetchone()
    conn.close()
    return JobOut(**{**dict(row), "tags": json.loads(row["tags"] or "[]")})


@router.post("/{job_id}/save", response_model=ApplicationOut, status_code=201)
def save_job(job_id: int):
    conn = get_connection()
    conn.row_factory = __import__("sqlite3").Row

    if not conn.execute("SELECT 1 FROM jobs WHERE id = ? AND hidden = 0", (job_id,)).fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Job not found")

    if conn.execute("SELECT 1 FROM applications WHERE job_id = ?", (job_id,)).fetchone():
        conn.close()
        raise HTTPException(status_code=409, detail="Job already saved")

    conn.execute("INSERT INTO applications (job_id, status) VALUES (?, 'saved')", (job_id,))
    conn.commit()

    row = conn.execute("SELECT * FROM applications WHERE job_id = ?", (job_id,)).fetchone()
    conn.close()
    return ApplicationOut(**dict(row))


@router.delete("/{job_id}", status_code=204)
def hide_job(job_id: int):
    conn = get_connection()

    result = conn.execute("UPDATE jobs SET hidden = 1 WHERE id = ? AND hidden = 0", (job_id,))
    conn.commit()
    conn.close()

    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Job not found")

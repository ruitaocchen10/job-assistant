import json
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from db import get_connection

router = APIRouter()

VALID_STATUSES = {"saved", "applied", "interviewing", "offered", "rejected", "discarded"}


class ApplicationOut(BaseModel):
    id: int
    job_id: int
    status: str
    notes: str | None
    applied_at: str | None
    created_at: str
    updated_at: str
    job_title: str
    company: str
    salary: str | None
    url: str
    llm_score: float | None


class PatchApplication(BaseModel):
    status: str | None = None
    notes: str | None = None
    applied_at: str | None = None


@router.get("", response_model=list[ApplicationOut])
def list_applications():
    conn = get_connection()
    conn.row_factory = __import__("sqlite3").Row

    rows = conn.execute("""
        SELECT
            applications.id, applications.job_id, applications.status,
            applications.notes, applications.applied_at,
            applications.created_at, applications.updated_at,
            jobs.title AS job_title, companies.name AS company,
            jobs.salary, jobs.url, jobs.llm_score
        FROM applications
        JOIN jobs ON applications.job_id = jobs.id
        JOIN companies ON jobs.company_id = companies.id
        ORDER BY applications.updated_at DESC
    """).fetchall()

    conn.close()
    return [ApplicationOut(**dict(row)) for row in rows]


@router.patch("/{application_id}", response_model=ApplicationOut)
def update_application(application_id: int, body: PatchApplication):
    conn = get_connection()
    conn.row_factory = __import__("sqlite3").Row

    if not conn.execute("SELECT 1 FROM applications WHERE id = ?", (application_id,)).fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Application not found")

    if body.status and body.status not in VALID_STATUSES:
        conn.close()
        raise HTTPException(status_code=422, detail=f"Invalid status. Must be one of: {', '.join(VALID_STATUSES)}")

    fields = {"updated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")}
    if body.status is not None:    fields["status"] = body.status
    if body.notes is not None:     fields["notes"] = body.notes
    if body.applied_at is not None: fields["applied_at"] = body.applied_at

    set_clause = ", ".join(f"{k} = ?" for k in fields)
    conn.execute(
        f"UPDATE applications SET {set_clause} WHERE id = ?",
        [*fields.values(), application_id],
    )
    conn.commit()

    row = conn.execute("""
        SELECT
            applications.id, applications.job_id, applications.status,
            applications.notes, applications.applied_at,
            applications.created_at, applications.updated_at,
            jobs.title AS job_title, companies.name AS company,
            jobs.salary, jobs.url, jobs.llm_score
        FROM applications
        JOIN jobs ON applications.job_id = jobs.id
        JOIN companies ON jobs.company_id = companies.id
        WHERE applications.id = ?
    """, (application_id,)).fetchone()

    conn.close()
    return ApplicationOut(**dict(row))

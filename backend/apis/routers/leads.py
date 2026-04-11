import sqlite3
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from db import get_connection

router = APIRouter()

VALID_RELATIONSHIPS = {"recruiter", "hiring_manager", "referral", "other"}


class LeadOut(BaseModel):
    id: int
    name: str
    email: str | None
    linkedin_url: str | None
    company: str | None
    title: str | None
    notes: str | None
    created_at: str
    updated_at: str
    linked_jobs_count: int


class LeadCreate(BaseModel):
    name: str
    email: str | None = None
    linkedin_url: str | None = None
    company: str | None = None
    title: str | None = None
    notes: str | None = None


class PatchLead(BaseModel):
    name: str | None = None
    email: str | None = None
    linkedin_url: str | None = None
    company: str | None = None
    title: str | None = None
    notes: str | None = None


class JobLeadOut(BaseModel):
    id: int
    job_id: int
    lead_id: int
    relationship: str | None
    notes: str | None
    created_at: str
    job_title: str
    company: str
    job_url: str


class JobLeadCreate(BaseModel):
    job_id: int
    relationship: str
    notes: str | None = None


@router.get("", response_model=list[LeadOut])
def list_leads():
    conn = get_connection()
    conn.row_factory = sqlite3.Row

    rows = conn.execute("""
        SELECT leads.*, COUNT(job_leads.id) AS linked_jobs_count
        FROM leads
        LEFT JOIN job_leads ON job_leads.lead_id = leads.id
        GROUP BY leads.id
        ORDER BY leads.updated_at DESC
    """).fetchall()

    conn.close()
    return [LeadOut(**dict(row)) for row in rows]


@router.post("", response_model=LeadOut, status_code=201)
def create_lead(body: LeadCreate):
    conn = get_connection()
    conn.row_factory = sqlite3.Row

    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    conn.execute(
        """
        INSERT INTO leads (name, email, linkedin_url, company, title, notes, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (body.name, body.email, body.linkedin_url, body.company, body.title, body.notes, now, now),
    )
    conn.commit()

    row = conn.execute(
        """
        SELECT leads.*, COUNT(job_leads.id) AS linked_jobs_count
        FROM leads
        LEFT JOIN job_leads ON job_leads.lead_id = leads.id
        WHERE leads.id = (SELECT last_insert_rowid())
        GROUP BY leads.id
        """
    ).fetchone()

    conn.close()
    return LeadOut(**dict(row))


@router.patch("/{lead_id}", response_model=LeadOut)
def update_lead(lead_id: int, body: PatchLead):
    conn = get_connection()
    conn.row_factory = sqlite3.Row

    if not conn.execute("SELECT 1 FROM leads WHERE id = ?", (lead_id,)).fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Lead not found")

    fields = {"updated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")}
    if body.name is not None:
        fields["name"] = body.name
    if body.email is not None:
        fields["email"] = body.email
    if body.linkedin_url is not None:
        fields["linkedin_url"] = body.linkedin_url
    if body.company is not None:
        fields["company"] = body.company
    if body.title is not None:
        fields["title"] = body.title
    if body.notes is not None:
        fields["notes"] = body.notes

    set_clause = ", ".join(f"{k} = ?" for k in fields)
    conn.execute(
        f"UPDATE leads SET {set_clause} WHERE id = ?",
        [*fields.values(), lead_id],
    )
    conn.commit()

    row = conn.execute(
        """
        SELECT leads.*, COUNT(job_leads.id) AS linked_jobs_count
        FROM leads
        LEFT JOIN job_leads ON job_leads.lead_id = leads.id
        WHERE leads.id = ?
        GROUP BY leads.id
        """,
        (lead_id,),
    ).fetchone()

    conn.close()
    return LeadOut(**dict(row))


@router.delete("/{lead_id}", status_code=204)
def delete_lead(lead_id: int):
    conn = get_connection()

    result = conn.execute("DELETE FROM leads WHERE id = ?", (lead_id,))
    conn.commit()
    conn.close()

    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Lead not found")


@router.get("/{lead_id}/jobs", response_model=list[JobLeadOut])
def list_lead_jobs(lead_id: int):
    conn = get_connection()
    conn.row_factory = sqlite3.Row

    if not conn.execute("SELECT 1 FROM leads WHERE id = ?", (lead_id,)).fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Lead not found")

    rows = conn.execute(
        """
        SELECT
            job_leads.id, job_leads.job_id, job_leads.lead_id,
            job_leads.relationship, job_leads.notes, job_leads.created_at,
            jobs.title AS job_title, jobs.url AS job_url,
            companies.name AS company
        FROM job_leads
        JOIN jobs ON jobs.id = job_leads.job_id
        JOIN companies ON companies.id = jobs.company_id
        WHERE job_leads.lead_id = ?
        ORDER BY job_leads.created_at DESC
        """,
        (lead_id,),
    ).fetchall()

    conn.close()
    return [JobLeadOut(**dict(row)) for row in rows]


@router.post("/{lead_id}/jobs", response_model=JobLeadOut, status_code=201)
def link_lead_to_job(lead_id: int, body: JobLeadCreate):
    conn = get_connection()
    conn.row_factory = sqlite3.Row

    # Validate lead exists
    if not conn.execute("SELECT 1 FROM leads WHERE id = ?", (lead_id,)).fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Lead not found")

    # Validate job exists
    if not conn.execute("SELECT 1 FROM jobs WHERE id = ?", (body.job_id,)).fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Job not found")

    # Validate relationship
    if body.relationship not in VALID_RELATIONSHIPS:
        conn.close()
        raise HTTPException(
            status_code=422,
            detail=f"Invalid relationship. Must be one of: {', '.join(sorted(VALID_RELATIONSHIPS))}",
        )

    # Check if already linked
    if conn.execute(
        "SELECT 1 FROM job_leads WHERE lead_id = ? AND job_id = ?",
        (lead_id, body.job_id),
    ).fetchone():
        conn.close()
        raise HTTPException(status_code=409, detail="Lead is already linked to this job")

    conn.execute(
        """
        INSERT INTO job_leads (job_id, lead_id, relationship, notes)
        VALUES (?, ?, ?, ?)
        """,
        (body.job_id, lead_id, body.relationship, body.notes),
    )
    conn.commit()

    row = conn.execute(
        """
        SELECT
            job_leads.id, job_leads.job_id, job_leads.lead_id,
            job_leads.relationship, job_leads.notes, job_leads.created_at,
            jobs.title AS job_title, jobs.url AS job_url,
            companies.name AS company
        FROM job_leads
        JOIN jobs ON jobs.id = job_leads.job_id
        JOIN companies ON companies.id = jobs.company_id
        WHERE job_leads.id = (SELECT last_insert_rowid())
        """
    ).fetchone()

    conn.close()
    return JobLeadOut(**dict(row))


@router.delete("/{lead_id}/jobs/{job_lead_id}", status_code=204)
def unlink_lead_from_job(lead_id: int, job_lead_id: int):
    conn = get_connection()

    # Verify the job_lead belongs to the lead
    result = conn.execute(
        "DELETE FROM job_leads WHERE id = ? AND lead_id = ?",
        (job_lead_id, lead_id),
    )
    conn.commit()
    conn.close()

    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Job link not found")

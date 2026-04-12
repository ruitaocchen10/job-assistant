import asyncio
import json
import sqlite3
import sys
import os
from datetime import datetime, timedelta

sys.path.insert(0, os.path.dirname(__file__))
from db import get_connection

from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

server = Server("job-assistant")


@server.list_tools()
async def list_tools():
    return [
        Tool(
            name="get_jobs",
            description="Search for jobs in the database by keyword or score threshold. Returns a list of jobs with ID, title, company, score, and URL.",
            inputSchema={
                "type": "object",
                "properties": {
                    "keyword": {"type": "string", "description": "Search for jobs containing this keyword in title or description (optional)"},
                    "score_min": {"type": "integer", "description": "Only return jobs with LLM score >= this value (0-100, optional)"},
                    "limit": {"type": "integer", "description": "Maximum number of results to return (default: 20)"}
                }
            }
        ),
        Tool(
            name="get_applications",
            description="List all applications with their current status (saved, applied, interviewing, offered, rejected, discarded) and associated job information.",
            inputSchema={
                "type": "object",
                "properties": {
                    "status": {"type": "string", "enum": ["saved", "applied", "interviewing", "offered", "rejected", "discarded"], "description": "Filter by application status (optional)"}
                }
            }
        ),
        Tool(
            name="update_application",
            description="Update an application's status (e.g., mark as applied, rejected) or add/update notes.",
            inputSchema={
                "type": "object",
                "properties": {
                    "application_id": {"type": "integer", "description": "The application ID to update"},
                    "status": {"type": "string", "enum": ["saved", "applied", "interviewing", "offered", "rejected", "discarded"], "description": "New status (optional)"},
                    "notes": {"type": "string", "description": "Notes or feedback about the application (optional)"}
                },
                "required": ["application_id"]
            }
        ),
        Tool(
            name="add_lead",
            description="Add a new contact/lead to the database. This is useful when you meet someone at an event or conference who might help with your job search.",
            inputSchema={
                "type": "object",
                "properties": {
                    "name": {"type": "string", "description": "Full name of the contact (required)"},
                    "email": {"type": "string", "description": "Email address (optional)"},
                    "linkedin_url": {"type": "string", "description": "LinkedIn profile URL (optional)"},
                    "company": {"type": "string", "description": "Company they work at (optional)"},
                    "title": {"type": "string", "description": "Job title (optional)"},
                    "notes": {"type": "string", "description": "Any additional notes about the contact or how you met them (optional)"}
                },
                "required": ["name"]
            }
        ),
        Tool(
            name="get_leads",
            description="List all contacts/leads in your database, optionally filtered by keyword search.",
            inputSchema={
                "type": "object",
                "properties": {
                    "keyword": {"type": "string", "description": "Search by name or company (optional)"}
                }
            }
        ),
        Tool(
            name="update_lead",
            description="Update an existing contact's information.",
            inputSchema={
                "type": "object",
                "properties": {
                    "lead_id": {"type": "integer", "description": "The lead ID to update"},
                    "name": {"type": "string", "description": "Full name (optional)"},
                    "email": {"type": "string", "description": "Email address (optional)"},
                    "linkedin_url": {"type": "string", "description": "LinkedIn profile URL (optional)"},
                    "company": {"type": "string", "description": "Company (optional)"},
                    "title": {"type": "string", "description": "Job title (optional)"},
                    "notes": {"type": "string", "description": "Notes (optional)"}
                },
                "required": ["lead_id"]
            }
        ),
        Tool(
            name="add_job",
            description="Manually add a job to the database. Use this when the user pastes a job listing or provides job details directly.",
            inputSchema={
                "type": "object",
                "properties": {
                    "title": {"type": "string", "description": "Job title (required)"},
                    "company": {"type": "string", "description": "Company name (required)"},
                    "url": {"type": "string", "description": "Job posting URL (required)"},
                    "location": {"type": "string", "description": "Job location (optional)"},
                    "job_type": {"type": "string", "description": "e.g. full-time, part-time, contract (optional)"},
                    "salary": {"type": "string", "description": "Salary or compensation info (optional)"},
                    "description": {"type": "string", "description": "Full job description text (optional)"},
                    "tags": {"type": "array", "items": {"type": "string"}, "description": "List of relevant tags or skills (optional)"}
                },
                "required": ["title", "company", "url"]
            }
        ),
        Tool(
            name="daily_brief",
            description="Get a summary of your job search status: new jobs from the last 24 hours, applications by status, and total lead count.",
            inputSchema={
                "type": "object",
                "properties": {}
            }
        )
    ]


@server.call_tool()
async def call_tool(name: str, arguments: dict):
    """Dispatch tool calls to the appropriate handler."""

    if name == "get_jobs":
        return await handle_get_jobs(arguments)
    elif name == "get_applications":
        return await handle_get_applications(arguments)
    elif name == "update_application":
        return await handle_update_application(arguments)
    elif name == "add_lead":
        return await handle_add_lead(arguments)
    elif name == "get_leads":
        return await handle_get_leads(arguments)
    elif name == "update_lead":
        return await handle_update_lead(arguments)
    elif name == "add_job":
        return await handle_add_job(arguments)
    elif name == "daily_brief":
        return await handle_daily_brief(arguments)
    else:
        return [TextContent(type="text", text=f"Unknown tool: {name}")]


async def handle_get_jobs(args: dict):
    """Query jobs with optional keyword and score filters."""
    keyword = args.get("keyword", "").strip()
    score_min = args.get("score_min", 0)
    limit = args.get("limit", 20)

    conn = get_connection()
    cur = conn.cursor()

    query = "SELECT id, title, company_id, llm_score, url, posted_at FROM jobs WHERE hidden = 0 AND llm_score >= ?"
    params = [score_min]

    if keyword:
        query += " AND (title LIKE ? OR description LIKE ?)"
        params.extend([f"%{keyword}%", f"%{keyword}%"])

    query += " ORDER BY posted_at DESC LIMIT ?"
    params.append(limit)

    cur.execute(query, params)
    rows = cur.fetchall()

    # Fetch company names
    results = []
    for job_id, title, company_id, score, url, posted_at in rows:
        cur.execute("SELECT name FROM companies WHERE id = ?", (company_id,))
        company = cur.fetchone()[0]
        results.append({
            "id": job_id,
            "title": title,
            "company": company,
            "score": score,
            "url": url,
            "posted_at": posted_at
        })

    conn.close()
    return [TextContent(type="text", text=json.dumps(results, indent=2))]


async def handle_get_applications(args: dict):
    """List applications, optionally filtered by status."""
    status_filter = args.get("status", "").strip()

    conn = get_connection()
    cur = conn.cursor()

    query = """
        SELECT a.id, j.title, c.name as company, a.status, a.notes, a.applied_at
        FROM applications a
        JOIN jobs j ON a.job_id = j.id
        JOIN companies c ON j.company_id = c.id
    """
    params = []

    if status_filter:
        query += " WHERE a.status = ?"
        params.append(status_filter)

    query += " ORDER BY a.updated_at DESC"

    cur.execute(query, params)
    rows = cur.fetchall()

    results = []
    for app_id, title, company, status, notes, applied_at in rows:
        results.append({
            "id": app_id,
            "job_title": title,
            "company": company,
            "status": status,
            "notes": notes,
            "applied_at": applied_at
        })

    conn.close()
    return [TextContent(type="text", text=json.dumps(results, indent=2))]


async def handle_update_application(args: dict):
    """Update application status and/or notes."""
    app_id = args.get("application_id")
    status = args.get("status")
    notes = args.get("notes")

    if not app_id:
        return [TextContent(type="text", text="Error: application_id is required")]

    conn = get_connection()
    cur = conn.cursor()

    # Check if application exists
    cur.execute("SELECT id FROM applications WHERE id = ?", (app_id,))
    if not cur.fetchone():
        conn.close()
        return [TextContent(type="text", text=f"Error: Application {app_id} not found")]

    updates = []
    params = []

    if status:
        updates.append("status = ?")
        params.append(status)

    if notes:
        updates.append("notes = ?")
        params.append(notes)

    if not updates:
        conn.close()
        return [TextContent(type="text", text="Error: No updates provided (status or notes required)")]

    updates.append("updated_at = datetime('now')")
    query = f"UPDATE applications SET {', '.join(updates)} WHERE id = ?"
    params.append(app_id)

    cur.execute(query, params)
    conn.commit()
    conn.close()

    return [TextContent(type="text", text=f"Application {app_id} updated successfully")]


async def handle_add_lead(args: dict):
    """Insert a new lead into the database."""
    name = args.get("name", "").strip()
    email = args.get("email", "").strip()
    linkedin_url = args.get("linkedin_url", "").strip()
    company = args.get("company", "").strip()
    title = args.get("title", "").strip()
    notes = args.get("notes", "").strip()

    if not name:
        return [TextContent(type="text", text="Error: name is required")]

    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """INSERT INTO leads (name, email, linkedin_url, company, title, notes)
           VALUES (?, ?, ?, ?, ?, ?)""",
        (name, email or None, linkedin_url or None, company or None, title or None, notes or None)
    )

    lead_id = cur.lastrowid
    conn.commit()
    conn.close()

    return [TextContent(type="text", text=f"Lead '{name}' added successfully with ID {lead_id}")]


async def handle_get_leads(args: dict):
    """List all leads, optionally filtered by keyword."""
    keyword = args.get("keyword", "").strip()

    conn = get_connection()
    cur = conn.cursor()

    query = "SELECT id, name, company, title, email FROM leads"
    params = []

    if keyword:
        query += " WHERE name LIKE ? OR company LIKE ?"
        params.extend([f"%{keyword}%", f"%{keyword}%"])

    query += " ORDER BY name ASC"

    cur.execute(query, params)
    rows = cur.fetchall()

    results = []
    for lead_id, name, company, title, email in rows:
        results.append({
            "id": lead_id,
            "name": name,
            "company": company,
            "title": title,
            "email": email
        })

    conn.close()
    return [TextContent(type="text", text=json.dumps(results, indent=2))]


async def handle_update_lead(args: dict):
    """Update a lead's information."""
    lead_id = args.get("lead_id")

    if not lead_id:
        return [TextContent(type="text", text="Error: lead_id is required")]

    conn = get_connection()
    cur = conn.cursor()

    # Check if lead exists
    cur.execute("SELECT id FROM leads WHERE id = ?", (lead_id,))
    if not cur.fetchone():
        conn.close()
        return [TextContent(type="text", text=f"Error: Lead {lead_id} not found")]

    updates = []
    params = []

    for field in ["name", "email", "linkedin_url", "company", "title", "notes"]:
        value = args.get(field)
        if value is not None:
            updates.append(f"{field} = ?")
            params.append(value.strip() if isinstance(value, str) else value)

    if not updates:
        conn.close()
        return [TextContent(type="text", text="Error: No updates provided")]

    updates.append("updated_at = datetime('now')")
    query = f"UPDATE leads SET {', '.join(updates)} WHERE id = ?"
    params.append(lead_id)

    cur.execute(query, params)
    conn.commit()
    conn.close()

    return [TextContent(type="text", text=f"Lead {lead_id} updated successfully")]


async def handle_add_job(args: dict):
    """Manually insert a job into the database."""
    import json as _json
    from datetime import datetime, timezone

    title = args.get("title", "").strip()
    company = args.get("company", "").strip()
    url = args.get("url", "").strip()

    if not title or not company or not url:
        return [TextContent(type="text", text="Error: title, company, and url are required")]

    conn = get_connection()
    cur = conn.cursor()

    # Get or create company
    cur.execute("SELECT id FROM companies WHERE name = ?", (company,))
    row = cur.fetchone()
    if row:
        company_id = row[0]
    else:
        cur.execute("INSERT INTO companies (name) VALUES (?)", (company,))
        company_id = cur.lastrowid

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
                title,
                args.get("location"),
                url,
                args.get("salary"),
                args.get("job_type"),
                _json.dumps(args.get("tags", [])),
                args.get("description", ""),
                "manual",
                url,
                datetime.now(timezone.utc).isoformat(),
            ),
        )
        job_id = cur.lastrowid
        conn.commit()
        conn.close()
        return [TextContent(type="text", text=f"Job '{title}' at {company} added successfully with ID {job_id}")]
    except Exception as e:
        conn.close()
        if "UNIQUE constraint" in str(e):
            return [TextContent(type="text", text=f"A job with this URL already exists in the database.")]
        return [TextContent(type="text", text=f"Error adding job: {e}")]


async def handle_daily_brief(args: dict):
    """Generate a summary of the job search status."""
    conn = get_connection()
    cur = conn.cursor()

    yesterday = (datetime.now() - timedelta(days=1)).isoformat()

    # New jobs in last 24h
    cur.execute("SELECT COUNT(*) FROM jobs WHERE created_at > ?", (yesterday,))
    new_jobs = cur.fetchone()[0]

    # Applications by status
    cur.execute("""
        SELECT status, COUNT(*) as count
        FROM applications
        GROUP BY status
        ORDER BY status
    """)
    status_counts = {row[0]: row[1] for row in cur.fetchall()}

    # Total leads
    cur.execute("SELECT COUNT(*) FROM leads")
    total_leads = cur.fetchone()[0]

    conn.close()

    brief = f"""
**Job Search Daily Brief**

**New Jobs (Last 24h):** {new_jobs}

**Applications by Status:**
"""

    for status in ["saved", "applied", "interviewing", "offered", "rejected", "discarded"]:
        count = status_counts.get(status, 0)
        brief += f"\n- {status.title()}: {count}"

    brief += f"\n\n**Total Leads:** {total_leads}"

    return [TextContent(type="text", text=brief)]


async def main():
    async with stdio_server() as (read_stream, write_stream):
        await server.run(read_stream, write_stream, server.create_initialization_options())

if __name__ == "__main__":
    asyncio.run(main())
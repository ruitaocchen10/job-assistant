import asyncio
import json
import os
import sys

import requests

from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

server = Server("job-assistant")

API_BASE_URL = os.environ.get("API_BASE_URL", "http://localhost:8000")
API_KEY = os.environ.get("API_KEY", "")


def _headers():
    return {"X-API-Key": API_KEY}


def _get(path: str, params: dict = None):
    resp = requests.get(f"{API_BASE_URL}{path}", headers=_headers(), params=params)
    resp.raise_for_status()
    return resp.json()


def _post(path: str, body: dict):
    resp = requests.post(
        f"{API_BASE_URL}{path}",
        headers={**_headers(), "Content-Type": "application/json"},
        json=body,
    )
    resp.raise_for_status()
    return resp.json()


def _patch(path: str, body: dict):
    resp = requests.patch(
        f"{API_BASE_URL}{path}",
        headers={**_headers(), "Content-Type": "application/json"},
        json=body,
    )
    resp.raise_for_status()
    return resp.json()


@server.list_tools()
async def list_tools():
    return [
        Tool(
            name="get_jobs",
            description="Search for jobs in the database by keyword or score threshold. Returns a list of jobs with ID, title, company, score, and URL.",
            inputSchema={
                "type": "object",
                "properties": {
                    "keyword": {"type": "string", "description": "Search for jobs containing this keyword in title (optional)"},
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
    params = {}
    if args.get("keyword"):
        params["keyword"] = args["keyword"]
    if args.get("score_min") is not None:
        params["score_min"] = args["score_min"]

    jobs = _get("/jobs", params=params)
    limit = args.get("limit", 20)
    jobs = jobs[:limit]

    results = [
        {
            "id": j["id"],
            "title": j["title"],
            "company": j["company"],
            "score": j["llm_score"],
            "url": j["url"],
            "posted_at": j["posted_at"],
        }
        for j in jobs
    ]
    return [TextContent(type="text", text=json.dumps(results, indent=2))]


async def handle_get_applications(args: dict):
    apps = _get("/applications")
    status_filter = args.get("status", "").strip()
    if status_filter:
        apps = [a for a in apps if a["status"] == status_filter]

    results = [
        {
            "id": a["id"],
            "job_title": a["job_title"],
            "company": a["company"],
            "status": a["status"],
            "notes": a["notes"],
            "applied_at": a["applied_at"],
        }
        for a in apps
    ]
    return [TextContent(type="text", text=json.dumps(results, indent=2))]


async def handle_update_application(args: dict):
    app_id = args.get("application_id")
    if not app_id:
        return [TextContent(type="text", text="Error: application_id is required")]

    patch = {}
    if args.get("status"):
        patch["status"] = args["status"]
    if args.get("notes"):
        patch["notes"] = args["notes"]

    if not patch:
        return [TextContent(type="text", text="Error: No updates provided (status or notes required)")]

    try:
        _patch(f"/applications/{app_id}", patch)
        return [TextContent(type="text", text=f"Application {app_id} updated successfully")]
    except requests.HTTPError as e:
        return [TextContent(type="text", text=f"Error: {e.response.text}")]


async def handle_add_lead(args: dict):
    name = args.get("name", "").strip()
    if not name:
        return [TextContent(type="text", text="Error: name is required")]

    body = {"name": name}
    for field in ["email", "linkedin_url", "company", "title", "notes"]:
        if args.get(field):
            body[field] = args[field]

    try:
        lead = _post("/leads", body)
        return [TextContent(type="text", text=f"Lead '{name}' added successfully with ID {lead['id']}")]
    except requests.HTTPError as e:
        return [TextContent(type="text", text=f"Error: {e.response.text}")]


async def handle_get_leads(args: dict):
    leads = _get("/leads")
    keyword = args.get("keyword", "").strip().lower()
    if keyword:
        leads = [
            l for l in leads
            if keyword in (l.get("name") or "").lower()
            or keyword in (l.get("company") or "").lower()
        ]

    results = [
        {
            "id": l["id"],
            "name": l["name"],
            "company": l["company"],
            "title": l["title"],
            "email": l["email"],
        }
        for l in leads
    ]
    return [TextContent(type="text", text=json.dumps(results, indent=2))]


async def handle_update_lead(args: dict):
    lead_id = args.get("lead_id")
    if not lead_id:
        return [TextContent(type="text", text="Error: lead_id is required")]

    patch = {}
    for field in ["name", "email", "linkedin_url", "company", "title", "notes"]:
        if args.get(field) is not None:
            patch[field] = args[field]

    if not patch:
        return [TextContent(type="text", text="Error: No updates provided")]

    try:
        _patch(f"/leads/{lead_id}", patch)
        return [TextContent(type="text", text=f"Lead {lead_id} updated successfully")]
    except requests.HTTPError as e:
        return [TextContent(type="text", text=f"Error: {e.response.text}")]


async def handle_add_job(args: dict):
    title = args.get("title", "").strip()
    company = args.get("company", "").strip()
    url = args.get("url", "").strip()

    if not title or not company or not url:
        return [TextContent(type="text", text="Error: title, company, and url are required")]

    body = {"title": title, "company": company, "url": url}
    for field in ["location", "salary", "job_type"]:
        if args.get(field):
            body[field] = args[field]
    if args.get("tags"):
        body["tags"] = args["tags"]

    try:
        job = _post("/jobs", body)
        return [TextContent(type="text", text=f"Job '{title}' at {company} added successfully with ID {job['id']}")]
    except requests.HTTPError as e:
        if e.response.status_code == 409:
            return [TextContent(type="text", text="A job with this URL already exists in the database.")]
        return [TextContent(type="text", text=f"Error adding job: {e.response.text}")]


async def handle_daily_brief(args: dict):
    try:
        data = _get("/daily-brief")
    except requests.HTTPError as e:
        return [TextContent(type="text", text=f"Error fetching daily brief: {e.response.text}")]

    brief = f"**Job Search Daily Brief**\n\n**New Jobs (Last 24h):** {data['new_jobs_24h']}\n\n**Applications by Status:**"
    for status in ["saved", "applied", "interviewing", "offered", "rejected", "discarded"]:
        count = data["applications"].get(status, 0)
        brief += f"\n- {status.title()}: {count}"
    brief += f"\n\n**Total Leads:** {data['total_leads']}"

    return [TextContent(type="text", text=brief)]


async def main():
    async with stdio_server() as (read_stream, write_stream):
        await server.run(read_stream, write_stream, server.create_initialization_options())

if __name__ == "__main__":
    asyncio.run(main())

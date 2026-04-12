""" FastAPI server — exposes job data to the Next.js frontend """

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from datetime import datetime, timedelta

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from db import get_connection
from .routers import applications, jobs, leads

app = FastAPI(title="Job Assistant API")


class APIKeyMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.method == "OPTIONS":
            return await call_next(request)
        expected = os.environ.get("API_KEY")
        if not expected or request.headers.get("X-API-Key") != expected:
            return JSONResponse(status_code=401, content={"detail": "Invalid or missing API key"})
        return await call_next(request)


app.add_middleware(APIKeyMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
app.include_router(applications.router, prefix="/applications", tags=["applications"])
app.include_router(leads.router, prefix="/leads", tags=["leads"])


@app.get("/daily-brief")
def daily_brief():
    conn = get_connection()
    cur = conn.cursor()

    yesterday = (datetime.now() - timedelta(days=1)).isoformat()
    cur.execute("SELECT COUNT(*) FROM jobs WHERE created_at > ?", (yesterday,))
    new_jobs = cur.fetchone()[0]

    cur.execute("SELECT status, COUNT(*) FROM applications GROUP BY status")
    status_counts = {row[0]: row[1] for row in cur.fetchall()}

    cur.execute("SELECT COUNT(*) FROM leads")
    total_leads = cur.fetchone()[0]

    conn.close()
    return {
        "new_jobs_24h": new_jobs,
        "applications": status_counts,
        "total_leads": total_leads,
    }

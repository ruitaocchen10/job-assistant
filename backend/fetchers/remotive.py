""" Fetches jobs from the remotive API """

import json
import re
import requests
from datetime import datetime, timedelta, timezone

BASE_URL = "https://remotive.com/api/remote-jobs"
CATEGORIES = ["software-development", "ai-ml"]
MAX_AGE_DAYS = 28


def fetch_jobs(search=None, limit=None) -> list[dict]:
    """
    Fetch remote jobs from Remotive and return a normalized list.

    Each job dict has the following keys:
        title, company, company_logo, location, url, salary,
        job_type, tags, description, source, source_id, posted_at
    """
    seen_ids = set()
    raw_jobs = []

    for category in CATEGORIES:
        params = {"category": category}
        if search: params["search"] = search
        if limit:  params["limit"] = limit

        response = requests.get(BASE_URL, params=params)
        response.raise_for_status()

        for job in response.json()["jobs"]:
            if job["id"] not in seen_ids:
                seen_ids.add(job["id"])
                raw_jobs.append(job)

    # Age filter
    cutoff = datetime.now(timezone.utc) - timedelta(days=MAX_AGE_DAYS)
    def parse_date(date_str):
        dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
        return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)

    raw_jobs = [j for j in raw_jobs if parse_date(j["publication_date"]) >= cutoff]

    return [_normalize(j) for j in raw_jobs]


def _normalize(job: dict) -> dict:
    return {
        "title":        job["title"],
        "company":      job["company_name"],
        "company_logo": job.get("company_logo_url") or job.get("company_logo"),
        "location":     job.get("candidate_required_location") or None,
        "url":          job["url"],
        "salary":       job.get("salary") or None,
        "job_type":     job.get("job_type"),
        "tags":         job.get("tags", []),
        "description":  re.sub(r"<[^>]+>", " ", job.get("description", "")).strip(),
        "source":       "remotive",
        "source_id":    f"remotive-{job['id']}",
        "posted_at":    job["publication_date"],
    }


if __name__ == "__main__":
    jobs = fetch_jobs()
    # Print without description for readability
    preview = [{k: v for k, v in j.items() if k != "description"} for j in jobs]
    print(json.dumps({"job-count": len(jobs), "jobs": preview}, indent=2))

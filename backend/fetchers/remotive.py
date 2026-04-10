import json
import requests
from datetime import datetime, timedelta, timezone

BASE_URL = "https://remotive.com/api/remote-jobs"
CATEGORIES = ["software-development", "ai-ml"]
MAX_AGE_DAYS = 28

def fetch_jobs(search=None, limit=None) -> dict:
    seen_ids = set()
    all_jobs = []

    for category in CATEGORIES:
        params = {"category": category}
        if search: params["search"] = search
        if limit:  params["limit"] = limit

        response = requests.get(BASE_URL, params=params)
        response.raise_for_status()

        for job in response.json()["jobs"]:
            if job["id"] not in seen_ids:
                seen_ids.add(job["id"])
                all_jobs.append(job)

    # Age filter
    cutoff = datetime.now(timezone.utc) - timedelta(days=MAX_AGE_DAYS)
    def parse_date(date_str):
        dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
        return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)

    all_jobs = [j for j in all_jobs if parse_date(j["publication_date"]) >= cutoff]

    for job in all_jobs:
        job.pop("description", None)

    return {"job-count": len(all_jobs), "jobs": all_jobs}


if __name__ == "__main__":
    result = fetch_jobs()
    print(json.dumps(result, indent=2))

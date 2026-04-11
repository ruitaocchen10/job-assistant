""" Runs full pipeline """

from fetchers.remotive import fetch_jobs
from db import save_jobs, cleanup_hidden_jobs

if __name__ == "__main__":
    print("Fetching jobs...")
    jobs = fetch_jobs()
    print(f"Fetched {len(jobs)} jobs")

    new = save_jobs(jobs)
    print(f"Saved {new} new jobs ({len(jobs) - new} duplicates skipped)")

    deleted = cleanup_hidden_jobs(days=30)
    if deleted:
        print(f"Cleaned up {deleted} hidden jobs older than 30 days")

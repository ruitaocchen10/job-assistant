from fetchers.remotive import fetch_jobs
from db import save_jobs

if __name__ == "__main__":
    print("Fetching jobs...")
    jobs = fetch_jobs()
    print(f"Fetched {len(jobs)} jobs")

    new = save_jobs(jobs)
    print(f"Saved {new} new jobs ({len(jobs) - new} duplicates skipped)")

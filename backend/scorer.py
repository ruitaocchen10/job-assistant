""" Scores unscored jobs in the database using Claude """

import base64
import json
import os

import anthropic

from db import get_connection

USER_CONTEXT_DIR = os.path.join(os.path.dirname(__file__), "user_context")
PROFILE_PATH = os.path.join(USER_CONTEXT_DIR, "user_profile.md")
RESUME_PATH = os.path.join(USER_CONTEXT_DIR, "Ruitao Chen Resume.pdf")
MODEL = "claude-haiku-4-5-20251001"


def load_profile() -> str:
    with open(PROFILE_PATH, "r") as f:
        return f.read()


def load_resume_b64() -> str | None:
    if not os.path.exists(RESUME_PATH):
        return None
    with open(RESUME_PATH, "rb") as f:
        return base64.standard_b64encode(f.read()).decode("utf-8")


def score_job(client: anthropic.Anthropic, profile: str, resume_b64: str | None, job: dict) -> tuple[float, str]:
    prompt = f"""You are evaluating job listings for a specific candidate.

<candidate_profile>
{profile}
</candidate_profile>

Rate the following job for this candidate on a scale of 0–100.
Respond with a JSON object only, no other text: {{"score": <int 0-100>, "notes": "<1-2 sentence explanation>"}}

Job:
Title: {job["title"]}
Company: {job["company"]}
Location: {job["location"] or "Not specified"}
Salary: {job["salary"] or "Not specified"}
Type: {job["job_type"] or "Not specified"}
Tags: {", ".join(json.loads(job["tags"] or "[]"))}
Description: {job["description"] or "Not provided"}"""

    if resume_b64:
        content = [
            {
                "type": "document",
                "source": {
                    "type": "base64",
                    "media_type": "application/pdf",
                    "data": resume_b64,
                },
                "title": "Candidate Resume",
            },
            {"type": "text", "text": prompt},
        ]
    else:
        content = prompt

    message = client.messages.create(
        model=MODEL,
        max_tokens=256,
        messages=[{"role": "user", "content": content}],
    )

    raw = message.content[0].text.strip()
    result = json.loads(raw)
    return float(result["score"]), result["notes"]


def run():
    conn = get_connection()
    conn.row_factory = __import__("sqlite3").Row

    rows = conn.execute("""
        SELECT jobs.id, jobs.title, companies.name AS company, jobs.location,
               jobs.salary, jobs.job_type, jobs.tags, jobs.description
        FROM jobs
        JOIN companies ON jobs.company_id = companies.id
        WHERE jobs.llm_score IS NULL
    """).fetchall()

    if not rows:
        print("No unscored jobs found.")
        return

    client = anthropic.Anthropic()
    profile = load_profile()
    resume_b64 = load_resume_b64()

    if resume_b64:
        print("Resume loaded.")

    print(f"Scoring {len(rows)} jobs...")
    for row in rows:
        job = dict(row)
        try:
            score, notes = score_job(client, profile, resume_b64, job)
            conn.execute(
                "UPDATE jobs SET llm_score = ?, llm_notes = ? WHERE id = ?",
                (score, notes, job["id"]),
            )
            conn.commit()
            print(f"  [{int(score):3d}] {job['title']} @ {job['company']}: {notes}")
        except Exception as e:
            print(f"  [ERR] {job['title']}: {e}")


if __name__ == "__main__":
    run()

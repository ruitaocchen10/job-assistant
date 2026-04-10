export interface Job {
  id: number
  title: string
  company: string
  company_logo: string | null
  location: string | null
  salary: string | null
  job_type: string | null
  tags: string[]
  llm_score: number | null
  llm_notes: string | null
  posted_at: string
  source: string
  url: string
  application_status: string | null
}

export interface Application {
  id: number
  job_id: number
  status: ApplicationStatus
  notes: string | null
  applied_at: string | null
  created_at: string
  updated_at: string
  job_title: string
  company: string
  salary: string | null
  url: string
  llm_score: number | null
}

export type ApplicationStatus =
  | "saved"
  | "applied"
  | "interviewing"
  | "offered"
  | "rejected"
  | "discarded"

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "saved",
  "applied",
  "interviewing",
  "offered",
  "rejected",
  "discarded",
]

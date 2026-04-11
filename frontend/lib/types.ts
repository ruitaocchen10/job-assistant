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

export interface Lead {
  id: number
  name: string
  email: string | null
  linkedin_url: string | null
  company: string | null
  title: string | null
  notes: string | null
  created_at: string
  updated_at: string
  linked_jobs_count: number
}

export interface JobLead {
  id: number
  job_id: number
  lead_id: number
  relationship: LeadRelationship | null
  notes: string | null
  created_at: string
  job_title: string
  company: string
  job_url: string
}

export type LeadRelationship = "recruiter" | "hiring_manager" | "referral" | "other"

export const LEAD_RELATIONSHIPS: { value: LeadRelationship; label: string }[] = [
  { value: "recruiter", label: "Recruiter" },
  { value: "hiring_manager", label: "Hiring Manager" },
  { value: "referral", label: "Referral" },
  { value: "other", label: "Other" },
]

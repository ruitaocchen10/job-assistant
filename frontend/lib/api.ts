import type { Application, ApplicationStatus, Job, Lead, JobLead } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY ?? "";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "X-API-Key": API_KEY,
      ...options?.headers,
    },
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  if (res.status === 204) return undefined as T;
  return res.json();
}

// Jobs

export function getJobs(params?: {
  score_min?: number;
  keyword?: string;
  source?: string;
}): Promise<Job[]> {
  const query = new URLSearchParams();
  if (params?.score_min != null)
    query.set("score_min", String(params.score_min));
  if (params?.keyword) query.set("keyword", params.keyword);
  if (params?.source) query.set("source", params.source);
  const qs = query.toString();
  return request(`/jobs${qs ? `?${qs}` : ""}`);
}

export function saveJob(jobId: number): Promise<Application> {
  1;
  return request(`/jobs/${jobId}/save`, { method: "POST" });
}

export function hideJob(jobId: number): Promise<void> {
  return request(`/jobs/${jobId}`, { method: "DELETE" });
}

export interface JobCreate {
  url: string;
  title: string;
  company: string;
  location?: string;
  salary?: string;
  job_type?: string;
  tags?: string[];
}

export function addJob(data: JobCreate): Promise<Job> {
  return request<Job>("/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// Applications

export function getApplications(): Promise<Application[]> {
  return request("/applications");
}

export function updateApplication(
  id: number,
  patch: { status?: ApplicationStatus; notes?: string; applied_at?: string },
): Promise<Application> {
  return request(`/applications/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
}

// Leads

export interface LeadCreate {
  name: string;
  email?: string;
  linkedin_url?: string;
  company?: string;
  title?: string;
  notes?: string;
}

export interface LeadPatch {
  name?: string;
  email?: string;
  linkedin_url?: string;
  company?: string;
  title?: string;
  notes?: string;
}

export function getLeads(): Promise<Lead[]> {
  return request("/leads");
}

export function createLead(data: LeadCreate): Promise<Lead> {
  return request<Lead>("/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function updateLead(id: number, patch: LeadPatch): Promise<Lead> {
  return request<Lead>(`/leads/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
}

export function deleteLead(id: number): Promise<void> {
  return request(`/leads/${id}`, { method: "DELETE" });
}

export function getLeadJobs(leadId: number): Promise<JobLead[]> {
  return request(`/leads/${leadId}/jobs`);
}

export function linkLeadToJob(
  leadId: number,
  data: { job_id: number; relationship: string; notes?: string },
): Promise<JobLead> {
  return request<JobLead>(`/leads/${leadId}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function unlinkLeadFromJob(
  leadId: number,
  jobLeadId: number,
): Promise<void> {
  return request(`/leads/${leadId}/jobs/${jobLeadId}`, { method: "DELETE" });
}

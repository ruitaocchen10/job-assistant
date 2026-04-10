import type { Application, ApplicationStatus, Job } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, options);
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

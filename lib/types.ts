export type Application = {
  id: string;
  user_id: string;
  company_name: string;
  job_title: string;
  job_url: string | null;
  location: string | null;
  status:
    | "wishlist"
    | "applied"
    | "interviewing"
    | "offered"
    | "rejected"
    | "withdrawn";
  applied_date: string | null;
  salary_min: number | null;
  salary_max: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};
